import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

// Load the Razorpay checkout script once, on demand.
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function payForBooking(
  bookingId: string,
  customerName: string,
  customerEmail: string,
  customerContact: string
): Promise<void> {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) throw new Error('Failed to load payment gateway. Check your connection.');

  // Call the Edge Function — this is what actually creates the Razorpay order server-side
  const { data, error } = await supabase.functions.invoke('create-payment', {
    body: { booking_id: bookingId },
  });

  if (error || !data) throw new Error(error?.message || 'Failed to initiate payment');

  return new Promise<void>((resolve, reject) => {
    const options = {
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      name: 'SAHYOG',
      description: 'Cooperative Service Booking Payment',
      order_id: data.order_id,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerContact,
      },
      theme: { color: '#0C3B2E' },
      handler: () => {
        // Actual confirmation happens via the webhook (server-side, tamper-proof).
        // This gives immediate UI feedback.
        resolve();
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled by user')),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
