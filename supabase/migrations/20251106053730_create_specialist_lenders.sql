/*
  # Create Specialist Lender Profiles
  
  Creates 2 specialized lender profiles:
  1. Construction Financing Specialist - Capital Construction Finance
  2. Islamic Finance Specialist - Amanah Islamic Finance
*/

DO $$
DECLARE
  lender1_id uuid := 'd0000000-0000-0000-0000-000000000001';
  lender2_id uuid := 'd0000000-0000-0000-0000-000000000002';
BEGIN

  -- Create auth user for Construction Finance Lender
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    lender1_id,
    'construction.finance@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for Construction Finance Lender
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    lender1_id,
    'construction.finance@example.com',
    'Capital Construction Finance',
    'lender'::user_role,
    'Capital Construction Finance Limited',
    'PJ, Selangor',
    ARRAY['BNM Licensed', 'SC Authorized', 'ISO 27001'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create lender profiles table data for Construction Finance Lender
  INSERT INTO public.profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  SELECT 
    lender1_id,
    'construction.finance@example.com',
    'Capital Construction Finance',
    'lender'::user_role,
    'Capital Construction Finance Limited',
    'PJ, Selangor',
    ARRAY['BNM Licensed', 'SC Authorized', 'ISO 27001'],
    now(),
    now()
  WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = lender1_id);

  -- Create auth user for Islamic Finance Lender
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    lender2_id,
    'amanah.finance@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for Islamic Finance Lender
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    lender2_id,
    'amanah.finance@example.com',
    'Amanah Islamic Finance',
    'lender'::user_role,
    'Amanah Islamic Finance Berhad',
    'Kuala Lumpur, KL',
    ARRAY['BNM Licensed', 'Shariah Board Certified', 'ISO 27001'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

END $$;
