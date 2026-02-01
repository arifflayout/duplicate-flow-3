/*
  # Create developer auth user
  
  Creates the developer@example.com user in the auth system to match the existing profile.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'developer@example.com') THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      'dddddddd-dddd-dddd-dddd-dddddddddddd',
      'developer@example.com',
      crypt('demo123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"John Developer","role":"developer"}'::jsonb
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      provider,
      provider_id,
      identity_data,
      created_at,
      updated_at
    ) VALUES (
      'dddddddd-dddd-dddd-dddd-dddddddddddd',
      'dddddddd-dddd-dddd-dddd-dddddddddddd',
      'email',
      'developer@example.com',
      '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","email":"developer@example.com"}'::jsonb,
      now(),
      now()
    );
  END IF;
END $$;