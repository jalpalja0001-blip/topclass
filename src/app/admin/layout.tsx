'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Shield } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 즉시 localStorage에서 사용자 이메일 확인
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
    
    if (userEmail) {
      // 로그인한 사용자는 모두 관리자로 설정
      console.warn('⚠️ 개발 모드: 로그인한 사용자를 관리자로 설정')
      setIsAdmin(true)
      setLoading(false)
    } else {
      // 로그인하지 않은 경우 메인 페이지로 리다이렉트
      router.push('/')
    }
  }, [router])

  // 로딩 중인 경우
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">관리자 권한을 확인하는 중...</p>
        </div>
      </div>
    )
  }

  // 관리자가 아닌 경우 접근 거부
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">관리자만 접근할 수 있는 페이지입니다.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            메인 페이지로 이동
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">관리자 페이지</h1>
            </div>
            <div className="text-sm text-gray-500">
              개발 모드 - 임시 관리자 권한으로 접근 중
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                개발 모드
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>현재 개발 모드로 실행 중입니다. 더미 데이터를 사용합니다.</p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}