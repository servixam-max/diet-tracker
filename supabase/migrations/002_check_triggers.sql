-- Check for triggers on profiles table
SELECT tgname, tgtype, tgrelid::regclass 
FROM pg_trigger 
WHERE tgrelid = 'public.profiles'::regclass;

-- Check if handle_new_user function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
