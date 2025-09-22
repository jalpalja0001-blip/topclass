import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://likscdiwibbmqnamicon.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_7fvcqr7Pb9Hz2ptfjkjj7Q_ubZyQNky'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL과 Key가 필요합니다.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
