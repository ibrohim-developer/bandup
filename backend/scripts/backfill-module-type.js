/**
 * Backfill module_type for existing tests based on their relations.
 * Run from backend/: node scripts/backfill-module-type.js
 */
const Database = require("better-sqlite3");
const db = new Database(".tmp/data.db");

// Find tests linked to listening_sections
const listeningTestIds = db
  .prepare("SELECT DISTINCT test_id FROM listening_sections_test_lnk")
  .all()
  .map((r) => r.test_id);

// Find tests linked to reading_passages
const readingTestIds = db
  .prepare("SELECT DISTINCT test_id FROM reading_passages_test_lnk")
  .all()
  .map((r) => r.test_id);

// Find tests linked to writing_tasks
let writingTestIds = [];
try {
  writingTestIds = db
    .prepare("SELECT DISTINCT test_id FROM writing_tasks_test_lnk")
    .all()
    .map((r) => r.test_id);
} catch {
  // table may not exist
}

const update = db.prepare("UPDATE tests SET module_type = ? WHERE id = ?");

let counts = { listening: 0, reading: 0, writing: 0 };

db.transaction(() => {
  for (const id of listeningTestIds) {
    update.run("listening", id);
    counts.listening++;
  }
  for (const id of readingTestIds) {
    update.run("reading", id);
    counts.reading++;
  }
  for (const id of writingTestIds) {
    update.run("writing", id);
    counts.writing++;
  }
})();

console.log("Backfill complete:");
console.log(`  Listening: ${counts.listening}`);
console.log(`  Reading:   ${counts.reading}`);
console.log(`  Writing:   ${counts.writing}`);

db.close();
