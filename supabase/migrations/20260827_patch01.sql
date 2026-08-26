-- ============================================================================
-- SAHYOG — Patch 01: Auth trigger, denormalized views, storage, indexes
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. AUTO-CREATE public.users PROFILE ON SIGNUP
-- Without this, every new auth.users row has no matching public.users row,
-- so RLS policies that join through public.users will silently fail.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, role, name, email, contact, language_preference, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'contact', ''),
    'en',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;

  -- If they signed up as a customer, also create the customers row
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'customer' THEN
    INSERT INTO public.customers (user_id, full_name, contact, addresses)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), '', '[]'::jsonb)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. AUTO-GENERATE booking_code and invoice_number
-- ----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS booking_code_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 5000;

CREATE OR REPLACE FUNCTION public.set_booking_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
    NEW.booking_code := 'SHY-' || to_char(NOW(), 'YYYY') || '-' || nextval('booking_code_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_booking_code ON public.bookings;
CREATE TRIGGER trg_set_booking_code
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_booking_code();

CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || to_char(NOW(), 'YYYY') || '-' || nextval('invoice_number_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_invoice_number ON public.payments_invoices;
CREATE TRIGGER trg_set_invoice_number
  BEFORE INSERT ON public.payments_invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

-- ----------------------------------------------------------------------------
-- 3. DENORMALIZED VIEWS matching your frontend TypeScript shapes
-- ----------------------------------------------------------------------------

-- Workers, shaped to match the `Worker` frontend type
CREATE OR REPLACE VIEW public.workers_view AS
SELECT
  w.id,
  w.user_id,
  w.cooperative_id,
  c.name AS cooperative_name,
  w.full_name,
  w.skills,
  w.service_category_ids,
  w.experience_years,
  w.verification_status,
  w.insurance_status,
  w.availability,
  w.rating,
  w.total_ratings_count,
  w.total_jobs_completed,
  w.hourly_rate,
  w.base_visit_fee,
  jsonb_build_object(
    'lat', w.location_lat, 'lng', w.location_lng,
    'area', w.location_area, 'city', w.location_city
  ) AS location,
  w.police_verified,
  w.kyc_verified,
  w.bio,
  w.avatar_url,
  w.bank_account_verified
FROM public.workers w
LEFT JOIN public.cooperatives c ON c.id = w.cooperative_id;

-- Bookings, shaped to match the `Booking` frontend type
CREATE OR REPLACE VIEW public.bookings_view AS
SELECT
  b.id,
  b.booking_code,
  b.customer_id,
  cu.full_name AS customer_name,
  cu.contact AS customer_contact,
  b.worker_id,
  w.full_name AS worker_name,
  wu.contact AS worker_contact,
  w.avatar_url AS worker_avatar,
  coop.name AS cooperative_name,
  b.service_category_id,
  sc.name AS service_category_name,
  b.service_task,
  b.description,
  b.status,
  b.scheduled_time,
  b.is_emergency,
  jsonb_build_object('address', b.location_address, 'lat', b.location_lat, 'lng', b.location_lng) AS location,
  jsonb_build_object(
    'worker_wage', b.price_worker_wage,
    'welfare_contribution', b.price_welfare_contribution,
    'coop_admin_fee', b.price_coop_admin_fee,
    'platform_fee', b.price_platform_fee,
    'tax_amount', b.price_tax_amount,
    'emergency_fee', b.price_emergency_fee,
    'total_amount', b.price_total_amount
  ) AS price_breakdown,
  b.notes,
  b.created_at
FROM public.bookings b
LEFT JOIN public.customers cu ON cu.id = b.customer_id
LEFT JOIN public.users wu ON wu.id = (SELECT user_id FROM public.workers WHERE id = b.worker_id)
LEFT JOIN public.workers w ON w.id = b.worker_id
LEFT JOIN public.cooperatives coop ON coop.id = w.cooperative_id
LEFT JOIN public.service_categories sc ON sc.id = b.service_category_id;

-- Invoices, shaped to match `PaymentInvoice`
CREATE OR REPLACE VIEW public.invoices_view AS
SELECT
  pi.id, pi.booking_id, bv.booking_code, bv.customer_name, bv.worker_name, bv.cooperative_name,
  pi.amount, pi.payment_status, pi.payment_method, pi.gateway_reference,
  pi.invoice_number, pi.invoice_url, pi.created_at
FROM public.payments_invoices pi
LEFT JOIN public.bookings_view bv ON bv.id = pi.booking_id;

-- Reviews, shaped to match `RatingReview`
CREATE OR REPLACE VIEW public.reviews_view AS
SELECT
  r.id, r.booking_id, r.rated_by, u.name AS rated_by_name, r.rated_user_id,
  r.rating, r.comment, r.tags, r.created_at
FROM public.ratings_reviews r
LEFT JOIN public.users u ON u.id = r.rated_by;

-- Welfare, shaped to match `WorkerWelfare`
CREATE OR REPLACE VIEW public.welfare_view AS
SELECT
  ww.id, ww.worker_id, w.full_name AS worker_name, ww.insurance_provider, ww.policy_number,
  ww.coverage_amount, ww.expiry_date, ww.welfare_fund_contribution,
  ww.cooperative_dividend_earned, ww.emergency_claim_status
FROM public.worker_welfare ww
LEFT JOIN public.workers w ON w.id = ww.worker_id;

-- Grievances, shaped to match `Grievance`
CREATE OR REPLACE VIEW public.grievances_view AS
SELECT
  g.id, g.ticket_number, g.filed_by_role, g.filed_by_id, u.name AS filed_by_name,
  g.booking_id, g.category, g.description, g.status, g.resolution_notes,
  g.assigned_admin_name, g.created_at
FROM public.grievances g
LEFT JOIN public.users u ON u.id = g.filed_by_id;

-- Demand forecasts, shaped to match `DemandForecast`
CREATE OR REPLACE VIEW public.demand_forecasts_view AS
SELECT
  df.id, df.region, df.city, df.service_category_id, sc.name AS service_category_name,
  df.predicted_demand_units, df.active_workers_available, df.deficit_or_surplus,
  df.period, df.confidence_score, df.ai_recommendation, df.generated_at
FROM public.demand_forecasts df
LEFT JOIN public.service_categories sc ON sc.id = df.service_category_id;

-- ----------------------------------------------------------------------------
-- 4. STORAGE BUCKETS (certificates, avatars, invoices)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars: public read, owner can upload/update their own
CREATE POLICY "Avatar public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatar owner upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Avatar owner update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Certificates: only the worker who owns them (folder = their user id) can read/write
CREATE POLICY "Certificates owner access" ON storage.objects
  FOR ALL USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Invoices: only the customer/worker involved can read (writes happen via Edge Function service role)
CREATE POLICY "Invoices owner read" ON storage.objects
  FOR SELECT USING (bucket_id = 'invoices' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ----------------------------------------------------------------------------
-- 5. INDEXES for common lookups
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_workers_cooperative ON public.workers(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_workers_availability ON public.workers(availability);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON public.bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read_status);

-- ----------------------------------------------------------------------------
-- 6. REALTIME — let booking status changes push live to the UI
-- ----------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
