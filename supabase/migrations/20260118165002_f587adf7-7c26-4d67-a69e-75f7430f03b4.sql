-- Update max_lives default and existing profiles to 5 lives
ALTER TABLE public.profiles ALTER COLUMN max_lives SET DEFAULT 5;
ALTER TABLE public.profiles ALTER COLUMN lives SET DEFAULT 5;

-- Update existing profiles to have 5 max lives
UPDATE public.profiles SET max_lives = 5 WHERE max_lives = 3;
UPDATE public.profiles SET lives = 5 WHERE lives > 0 AND lives = max_lives;