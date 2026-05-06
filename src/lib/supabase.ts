import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lpfvprxbedrjzhlushcx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZnZwcnhiZWRyanpobHVzaGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzQ4OTQsImV4cCI6MjA5MzY1MDg5NH0.sbvNMKBGZACxR_D4mZCkz49TzHEVRdEgE2ulJibNS-U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)