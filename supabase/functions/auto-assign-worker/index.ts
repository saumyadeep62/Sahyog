// ============================================================================
// Supabase Edge Function: auto-assign-worker
// Weighted AI/Algorithm Matching & Dispatch for Workerless Bookings
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Haversine distance calculator in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { booking_id, category_id, customer_location } = body;

    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'booking_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch booking details if not supplied
    const { data: booking, error: bkError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (bkError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const targetCategoryId = category_id || booking.service_category_id;
    const custLat = customer_location?.lat || booking.customer_location_lat || 19.076;
    const custLng = customer_location?.lng || booking.customer_location_lng || 72.8777;

    // 2. Query online, verified candidate workers
    const { data: candidateWorkers, error: wError } = await supabase
      .from('workers')
      .select('*, user:users(name, contact)')
      .eq('availability', 'online')
      .eq('verification_status', 'verified')
      .contains('service_category_ids', [targetCategoryId]);

    if (wError || !candidateWorkers || candidateWorkers.length === 0) {
      // No online worker available in category -> Notify Cooperative Admin
      await supabase.from('notifications').insert({
        user_id: 'usr-fed-1', // Default federation admin
        title: '⚠️ Unfulfilled Dispatch Alert',
        message: `Booking #${booking.booking_code} could not be auto-matched. No verified artisans are currently online in category ${targetCategoryId}.`,
        read_status: false,
      });

      return new Response(
        JSON.stringify({
          matched: false,
          message: 'No available online artisans found. Booking remains queued for manual assignment.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Calculate weighted scoring
    // Score = (0.5 * Rating/5) + (0.3 * ProximityScore) + (0.2 * FairnessScore)
    const scoredWorkers = candidateWorkers.map((worker) => {
      const rating = Number(worker.rating) || 4.5;
      const normalizedRating = Math.min(Math.max(rating / 5, 0), 1);

      const workerLat = worker.location_lat || 19.082;
      const workerLng = worker.location_lng || 72.884;
      const distKm = calculateDistanceKm(custLat, custLng, workerLat, workerLng);

      // Proximity score: 1.0 for 0km, down to 0.0 for 25km+
      const proximityScore = Math.max(0, 1 - distKm / 25);

      // Fairness load-balancing: fewer completed jobs = higher priority
      const jobsCompleted = worker.total_jobs_completed || 0;
      const fairnessScore = Math.max(0.1, 1 / (1 + jobsCompleted * 0.05));

      const totalScore = 0.5 * normalizedRating + 0.3 * proximityScore + 0.2 * fairnessScore;

      return {
        worker,
        distanceKm: distKm,
        totalScore,
      };
    });

    // Sort descending by score
    scoredWorkers.sort((a, b) => b.totalScore - a.totalScore);
    const selected = scoredWorkers[0];
    const topWorker = selected.worker;

    // 4. Update booking with assigned worker
    await supabase
      .from('bookings')
      .update({
        worker_id: topWorker.id,
        status: 'confirmed',
      })
      .eq('id', booking_id);

    // 5. Send notification to assigned worker
    await supabase.from('notifications').insert({
      user_id: topWorker.user_id,
      title: '⚡ New Auto-Dispatched Job Assigned!',
      message: `You have been matched to booking #${booking.booking_code} (${selected.distanceKm.toFixed(1)} km away). Fair Wage: ₹${booking.price_worker_wage || 450}.`,
      read_status: false,
    });

    return new Response(
      JSON.stringify({
        matched: true,
        worker_id: topWorker.id,
        worker_name: topWorker.user?.name || 'Verified Cooperative Artisan',
        distanceKm: selected.distanceKm,
        score: selected.totalScore,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
