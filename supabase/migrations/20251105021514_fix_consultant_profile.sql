/*
  # Fix Consultant Profile
  
  Updates consultant profile with correct role and creates consultant specialist profile
*/

DO $$
DECLARE
  consultant_id uuid := 'a0000000-0000-0000-0000-000000000002';
BEGIN
  -- Update consultant profile
  UPDATE profiles
  SET 
    role = 'consultant',
    company = 'Premier Design Studio',
    location = 'Petaling Jaya, Malaysia',
    certifications = ARRAY['Board of Architects Malaysia', 'LEED Accredited Professional'],
    updated_at = now()
  WHERE id = consultant_id;

  -- Create consultant specialist profile
  INSERT INTO consultant_profiles (id, discipline, company, phone, location, rating, review_count, projects_completed, years_experience, licenses, certifications, memberships, specializations, availability, preferred_project_types, min_project_value, max_project_value, fee_structure, typical_fee_range, company_profile, created_at, updated_at)
  VALUES (
    consultant_id,
    'architect',
    'Premier Design Studio',
    '+60 12-345-6789',
    'Petaling Jaya, Malaysia',
    4.8,
    24,
    35,
    12,
    ARRAY['Board of Architects Malaysia Registration AR12345'],
    ARRAY['LEED Accredited Professional', 'Green Building Index Facilitator'],
    ARRAY['Malaysian Institute of Architects', 'International Union of Architects'],
    ARRAY['High-rise Residential', 'Commercial Buildings', 'Sustainable Design', 'Heritage Conservation'],
    'available',
    ARRAY['residential', 'commercial', 'mixed'],
    5000000,
    500000000,
    'percentage',
    '{"min": 3.5, "max": 6.0, "currency": "percentage"}'::json,
    'Award-winning architectural firm specializing in sustainable design and innovative architectural solutions for 12+ years.',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET 
    company = 'Premier Design Studio',
    location = 'Petaling Jaya, Malaysia',
    rating = 4.8,
    review_count = 24,
    projects_completed = 35,
    years_experience = 12,
    updated_at = now();

END $$;
