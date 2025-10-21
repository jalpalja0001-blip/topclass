import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { z } from 'zod'

const supabase = createClient()

const enrollmentSchema = z.object({
  courseId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🎓 무료강의 수강신청 시작...')
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: '인증이 필요합니다.' 
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // 토큰으로 사용자 정보 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ 
        success: false, 
        message: '유효하지 않은 토큰입니다.' 
      }, { status: 401 })
    }
    
    const body = await request.json()
    const { courseId } = body
    
    console.log('📋 수강신청 정보:', { courseId, userId: user.id })
    
    // 이미 수강신청했는지 확인
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .single()
    
    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        data: existingEnrollment,
        message: '이미 수강신청한 강의입니다.'
      })
    }
    
    // 실제 Supabase에 저장
    console.log('💾 Supabase에 실제 저장 중...')
    
    // 사용자 인증된 클라이언트로 다시 생성
    const { createClient } = require('@supabase/supabase-js')
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mpejkujtaiqgmbazobjv.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZWprdWp0YWlxZ21iYXpvYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODIwMDAsImV4cCI6MjA3NjE1ODAwMH0.cpFLDyB2QsPEh-8UT5DtXIdIyeN8--Z7V8fdVs3bZII',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )
    
    const { data: enrollment, error: enrollmentError } = await userSupabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        status: 'active',
        enrolled_at: new Date().toISOString(),
        progress_percentage: 0
      })
      .select()
      .single()
    
    if (enrollmentError) {
      console.error('❌ 저장 실패:', enrollmentError)
      return NextResponse.json({
        success: false,
        message: '수강신청 처리 중 오류가 발생했습니다.'
      }, { status: 500 })
    }
    
    console.log('✅ 실제 저장 완료:', enrollment.id)
    
    return NextResponse.json({
      success: true,
      data: enrollment,
      message: '무료강의 수강신청이 완료되었습니다.'
    })
    
  } catch (error) {
    console.error('❌ 무료강의 수강신청 오류:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: '수강신청 처리 중 오류가 발생했습니다.'
      },
      { status: 500 }
    )
  }
}