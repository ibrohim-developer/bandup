-- Create speaking_topics table
CREATE TABLE IF NOT EXISTS public.speaking_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    part_number INTEGER NOT NULL,
    topic TEXT NOT NULL,
    questions JSONB DEFAULT NULL,
    preparation_time_seconds INTEGER NOT NULL DEFAULT 0,
    speaking_time_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_speaking_topics_test_id ON public.speaking_topics(test_id);

-- Enable RLS
ALTER TABLE public.speaking_topics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view speaking topics
CREATE POLICY "Authenticated users can view speaking topics"
    ON public.speaking_topics FOR SELECT
    TO authenticated
    USING (true);
