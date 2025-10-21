import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    console.log('🚀 강의 생성 API 시작')
    console.log('📡 요청 URL:', request.url)
    console.log('📡 요청 메서드:', request.method)
    console.log('📡 Content-Type:', request.headers.get('content-type'))
    
    // Supabase 클라이언트 생성 (서비스 키 사용)
    const supabase = createClient()
    
    // 개발 단계: 인증 확인을 우회
    console.log('⚠️ 개발 단계: 인증 확인을 우회합니다.')
    
    // 세션 확인 (개발 단계에서 우회)
    // const { data: { session } } = await supabase.auth.getSession()
    // if (!session?.user?.email) {
    //   console.log('❌ 로그인이 필요합니다.')
    //   return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 })
    // }

    // console.log('✅ 사용자 인증 확인:', session.user.email)

    // 요청 데이터 파싱 (FormData 또는 JSON)
    console.log('📥 요청 데이터 파싱 시작...')
    const contentType = request.headers.get('content-type')
    let data: any

    if (contentType?.includes('multipart/form-data')) {
      // FormData 처리 (비디오 파일 포함)
      const formData = await request.formData()
      data = Object.fromEntries(formData.entries())
      
      // JSON 필드 파싱
      if (data.tags) {
        try {
          data.tags = JSON.parse(data.tags)
        } catch (e) {
          data.tags = []
        }
      }
      
      // 숫자 필드 변환
      data.price = parseInt(data.price) || 0
      data.original_price = parseInt(data.original_price) || 0
      data.duration = parseInt(data.duration) || 0
      data.is_featured = data.is_featured === 'true'
      
      console.log('📝 FormData 파싱 완료:', { 
        hasVideoFile: !!data.video_file,
        videoFileName: data.video_file?.name,
        videoFileSize: data.video_file?.size
      })
    } else {
      // JSON 처리
      try {
        data = await request.json()
        console.log('📝 JSON 데이터 파싱 완료:', { 
          hasVideoFile: !!data.video_file,
          videoFileName: data.video_file?.name,
          videoFileSize: data.video_file?.size
        })
      } catch (jsonError) {
        console.error('❌ JSON 파싱 오류:', jsonError)
        return NextResponse.json({ 
          success: false, 
          error: '잘못된 JSON 형식입니다.' 
        }, { status: 400 })
      }
    }
    
    console.log('📝 강의 생성 요청 데이터:', JSON.stringify(data, null, 2))
    console.log('📝 데이터 타입:', typeof data)
    console.log('📝 데이터 키들:', Object.keys(data))

    // 필수 필드 검증 (실제 테이블 스키마에 맞게 수정)
    if (!data.title || !data.description) {
      console.log('❌ 필수 필드 누락:', { title: data.title, description: data.description })
      return NextResponse.json({ 
        success: false, 
        error: '제목과 설명은 필수입니다.' 
      }, { status: 400 })
    }

    // Supabase 데이터베이스에 강의 생성
    console.log('🔄 강의 생성 (Supabase 데이터베이스)...')
    
    // Supabase 연결 테스트
    console.log('🔍 Supabase 연결 테스트 중...')
    const { data: testData, error: testError } = await supabase
      .from('courses')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase 연결 실패:', testError)
      console.error('오류 코드:', testError.code)
      console.error('오류 메시지:', testError.message)
      
      return NextResponse.json({
        success: false,
        error: 'Supabase 연결 실패',
        details: {
          code: testError.code,
          message: testError.message,
          hint: '환경 변수와 RLS 정책을 확인해주세요.'
        }
      }, { status: 500 })
    }
    
    console.log('✅ Supabase 연결 성공!')
    
    // 카테고리별 처리
    const isFreeCourse = data.category === '무료강의'
    console.log('📋 카테고리 정보:', { category: data.category, isFreeCourse })
    
    // 새 강의 데이터 생성 (실제 테이블 스키마에 맞게 수정)
    const courseData = {
      title: data.title,
      description: data.description || '',
      instructor: data.instructor || '',
      category: data.category || '', // 카테고리명 그대로 저장
      status: data.status || 'draft', // 상태 문자열 그대로 저장 (published, draft, archived)
      price: isFreeCourse ? 0 : (data.price || 0),
      original_price: isFreeCourse ? 0 : (data.original_price || 0),
      tags: data.tags || [],
      thumbnail_url: data.thumbnail_url || null,
      video_url: data.video_url || null, // video_url 컬럼 활성화 (URL 또는 임베드 코드)
      // vimeo_url: data.vimeo_url || null, // 임시로 주석 처리 (컬럼이 없어서)
      duration: data.duration || null,
      level: data.level || 'beginner',
      is_featured: data.is_featured || false,
      published: data.status === 'published' || false
    }

    console.log('📊 Supabase에 저장할 강의 데이터:', JSON.stringify(courseData, null, 2))
    console.log('📊 각 필드별 상세 정보:')
    Object.entries(courseData).forEach(([key, value]) => {
      console.log(`  ${key}: ${typeof value} = ${JSON.stringify(value)}`)
    })
    
    // video_url 필드 특별 확인
    console.log('🎬 video_url 필드 확인:', {
      video_url: courseData.video_url,
      hasVideoUrl: !!courseData.video_url,
      videoUrlType: typeof courseData.video_url
    })

    // 먼저 courses 테이블의 구조를 확인
    console.log('🔍 courses 테이블 구조 확인 중...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('courses')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ 테이블 구조 확인 오류:', tableError)
      console.error('테이블 구조 확인 실패 - courses 테이블이 존재하지 않거나 접근 권한이 없습니다.')
      
      // 테이블이 존재하지 않는 경우, 더미 데이터로 테스트
      console.log('🧪 더미 데이터로 테스트 시도...')
      const dummyData = {
        title: '테스트 강의',
        description: '테스트 설명',
        instructor: '테스트 강사'
      }
      
      const { data: dummyResult, error: dummyError } = await supabase
        .from('courses')
        .insert([dummyData])
        .select()
        .single()
      
      if (dummyError) {
        console.error('❌ 더미 데이터 테스트도 실패:', dummyError)
        return NextResponse.json({ 
          success: false, 
          error: '데이터베이스 테이블 접근 오류',
          details: {
            tableError: tableError,
            dummyError: dummyError
          }
        }, { status: 500 })
      } else {
        console.log('✅ 더미 데이터 테스트 성공:', dummyResult)
        // 더미 데이터 삭제
        await supabase.from('courses').delete().eq('title', '테스트 강의')
      }
    } else {
      console.log('✅ 테이블 구조 확인 성공:', tableInfo)
      console.log('📋 사용 가능한 컬럼들:', tableInfo.length > 0 ? Object.keys(tableInfo[0]) : '테이블이 비어있음')
    }

    // Supabase에 실제 저장 시도
    console.log('💾 Supabase에 강의 저장 시도...')
    console.log('📊 저장할 데이터:', courseData)
    
    const { data: newCourse, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single()
    
    console.log('💾 Supabase 저장 결과:', { newCourse, error })
    
    if (error) {
      console.error('❌ Supabase 저장 실패:', error)
      console.error('오류 코드:', error.code)
      console.error('오류 메시지:', error.message)
      console.error('오류 세부사항:', error.details)
      console.error('오류 힌트:', error.hint)
      
      // 더 명확한 오류 메시지 생성
      let errorMessage = '강의 생성에 실패했습니다.'
      if (error.message) {
        errorMessage = `강의 생성에 실패했습니다: ${error.message}`
      }
      
      return NextResponse.json({ 
        success: false, 
        error: errorMessage,
        message: errorMessage,
        details: {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        }
      }, { status: 500 })
    }
    
    console.log('✅ Supabase 저장 성공:', newCourse)

    // 비디오 URL이 있는 경우 로그 출력
    if (newCourse.video_url) {
      console.log('🎬 비디오 URL 설정됨:', newCourse.video_url)
    }
    if (newCourse.vimeo_url) {
      console.log('🎥 Vimeo URL 설정됨:', newCourse.vimeo_url)
    }
    

    console.log('✅ Supabase에 강의 저장 완료:', newCourse)


    console.log('🎉 최종 응답 준비 중...')
    console.log('📊 응답 데이터:', { 
      success: true, 
      message: '강의가 성공적으로 생성되었습니다!',
      data: newCourse 
    })

    // 안전한 응답 생성
    const responseData = {
      success: true,
      message: '강의가 성공적으로 생성되었습니다!',
      data: newCourse
    }

    console.log('📤 최종 응답 전송:', responseData)
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('❌ 강의 생성 API 오류:', error)
    console.error('오류 타입:', typeof error)
    console.error('오류 메시지:', error instanceof Error ? error.message : '알 수 없는 오류')
    console.error('오류 스택:', error instanceof Error ? error.stack : '스택 없음')
    
    // JSON 응답이 제대로 전송되도록 보장
    try {
      return NextResponse.json({ 
        success: false, 
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      }, { status: 500 })
    } catch (responseError) {
      console.error('❌ 응답 생성 실패:', responseError)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
