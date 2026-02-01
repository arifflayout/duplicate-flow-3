/*
  # Fix developer auth user with proper password
  
  Removes invalid developer user and recreates with proper password using pgcrypto.
*/

-- Delete existing identities for this user
DELETE FROM auth.identities WHERE provider_id = 'developer@example.com';

-- Delete existing user
DELETE FROM auth.users WHERE email = 'developer@example.com';

-- Create user with proper password encryption
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role
) VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'developer@example.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"John Developer","role":"developer"}'::jsonb,
  'authenticated'
);

-- Create identity
INSERT INTO auth.identities (
  user_id,
  provider,
  provider_id,
  identity_data,
  created_at,
  updated_at
) VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'email',
  'developer@example.com',
  '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","email":"developer@example.com"}'::jsonb,
  now(),
  now()
);