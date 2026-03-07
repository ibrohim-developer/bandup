/**
 * Migrate listening data from /data.db into backend/.tmp/data.db
 * Remaps IDs to avoid conflicts with existing reading data.
 *
 * Run from project root: node frontend/scripts/migrate-listening.mjs
 */

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(__dirname, '../../backend/'));
const Database = require('better-sqlite3');

const rootDir = path.join(__dirname, '../..');
const sourceDb = new Database(path.join(rootDir, 'data.db'), { readonly: true });
const targetDb = new Database(path.join(rootDir, 'backend/.tmp/data.db'));

// Get max IDs from target
const maxTestId = targetDb.prepare('SELECT COALESCE(MAX(id), 0) as m FROM tests').get().m;
const maxSectionId = targetDb.prepare('SELECT COALESCE(MAX(id), 0) as m FROM listening_sections').get().m;
const maxQuestionId = targetDb.prepare('SELECT COALESCE(MAX(id), 0) as m FROM questions').get().m;
const maxGroupId = targetDb.prepare('SELECT COALESCE(MAX(id), 0) as m FROM question_groups').get().m;

console.log('Target DB max IDs:', { maxTestId, maxSectionId, maxQuestionId, maxGroupId });

// Read source data
const listeningTestIds = sourceDb.prepare(
  'SELECT DISTINCT test_id FROM listening_sections_test_lnk'
).all().map(r => r.test_id);

const sourceTests = sourceDb.prepare(
  `SELECT * FROM tests WHERE id IN (${listeningTestIds.join(',')})`
).all();

const sourceSections = sourceDb.prepare('SELECT * FROM listening_sections').all();
const sourceSectionLinks = sourceDb.prepare('SELECT * FROM listening_sections_test_lnk').all();
const sourceGroups = sourceDb.prepare('SELECT * FROM question_groups').all();

// Get listening question IDs via link table
const listeningQuestionIds = sourceDb.prepare(
  'SELECT question_id FROM questions_listening_section_lnk'
).all().map(r => r.question_id);

const sourceQuestions = sourceDb.prepare(
  `SELECT * FROM questions WHERE id IN (${listeningQuestionIds.join(',')})`
).all();

const sourceQuestionSectionLinks = sourceDb.prepare(
  'SELECT * FROM questions_listening_section_lnk'
).all();

// Get question-group links for listening questions only
const sourceQuestionGroupLinks = sourceDb.prepare(
  `SELECT * FROM questions_question_group_lnk WHERE question_id IN (${listeningQuestionIds.join(',')})`
).all();

console.log('Source data counts:', {
  tests: sourceTests.length,
  sections: sourceSections.length,
  sectionLinks: sourceSectionLinks.length,
  groups: sourceGroups.length,
  questions: sourceQuestions.length,
  questionSectionLinks: sourceQuestionSectionLinks.length,
  questionGroupLinks: sourceQuestionGroupLinks.length,
});

// Build ID maps
const testIdMap = new Map();
sourceTests.forEach((t, i) => testIdMap.set(t.id, maxTestId + 1 + i));

const sectionIdMap = new Map();
sourceSections.forEach((s, i) => sectionIdMap.set(s.id, maxSectionId + 1 + i));

const questionIdMap = new Map();
sourceQuestions.forEach((q, i) => questionIdMap.set(q.id, maxQuestionId + 1 + i));

const groupIdMap = new Map();
sourceGroups.forEach((g, i) => groupIdMap.set(g.id, maxGroupId + 1 + i));

