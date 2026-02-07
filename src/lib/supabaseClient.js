// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://frzwffzopzyojgcppvpe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyendmZnpvcHp5b2pnY3BwdnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTM1MTcsImV4cCI6MjA4NTM4OTUxN30.-Up0AI3FRHJvOnjpxqu0i6fekx1uaqNLfH_YsrJKVUU";

export const supabase = createClient(supabaseUrl, supabaseKey);
