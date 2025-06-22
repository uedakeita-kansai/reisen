import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigins = [
  'http://localhost:5173',
  'https://uedakeita-kansai.github.io'
];

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin') || '';

  const isAllowed = allowedOrigins.includes(origin);

  if (req.method === 'OPTIONS') {
    if (isAllowed) {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
      });
    } else {
      return new Response('Forbidden', { status: 403 });
    }
  }

  if (!isAllowed) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const { departureStationId, maxPrice } = await req.json();
    if (!departureStationId || maxPrice === undefined) {
      throw new Error('departureStationId and maxPrice are required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data, error } = await supabase
      .from('fares')
      .select('to_station_id')
      .eq('from_station_id', departureStationId)
      .lte('fare', maxPrice);

    if (error) {
      throw error;
    }

    const reachableIds = data.map(item => item.to_station_id);
    if (!reachableIds.includes(departureStationId)) {
      reachableIds.push(departureStationId);
    }

    return new Response(JSON.stringify(reachableIds), {
      headers: { 'Access-Control-Allow-Origin': origin, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(String(err?.message ?? err), {
      headers: { 'Access-Control-Allow-Origin': origin, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});