import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: '강의 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: true,
        purchased: false,
      })
    }

    const token = authHeader.split(' ')[1]
    
    // Supabase에서 사용자 정보 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({
        success: true,
        purchased: false,
      })
    }

    const { data: purchase } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'completed')
      .single()

    return NextResponse.json({
      success: true,
      purchased: !!purchase,
    })
  } catch (error) {
    console.error('Error checking purchase:', error)
    return NextResponse.json(
      { success: false, error: '구매 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
