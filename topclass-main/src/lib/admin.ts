import { supabase } from './supabase'

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'instructor' | 'user'
  isActive: boolean
}

/**
 * 관리자 권한 확인 함수
 * @param token JWT 토큰
 * @returns 관리자 정보 또는 null
 */
export async function checkAdminPermission(token: string): Promise<AdminUser | null> {
  try {
    // 토큰으로 사용자 정보 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('사용자 인증 실패:', userError?.message)
      return null
    }

    // 사용자 프로필에서 역할 확인
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('프로필 조회 실패:', profileError.message)
      return null
    }

    // 관리자 권한 확인
    if (profile.role !== 'admin' || !profile.is_active) {
      return null
    }

    return {
      id: user.id,
      email: user.email || '',
      role: profile.role,
      isActive: profile.is_active
    }
  } catch (error) {
    console.error('관리자 권한 확인 오류:', error)
    return null
  }
}

/**
 * 관리자 권한이 필요한 API 라우트에서 사용하는 헬퍼 함수
 * @param request NextRequest 객체
 * @returns 관리자 정보 또는 에러 응답
 */
export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: '로그인이 필요합니다.',
      status: 401
    }
  }

  const token = authHeader.split(' ')[1]
  const adminUser = await checkAdminPermission(token)

  if (!adminUser) {
    return {
      error: '관리자 권한이 필요합니다.',
      status: 403
    }
  }

  return { adminUser }
}

/**
 * 관리자 권한 확인 (클라이언트 사이드용)
 * @param token JWT 토큰
 * @returns Promise<boolean>
 */
export async function isAdmin(token: string): Promise<boolean> {
  const adminUser = await checkAdminPermission(token)
  return adminUser !== null
}
