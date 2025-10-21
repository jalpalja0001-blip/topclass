import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ 
        success: false, 
        message: '강의 ID가 필요합니다.' 
      }, { status: 400 })
    }

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

    // 수강신청 상태 확인
    const { data: enrollment, error: enrollmentError } = await userSupabase
      .from('enrollments')
      .select('id, status, enrolled_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .single()

    if (enrollmentError && enrollmentError.code !== 'PGRST116') {
      console.error('수강신청 상태 확인 오류:', enrollmentError)
      return NextResponse.json({ 
        success: false, 
        message: '수강신청 상태 확인 중 오류가 발생했습니다.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      enrolled: !!enrollment,
      enrollment: enrollment || null
    })

  } catch (error: any) {
    console.error('수강신청 상태 확인 오류:', error)
    return NextResponse.json({ 
      success: false, 
      message: '수강신청 상태 확인 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}
