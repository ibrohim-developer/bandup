-- ============================================
-- IELTS Platform - Core Database Tables
-- Run this FIRST in Supabase SQL Editor
-- ============================================

-- ============================================
-- 0. Shared utility: update_updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    target_band_score DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. TESTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published tests"
    ON public.tests FOR SELECT
    USING (is_published = true);

CREATE TRIGGER trigger_tests_updated_at
    BEFORE UPDATE ON public.tests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_tests_is_published ON public.tests(is_published);
CREATE INDEX idx_tests_difficulty_level ON public.tests(difficulty_level);

-- ============================================
-- 3. LISTENING SECTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.listening_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    section_number INTEGER NOT NULL,
    audio_url TEXT NOT NULL,
    audio_duration_seconds INTEGER,
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, section_number)
);

ALTER TABLE public.listening_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view listening sections"
    ON public.listening_sections FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE INDEX idx_listening_sections_test_id ON public.listening_sections(test_id);

-- ============================================
-- 4. READING PASSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.reading_passages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    passage_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, passage_number)
);

ALTER TABLE public.reading_passages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view reading passages"
    ON public.reading_passages FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE INDEX idx_reading_passages_test_id ON public.reading_passages(test_id);

-- ============================================
-- 5. WRITING TASKS
-- ============================================
CREATE TABLE IF NOT EXISTS public.writing_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    task_number INTEGER NOT NULL,
    task_type TEXT,
    prompt TEXT NOT NULL,
    image_url TEXT,
    min_words INTEGER NOT NULL,
    sample_answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, task_number)
);

ALTER TABLE public.writing_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view writing tasks"
    ON public.writing_tasks FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE INDEX idx_writing_tasks_test_id ON public.writing_tasks(test_id);

-- ============================================
-- 6. QUESTIONS (for listening & reading)
-- ============================================
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_type TEXT NOT NULL CHECK (module_type IN ('listening', 'reading')),
    section_id UUID NOT NULL,
    question_number INTEGER NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'multiple_choice', 'fill_in_blank', 'matching',
        'true_false_not_given', 'matching_headings', 'sentence_completion'
    )),
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view questions"
    ON public.questions FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE INDEX idx_questions_section_id ON public.questions(section_id);
CREATE INDEX idx_questions_module_type ON public.questions(module_type);

-- ============================================
-- 7. TEST ATTEMPTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.test_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    module_type TEXT NOT NULL CHECK (module_type IN ('listening', 'reading', 'writing', 'full')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER,
    raw_score INTEGER,
    band_score DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own test attempts"
    ON public.test_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test attempts"
    ON public.test_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test attempts"
    ON public.test_attempts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_test_attempts_user_id ON public.test_attempts(user_id);
CREATE INDEX idx_test_attempts_test_id ON public.test_attempts(test_id);
CREATE INDEX idx_test_attempts_status ON public.test_attempts(status);

-- ============================================
-- 8. USER ANSWERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own answers"
    ON public.user_answers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = user_answers.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own answers"
    ON public.user_answers FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = user_answers.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own answers"
    ON public.user_answers FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = user_answers.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE INDEX idx_user_answers_attempt_id ON public.user_answers(attempt_id);
CREATE INDEX idx_user_answers_question_id ON public.user_answers(question_id);

-- ============================================
-- 9. WRITING SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.writing_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.writing_tasks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    word_count INTEGER,
    task_achievement_score DECIMAL(3,1),
    coherence_score DECIMAL(3,1),
    lexical_score DECIMAL(3,1),
    grammar_score DECIMAL(3,1),
    overall_band_score DECIMAL(3,1),
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.writing_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own writing submissions"
    ON public.writing_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = writing_submissions.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own writing submissions"
    ON public.writing_submissions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = writing_submissions.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own writing submissions"
    ON public.writing_submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = writing_submissions.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE INDEX idx_writing_submissions_attempt_id ON public.writing_submissions(attempt_id);
CREATE INDEX idx_writing_submissions_task_id ON public.writing_submissions(task_id);

-- ============================================
-- 10. TEST PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS public.test_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attempt_id UUID NOT NULL UNIQUE REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    current_section INTEGER,
    current_question INTEGER,
    time_remaining_seconds INTEGER,
    answers_snapshot JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.test_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own test progress"
    ON public.test_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = test_progress.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own test progress"
    ON public.test_progress FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = test_progress.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own test progress"
    ON public.test_progress FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            WHERE test_attempts.id = test_progress.attempt_id
            AND test_attempts.user_id = auth.uid()
        )
    );

CREATE TRIGGER trigger_test_progress_updated_at
    BEFORE UPDATE ON public.test_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_test_progress_attempt_id ON public.test_progress(attempt_id);

-- ============================================
-- DONE: 10 tables created with RLS policies
-- Next: Run full_mock_test_attempts migration
-- Then: Run seed data
-- ============================================