// Prepare insert statements
const insertTest = targetDb.prepare(
  `INSERT INTO tests (id, document_id, title, description, difficulty_level, is_published, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const insertSection = targetDb.prepare(
  `INSERT INTO listening_sections (id, document_id, section_number, audio_url, audio_duration_seconds, transcript, time_limit, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const insertSectionLink = targetDb.prepare(
  `INSERT INTO listening_sections_test_lnk (listening_section_id, test_id, listening_section_ord)
   VALUES (?, ?, ?)`
);

const insertGroup = targetDb.prepare(
  `INSERT INTO question_groups (id, document_id, group_number, question_type, instruction, context, points, options, metadata, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const insertQuestion = targetDb.prepare(
  `INSERT INTO questions (id, document_id, module_type, question_number, question_type, question_text, options, correct_answer, explanation, points, metadata, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const insertQuestionSectionLink = targetDb.prepare(
  `INSERT INTO questions_listening_section_lnk (question_id, listening_section_id, question_ord)
   VALUES (?, ?, ?)`
);

const insertQuestionGroupLink = targetDb.prepare(
  `INSERT INTO questions_question_group_lnk (question_id, question_group_id, question_ord)
   VALUES (?, ?, ?)`
);

// Run migration in a transaction
const migrate = targetDb.transaction(() => {
  // 1. Insert tests
  for (const t of sourceTests) {
    insertTest.run(
      testIdMap.get(t.id), t.document_id, t.title, t.description,
      t.difficulty_level, t.is_published, t.created_at, t.updated_at,
      t.published_at, t.created_by_id, t.updated_by_id, t.locale
    );
  }
  console.log(`Inserted ${sourceTests.length} tests`);

  // 2. Insert listening sections
  for (const s of sourceSections) {
    insertSection.run(
      sectionIdMap.get(s.id), s.document_id, s.section_number, s.audio_url,
      s.audio_duration_seconds, s.transcript, s.time_limit, s.created_at,
      s.updated_at, s.published_at, s.created_by_id, s.updated_by_id, s.locale
    );
  }
  console.log(`Inserted ${sourceSections.length} listening sections`);

  // 3. Insert section-test links
  for (const l of sourceSectionLinks) {
    insertSectionLink.run(
      sectionIdMap.get(l.listening_section_id),
      testIdMap.get(l.test_id),
      l.listening_section_ord
    );
  }
  console.log(`Inserted ${sourceSectionLinks.length} section-test links`);

  // 4. Insert question groups
  for (const g of sourceGroups) {
    insertGroup.run(
      groupIdMap.get(g.id), g.document_id, g.group_number, g.question_type,
      g.instruction, g.context, g.points, g.options, g.metadata,
      g.created_at, g.updated_at, g.published_at, g.created_by_id,
      g.updated_by_id, g.locale
    );
  }
  console.log(`Inserted ${sourceGroups.length} question groups`);

  // 5. Insert questions
  for (const q of sourceQuestions) {
    insertQuestion.run(
      questionIdMap.get(q.id), q.document_id, q.module_type, q.question_number,
      q.question_type, q.question_text, q.options, q.correct_answer,
      q.explanation, q.points, q.metadata, q.created_at, q.updated_at,
      q.published_at, q.created_by_id, q.updated_by_id, q.locale
    );
  }
  console.log(`Inserted ${sourceQuestions.length} questions`);

  // 6. Insert question-section links
  for (const l of sourceQuestionSectionLinks) {
    insertQuestionSectionLink.run(
      questionIdMap.get(l.question_id),
      sectionIdMap.get(l.listening_section_id),
      l.question_ord
    );
  }
  console.log(`Inserted ${sourceQuestionSectionLinks.length} question-section links`);

  // 7. Insert question-group links
  for (const l of sourceQuestionGroupLinks) {
    insertQuestionGroupLink.run(
      questionIdMap.get(l.question_id),
      groupIdMap.get(l.question_group_id),
      l.question_ord
    );
  }
  console.log(`Inserted ${sourceQuestionGroupLinks.length} question-group links`);
});

migrate();

// Verify
console.log('\n=== Verification ===');
console.log('Tests:', targetDb.prepare('SELECT count(*) as c FROM tests').get());
console.log('Listening sections:', targetDb.prepare('SELECT count(*) as c FROM listening_sections').get());
console.log('Questions:', targetDb.prepare('SELECT count(*) as c FROM questions').get());
console.log('Question groups:', targetDb.prepare('SELECT count(*) as c FROM question_groups').get());
console.log('Section-test links:', targetDb.prepare('SELECT count(*) as c FROM listening_sections_test_lnk').get());
console.log('Question-section links:', targetDb.prepare('SELECT count(*) as c FROM questions_listening_section_lnk').get());
console.log('Question-group links:', targetDb.prepare('SELECT count(*) as c FROM questions_question_group_lnk').get());

sourceDb.close();
targetDb.close();

console.log('\nMigration complete!');
