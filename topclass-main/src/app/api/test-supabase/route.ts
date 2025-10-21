import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 Supabase 연결 테스트 시작...')
    
    const supabase = createClient()
    
    // 1. 기본 연결 테스트
    console.log('🔍 기본 연결 테스트...')
    const { data: testData, error: testError } = await supabase
      .from('courses')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase 연결 실패:', testError)
      return NextResponse.json({
        success: false,
        error: 'Supabase 연결 실패',
        details: {
          code: testError.code,
          message: testError.message,
          hint: testError.hint
        }
      })
    }
    
    console.log('✅ Supabase 연결 성공!')
    
    // 2. 테스트 데이터 삽입
    console.log('📝 테스트 데이터 삽입...')
    const { data: insertData, error: insertError } = await supabase
      .from('courses')
      .insert([{
        title: '테스트 강의',
        description: '테스트 설명',
        instructor: '테스트 강사',
        category: '무료강의',
        price: 0,
        original_price: 0,
        duration: 0,
        level: 'beginner',
        status: 'draft',
        is_featured: false,
        tags: ['테스트'],
        thumbnail_url: null,
        video_url: null
      }])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ 데이터 삽입 실패:', insertError)
      return NextResponse.json({
        success: false,
        error: '데이터 삽입 실패',
        details: {
          code: insertError.code,
          message: insertError.message,
          hint: insertError.hint
        }
      })
    }
    
    console.log('✅ 데이터 삽입 성공:', insertData)
    
    // 3. 테스트 데이터 삭제
    console.log('🗑️ 테스트 데이터 삭제...')
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', insertData.id)
    
    if (deleteError) {
      console.error('❌ 데이터 삭제 실패:', deleteError)
    } else {
      console.log('✅ 테스트 데이터 삭제 완료')
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase 연결 및 데이터 조작 성공!',
      data: {
        connection: '성공',
        insert: '성공',
        delete: deleteError ? '실패' : '성공'
      }
    })
    
  } catch (error) {
    console.error('❌ Supabase 테스트 오류:', error)
    return NextResponse.json({
      success: false,
      error: '테스트 실패',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}