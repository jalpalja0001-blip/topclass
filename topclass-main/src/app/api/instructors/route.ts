import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 공개 강사 목록 조회 요청...')
    
    // 강사 데이터 조회 (승인된 강사만)
    const { data: instructors, error } = await supabase
      .from('instructors')
      .select(`
        id,
        name,
        email,
        bio,
        specialties,
        experience_years,
        education,
        certifications,
        profile_image,
        portfolio_url,
        social_links,
        created_at
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('강사 데이터 조회 오류:', error)
      return NextResponse.json({ 
        success: false, 
        error: '강사 데이터를 불러오는 중 오류가 발생했습니다.' 
      }, { status: 500 })
    }

    // 강사별 통계 정보 추가
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

          // 강의 제목들 조회
          const { data: courseTitles } = await supabase
            .from('courses')
            .select('title')
            .eq('instructor', instructor.name)
            .limit(3)

          return {
            id: instructor.id,
            name: instructor.name,
            nickname: `${instructor.name} 강사님`,
            specialty: instructor.specialties?.[0] || '전문가',
            description: instructor.bio || '전문 지식과 경험을 바탕으로 한 강의를 제공합니다.',
            avatar: '🎓',
            rating: Math.round(averageRating * 10) / 10,
            students: totalStudents,
            courses: coursesCount || 0,
            totalRevenue: '월 수익 달성',
            experience: `${instructor.experience_years || 0}년`,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            achievements: instructor.certifications || [],
            courses_taught: courseTitles?.map(c => c.title) || [],
            intro: instructor.bio || '안녕하세요. 전문 지식과 경험을 바탕으로 한 강의를 제공합니다.'
          }
        } catch (error) {
          console.error(`강사 ${instructor.name} 통계 조회 오류:`, error)
          return {
            id: instructor.id,
            name: instructor.name,
            nickname: `${instructor.name} 강사님`,
            specialty: instructor.specialties?.[0] || '전문가',
            description: instructor.bio || '전문 지식과 경험을 바탕으로 한 강의를 제공합니다.',
            avatar: '🎓',
            rating: 0,
            students: 0,
            courses: 0,
            totalRevenue: '월 수익 달성',
            experience: `${instructor.experience_years || 0}년`,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            achievements: instructor.certifications || [],
            courses_taught: [],
            intro: instructor.bio || '안녕하세요. 전문 지식과 경험을 바탕으로 한 강의를 제공합니다.'
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
