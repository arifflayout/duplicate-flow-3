/*
  # Fix Lender Profile
  
  Updates lender profile with correct role and data
*/

DO $$
DECLARE
  lender_id uuid := 'a0000000-0000-0000-0000-000000000005';
BEGIN
  -- Update lender profile
  UPDATE profiles
  SET 
    role = 'lender'::user_role,
    company = 'Prime Development Finance',
    location = 'KLCC, Kuala Lumpur',
    certifications = ARRAY['Bank Negara Malaysia Licensed', 'ISO 9001:2015 Certified', 'Financial Services Board Accredited'],
    updated_at = now()
  WHERE id = lender_id;

END $$;
