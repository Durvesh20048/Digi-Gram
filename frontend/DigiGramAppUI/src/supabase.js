import { createClient } from "@supabase/supabase-js";

console.log("ENV CHECK → URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("ENV CHECK → KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Loaded" : "Missing!");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("supabaseUrl missing!");
if (!supabaseKey) throw new Error("supabaseKey missing!");

export const supabase = createClient(supabaseUrl, supabaseKey);
