import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const purchaseSchema = z.object({
  courseId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🛒 구매 요청 시작...')
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Authorization 헤더:', authHeader ? '존재함' : '없음')
    
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

    const body = await request.json()
    const { courseId } = purchaseSchema.parse(body)

    // 실제 데이터베이스에서 강의 조회
    console.log('🔍 강의 조회 중:', courseId)
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()
    
    if (courseError || !course) {
      console.log('❌ 강의를 찾을 수 없습니다:', courseId, courseError?.message)
      return NextResponse.json(
        { success: false, error: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    console.log('✅ 강의 찾음:', course.title, '카테고리:', course.category)
    
    // 무료강의인 경우 수강신청으로 처리
    if (course.category === '무료강의') {
      console.log('🎓 무료강의 수강신청 처리 중...')
      
      // 기존 수강신청 확인
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single()
      
      if (existingEnrollment) {
        console.log('❌ 이미 수강신청한 강의입니다.')
        return NextResponse.json(
          { success: false, error: '이미 수강신청한 강의입니다.' },
          { status: 400 }
        )
      }
      
      // 새로운 수강신청 생성
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          enrolled_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (enrollmentError) {
        console.error('❌ 수강신청 생성 실패:', enrollmentError)
        return NextResponse.json(
          { success: false, error: '수강신청 처리 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }
      
      console.log('✅ 무료강의 수강신청 완료:', enrollment.id)
      
      return NextResponse.json({
        success: true,
        data: enrollment,
        message: '무료강의 수강신청이 완료되었습니다.'
      })
    }
    
    // 유료강의인 경우 구매 처리
    console.log('💰 유료강의 구매 처리 중...')

    // 기존 구매 내역 확인
    console.log('🔍 기존 구매 내역 확인 중...')
    
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()
    
    if (existingPurchase) {
      console.log('❌ 이미 구매한 강의입니다.')
      return NextResponse.json(
        { success: false, error: '이미 구매한 강의입니다.' },
        { status: 400 }
      )
    }

    // 구매 기록 생성
    console.log('💳 구매 기록 생성 중...')
    
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        course_id: courseId,
        amount: course.price || 0,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (purchaseError) {
      console.error('❌ 구매 기록 생성 실패:', purchaseError.message)
      return NextResponse.json(
        { success: false, error: '구매 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
    
    console.log('✅ 구매 기록 생성 완료:', purchase.id)

    return NextResponse.json({
      success: true,
      data: purchase,
      message: '강의 구매가 완료되었습니다.'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: '잘못된 입력 데이터입니다.' },
        { status: 400 }
      )
    }

    console.error('Purchase error:', error)
    return NextResponse.json(
      { success: false, error: '구매 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📋 구매 내역 조회 요청 시작...')
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Authorization 헤더:', authHeader ? '존재함' : '없음')
    
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

    // 더미 구매 내역 데이터 (실제로는 데이터베이스에서 조회해야 함)
    console.log('📋 더미 구매 내역 생성 중...')
    
    const dummyPurchases = [
      {
        id: 'purchase-1759387914088',
        amount: 80000,
        createdAt: new Date().toISOString(),
        course: {
          id: 'course-2',
          title: 'Next.js 완벽 가이드',
          description: 'Next.js를 활용한 풀스택 웹 개발',
          thumbnail: null, // 이미지 없음으로 설정
          category: {
            name: '프로그래밍'
          },
          _count: {
            lessons: 15
          }
        }
      }
    ]

    console.log('✅ 구매 내역 조회 완료:', dummyPurchases.length, '개')

    return NextResponse.json({
      success: true,
      data: dummyPurchases,
    })
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { success: false, error: '구매 내역을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
