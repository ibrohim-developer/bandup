-- Create full_mock_test_attempts table
CREATE TABLE IF NOT EXISTS public.full_mock_test_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    listening_score DECIMAL(3,1),
    reading_score DECIMAL(3,1),
    writing_score DECIMAL(3,1),
    speaking_score DECIMAL(3,1),
    overall_band_score DECIMAL(3,1),
    time_spent_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_full_mock_test_attempts_user_id ON public.full_mock_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_full_mock_test_attempts_test_id ON public.full_mock_test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_full_mock_test_attempts_status ON public.full_mock_test_attempts(status);
CREATE INDEX IF NOT EXISTS idx_full_mock_test_attempts_created_at ON public.full_mock_test_attempts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.full_mock_test_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own attempts
CREATE POLICY "Users can view their own full mock test attempts"
    ON public.full_mock_test_attempts
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own attempts
CREATE POLICY "Users can create their own full mock test attempts"
    ON public.full_mock_test_attempts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own attempts
CREATE POLICY "Users can update their own full mock test attempts"
    ON public.full_mock_test_attempts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_full_mock_test_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_full_mock_test_attempts_updated_at
    BEFORE UPDATE ON public.full_mock_test_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_full_mock_test_attempts_updated_at();

-- Add comment to table
COMMENT ON TABLE public.full_mock_test_attempts IS 'Stores full mock test attempts with 24-hour restriction enforcement';
