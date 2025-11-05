/*
  # Fix Contractor Profile - Corrected
  
  Updates contractor profile with correct role and creates contractor specialist profile
*/

DO $$
DECLARE
  contractor_id uuid := 'a0000000-0000-0000-0000-000000000003';
BEGIN
  -- Update contractor profile
  UPDATE profiles
  SET 
    role = 'contractor',
    company = 'BuildRight Construction Sdn Bhd',
    location = 'Klang, Selangor',
    certifications = ARRAY['Construction Industry Development Board Registration', 'ISO 9001:2015 Certified'],
    updated_at = now()
  WHERE id = contractor_id;

  -- Create contractor specialist profile
  INSERT INTO contractor_profiles (id, company, phone, location, rating, review_count, projects_completed, years_experience, licenses, certifications, specializations, equipment, team_size, max_project_value, company_profile, created_at, updated_at)
  VALUES (
    contractor_id,
    'BuildRight Construction Sdn Bhd',
    '+60 16-987-6543',
    'Klang, Selangor',
    4.7,
    31,
    42,
    14,
    ARRAY['CIDB Grade G7', 'SSM Registration BRW123456'],
    ARRAY['ISO 9001:2015', 'ISO 45001:2018 Occupational Health & Safety', 'Green Building Index Certified'],
    ARRAY['Commercial Construction', 'Residential Building', 'Infrastructure Works', 'Facade Installation'],
    ARRAY['Concrete Pump Trucks', 'Tower Cranes', 'Excavators', 'Pile Drivers', 'Scaffolding Systems'],
    250,
    450000000,
    'Leading construction contractor with 14+ years of experience in large-scale commercial and residential projects across Malaysia.',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET 
    company = 'BuildRight Construction Sdn Bhd',
    location = 'Klang, Selangor',
    rating = 4.7,
    review_count = 31,
    projects_completed = 42,
    years_experience = 14,
    updated_at = now();

END $$;
