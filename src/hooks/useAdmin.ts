'use client'

import { useState, useEffect } from 'react'

interface AdminStatus {
  isAdmin: boolean
  role: string
  isActive: boolean
  loading: boolean
  error: string | null
}

export function useAdmin(): AdminStatus {
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    role: 'user',
    isActive: false,
    loading: true,
    error: null
  })

  useEffect(() => {
    // localStorage에서 사용자 이메일 확인 (Supabase 연결 없이)
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
    
    if (!userEmail) {
      setAdminStatus({
        isAdmin: false,
        role: 'user',
        isActive: false,
        loading: false,
        error: null
      })
      return
    }

    // 모든 로그인한 사용자를 임시 관리자로 설정 (개발용)
    console.warn('⚠️ 개발 모드: 모든 사용자를 임시 관리자로 설정')
    setAdminStatus({
      isAdmin: true,
      role: 'admin',
      isActive: true,
      loading: false,
      error: '개발 모드 - 임시 관리자 권한'
    })
  }, [])

  return adminStatus
}
