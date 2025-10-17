import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 강의 데이터 조회 시작...')
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Supabase 데이터베이스에서 강의 데이터 조회
    console.log('🔍 강의 데이터 조회 (Supabase 데이터베이스)...')
    
    const supabase = createClient()
    
    // Supabase 쿼리 빌더 시작 (실제 테이블 스키마에 맞게 수정)
    let query = supabase
      .from('courses')
      .select('*')
      // published 컬럼이 없으므로 제거
      // .eq('published', true)

    // 특별한 카테고리 처리 (실제 테이블 스키마에 맞게)
    if (category === '얼리버드') {
      // 얼리버드 카테고리는 모든 공개 강의 표시
      console.log('🎯 얼리버드 필터 적용: 모든 공개 강의 표시')
    } else if (category === '클래스') {
      // 클래스 카테고리는 유료 강의만 표시 (무료강의 제외)
      query = query.gt('price', 0)
      console.log('🎯 클래스 필터 적용: 유료강의만 표시')
    } else if (category === '무료강의') {
      // 무료강의는 price가 0인 강의만 표시
      query = query.eq('price', 0)
      console.log('🎯 무료강의 필터 적용: 무료강의만 표시')
    }

    // 검색 필터 (실제 테이블 스키마에 맞게 수정)
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // 페이지네이션
    query = query.range(offset, offset + limit - 1)

    const { data: courses, error } = await query

    if (error) {
      console.error('❌ Supabase 조회 오류:', error)
      console.error('오류 코드:', error.code)
      console.error('오류 메시지:', error.message)
      console.error('오류 세부사항:', error.details)
      console.error('오류 힌트:', error.hint)
      
      return NextResponse.json(
        { success: false, error: '강의 목록을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 전체 개수 조회 (페이지네이션용) - 실제 테이블 스키마에 맞게 수정
    let countQuery = supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      // published 컬럼이 없으므로 제거
      // .eq('published', true)

    if (category === '얼리버드') {
      // 얼리버드는 모든 공개 강의
    } else if (category === '클래스') {
      countQuery = countQuery.gt('price', 0)
    } else if (category === '무료강의') {
      countQuery = countQuery.eq('price', 0)
    }

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { count } = await countQuery

    console.log('✅ Supabase에서 강의 데이터 조회 완료!')
    console.log('📚 조회된 강의 수:', courses?.length || 0)
    console.log('🔍 조회된 강의 목록:', courses?.map(c => ({ id: c.id, title: c.title, category: c.category, is_featured: c.is_featured })))
      
    return NextResponse.json({
      success: true,
      data: {
        courses: courses || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error('❌ 강의 조회 오류:', error)
    return NextResponse.json(
      { success: false, error: '강의 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
