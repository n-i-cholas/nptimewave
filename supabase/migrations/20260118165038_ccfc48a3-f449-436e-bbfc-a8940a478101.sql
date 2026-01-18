-- Add lives_reset_at column to track when lives should reset
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lives_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;