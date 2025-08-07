import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://njrqgpninhgjsmvdrkgo.supabase.co"
const supabaseClient = createClient(SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

export default supabaseClient;