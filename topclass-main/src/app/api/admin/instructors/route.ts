import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 강사 목록 조회 요청...')
    
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: '로그인이 필요합니다.' 
      }, { status: 401 })
    }

    // 관리자 권한 확인
    if (session.user.email !== 'sprince1004@naver.com') {
      return NextResponse.json({ 
        success: false, 
        error: '관리자 권한이 필요합니다.' 
      }, { status: 403 })
    }

    // 강사 데이터 조회
    const { data: instructors, error } = await supabase
      .from('instructors')
      .select(`
        id,
        name,
        email,
        phone,
        bio,
        specialties,
        experience_years,
        education,
        certifications,
        status,
        application_date,
        approval_date,
        profile_image,
        resume_url,
        portfolio_url,
        social_links,
        bank_account,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('강사 데이터 조회 오류:', error)
      return NextResponse.json({ 
        success: false, 
        error: '강사 데이터를 불러오는 중 오류가 발생했습니다.' 
      }, { status: 500 })
    }

    // 강사별 강의 수와 학생 수 계산
    const instructorsWithStats = await Promise.all(
      (instructors || []).map(async (instructor) => {
        try {
          // 강의 수 조회
          const { count: coursesCount } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('instructor', instructor.name)

          // 학생 수 조회 (강의별 학생 수의 합)
          const { data: courses } = await supabase
            .from('courses')
            .select('student_count')
            .eq('instructor', instructor.name)

          const totalStudents = courses?.reduce((sum, course) => sum + (course.student_count || 0), 0) || 0

          // 평균 평점 조회
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('instructor', instructor.name)

          const averageRating = reviews?.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0

          return {
            ...instructor,
            courses_count: coursesCount || 0,
            total_students: totalStudents,
            average_rating: Math.round(averageRating * 10) / 10
          }
        } catch (error) {
          console.error(`강사 ${instructor.name} 통계 조회 오류:`, error)
          return {
            ...instructor,
            courses_count: 0,
            total_students: 0,
            average_rating: 0
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      instructors: instructorsWithStats
    })

  } catch (error) {
    console.error('❌ 강사 목록 조회 오류:', error)
    return NextResponse.json(
      { success: false, error: '강사 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('➕ 새 강사 생성 요청...')
    
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: '로그인이 필요합니다.' 
      }, { status: 401 })
    }

    // 관리자 권한 확인
    if (session.user.email !== 'sprince1004@naver.com') {
      return NextResponse.json({ 
        success: false, 
        error: '관리자 권한이 필요합니다.' 
      }, { status: 403 })
    }

    const data = await request.json()

    // 필수 필드 검증
    if (!data.name || !data.email) {
      return NextResponse.json({ 
        success: false, 
        error: '필수 필드가 누락되었습니다.' 
      }, { status: 400 })
    }

    // 강사 생성
    const { data: instructor, error } = await supabase
      .from('instructors')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        specialties: data.specialties || [],
        experience_years: data.experience_years || 0,
        education: data.education,
        certifications: data.certifications || [],
        status: data.status || 'pending',
        profile_image: data.profile_image,
        resume_url: data.resume_url,
        portfolio_url: data.portfolio_url,
        social_links: data.social_links || {},
        bank_account: data.bank_account
      }])
      .select()
      .single()

    if (error) {
      console.error('강사 생성 오류:', error)
      return NextResponse.json({ 
        success: false, 
        error: '강사 생성 중 오류가 발생했습니다.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      instructor 
    })

  } catch (error) {
    console.error('❌ 강사 생성 오류:', error)
    return NextResponse.json(
      { success: false, error: '강사 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
