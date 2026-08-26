// Supabase Edge Function: demand-forecast-job
// Deploy: supabase functions deploy demand-forecast-job
// Schedule it (e.g. daily) with Supabase Cron:
//   supabase functions schedule demand-forecast-job --cron "0 3 * * *"
//
// This looks at booking volume per region/category over the last 30 days,
// compares it to active worker supply, and writes a forecast row.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async () => {
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: categories } = await supabaseAdmin.from('service_categories').select('id, name');
  const { data: cooperatives } = await supabaseAdmin.from('cooperatives').select('id, city, region');

  if (!categories || !cooperatives) {
    return new Response(JSON.stringify({ error: 'No base data found' }), { status: 500 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const results = [];

  for (const coop of cooperatives) {
    for (const category of categories) {
      const { count: bookingCount } = await supabaseAdmin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('service_category_id', category.id)
        .gte('created_at', thirtyDaysAgo);

      const { count: workerCount } = await supabaseAdmin
        .from('workers')
        .select('id', { count: 'exact', head: true })
        .eq('cooperative_id', coop.id)
        .contains('service_category_ids', [category.id])
        .eq('availability', 'online');

      const predicted = Math.round((bookingCount ?? 0) * 1.15); // naive 15% growth projection
      const available = workerCount ?? 0;
      const deficitOrSurplus = available - predicted;

      const recommendation =
        deficitOrSurplus < 0
          ? `Recruit or activate ~${Math.abs(deficitOrSurplus)} more ${category.name} workers in ${coop.city} to meet projected demand.`
          : `Supply is sufficient for ${category.name} in ${coop.city}; consider reallocating idle capacity.`;

      results.push({
        region: coop.region,
        city: coop.city,
        service_category_id: category.id,
        predicted_demand_units: predicted,
        active_workers_available: available,
        deficit_or_surplus: deficitOrSurplus,
        period: 'Upcoming Week',
        confidence_score: 0.75,
        ai_recommendation: recommendation,
      });
    }
  }

  if (results.length > 0) {
    const { error } = await supabaseAdmin.from('demand_forecasts').insert(results);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ inserted: results.length }), { status: 200 });
});
