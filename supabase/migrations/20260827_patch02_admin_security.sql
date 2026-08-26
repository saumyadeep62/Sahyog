-- ============================================================================
-- SAHYOG — Patch 02: Admin Role Security & Email Restriction
-- Enforces that only admin@gmail.com can hold federation_admin or super_admin roles
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. HARDENED public.handle_new_user() TRIGGER
-- Silently downgrades any non-admin signup attempting an admin role to 'customer'
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_name TEXT;
  v_contact TEXT;
BEGIN
  -- Extract requested role from metadata
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  v_contact := COALESCE(NEW.raw_user_meta_data->>'contact', '+91 98765 43210');

  -- Strict Security: Only admin@gmail.com can have admin roles
  IF v_role IN ('federation_admin', 'super_admin') AND LOWER(TRIM(NEW.email)) != 'admin@gmail.com' THEN
    v_role := 'customer';
  END IF;

  -- If admin@gmail.com signs up, give them super_admin role by default
  IF LOWER(TRIM(NEW.email)) = 'admin@gmail.com' THEN
    v_role := 'super_admin';
  END IF;

  -- Insert or update user profile in public.users
  INSERT INTO public.users (id, role, name, email, contact, language_preference, status)
  VALUES (
    NEW.id,
    v_role,
    v_name,
    NEW.email,
    v_contact,
    'en',
    'active'
  )
  ON CONFLICT (id) DO UPDATE
    SET role = EXCLUDED.role,
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        contact = EXCLUDED.contact;

  -- If customer, ensure customer record exists
  IF v_role = 'customer' THEN
    INSERT INTO public.customers (user_id, saved_addresses, emergency_contact)
    VALUES (NEW.id, '[]'::jsonb, NULL)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Reattach trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. DATABASE CONSTRAINT ON public.users
-- Prevents direct SQL updates from granting admin roles to non-admin emails
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_admin_role_email'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT check_admin_role_email
      CHECK (
        (role NOT IN ('federation_admin', 'super_admin'))
        OR (LOWER(TRIM(email)) = 'admin@gmail.com')
      );
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY: ADMIN POLICIES
-- Only requests authenticated as admin@gmail.com have admin read/write rights
-- ----------------------------------------------------------------------------

-- Admin policy for full access on public.users
DROP POLICY IF EXISTS "Admins can view and update all users" ON public.users;
CREATE POLICY "Admins can view and update all users"
  ON public.users
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'admin@gmail.com'
    OR auth.uid() = id
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'admin@gmail.com'
    OR auth.uid() = id
  );

-- Admin policy for full access on public.workers
DROP POLICY IF EXISTS "Admins have full access to workers" ON public.workers;
CREATE POLICY "Admins have full access to workers"
  ON public.workers
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'admin@gmail.com'
    OR auth.uid() = user_id
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'admin@gmail.com'
    OR auth.uid() = user_id
  );

-- Admin policy for full access on public.grievances
DROP POLICY IF EXISTS "Admins have full access to grievances" ON public.grievances;
CREATE POLICY "Admins have full access to grievances"
  ON public.grievances
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'admin@gmail.com'
    OR auth.uid() = raised_by
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'admin@gmail.com'
    OR auth.uid() = raised_by
  );
