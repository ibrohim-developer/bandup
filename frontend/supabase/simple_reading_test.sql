-- ============================================
-- Simple Reading Test
-- A simple test with 1 short passage and 5 questions
-- Run this in Supabase SQL Editor
-- ============================================

-- Create a new test
INSERT INTO public.tests (id, title, description, difficulty_level, is_published) VALUES
('44444444-4444-4444-4444-444444444444', 'Quick Reading Test', 'A simple reading test with one passage', 'easy', true);

-- Create a short reading passage
INSERT INTO public.reading_passages (id, test_id, passage_number, title, content, word_count) VALUES
('c4000001-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 1, 'Coffee Culture',
'Coffee is one of the most popular beverages in the world. Every day, millions of people start their morning with a cup of coffee. The coffee plant grows in tropical regions and produces red berries called coffee cherries. Inside each cherry are two coffee beans.

There are two main types of coffee beans: Arabica and Robusta. Arabica beans are considered higher quality and have a smoother, sweeter taste. Robusta beans contain more caffeine and taste stronger and more bitter. About 70% of the world''s coffee is Arabica.

Coffee was first discovered in Ethiopia over 1,000 years ago. According to legend, a goat herder noticed his goats became energetic after eating berries from a certain tree. He tried the berries himself and felt more alert. Coffee then spread to Yemen, and later to Europe in the 17th century.

Today, Brazil is the largest coffee producer in the world, followed by Vietnam and Colombia. The coffee industry provides jobs for millions of people worldwide. However, climate change is threatening coffee production, as coffee plants need specific temperature and rainfall conditions to grow properly.', 178);

-- Create 5 reading questions for this passage
INSERT INTO public.questions (id, module_type, section_id, question_number, question_type, question_text, options, correct_answer, explanation, points) VALUES

-- Question 1 - Multiple Choice
('d4000001-0000-0000-0000-000000000001', 'reading', 'c4000001-0000-0000-0000-000000000001', 1, 'multiple_choice',
'What are the red berries from coffee plants called?',
'["A. Coffee beans", "B. Coffee cherries", "C. Coffee fruits", "D. Coffee pods"]',
'B',
'The passage states: "produces red berries called coffee cherries"', 1),

-- Question 2 - True/False/Not Given
('d4000001-0000-0000-0000-000000000002', 'reading', 'c4000001-0000-0000-0000-000000000001', 2, 'true_false_not_given',
'Robusta beans have more caffeine than Arabica beans.',
null,
'TRUE',
'The passage clearly states: "Robusta beans contain more caffeine"', 1),

-- Question 3 - Fill in the blank
('d4000001-0000-0000-0000-000000000003', 'reading', 'c4000001-0000-0000-0000-000000000001', 3, 'fill_in_blank',
'Coffee was first discovered in _____ over 1,000 years ago.',
null,
'Ethiopia',
'The passage states: "Coffee was first discovered in Ethiopia over 1,000 years ago"', 1),

-- Question 4 - Multiple Choice
('d4000001-0000-0000-0000-000000000004', 'reading', 'c4000001-0000-0000-0000-000000000001', 4, 'multiple_choice',
'Which country is the largest coffee producer in the world?',
'["A. Vietnam", "B. Colombia", "C. Brazil", "D. Ethiopia"]',
'C',
'The passage states: "Brazil is the largest coffee producer in the world"', 1),

-- Question 5 - True/False/Not Given
('d4000001-0000-0000-0000-000000000005', 'reading', 'c4000001-0000-0000-0000-000000000001', 5, 'true_false_not_given',
'Coffee arrived in Europe in the 18th century.',
null,
'FALSE',
'The passage states it arrived "in the 17th century", not the 18th century', 1);

-- Done! Now you have a simple test with:
-- - 1 test: "Quick Reading Test"
-- - 1 passage: "Coffee Culture" (178 words)
-- - 5 questions (mix of multiple choice, true/false/not given, and fill in blank)
