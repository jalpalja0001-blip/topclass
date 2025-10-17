'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface AdminStatus {
  isAdmin: boolean
  role: string
  isActive: boolean
  loading: boolean
  error: string | null
}

export function useAdmin(): AdminStatus {
  const { user } = useAuth()
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    role: 'user',
    isActive: false,
    loading: true,
    error: null
  })

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // 로그인하지 않은 경우
        if (!user?.email) {
          setAdminStatus({
            isAdmin: false,
            role: 'user',
            isActive: false,
            loading: false,
            error: null
          })
          return
        }

        // 관리자 이메일 확인
        if (user.email === 'sprince1004@naver.com') {
          setAdminStatus({
            isAdmin: true,
            role: 'super_admin',
            isActive: true,
            loading: false,
            error: null
          })
          return
        }

        // 다른 사용자는 일반 사용자로 설정
        setAdminStatus({
          isAdmin: false,
          role: 'user',
          isActive: false,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Admin check error:', error)
        setAdminStatus({
          isAdmin: false,
          role: 'user',
          isActive: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    checkAdminStatus()
  }, [user?.email])

  return adminStatus
}
