import { supabase } from './supabase';
import {
  ServiceCategory,
  Cooperative,
  Worker,
  WorkerCertification,
  Customer,
  Booking,
  PaymentInvoice,
  RatingReview,
  WorkerWelfare,
  Grievance,
  DemandForecast,
  NotificationItem,
  BookingStatus,
} from './database.types';

// ---------------------------------------------------------------------------
// SERVICE CATEGORIES
// ---------------------------------------------------------------------------
export async function fetchServiceCategories(): Promise<ServiceCategory[]> {
  const { data, error } = await supabase.from('service_categories').select('*').order('name');
  if (error) throw error;
  return (data || []) as ServiceCategory[];
}

// ---------------------------------------------------------------------------
// COOPERATIVES
// ---------------------------------------------------------------------------
export async function fetchCooperatives(): Promise<Cooperative[]> {
  const { data, error } = await supabase.from('cooperatives').select('*').order('name');
  if (error) throw error;
  return (data || []) as Cooperative[];
}

// ---------------------------------------------------------------------------
// WORKERS (reads from workers_view for denormalized shape)
// ---------------------------------------------------------------------------
export async function fetchWorkers(): Promise<Worker[]> {
  const { data, error } = await supabase.from('workers_view').select('*');
  if (error) throw error;
  return (data || []) as Worker[];
}

export async function fetchWorkerById(id: string): Promise<Worker | null> {
  const { data, error } = await supabase.from('workers_view').select('*').eq('id', id).single();
  if (error) return null;
  return data as Worker;
}

export async function updateWorkerAvailability(workerId: string, availability: Worker['availability']) {
  const { error } = await supabase.from('workers').update({ availability }).eq('id', workerId);
  if (error) throw error;
}

export async function updateWorkerVerification(workerId: string, verification_status: Worker['verification_status']) {
  const { error } = await supabase.from('workers').update({ verification_status }).eq('id', workerId);
  if (error) throw error;
}

export async function fetchCertifications(workerId: string): Promise<WorkerCertification[]> {
  const { data, error } = await supabase
    .from('worker_certifications')
    .select('*')
    .eq('worker_id', workerId);
  if (error) throw error;
  return (data || []) as WorkerCertification[];
}

