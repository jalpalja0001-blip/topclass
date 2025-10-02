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

    // Check if course exists (더미 데이터로 임시 처리)
    console.log('🔍 강의 조회 중:', courseId)
    
    // 더미 강의 데이터
    const dummyCourses = {
      'course-1': { id: 'course-1', title: 'React 기초 강의', price: 50000 },
      'course-2': { id: 'course-2', title: 'Next.js 완벽 가이드', price: 80000 },
      'course-3': { id: 'course-3', title: 'TypeScript 마스터', price: 60000 },
      'course-4': { id: 'course-4', title: 'Node.js 백엔드 개발', price: 70000 },
      'course-5': { id: 'course-5', title: 'Python 데이터 분석', price: 90000 },
      'course-6': { id: 'course-6', title: 'JavaScript ES6+', price: 40000 },
      'course-7': { id: 'course-7', title: 'Vue.js 3 완벽 가이드', price: 75000 },
      'course-8': { id: 'course-8', title: 'Angular 프레임워크', price: 85000 },
    }

    const course = dummyCourses[courseId as keyof typeof dummyCourses]
    
    if (!course) {
      console.log('❌ 강의를 찾을 수 없습니다:', courseId)
      return NextResponse.json(
        { success: false, error: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    console.log('✅ 강의 찾음:', course.title, '가격:', course.price)

    // Check if already purchased (더미 데이터로 임시 처리)
    console.log('🔍 기존 구매 내역 확인 중...')
    
    // 임시로 항상 새로운 구매로 처리 (실제로는 로컬 스토리지나 메모리에서 확인)
    const existingPurchase = null // 실제로는 구매 내역을 확인해야 함
    
    if (existingPurchase) {
      console.log('❌ 이미 구매한 강의입니다.')
      return NextResponse.json(
        { success: false, error: '이미 구매한 강의입니다.' },
        { status: 400 }
      )
    }

    // Create purchase record (더미 데이터로 임시 처리)
    console.log('💳 구매 기록 생성 중...')
    
    const purchase = {
      id: `purchase-${Date.now()}`,
      user_id: user.id,
      course_id: courseId,
      amount: course.price,
      status: 'completed',
      created_at: new Date().toISOString(),
      courses: course
    }
    
    console.log('✅ 구매 기록 생성 완료:', purchase.id)

    return NextResponse.json({
      success: true,
      data: purchase,
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
