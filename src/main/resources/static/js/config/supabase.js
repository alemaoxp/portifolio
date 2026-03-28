import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://isjeetfktjajpnoijtya.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzamVldGZrdGphanBub2lqdHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mzc4MDYsImV4cCI6MjA4ODExMzgwNn0.EPq8PCcIyBpihtBE98yB9b3BEsLKMoCueyiLWAzBWr8";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