export async function uploadCertification(
  workerId: string,
  file: File,
  meta: { certificate_name: string; issuing_body: string; issue_date?: string }
): Promise<string> {
  const path = `${workerId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from('certificates').upload(path, file);
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(path);
  const fileUrl = urlData.publicUrl;

  const { error } = await supabase.from('worker_certifications').insert({
    worker_id: workerId,
    certificate_name: meta.certificate_name,
    issuing_body: meta.issuing_body,
    issue_date: meta.issue_date || new Date().toISOString().split('T')[0],
    file_url: fileUrl,
    verified: false,
  });
  if (error) throw error;

  return fileUrl;
}

// ---------------------------------------------------------------------------
// CUSTOMERS
// ---------------------------------------------------------------------------
export async function fetchCustomerByUserId(userId: string): Promise<Customer | null> {
  const { data, error } = await supabase.from('customers').select('*').eq('user_id', userId).single();
  if (error) return null;
  return data as Customer;
}

export async function addCustomerAddress(customerId: string, addresses: Customer['addresses']) {
  const { error } = await supabase.from('customers').update({ addresses }).eq('id', customerId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// BOOKINGS (reads from bookings_view; writes to bookings table)
// ---------------------------------------------------------------------------
export async function fetchBookingsForUser(role: string, userId: string): Promise<Booking[]> {
  let query = supabase.from('bookings_view').select('*').order('created_at', { ascending: false });

  if (role === 'customer') {
    const customer = await fetchCustomerByUserId(userId);
    if (!customer) return [];
    query = query.eq('customer_id', customer.id);
  } else if (role === 'worker') {
    const { data: worker } = await supabase.from('workers').select('id').eq('user_id', userId).single();
    if (!worker) return [];
    query = query.eq('worker_id', worker.id);
  }
  // federation_admin / super_admin see all bookings (governed by RLS)

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Booking[];
}

export interface CreateBookingInput {
  customer_id: string;
  worker_id?: string;
  service_category_id: string;
  service_task: string;
  description: string;
  scheduled_time: string;
  is_emergency: boolean;
  location_address: string;
  location_lat: number;
  location_lng: number;
  price_worker_wage: number;
  price_welfare_contribution: number;
  price_coop_admin_fee: number;
  price_platform_fee: number;
  price_emergency_fee: number;
  price_tax_amount: number;
  price_total_amount: number;
  notes?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<string> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...input, status: 'requested' as BookingStatus })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
  if (error) throw error;
}

export async function assignWorkerToBooking(bookingId: string, workerId: string) {
  const { error } = await supabase
    .from('bookings')
    .update({ worker_id: workerId, status: 'matched' as BookingStatus })
    .eq('id', bookingId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// PAYMENTS / INVOICES
// ---------------------------------------------------------------------------
export async function fetchInvoiceForBooking(bookingId: string): Promise<PaymentInvoice | null> {
  const { data, error } = await supabase
    .from('invoices_view')
    .select('*')
    .eq('booking_id', bookingId)
    .single();
  if (error) return null;
  return data as PaymentInvoice;
}

// ---------------------------------------------------------------------------
// RATINGS & REVIEWS
// ---------------------------------------------------------------------------
export async function fetchReviewsForUser(userId: string): Promise<RatingReview[]> {
  const { data, error } = await supabase
    .from('reviews_view')
    .select('*')
    .eq('rated_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as RatingReview[];
}

export async function submitReview(input: {
  booking_id: string;
  rated_by: string;
  rated_user_id: string;
  rating: number;
  comment: string;
  tags: string[];
}) {
  const { error } = await supabase.from('ratings_reviews').insert(input);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// WORKER WELFARE
// ---------------------------------------------------------------------------
export async function fetchWelfareForWorker(workerId: string): Promise<WorkerWelfare | null> {
  const { data, error } = await supabase.from('welfare_view').select('*').eq('worker_id', workerId).single();
  if (error) return null;
  return data as WorkerWelfare;
}

// ---------------------------------------------------------------------------
// GRIEVANCES
// ---------------------------------------------------------------------------
export async function fetchGrievances(): Promise<Grievance[]> {
  const { data, error } = await supabase.from('grievances_view').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Grievance[];
}

export async function fileGrievance(input: {
  filed_by_role: 'customer' | 'worker';
  filed_by_id: string;
  booking_id?: string;
  category: Grievance['category'];
  description: string;
}) {
  const ticket_number = `GRV-${Date.now()}`;
  const { error } = await supabase.from('grievances').insert({ ...input, ticket_number });
  if (error) throw error;
}

export async function resolveGrievance(id: string, resolution_notes: string, admin_name: string) {
  const { error } = await supabase
    .from('grievances')
    .update({ status: 'resolved', resolution_notes, assigned_admin_name: admin_name })
    .eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// DEMAND FORECASTS (populated by the Edge Function cron job — read only here)
// ---------------------------------------------------------------------------
export async function fetchDemandForecasts(): Promise<DemandForecast[]> {
  const { data, error } = await supabase
    .from('demand_forecasts_view')
    .select('*')
    .order('generated_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DemandForecast[];
}

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------
export async function fetchNotifications(userId: string): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as NotificationItem[];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from('notifications').update({ read_status: true }).eq('id', id);
  if (error) throw error;
}

// Subscribe to realtime notification inserts for a given user.
export function subscribeToNotifications(userId: string, onInsert: (n: NotificationItem) => void) {
  const channel = supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => onInsert(payload.new as NotificationItem)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Subscribe to realtime booking status changes
export function subscribeToBooking(bookingId: string, onUpdate: (b: Partial<Booking>) => void) {
  const channel = supabase
    .channel(`booking-${bookingId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${bookingId}` },
      (payload) => onUpdate(payload.new as Partial<Booking>)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
