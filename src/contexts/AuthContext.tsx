'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Supabase 세션 상태 확인
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!,
          }
          setUser(userData)
          // localStorage에 이메일 저장 (관리자 권한 확인용)
          if (typeof window !== 'undefined') {
            localStorage.setItem('userEmail', session.user.email!)
          }
        } else {
          setUser(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userEmail')
          }
        }
        setLoading(false)
      }
    )

    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!,
        }
        setUser(userData)
        // localStorage에 이메일 저장 (관리자 권한 확인용)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', session.user.email!)
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!,
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 로그인 시도:', email)
      
      // 로그인 시도
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // 이메일 인증 오류인 경우 자동으로 인증 처리
        if (error.message.includes('Email not confirmed')) {
          console.log('⚠️ 이메일 미인증 상태, 자동 인증 시도...')
          
          // 새로운 회원가입 시도 (기존 계정 덮어쓰기)
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: { email_confirmed: true }
            }
          })

          if (!signUpError && signUpData.user) {
            console.log('✅ 자동 인증 성공')
            const userData = {
              id: signUpData.user.id,
              email: signUpData.user.email!,
              name: signUpData.user.email!
            }
            setUser(userData)
            if (typeof window !== 'undefined') {
              localStorage.setItem('userEmail', signUpData.user.email!)
            }
            return true
          }
        }
        
        console.error('❌ Supabase 로그인 오류:', error.message)
        return false
      }

      if (data.user) {
        console.log('✅ Supabase 로그인 성공:', data.user.email)
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email!,
        }
        setUser(userData)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', data.user.email!)
        }
        return true
      }

      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      console.log('📝 회원가입 시도:', email)
      
      // Supabase 직접 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // 이메일 확인 비활성화
          emailConfirm: false
        },
      })

      if (error) {
        console.error('❌ Supabase 회원가입 오류:', error.message)
        return false
      }

      if (data.user) {
        console.log('✅ Supabase 회원가입 성공:', data.user.email)
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email!,
        }
        setUser(userData)
        // localStorage에 이메일 저장 (관리자 권한 확인용)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', data.user.email!)
        }
        return true
      }

      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 로그아웃 시도')
      
      // Supabase 직접 로그아웃
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Supabase 로그아웃 오류:', error.message)
      } else {
        console.log('✅ Supabase 로그아웃 성공')
      }
      
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmail')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmail')
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
