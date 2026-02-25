import { createClient } from '@supabase/supabase-js'

// Soporte para Vite (import.meta.env) y Node.js (process.env)
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL)
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY)

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL o Anon Key no encontradas. Las llamadas a la DB fallarán.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
