import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 })
    }

    // 관리자 권한 확인
    if (session.user.email !== 'sprince1004@naver.com') {
      return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 })
    }

    // FormData 파싱
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'thumbnail' 또는 'detail'

    if (!file) {
      return NextResponse.json({ success: false, error: '파일이 없습니다.' }, { status: 400 })
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 })
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: '파일 크기는 10MB를 초과할 수 없습니다.' }, { status: 400 })
    }

    // 파일 이름 생성
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${type}_${timestamp}.${fileExt}`

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer()
    const fileData = new Uint8Array(arrayBuffer)

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('course-images')
      .upload(fileName, fileData, {
        contentType: file.type,
        cacheControl: '3600'
      })

    if (error) {
      console.error('파일 업로드 오류:', error)
      return NextResponse.json({ success: false, error: '파일 업로드에 실패했습니다.' }, { status: 500 })
    }

    // 파일 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('course-images')
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl
    })

  } catch (error) {
    console.error('파일 업로드 오류:', error)
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
