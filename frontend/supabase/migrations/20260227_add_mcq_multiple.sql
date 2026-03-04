-- ============================================
-- Add mcq_multiple question type for multi-answer questions
-- ============================================

-- 1. Drop the existing CHECK constraint
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_question_type_check;

-- 2. Re-add with mcq_multiple included
ALTER TABLE public.questions ADD CONSTRAINT questions_question_type_check
    CHECK (question_type IN ('tfng', 'mcq_single', 'mcq_multiple', 'gap_fill', 'matching_headings', 'matching_info', 'summary_completion', 'short_answer'));
