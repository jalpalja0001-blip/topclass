import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const purchaseSchema = z.object({
  courseId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    // Supabase에서 사용자 정보 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId } = purchaseSchema.parse(body)

    // Check if course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { success: false, error: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // Check if already purchased
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (existingPurchase) {
      return NextResponse.json(
        { success: false, error: '이미 구매한 강의입니다.' },
        { status: 400 }
      )
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        course_id: courseId,
        amount: course.price,
        status: 'completed',
      })
      .select(`
        *,
        courses (*)
      `)
      .single()

    if (purchaseError) {
      throw purchaseError
    }

    // Create course progress record
    await supabase
      .from('course_progress')
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress_percent: 0,
      })

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
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    // Supabase에서 사용자 정보 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select(`
        *,
        courses:courses (
          *,
          categories:category_id (
            id,
            name,
            description
          ),
          lessons (count)
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: purchases || [],
    })
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { success: false, error: '구매 내역을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
