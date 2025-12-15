/*
  # Create Demo Account with Fixed ID
  
  Creates demo user with email and password using fixed UUID
*/

DO $$
DECLARE
  demo_user_id uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Delete any existing demo user with this email
  DELETE FROM auth.users WHERE email = 'demo@example.com';
  DELETE FROM profiles WHERE email = 'demo@example.com';
  DELETE FROM projects WHERE owner_id = demo_user_id;

  -- Insert demo user into auth.users with proper password hashing
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_super_admin,
    is_sso_user
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    demo_user_id,
    'authenticated',
    'authenticated',
    'demo@example.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    '{}',
    '{}',
    now(),
    now(),
    false,
    false
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for the user
  INSERT INTO profiles (
    id,
    email,
    name,
    role,
    company,
    location,
    certifications,
    created_at,
    updated_at
  ) VALUES (
    demo_user_id,
    'demo@example.com',
    'Demo Developer',
    'developer'::user_role,
    'Demo Development Co',
    'Kuala Lumpur, Malaysia',
    ARRAY['Demo Account', 'Sample Project Manager'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create demo projects
  INSERT INTO projects (
    owner_id,
    title,
    description,
    location,
    type,
    budget,
    status,
    start_date,
    end_date,
    ltv,
    created_at,
    updated_at
  ) VALUES
  (
    demo_user_id,
    'Sentosa Commercial Complex Development',
    'Premium commercial and retail development project in Sentosa with modern architecture and sustainable features. Total built-up area: 250,000 sqm. Includes office spaces, retail outlets, and dining facilities.',
    'Sentosa, Kuala Lumpur',
    'commercial'::project_type,
    250000000,
    'draft'::project_status,
    now(),
    now() + interval '18 months',
    75,
    now(),
    now()
  ),
  (
    demo_user_id,
    'Lakeside Residential Towers',
    'Luxury residential development with 3 towers comprising 450 residential units. Features modern amenities, landscape design, and water-front access. Mixed-use development with retail podium.',
    'Bangsar, Kuala Lumpur',
    'residential'::project_type,
    180000000,
    'active'::project_status,
    now(),
    now() + interval '24 months',
    70,
    now(),
    now()
  );

END $$;
