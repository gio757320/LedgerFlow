import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Verify the caller is an authenticated admin staff member
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey     = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify caller's JWT
    const callerSb = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user }, error: userErr } = await callerSb.auth.getUser();
    if (userErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    // Check caller is an admin in firm_staff
    const adminSb = createClient(supabaseUrl, serviceKey);
    const { data: caller } = await adminSb.from('firm_staff').select('role').eq('email', user.email).maybeSingle();
    if (caller?.role !== 'admin') return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403, headers: corsHeaders });

    const { email, role } = await req.json();
    if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400, headers: corsHeaders });

    // Send invitation via Supabase Auth admin API
    const { data, error } = await adminSb.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://portal.manriqueassociates.com',
      data: { role: role || 'staff', firm: 'Manrique & Associates LLC' }
    });

    if (error) {
      // If user already exists, send a password reset instead
      if (error.message?.includes('already been registered')) {
        const { data: users } = await adminSb.auth.admin.listUsers();
        const existing = users?.users?.find(u => u.email === email);
        if (existing) {
          await adminSb.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: { redirectTo: 'https://portal.manriqueassociates.com' }
          });
          return new Response(JSON.stringify({ ok: true, note: 'User exists — recovery email sent' }), { headers: corsHeaders });
        }
      }
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true, user: data.user?.email }), { headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});
