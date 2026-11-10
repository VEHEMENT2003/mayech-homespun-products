/* ================================================================
   js/supabase.js — Supabase client + product fetching
   ---------------------------------------------------------------
   SAFETY: Only the ANON/PUBLISHABLE key belongs here.
   NEVER put the service_role key in frontend code.
   ================================================================ */
(function (global) {
  'use strict';

  // ---- Configure these to enable Supabase ----
  // Leave empty ("") to use the local fallback dataset.
  const SUPABASE_URL = '';        // e.g. 'https://xyzcompany.supabase.co'
  const SUPABASE_ANON_KEY = '';   // e.g. 'eyJhbGciOi...'

  let client = null;

  function isConfigured() {
    return (
      SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      typeof global.supabase !== 'undefined' &&
      typeof global.supabase.createClient === 'function'
    );
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!client) {
      client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false }
      });
    }
    return client;
  }

  /**
   * Fetch active products ordered by display_order.
   * Returns an array (possibly empty) or throws on error.
   */
  async function fetchActiveProducts() {
    const c = getClient();
    if (!c) throw new Error('Supabase is not configured.');

    const { data, error } = await c
      .from('products')
      .select('id, name_mr, name_en, price_per_kg, image_url, description_mr, description_en, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  global.MayechSupabase = {
    isConfigured,
    getClient,
    fetchActiveProducts
  };
})(window);