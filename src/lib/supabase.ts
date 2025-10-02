import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수 검증 및 설정
let finalUrl: string
let finalKey: string

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
  console.error('다음 환경 변수를 설정해주세요:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('')
  console.error('예시:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.error('')
  console.error('개발용 임시 설정을 사용합니다...')
  
  // 개발용 임시 설정 (프로덕션에서는 제거해야 함)
  const tempUrl = 'https://likscdiwibbmqnamicon.supabase.co'
  const tempKey = 'sb_publishable_7fvcqr7Pb9Hz2ptfjkjj7Q_ubZyQNky'
  
  console.warn('⚠️ 경고: 하드코딩된 Supabase 설정을 사용합니다. 프로덕션에서는 환경 변수를 사용하세요.')
  
  // 임시 설정 사용
  finalUrl = supabaseUrl || tempUrl
  finalKey = supabaseKey || tempKey
} else {
  // 환경 변수가 설정된 경우
  console.log('✅ Supabase 환경 변수가 올바르게 설정되었습니다.')
  
  finalUrl = supabaseUrl
  finalKey = supabaseKey
}

// 최종 검증
if (!finalUrl || !finalKey) {
  throw new Error('Supabase URL과 Key가 필요합니다.')
}

// Supabase 클라이언트 생성
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 연결 테스트 함수
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase 연결 테스트 실패:', error.message)
      return false
    }
    
    console.log('✅ Supabase 연결 성공!')
    return true
  } catch (error) {
    console.error('Supabase 연결 오류:', error)
    return false
  }
}
