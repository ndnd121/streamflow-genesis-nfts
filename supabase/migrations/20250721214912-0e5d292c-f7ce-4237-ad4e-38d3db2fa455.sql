-- Add missing columns to videos table for proper NFT display
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS creator TEXT DEFAULT 'You',
ADD COLUMN IF NOT EXISTS thumbnail TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS growth_rate DECIMAL DEFAULT 0,
ADD COLUMN IF NOT EXISTS token_reward INTEGER DEFAULT 25;

-- Update existing videos with some sample engagement data
UPDATE public.videos 
SET 
  creator = 'You',
  thumbnail = CASE 
    WHEN thumbnail IS NULL THEN 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=80'
    ELSE thumbnail 
  END,
  likes = FLOOR(RANDOM() * 1000) + 10,
  shares = FLOOR(RANDOM() * 100) + 5,
  views = FLOOR(RANDOM() * 10000) + 100,
  growth_rate = ROUND((RANDOM() * 20)::DECIMAL, 1),
  token_reward = 25
WHERE likes = 0 OR likes IS NULL;