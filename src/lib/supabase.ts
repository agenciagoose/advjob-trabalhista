import { createClient } from '@supabase/supabase-js'

// Fallback values para desenvolvimento local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Verificar se as variáveis estão configuradas
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn('⚠️ Variáveis do Supabase não configuradas. Configure suas credenciais para usar a autenticação.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)