-- ============================================
-- Update question_type values to new IELTS type names
-- ============================================

-- 1. Drop the existing CHECK constraint
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_question_type_check;

-- 2. Rename existing question types
UPDATE public.questions SET question_type = 'tfng' WHERE question_type = 'true_false_not_given';
UPDATE public.questions SET question_type = 'mcq_single' WHERE question_type = 'multiple_choice';
UPDATE public.questions SET question_type = 'gap_fill' WHERE question_type = 'fill_in_blank';
UPDATE public.questions SET question_type = 'matching_info' WHERE question_type = 'matching';
UPDATE public.questions SET question_type = 'summary_completion' WHERE question_type = 'sentence_completion';
-- matching_headings stays as-is

-- 3. Add new CHECK constraint with updated types
ALTER TABLE public.questions ADD CONSTRAINT questions_question_type_check
    CHECK (question_type IN ('tfng', 'mcq_single', 'gap_fill', 'matching_headings', 'matching_info', 'summary_completion', 'short_answer'));
