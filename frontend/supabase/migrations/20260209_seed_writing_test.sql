-- ============================================
-- Seed data: 2 Writing Tests (1 task each)
-- Run this in Supabase SQL Editor
-- ============================================

-- Test 1: Task 1 only (Report Writing)
INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Writing Task 1 - Report Writing',
    'Practice describing charts, graphs, and diagrams (Task 1)',
    'medium',
    true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.writing_tasks (id, test_id, task_number, task_type, prompt, image_url, min_words, sample_answer)
VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    1,
    'report',
    'The bar chart below shows the number of students enrolled in three different types of courses (Science, Arts, and Business) at a university between 2015 and 2023.

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.',
    NULL,
    150,
    NULL
)
ON CONFLICT (test_id, task_number) DO NOTHING;

-- Test 2: Task 2 only (Essay Writing)
INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'Writing Task 2 - Essay Writing',
    'Practice argumentative and discussion essays (Task 2)',
    'medium',
    true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.writing_tasks (id, test_id, task_number, task_type, prompt, image_url, min_words, sample_answer)
VALUES (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    1,
    'essay',
    'Some people believe that universities should focus on providing academic skills, while others think they should prepare students for their future careers.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.',
    NULL,
    250,
    NULL
)
ON CONFLICT (test_id, task_number) DO NOTHING;
