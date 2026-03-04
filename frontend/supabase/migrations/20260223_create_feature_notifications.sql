-- ============================================
-- Feature Notifications (Notify Me) Table
-- Tracks users who want to be notified when
-- upcoming features become available
-- ============================================

CREATE TABLE IF NOT EXISTS public.feature_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, feature)
);

ALTER TABLE public.feature_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON public.feature_notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
    ON public.feature_notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
    ON public.feature_notifications FOR DELETE
    USING (auth.uid() = user_id);