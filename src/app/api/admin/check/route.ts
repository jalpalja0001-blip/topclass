import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 관리자 권한 확인 요청...')
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 인증 토큰이 없습니다.')
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
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

    // 사용자 프로필에서 역할 확인
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('❌ 프로필 조회 실패:', profileError.message)
      return NextResponse.json(
        { success: false, error: '사용자 프로필을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const isAdmin = profile.role === 'admin' && profile.is_active

    console.log('🔍 사용자 역할:', profile.role, '활성 상태:', profile.is_active)

    return NextResponse.json({
      success: true,
      data: {
        isAdmin,
        role: profile.role,
        isActive: profile.is_active,
        user: {
          id: user.id,
          email: user.email
        }
      }
    })
  } catch (error) {
    console.error('❌ 관리자 권한 확인 오류:', error)
    return NextResponse.json(
      { success: false, error: '관리자 권한 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
