// Supabase Edge Function: create-payment
// Deploy: supabase functions deploy create-payment
// Set secrets first:
//   supabase secrets set RAZORPAY_KEY_ID=your_key_id
//   supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'booking_id required' }), { status: 400 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Look up the authoritative price from the DB — never trust a client-supplied amount
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, price_total_amount')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404 });
    }

    const amountInPaise = Math.round(Number(booking.price_total_amount) * 100);

    // Create a Razorpay order
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `booking_${booking_id}`,
        notes: { booking_id },
      }),
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      return new Response(JSON.stringify({ error: 'Razorpay order failed', details: errText }), { status: 502 });
    }

    const order = await orderRes.json();

    // Record a pending invoice row
    await supabaseAdmin.from('payments_invoices').insert({
      booking_id,
      amount: booking.price_total_amount,
      payment_status: 'pending',
      payment_method: 'UPI',
      gateway_reference: order.id,
    });

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: amountInPaise,
        currency: 'INR',
        key_id: RAZORPAY_KEY_ID, // public key id, safe to return to the frontend
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
