export type UserRole = 'customer' | 'worker' | 'federation_admin' | 'super_admin';

export type BookingStatus = 
  | 'requested'
  | 'matched'
  | 'confirmed'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'under_review';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  contact: string;
  language_preference: string;
  avatar_url?: string;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
}

export interface Cooperative {
  id: string;
  name: string;
  registration_id: string;
  region: string;
  city: string;
  state: string;
  admin_contact: string;
  admin_email: string;
  total_members: number;
  welfare_fund_pool: number;
  established_year: number;
  verified_badge: boolean;
  logo_url?: string;
}

export interface WorkerCertification {
  id: string;
  worker_id: string;
  certificate_name: string;
  issuing_body: string; // e.g. "NSDC (National Skill Development Corp)", "ITI", "Cooperative Guild"
  file_url: string;
  verified: boolean;
  issue_date: string;
  expiry_date?: string;
}

export interface Worker {
  id: string;
  user_id: string;
  cooperative_id: string;
  cooperative_name?: string;
  full_name: string;
  skills: string[];
  service_category_ids: string[];
  experience_years: number;
  verification_status: VerificationStatus;
  insurance_status: boolean;
  availability: 'online' | 'busy' | 'offline';
  rating: number;
  total_ratings_count: number;
  total_jobs_completed: number;
  hourly_rate: number;
  base_visit_fee: number;
  location: {
    lat: number;
    lng: number;
    area: string;
    city: string;
  };
  police_verified: boolean;
  kyc_verified: boolean;
  bio: string;
  avatar_url: string;
  bank_account_verified: boolean;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  name_hi?: string;
  icon: string; // Lucide icon name
  description: string;
  base_price_range: string;
  popular_tasks: string[];
  urgency_available: boolean;
  image_url: string;
}

export interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  contact: string;
  addresses: {
    id: string;
    label: string; // "Home", "Office", "Elderly Parents"
    address_line: string;
    city: string;
    pincode: string;
    lat: number;
    lng: number;
  }[];
  is_institution: boolean;
  institution_name?: string;
}

export interface Booking {
  id: string;
  booking_code: string; // e.g. "SHY-2026-8812"
  customer_id: string;
  customer_name: string;
  customer_contact: string;
  worker_id?: string;
  worker_name?: string;
  worker_contact?: string;
  worker_avatar?: string;
  cooperative_name?: string;
  service_category_id: string;
  service_category_name: string;
  service_task: string;
  description: string;
  status: BookingStatus;
  scheduled_time: string;
  is_emergency: boolean;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  price_breakdown: {
    worker_wage: number; // ~88%
    welfare_contribution: number; // ~7%
    coop_admin_fee: number; // ~5%
    platform_fee: number; // ₹0 (Cooperative owned!)
    tax_amount: number;
    emergency_fee: number;
    total_amount: number;
  };
  notes?: string;
  created_at: string;
}

export interface PaymentInvoice {
  id: string;
  booking_id: string;
  booking_code: string;
  customer_name: string;
  worker_name: string;
  cooperative_name: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_method: 'UPI' | 'Card' | 'NetBanking' | 'CashAfterWork';
  gateway_reference: string;
  invoice_number: string;
  invoice_url?: string;
  created_at: string;
}

export interface RatingReview {
  id: string;
  booking_id: string;
  rated_by: string;
  rated_by_name: string;
  rated_user_id: string;
  rating: number; // 1-5
  comment: string;
  tags: string[];
  created_at: string;
}

export interface WorkerWelfare {
  id: string;
  worker_id: string;
  worker_name: string;
  insurance_provider: string; // e.g. "Ayushman Bharat PM-JAY / United India"
  policy_number: string;
  coverage_amount: number;
  expiry_date: string;
  welfare_fund_contribution: number;
  cooperative_dividend_earned: number;
  emergency_claim_status: 'none' | 'applied' | 'approved' | 'disbursed';
}

export interface Grievance {
  id: string;
  ticket_number: string;
  filed_by_role: 'customer' | 'worker';
  filed_by_id: string;
  filed_by_name: string;
  booking_id?: string;
  category: 'wage_dispute' | 'behavior' | 'quality_of_work' | 'safety' | 'welfare_delay' | 'other';
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'escalated';
  resolution_notes?: string;
  assigned_admin_name?: string;
  created_at: string;
}

export interface DemandForecast {
  id: string;
  region: string;
  city: string;
  service_category_id: string;
  service_category_name: string;
  predicted_demand_units: number;
  active_workers_available: number;
  deficit_or_surplus: number;
  period: 'Upcoming Week' | 'Next Month' | 'Seasonal Spike';
  confidence_score: number;
  ai_recommendation: string;
  generated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'welfare' | 'verification' | 'payment' | 'emergency';
  read_status: boolean;
  created_at: string;
  action_url?: string;
}
