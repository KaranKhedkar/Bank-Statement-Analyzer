// src/lib/supabaseClient.js
// import { createClient } from '@supabase/supabase-js'

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in Frontend/.env. Using fallback placeholder client.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);