import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient('https://gyeaakuocvtpxtqxhdwl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZWFha3VvY3Z0cHh0cXhoZHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc5MjQwNTQsImV4cCI6MjAxMzUwMDA1NH0.zrxuXPClGNLtjp4875TXpXzuKqIDVbOKqIfyTNxm_YY');

export default supabaseClient;