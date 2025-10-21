import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params
    const supabase = createClient()

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    // 강의 정보 조회
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, category, video_file_path, video_url')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 수강 권한 확인
    if (course.category === 'free') {
      // 무료 강의 - 수강 신청 확인
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single()

      if (!enrollment) {
        return NextResponse.json(
          { error: '수강 신청이 필요합니다.' },
          { status: 403 }
        )
      }
    } else {
      // 유료 강의 - 구매 확인
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single()

      if (!purchase) {
        return NextResponse.json(
          { error: '강의 구매가 필요합니다.' },
          { status: 403 }
        )
      }
    }

    // 비디오 파일 경로 확인
    if (!course.video_file_path) {
      return NextResponse.json(
        { error: '비디오 파일이 없습니다.' },
        { status: 404 }
      )
    }

    // 서명된 URL 생성 (1시간 유효)
    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from('course-videos')
      .createSignedUrl(course.video_file_path, 3600) // 1시간

    if (signedUrlError) {
      console.error('서명된 URL 생성 오류:', signedUrlError)
      return NextResponse.json(
        { error: '비디오 스트리밍 URL을 생성할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        videoUrl: signedUrl.signedUrl,
        courseTitle: course.title,
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1시간 후
      }
    })

  } catch (error) {
    console.error('비디오 스트리밍 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
