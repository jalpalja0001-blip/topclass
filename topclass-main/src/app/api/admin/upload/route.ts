import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    console.log('📤 이미지 업로드 요청 시작...')
    
    // 개발 단계: 인증 우회
    console.log('⚠️ 개발 단계: 인증 확인을 우회합니다.')

    // FormData 파싱
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'thumbnail' 또는 'detail'

    console.log('📁 파일 정보:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      uploadType: type
    })

    if (!file) {
      console.log('❌ 파일이 없음')
      return NextResponse.json({ success: false, error: '파일이 없습니다.' }, { status: 400 })
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      console.log('❌ 이미지 파일이 아님:', file.type)
      return NextResponse.json({ success: false, error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 })
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ 파일 크기 초과:', file.size)
      return NextResponse.json({ success: false, error: '파일 크기는 10MB를 초과할 수 없습니다.' }, { status: 400 })
    }

    // 파일 이름 생성
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${type}_${timestamp}.${fileExt}`

    console.log('📝 파일명 생성:', fileName)

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer()
    const fileData = new Uint8Array(arrayBuffer)

    // 타입에 따라 다른 버킷에 업로드
    const bucketName = type === 'thumbnail' ? 'course-thumbnails' : 'course-images'
    
    console.log('🪣 업로드 버킷:', bucketName)
    
    // Supabase Storage에 업로드 (RLS 우회)
    console.log('🔄 Supabase Storage 업로드 시작...')
    console.log('📊 업로드 데이터:', {
      bucketName,
      fileName,
      fileSize: fileData.length,
      contentType: file.type
    })
    
    // RLS 정책 우회를 위해 서비스 키 사용
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileData, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true // 기존 파일 덮어쓰기 허용
      })

    console.log('📤 업로드 결과:', { data, error })

    if (error) {
      console.error('❌ 파일 업로드 오류:', error)
      console.error('❌ 오류 상세:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      })
      return NextResponse.json({ 
        success: false, 
        error: `파일 업로드에 실패했습니다: ${error.message}`,
        details: error
      }, { status: 500 })
    }

    console.log('✅ 파일 업로드 성공:', data)

    // 파일 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    console.log('🔗 생성된 URL:', publicUrl)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl
    })

  } catch (error) {
    console.error('파일 업로드 오류:', error)
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
