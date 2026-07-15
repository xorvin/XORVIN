-- Fix for "type 'user_role' does not exist" during Supabase auth trigger
-- Ensure the function runs in the public schema context.
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO public.profiles (id, name, username, avatar_url)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
      COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
      COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN new;
  EXCEPTION WHEN OTHERS THEN
    -- Prevent auth signup failure if profile creation fails
    -- auth.service.ts will handle creating the profile on first login
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Change the default role for new users to 'guest' as requested
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'guest'::public.user_role;
