import { createClient } from '../@supabase/supabase-js';
const supabaseUrl = "https://vvrjzlsaizsbttinnoyy.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cmp6bHNhaXpzYnR0aW5ub3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjc0ODMsImV4cCI6MjA0ODg0MzQ4M30.ZYx6PMvp96VVaKptEMIIBHEHOsI23MzKbuqkl4awn3A"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;