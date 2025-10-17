import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 Supabase 연결 테스트 시작')
    
    const supabase = createClient()
    console.log('✅ Supabase 클라이언트 생성 완료')
    
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase
      .from('courses')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase 쿼리 오류:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase 연결 실패',
        details: error
      }, { status: 500 })
    }
    
    console.log('✅ Supabase 연결 성공:', data)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase 연결 성공',
      data: data
    })
    
  } catch (error) {
    console.error('❌ Supabase 테스트 오류:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Supabase 테스트 실패',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}
