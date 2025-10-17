import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수 검증 및 설정
let finalUrl: string
let finalKey: string

// 개발용 임시 설정 (프로덕션에서는 제거해야 함)
const tempUrl = 'https://mpejkujtaiqgmbazobjv.supabase.co'
const tempKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZWprdWp0YWlxZ21iYXpvYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODIwMDAsImV4cCI6MjA3NjE1ODAwMH0.cpFLDyB2QsPEh-8UT5DtXIdIyeN8--Z7V8fdVs3bZII'

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다. 개발용 임시 설정을 사용합니다.')
  console.warn('프로덕션에서는 다음 환경 변수를 설정해주세요:')
  console.warn('- NEXT_PUBLIC_SUPABASE_URL')
  console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  // 임시 설정 사용
  finalUrl = tempUrl
  finalKey = tempKey
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
    // 1295 오류 방지를 위해 간단한 쿼리 사용
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Supabase 연결 테스트 실패:', error.message)
      console.error('오류 코드:', error.code)
      console.error('오류 세부사항:', error.details)
      
      // 1295 오류인 경우 특별 처리
      if (error.code === 'PGRST1295' || error.message.includes('1295')) {
        console.warn('⚠️ MySQL 1295 오류 감지. 더미 데이터 모드로 전환합니다.')
        return false
      }
      
      return false
    }
    
    console.log('✅ Supabase 연결 성공!')
    return true
  } catch (error) {
    console.error('Supabase 연결 오류:', error)
    return false
  }
}
