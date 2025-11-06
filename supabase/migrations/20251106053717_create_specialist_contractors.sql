/*
  # Create Specialist Contractor Profiles
  
  Creates 2 specialized contractor profiles:
  1. Electrical Contractor - Ahmad Electrical
  2. Concrete & Foundation - Precision Concrete Works
*/

DO $$
DECLARE
  contractor1_id uuid := 'c0000000-0000-0000-0000-000000000001';
  contractor2_id uuid := 'c0000000-0000-0000-0000-000000000002';
BEGIN

  -- Create auth user for Electrical Contractor
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    contractor1_id,
    'ahmad.electrical@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for Electrical Contractor
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    contractor1_id,
    'ahmad.electrical@example.com',
    'Ahmad Electrical',
    'contractor'::user_role,
    'Ahmad Electrical Solutions Sdn Bhd',
    'Kota Damansara, Kuala Lumpur',
    ARRAY['CIDB Grade G4', 'Electrical Contractor License', 'DNV GL Certified'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create contractor specialist profile for Electrical Contractor
  INSERT INTO contractor_profiles (id, company, phone, location, rating, review_count, projects_completed, years_experience, licenses, certifications, specializations, equipment, team_size, max_project_value, company_profile, created_at, updated_at)
  VALUES (
    contractor1_id,
    'Ahmad Electrical Solutions Sdn Bhd',
    '+60 19-876-5432',
    'Kota Damansara, Kuala Lumpur',
    4.8,
    26,
    39,
    12,
    ARRAY['CIDB Grade G4', 'SSM Registration EAS654321', 'Electrical Contractor License EC/2019/123'],
    ARRAY['ISO 9001:2015', 'ISO 45001:2018', 'DNV GL Certification'],
    ARRAY['HV/LV Distribution Systems', 'Solar Installation & Integration', 'Smart Building Automation', 'Energy Efficient Solutions'],
    ARRAY['Electrical Testing Equipment', 'Cable Laying Machinery', 'Transformer Units', 'Solar Panel Installation Systems'],
    120,
    200000000,
    'Specialized electrical contractor with 12 years experience in commercial and industrial projects. Experts in energy-efficient solutions and renewable energy systems.',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET 
    rating = 4.8,
    projects_completed = 39,
    updated_at = now();

  -- Create auth user for Concrete Contractor
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
  VALUES (
    contractor2_id,
    'precision.concrete@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profile for Concrete Contractor
  INSERT INTO profiles (id, email, name, role, company, location, certifications, created_at, updated_at)
  VALUES (
    contractor2_id,
    'precision.concrete@example.com',
    'Precision Concrete',
    'contractor'::user_role,
    'Precision Concrete Works Sdn Bhd',
    'Shah Alam, Selangor',
    ARRAY['CIDB Grade G5', 'Concrete Works Specialist', 'IBFC Certified'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create contractor specialist profile for Concrete Contractor
  INSERT INTO contractor_profiles (id, company, phone, location, rating, review_count, projects_completed, years_experience, licenses, certifications, specializations, equipment, team_size, max_project_value, company_profile, created_at, updated_at)
  VALUES (
    contractor2_id,
    'Precision Concrete Works Sdn Bhd',
    '+60 18-765-4321',
    'Shah Alam, Selangor',
    4.9,
    31,
    45,
    15,
    ARRAY['CIDB Grade G5', 'SSM Registration PCW789012', 'Concrete Works Contractor License'],
    ARRAY['ISO 9001:2015', 'ISO 45001:2018', 'IBFC Certification', 'Quality Assurance in Concrete'],
    ARRAY['Foundation & Pile Works', 'Structural Concrete', 'Precast Concrete Solutions', 'Waterproofing Systems'],
    ARRAY['Concrete Pump Trucks (35m-52m)', 'Piling Rigs', 'Concrete Mixers (Multiple capacities)', 'Formwork Systems'],
    180,
    350000000,
    'Premier concrete contractor with 15 years experience in foundation and structural concrete works. Specialized in large-scale commercial and infrastructure projects.',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET 
    rating = 4.9,
    projects_completed = 45,
    updated_at = now();

END $$;
