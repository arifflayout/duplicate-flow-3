/*
  # Fix Demo Account Authentication
  
  Removes the invalid demo user created with incorrect password hashing
  and clears the profile to allow proper recreation via Edge Function.
*/

DO $$
BEGIN
  -- Delete the invalid demo user and related profile
  DELETE FROM profiles WHERE email = 'demo@example.com';
  DELETE FROM auth.users WHERE email = 'demo@example.com';
END $$;
