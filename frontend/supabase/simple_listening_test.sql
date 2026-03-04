-- ============================================
-- Simple Listening Test - Cambridge IELTS 20 Academic Test 4 Part 4
-- Run this in Supabase SQL Editor after running migrations
-- ============================================

-- Insert the test
INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Quick Listening Practice',
  'Academic listening test - single section practice',
  'medium',
  true
);

-- Insert the listening section with your audio URL
INSERT INTO public.listening_sections (id, test_id, section_number, audio_url, audio_duration_seconds, transcript)
VALUES (
  'a5000001-0000-0000-0000-000000000001',
  '55555555-5555-5555-5555-555555555555',
  1,
  'https://tzfatueonklvemdnhvjc.supabase.co/storage/v1/object/public/listening-audio/cambridge-ielts-20-academic-listening-4-audio-part-4.mp3',
  420,
  'Section 4: A lecture on research in the area around the Chem be Bird Sanctuary - discussing the importance of birds of prey to local communities, threats to their population, and ways of protecting chickens from them.'
);

-- Cambridge IELTS 20 Test 4 Part 4 - Research in the Area Around the Chem be Bird Sanctuary
-- Complete the notes below. Write ONE WORD ONLY for each answer.

-- Question 1
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000001',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  1,
  'fill_in_blank',
  'The importance of birds of prey to local communities: They destroy _____ and other rodents.',
  null,
  'rats',
  'Birds of prey help destroy rats and other rodents.',
  1
);

-- Question 2
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000002',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  2,
  'fill_in_blank',
  'They help prevent farmers from being bitten by _____.',
  null,
  'snakes',
  'Birds of prey help prevent snake bites.',
  1
);

-- Question 3
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000003',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  3,
  'fill_in_blank',
  'They now support the economy by encouraging _____ in the area.',
  null,
  'tourism',
  'Birds of prey encourage tourism which supports the economy.',
  1
);

-- Question 4
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000004',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  4,
  'fill_in_blank',
  'Falling numbers of birds of prey - The birds may be accidentally killed by _____ when hunting or sleeping.',
  null,
  'pesticides',
  'Birds may be accidentally killed by pesticides.',
  1
);

-- Question 5
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000005',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  5,
  'fill_in_blank',
  'By electrocution from power lines, especially during times of high _____.',
  null,
  'humidity',
  'Electrocution risk increases during times of high humidity.',
  1
);

-- Question 6
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000006',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  6,
  'fill_in_blank',
  'Local farmers may illegally shoot them or _____ them.',
  null,
  'poison',
  'Farmers may illegally poison the birds.',
  1
);

-- Question 7
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000007',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  7,
  'fill_in_blank',
  'Ways of protecting chickens from birds of prey - Providing a _____ for chickens (expensive).',
  null,
  'shelter',
  'Providing a shelter is an expensive option.',
  1
);

-- Question 8
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000008',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  8,
  'fill_in_blank',
  'Frightening birds of prey by keeping a _____.',
  null,
  'dog',
  'Keeping a dog can frighten away birds of prey.',
  1
);

-- Question 9
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000009',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  9,
  'fill_in_blank',
  'Making a _____ (e.g., with metal objects).',
  null,
  'noise',
  'Making noise with metal objects can frighten birds.',
  1
);

-- Question 10
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points)
VALUES (
  'b5010001-0000-0000-0000-000000000010',
  'listening',
  'a5000001-0000-0000-0000-000000000001',
  10,
  'fill_in_blank',
  'A _____ of methods is usually most effective.',
  null,
  'combination',
  'A combination of methods is usually most effective.',
  1
);

-- ============================================
-- HOW TO USE:
-- ============================================
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run"
-- 4. The test will appear on your Listening Tests page
--
-- IMPORTANT NOTES:
-- ============================================
-- - These answers are EDUCATED GUESSES based on the question structure
-- - You should verify the correct answers by listening to the actual audio
-- - Update any incorrect answers after listening to ensure accuracy
-- - All questions are "fill_in_blank" type (sentence completion/note completion)
-- - Each answer should be ONE WORD ONLY as per the instructions