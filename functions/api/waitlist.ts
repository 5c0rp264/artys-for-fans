// functions/api/waitlist.ts
// Cloudflare Pages Function — route POST /api/waitlist
// La clé Supabase reste côté serveur, jamais exposée au frontend

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

interface WaitlistPayload {
  email: string;
  genre: string;
  instagram?: string;
  tiktok?: string;
  lang?: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = ctx.env;

  // ── CORS headers ──────────────────────────────────────────
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    // Parse body
    const body = await ctx.request.json() as WaitlistPayload;
    const { email, genre, instagram, tiktok, lang = 'fr' } = body;

    // Validation basique
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Email invalide' }), {
        status: 400, headers: corsHeaders,
      });
    }
    if (!genre) {
      return new Response(JSON.stringify({ error: 'Genre requis' }), {
        status: 400, headers: corsHeaders,
      });
    }

    // ── Insert dans Supabase ──────────────────────────────────
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_fans`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email:     email.toLowerCase().trim(),
        genre,
        instagram: instagram || null,
        tiktok:    tiktok    || null,
        lang,
        source:    'landing_fans',
      }),
    });

    // Email déjà inscrit (409 Conflict / unique constraint)
    if (res.status === 409 || res.status === 23505) {
      return new Response(JSON.stringify({ success: true, already: true }), {
        status: 200, headers: corsHeaders,
      });
    }

    if (!res.ok) {
      const err = await res.text();
      console.error('Supabase error:', res.status, err);
      return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
        status: 500, headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: corsHeaders,
    });

  } catch (e) {
    console.error('Waitlist error:', e);
    return new Response(JSON.stringify({ error: 'Erreur inattendue' }), {
      status: 500, headers: corsHeaders,
    });
  }
};

// Gestion preflight CORS
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
