import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🎓 내 강의 목록 조회 시작...')
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 인증 토큰이 없습니다.')
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    console.log('🔑 토큰 추출 완료')
    
    // Supabase에서 사용자 정보 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      console.error('❌ 사용자 인증 실패:', userError?.message)
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }
    
    console.log('✅ 사용자 인증 성공:', user.email)

    // 1. 수강신청한 강의 목록 조회 (실제 데이터베이스)
    console.log('🔍 수강신청한 강의 조회 중...')
    
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
    
    const { data: enrollments, error: enrollmentError } = await userSupabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false })

    console.log('📊 수강신청 조회 결과:', { 
      enrollments: enrollments?.length || 0, 
      error: enrollmentError?.message,
      enrollmentData: enrollments?.slice(0, 2) // 처음 2개만 로그
    })

    if (enrollmentError) {
      console.error('❌ 수강신청 조회 실패:', enrollmentError)
    }
    
    console.log('✅ 수강신청 데이터 조회 완료:', enrollments?.length || 0, '개')

    // 1.5. enrollments에 해당하는 courses 조회 (수동 조인)
    let enrollmentCourses = []
    if (enrollments && enrollments.length > 0) {
      const courseIds = enrollments.map(e => e.course_id)
      console.log('🔍 수강신청 course_ids:', courseIds)

      const { data: courses, error: coursesError } = await userSupabase
        .from('courses')
        .select('*')
        .in('id', courseIds)

      console.log('📊 수강신청 courses 조회:', courses?.length || 0, '개')
      if (coursesError) {
        console.error('❌ 수강신청 courses 조회 실패:', coursesError)
      }

      if (courses) {
        enrollmentCourses = enrollments.map(enrollment => {
          const course = courses.find(c => c.id === enrollment.course_id)
          return {
            ...enrollment,
            course: course
          }
        }).filter(e => e.course) // course가 있는 것만 필터링
      }
    }

    console.log('✅ 수강신청 수동 조인 완료:', enrollmentCourses.length, '개')

    // 2. 구매한 강의 목록 조회 (purchases 테이블)
    console.log('🔍 구매한 강의 조회 중...')
    
    const { data: purchases, error: purchaseError } = await userSupabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (purchaseError) {
      console.error('❌ 구매 내역 조회 실패:', purchaseError)
    }

    // 2.5. purchases에 해당하는 courses 조회 (수동 조인)
    let purchaseCourses = []
    if (purchases && purchases.length > 0) {
      const courseIds = purchases.map(p => p.course_id)
      console.log('🔍 구매 course_ids:', courseIds)

      const { data: courses, error: coursesError } = await userSupabase
        .from('courses')
        .select('*')
        .in('id', courseIds)

      console.log('📊 구매 courses 조회:', courses?.length || 0, '개')
      if (coursesError) {
        console.error('❌ 구매 courses 조회 실패:', coursesError)
      }

      if (courses) {
        purchaseCourses = purchases.map(purchase => {
          const course = courses.find(c => c.id === purchase.course_id)
          return {
            ...purchase,
            course: course
          }
        }).filter(p => p.course) // course가 있는 것만 필터링
      }
    }

    console.log('✅ 구매 수동 조인 완료:', purchaseCourses.length, '개')

    // 3. 데이터 통합 및 중복 제거
    console.log('🔄 데이터 통합 시작...')
    const myCourses = new Map()
    
    // 수강신청한 강의 추가
    if (enrollmentCourses && enrollmentCourses.length > 0) {
      console.log('📚 수강신청한 강의 처리 중:', enrollmentCourses.length, '개')
      enrollmentCourses.forEach((enrollment: any, index: number) => {
        console.log(`📖 강의 ${index + 1}:`, {
          enrollment_id: enrollment.id,
          course_id: enrollment.course_id,
          course_title: enrollment.course?.title,
          status: enrollment.status
        })
        
        if (enrollment.course) {
          myCourses.set(enrollment.course.id, {
            ...enrollment.course,
            enrollment_id: enrollment.id,
            enrollment_status: enrollment.status,
            enrolled_at: enrollment.enrolled_at,
            progress_percentage: enrollment.progress_percentage,
            type: 'enrollment'
          })
        }
      })
    } else {
      console.log('⚠️ 수강신청한 강의가 없습니다.')
    }
    
    // 구매한 강의 추가 (중복되지 않는 경우만)
    if (purchaseCourses) {
      purchaseCourses.forEach((purchase: any) => {
        if (purchase.course && !myCourses.has(purchase.course.id)) {
          myCourses.set(purchase.course.id, {
            ...purchase.course,
            purchase_id: purchase.id,
            purchase_amount: purchase.amount,
            purchased_at: purchase.created_at,
            type: 'purchase'
          })
        }
      })
    }

    const courses = Array.from(myCourses.values())
    
    console.log('✅ 내 강의 목록 조회 완료:', courses.length, '개 강의')
    console.log('📋 최종 강의 목록:', courses.map(c => ({ 
      id: c.id, 
      title: c.title, 
      type: c.type,
      enrollment_id: c.enrollment_id,
      purchase_id: c.purchase_id
    })))
    
    return NextResponse.json({
      success: true,
      data: courses,
      count: courses.length
    })

  } catch (error) {
    console.error('❌ 내 강의 목록 조회 오류:', error)
    return NextResponse.json(
      { success: false, error: '내 강의 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
