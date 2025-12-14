/*
  # Create Demo Account with Sample Projects
  
  Creates a demo project owner account with sample projects
  Demo Account: Demo Developer (demo@example.com)
  Password: demo123
  
  Projects:
  - Sentosa Commercial Complex (draft status)
  - Lakeside Residential Towers (active status)
*/

DO $$
DECLARE
  demo_id uuid := 'e1000000-0000-0000-0000-000000000001';
  project1_id uuid := 'e2000000-0000-0000-0000-000000000001';
  project2_id uuid := 'e2000000-0000-0000-0000-000000000002';
BEGIN

  -- Create demo auth user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    demo_id,
    'demo@example.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create demo profile
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    demo_id,
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

  -- Create first demo project (Commercial Development - Draft Status)
  INSERT INTO projects (id, owner_id, title, description, location, type, budget, status, start_date, end_date, ltv, created_at, updated_at)
  VALUES (
    project1_id,
    demo_id,
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
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create second demo project (Residential Development - Active Status)
  INSERT INTO projects (id, owner_id, title, description, location, type, budget, status, start_date, end_date, ltv, created_at, updated_at)
  VALUES (
    project2_id,
    demo_id,
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
  )
  ON CONFLICT (id) DO NOTHING;

END $$;
