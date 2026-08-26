-- ============================================================================
-- SAHYOG (सहयोग) — Cooperative-Owned Digital Service Marketplace
-- Production-Ready Supabase SQL Schema with Row Level Security (RLS)
-- ============================================================================

-- Enable PostGIS / UUID extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS PROFILE TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL CHECK (role IN ('customer', 'worker', 'federation_admin', 'super_admin')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contact VARCHAR(50),
  language_preference VARCHAR(20) DEFAULT 'en',
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COOPERATIVES TABLE (Societies & Federations)
CREATE TABLE IF NOT EXISTS public.cooperatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  registration_id VARCHAR(100) UNIQUE NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  admin_contact VARCHAR(50),
  admin_email VARCHAR(255),
  total_members INTEGER DEFAULT 0,
  welfare_fund_pool DECIMAL(12,2) DEFAULT 0.00,
  established_year INTEGER,
  verified_badge BOOLEAN DEFAULT true,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  name_hi VARCHAR(150),
  icon VARCHAR(50) NOT NULL,
  description TEXT,
  base_price_range VARCHAR(100),
  popular_tasks JSONB DEFAULT '[]'::jsonb,
  urgency_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WORKERS TABLE (Linked to users and cooperative)
CREATE TABLE IF NOT EXISTS public.workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  cooperative_id UUID REFERENCES public.cooperatives(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  skills TEXT[] DEFAULT '{}',
  service_category_ids UUID[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 1,
  verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'under_review')),
  insurance_status BOOLEAN DEFAULT false,
  availability VARCHAR(20) DEFAULT 'online' CHECK (availability IN ('online', 'busy', 'offline')),
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_ratings_count INTEGER DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 250.00,
  base_visit_fee DECIMAL(10,2) NOT NULL DEFAULT 150.00,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_area VARCHAR(150),
  location_city VARCHAR(100),
  police_verified BOOLEAN DEFAULT false,
  kyc_verified BOOLEAN DEFAULT false,
  bank_account_verified BOOLEAN DEFAULT false,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WORKER CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.worker_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  certificate_name VARCHAR(255) NOT NULL,
  issuing_body VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMERS TABLE (Households & Institutions)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  contact VARCHAR(50),
  addresses JSONB DEFAULT '[]'::jsonb,
  is_institution BOOLEAN DEFAULT false,
  institution_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
  service_category_id UUID REFERENCES public.service_categories(id),
  service_task VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(30) DEFAULT 'requested' CHECK (status IN ('requested', 'matched', 'confirmed', 'en_route', 'in_progress', 'completed', 'cancelled')),
  scheduled_time TIMESTAMPTZ NOT NULL,
  is_emergency BOOLEAN DEFAULT false,
  location_address TEXT NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  price_worker_wage DECIMAL(10,2) NOT NULL,
  price_welfare_contribution DECIMAL(10,2) NOT NULL,
  price_coop_admin_fee DECIMAL(10,2) NOT NULL,
  price_platform_fee DECIMAL(10,2) DEFAULT 0.00,
  price_emergency_fee DECIMAL(10,2) DEFAULT 0.00,
  price_tax_amount DECIMAL(10,2) DEFAULT 0.00,
  price_total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENTS AND INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.payments_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded', 'failed')),
  payment_method VARCHAR(50) DEFAULT 'UPI',
  gateway_reference VARCHAR(150),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RATINGS AND REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.ratings_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rated_by UUID REFERENCES public.users(id),
  rated_user_id UUID REFERENCES public.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. WORKER WELFARE TABLE
CREATE TABLE IF NOT EXISTS public.worker_welfare (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  insurance_provider VARCHAR(255) NOT NULL,
  policy_number VARCHAR(100) NOT NULL,
  coverage_amount DECIMAL(12,2) DEFAULT 500000.00,
  expiry_date DATE,
  welfare_fund_contribution DECIMAL(10,2) DEFAULT 0.00,
  cooperative_dividend_earned DECIMAL(10,2) DEFAULT 0.00,
  emergency_claim_status VARCHAR(30) DEFAULT 'none' CHECK (emergency_claim_status IN ('none', 'applied', 'approved', 'disbursed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. GRIEVANCES TABLE
CREATE TABLE IF NOT EXISTS public.grievances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  filed_by_role VARCHAR(20) NOT NULL CHECK (filed_by_role IN ('customer', 'worker')),
  filed_by_id UUID REFERENCES public.users(id),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'escalated')),
  resolution_notes TEXT,
  assigned_admin_name VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DEMAND FORECASTS TABLE (AI Workforce Planning)
CREATE TABLE IF NOT EXISTS public.demand_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  service_category_id UUID REFERENCES public.service_categories(id),
  predicted_demand_units INTEGER NOT NULL,
  active_workers_available INTEGER NOT NULL,
  deficit_or_surplus INTEGER NOT NULL,
  period VARCHAR(50) NOT NULL,
  confidence_score DECIMAL(4,2) DEFAULT 0.92,
  ai_recommendation TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('booking', 'welfare', 'verification', 'payment', 'emergency')),
  read_status BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_welfare ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read for service categories & verified cooperatives
CREATE POLICY "Public can view service categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Public can view cooperatives" ON public.cooperatives FOR SELECT USING (true);
CREATE POLICY "Public can view verified workers" ON public.workers FOR SELECT USING (verification_status = 'verified' OR auth.uid() = user_id);

-- Workers can read/write their own profile
CREATE POLICY "Workers can view own profile" ON public.workers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Workers can view their certifications" ON public.worker_certifications FOR ALL USING (EXISTS (SELECT 1 FROM public.workers WHERE workers.id = worker_certifications.worker_id AND workers.user_id = auth.uid()));

-- Bookings policies: Customer and assigned worker can view
CREATE POLICY "Users can view relevant bookings" ON public.bookings FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()) OR
  worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('federation_admin', 'super_admin'))
);

-- Notifications policy
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
