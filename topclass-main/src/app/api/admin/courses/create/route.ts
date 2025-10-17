import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { useAdmin } from '@/hooks/useAdmin'

export async function POST(request: Request) {
  try {
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 })
    }

    // 관리자 권한 확인 (이메일로 체크)
    if (session.user.email !== 'sprince1004@naver.com') {
      return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 })
    }

    // 요청 데이터 파싱
    const data = await request.json()

    // 필수 필드 검증
    if (!data.title || !data.description || !data.instructor) {
      return NextResponse.json({ 
        success: false, 
        error: '필수 필드가 누락되었습니다.' 
      }, { status: 400 })
    }

    // 강의 생성
    const { data: course, error } = await supabase
      .from('courses')
      .insert([{
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        category: data.category,
        price: data.price,
        original_price: data.original_price,
        duration: data.duration,
        level: data.level,
        status: data.status,
        is_featured: data.is_featured,
        tags: data.tags,
        thumbnail_url: data.thumbnail_url,
        published: data.status === 'published'
      }])
      .select()
      .single()

    if (error) {
      console.error('강의 생성 오류:', error)
      return NextResponse.json({ 
        success: false, 
        error: '강의 생성 중 오류가 발생했습니다.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: course 
    })

  } catch (error) {
    console.error('강의 생성 오류:', error)
    return NextResponse.json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}
