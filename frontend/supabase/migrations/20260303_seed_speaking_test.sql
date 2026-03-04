-- ============================================
-- Seed data: 1 Speaking Test (3 parts)
-- Run this in Supabase SQL Editor
-- ============================================

-- Speaking Test
INSERT INTO public.tests (id, title, description, difficulty_level, is_published)
VALUES (
    'a0b1c2d3-e4f5-4a6b-8c7d-e8f9a0b1c2d3',
    'Speaking Practice - Daily Routine & Technology',
    'A complete IELTS Speaking test covering daily life, technology, and its impact on society.',
    'medium',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Part 1: Introduction & Interview (4-5 minutes)
INSERT INTO public.speaking_topics (id, test_id, part_number, topic, questions, preparation_time_seconds, speaking_time_seconds)
VALUES (
    'b1c2d3e4-f5a6-4b7c-8d9e-f0a1b2c3d4e5',
    'a0b1c2d3-e4f5-4a6b-8c7d-e8f9a0b1c2d3',
    1,
    'Daily Routine & Hobbies',
    '[
        "What do you usually do in the morning?",
        "Do you prefer to get up early or stay up late? Why?",
        "What hobbies do you have?",
        "How much time do you spend on your hobbies each week?"
    ]'::jsonb,
    0,
    300
)
ON CONFLICT (id) DO NOTHING;

-- Part 2: Individual Long Turn (3-4 minutes)
INSERT INTO public.speaking_topics (id, test_id, part_number, topic, questions, preparation_time_seconds, speaking_time_seconds)
VALUES (
    'c2d3e4f5-a6b7-4c8d-9e0f-a1b2c3d4e5f6',
    'a0b1c2d3-e4f5-4a6b-8c7d-e8f9a0b1c2d3',
    2,
    'Describe a piece of technology you find useful',
    '[
        "You should say:",
        "What the technology is",
        "How often you use it",
        "What you use it for",
        "And explain why you find it useful"
    ]'::jsonb,
    60,
    120
)
ON CONFLICT (id) DO NOTHING;

-- Part 3: Two-way Discussion (4-5 minutes)
INSERT INTO public.speaking_topics (id, test_id, part_number, topic, questions, preparation_time_seconds, speaking_time_seconds)
VALUES (
    'd3e4f5a6-b7c8-4d9e-0f1a-b2c3d4e5f6a7',
    'a0b1c2d3-e4f5-4a6b-8c7d-e8f9a0b1c2d3',
    3,
    'Technology & Society',
    '[
        "How has technology changed the way people communicate?",
        "Do you think people rely too much on technology nowadays?",
        "What are the advantages and disadvantages of children using technology at a young age?",
        "How do you think technology will change our lives in the future?"
    ]'::jsonb,
    0,
    300
)
ON CONFLICT (id) DO NOTHING;
