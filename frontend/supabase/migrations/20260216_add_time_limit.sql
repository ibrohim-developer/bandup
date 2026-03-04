-- ============================================
-- Add time_limit column to listening, reading, and writing tables
-- time_limit is stored in seconds
-- ============================================

-- Add time_limit to listening_sections
ALTER TABLE public.listening_sections
ADD COLUMN time_limit INTEGER;

COMMENT ON COLUMN public.listening_sections.time_limit IS 'Time limit for this section in seconds';

-- Add time_limit to reading_passages
ALTER TABLE public.reading_passages
ADD COLUMN time_limit INTEGER;

COMMENT ON COLUMN public.reading_passages.time_limit IS 'Time limit for this passage in seconds';

-- Add time_limit to writing_tasks
ALTER TABLE public.writing_tasks
ADD COLUMN time_limit INTEGER;

COMMENT ON COLUMN public.writing_tasks.time_limit IS 'Time limit for this task in seconds';

-- ============================================
-- Update existing seed data with time limits
-- ============================================

-- Update listening_sections with time_limit (10 minutes = 600 seconds per section)
UPDATE public.listening_sections
SET time_limit = 600
WHERE time_limit IS NULL;

-- Update reading_passages with time_limit (20 minutes = 1200 seconds per passage)
UPDATE public.reading_passages
SET time_limit = 1200
WHERE time_limit IS NULL;

-- Update writing_tasks with time_limit based on task_type
UPDATE public.writing_tasks
SET time_limit = CASE
    WHEN task_type = 'report' THEN 1200
    WHEN task_type = 'essay' THEN 2400
    ELSE 1200
END
WHERE time_limit IS NULL;
