/*
  # Create Specialist Consultant Auth Users and Profiles
  
  Creates 3 specialized consultant profiles with correct disciplines:
  1. Structural Engineer - Siti Rahman (civil-structural)
  2. MEP Consultant - Hassan Omar (mep-engineer)
  3. Sustainability Consultant - Nurul Amira (environmental)
*/

DO $$
DECLARE
  consultant1_id uuid := 'b0000000-0000-0000-0000-000000000001';
  consultant2_id uuid := 'b0000000-0000-0000-0000-000000000002';
  consultant3_id uuid := 'b0000000-0000-0000-0000-000000000003';
BEGIN

  -- Create auth user for Structural Engineer
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    consultant1_id,
    'siti.rahman@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for Structural Engineer
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    consultant1_id,
    'siti.rahman@example.com',
    'Siti Rahman',
    'consultant'::user_role,
    'Structural Solutions Engineering',
    'Sentosa, Kuala Lumpur',
    ARRAY['PE Malaysia - Structural', 'IEM Member', 'BIM Specialist'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create consultant specialist profile for Structural Engineer
  INSERT INTO consultant_profiles (id, discipline, company, phone, location, rating, review_count, projects_completed, years_experience, licenses, certifications, memberships, specializations, availability, max_project_value, company_profile, created_at, updated_at)
  VALUES (
    consultant1_id,
    'civil-structural'::consultant_discipline,
    'Structural Solutions Engineering',
    '+60 12-345-6789',
    'Sentosa, Kuala Lumpur',
    4.8,
    42,
    67,
    16,
    ARRAY['PE Malaysia License: PE/ST/12345'],
    ARRAY['Bachelor Civil Engineering (UTM)', 'Master Structural Design (UM)', 'Professional Engineer Malaysia'],
    ARRAY['Institution of Engineers Malaysia', 'Association of Consulting Engineers'],
    ARRAY['High-rise Buildings', 'Bridges & Flyovers', 'Stadium Design', 'Industrial Structures'],
    'available',
    450000000,
    'Senior structural engineer with 16 years experience in high-rise and infrastructure projects. Specialized in innovative structural systems and sustainable design solutions.',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET 
    rating = 4.8,
    projects_completed = 67,
    updated_at = now();

  -- Create auth user for MEP Consultant
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    consultant2_id,
    'hassan.omar@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for MEP Consultant
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    consultant2_id,
    'hassan.omar@example.com',
    'Hassan Omar',
    'consultant'::user_role,
    'Integrated Building Systems',
    'Menara Kuala Lumpur, KL',
    ARRAY['MEP Design Specialist', 'ASHRAE Member', 'BIM Coordinator'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create consultant specialist profile for MEP Consultant
  INSERT INTO consultant_profiles (id, discipline, company, phone, location, rating, review_count, projects_completed, years_experience, licenses, certifications, memberships, specializations, availability, max_project_value, company_profile, created_at, updated_at)
  VALUES (
    consultant2_id,
    'mep-engineer'::consultant_discipline,
    'Integrated Building Systems',
    '+60 16-456-7890',
    'Menara Kuala Lumpur, KL',
    4.7,
    38,
    54,
    13,
    ARRAY['Licensed MEP Designer Malaysia'],
    ARRAY['ASHRAE Certified', 'BIM Coordinator Level 2', 'Energy Management Professional'],
    ARRAY['ASHRAE', 'Cooling & Heating Exchange', 'Building Services Association'],
    ARRAY['HVAC Systems', 'Electrical Distribution', 'Plumbing & Fire Safety', 'Building Automation'],
    'available',
    350000000,
    'Specialized MEP consultant with 13 years in commercial and hospitality projects. Expert in energy-efficient systems and intelligent building technologies.',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET 
    rating = 4.7,
    projects_completed = 54,
    updated_at = now();

  -- Create auth user for Sustainability Consultant
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    consultant3_id,
    'nurul.amira@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for Sustainability Consultant
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    consultant3_id,
    'nurul.amira@example.com',
    'Nurul Amira',
    'consultant'::user_role,
    'Green Development Consultants',
    'Bangsar, Kuala Lumpur',
    ARRAY['LEED AP BD+C', 'GBI Accredited Professional', 'Sustainability Expert'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create consultant specialist profile for Sustainability Consultant
  INSERT INTO consultant_profiles (id, discipline, company, phone, location, rating, review_count, projects_completed, years_experience, licenses, certifications, memberships, specializations, availability, max_project_value, company_profile, created_at, updated_at)
  VALUES (
    consultant3_id,
    'environmental'::consultant_discipline,
    'Green Development Consultants',
    '+60 18-567-8901',
    'Bangsar, Kuala Lumpur',
    4.9,
    35,
    41,
    10,
    ARRAY['LEED AP BD+C', 'GBI Accredited Professional'],
    ARRAY['LEED Accredited Professional', 'GBI Professional', 'Environmental Consultant'],
    ARRAY['Green Building Council Malaysia', 'International WELL Building Institute', 'Sustainable Development Professionals'],
    ARRAY['Green Building Design', 'Environmental Impact Assessment', 'LEED Certification', 'Energy Efficiency'],
    'available',
    300000000,
    'Environmental and sustainability consultant specializing in green building certification and carbon footprint reduction. Passionate about climate-resilient development.',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET 
    rating = 4.9,
    projects_completed = 41,
    updated_at = now();

END $$;
