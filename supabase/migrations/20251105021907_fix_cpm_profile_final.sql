/*
  # Fix Project Manager (CPM) Profile
  
  Updates project manager profile with correct 'cpm' role and certifications
*/

DO $$
DECLARE
  pm_id uuid := 'a0000000-0000-0000-0000-000000000004';
BEGIN
  -- Update project manager profile with 'cpm' role
  UPDATE profiles
  SET 
    role = 'cpm'::user_role,
    company = 'Strategic Project Solutions',
    location = 'Bangsar, Kuala Lumpur',
    certifications = ARRAY['Project Management Institute - PMP', 'PRINCE2 Practitioner', 'Agile Certified Practitioner', 'Risk Management Professional'],
    updated_at = now()
  WHERE id = pm_id;

END $$;
