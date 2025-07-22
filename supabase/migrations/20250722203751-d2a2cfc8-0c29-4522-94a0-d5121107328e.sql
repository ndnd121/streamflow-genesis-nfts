-- Update RLS policy for videos table to ensure non-UUID user_id values are handled correctly

-- First, check if the policy exists before trying to drop it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_policy 
        WHERE polname = 'Users can view their own videos'
    ) THEN
        DROP POLICY "Users can view their own videos" ON public.videos;
    END IF;
END $$;

-- Create the updated policy that handles both UUID and wallet address formats
CREATE POLICY "Users can view their own videos" ON public.videos
    FOR SELECT
    USING (auth.uid()::text = user_id::text OR auth.uid() = user_id);

-- Update other policies to handle both UUID and wallet address formats
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_policy 
        WHERE polname = 'Users can update their own videos'
    ) THEN
        DROP POLICY "Users can update their own videos" ON public.videos;
    END IF;
END $$;

CREATE POLICY "Users can update their own videos" ON public.videos
    FOR UPDATE
    USING (auth.uid()::text = user_id::text OR auth.uid() = user_id);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_policy 
        WHERE polname = 'Users can create their own videos'
    ) THEN
        DROP POLICY "Users can create their own videos" ON public.videos;
    END IF;
END $$;

CREATE POLICY "Users can create their own videos" ON public.videos
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() = user_id);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_policy 
        WHERE polname = 'Users can delete their own videos'
    ) THEN
        DROP POLICY "Users can delete their own videos" ON public.videos;
    END IF;
END $$;

CREATE POLICY "Users can delete their own videos" ON public.videos
    FOR DELETE
    USING (auth.uid()::text = user_id::text OR auth.uid() = user_id);