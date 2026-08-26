// Supabase Edge Function: razorpay-webhook
// Deploy: supabase functions deploy razorpay-webhook --no-verify-jwt
// (no-verify-jwt because Razorpay calls this directly, not your logged-in user)
//
// After deploying, copy the function URL into Razorpay Dashboard -> Settings -> Webhooks,
// subscribe to the "payment.captured" event, and set the same secret below.
//
// Set secrets:
//   supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.190.0/crypto/mod.ts';

const WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  const expectedSignature = await hmacHex(WEBHOOK_SECRET, rawBody);
  if (expectedSignature !== signature) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured') {
    const orderId = event.payload.payment.entity.order_id;
    const paymentId = event.payload.payment.entity.id;

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: invoice } = await supabaseAdmin
      .from('payments_invoices')
      .select('id, booking_id')
      .eq('gateway_reference', orderId)
      .single();

    if (invoice) {
      await supabaseAdmin
        .from('payments_invoices')
        .update({ payment_status: 'completed', gateway_reference: paymentId })
        .eq('id', invoice.id);

      await supabaseAdmin
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', invoice.booking_id);

      // Notify the customer
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('customer_id, customers(user_id)')
        .eq('id', invoice.booking_id)
        .single();

      // @ts-ignore - nested join typing
      const userId = booking?.customers?.user_id;
      if (userId) {
        await supabaseAdmin.from('notifications').insert({
          user_id: userId,
          title: 'Payment received',
          message: 'Your payment was successful and your booking is confirmed.',
          type: 'payment',
        });
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
