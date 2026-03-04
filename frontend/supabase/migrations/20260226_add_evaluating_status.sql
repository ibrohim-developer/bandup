-- Add 'evaluating' to the allowed status values for test_attempts
ALTER TABLE public.test_attempts
    DROP CONSTRAINT IF EXISTS test_attempts_status_check;

ALTER TABLE public.test_attempts
    ADD CONSTRAINT test_attempts_status_check
    CHECK (status IN ('in_progress', 'completed', 'abandoned', 'evaluating'));
