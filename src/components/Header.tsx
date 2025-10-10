'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/hooks/useAdmin'
import { User, LogOut, Menu, X, ChevronDown, Search, Settings } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleLogout = async () => {
    await logout()
  }

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu)
  }

  const handleMouseEnter = (menu: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setActiveDropdown(menu)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms 지연으로 서브메뉴로 이동할 시간 제공
    setHoverTimeout(timeout)
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            잘파는<span className="text-blue-600">클래스</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {/* 잘파는 Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('titan')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => toggleDropdown('titan')}
              >
                잘파는
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg border ${
                activeDropdown === 'titan' ? 'block' : 'hidden'
              }`}>
                <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">회사소개</Link>
                <Link href="/instructors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">강사소개</Link>
                <Link href="/instructor-apply" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">강사지원</Link>
              </div>
            </div>

            {/* 클래스 Dropdown */}
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">
              클래스
            </Link>

            <Link href="/ebooks" className="text-gray-700 hover:text-blue-600 transition-colors">
              전자책
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-blue-600 transition-colors">
              커뮤니티
            </Link>
            <Link href="/notices" className="text-gray-700 hover:text-blue-600 transition-colors">
              공지사항
            </Link>
            {!adminLoading && isAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                <Settings className="w-4 h-4 mr-1" />
                관리자페이지
              </Link>
            )}
          </nav>

          {/* Search & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-gray-700 hover:text-blue-600 transition-colors lg:hidden">
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">내 강의</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
                <div className="hidden md:block text-sm text-gray-500 max-w-32 truncate">
                  {user.name || user.email}님
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
                >
                  로그인
                </Link>
                <Link 
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  회원가입
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-900 mb-2">잘파는</div>
                <div className="pl-4 space-y-2">
                  <Link href="/about" className="block text-sm text-gray-600 hover:text-blue-600">회사소개</Link>
                  <Link href="/instructors" className="block text-sm text-gray-600 hover:text-blue-600">강사소개</Link>
                  <Link href="/instructor-apply" className="block text-sm text-gray-600 hover:text-blue-600">강사지원</Link>
                </div>
              </div>
              
              <Link href="/courses" className="block text-gray-700 hover:text-blue-600">클래스</Link>

              <Link href="/ebooks" className="block text-gray-700 hover:text-blue-600">전자책</Link>
              <Link href="/community" className="block text-gray-700 hover:text-blue-600">커뮤니티</Link>
              <Link href="/notices" className="block text-gray-700 hover:text-blue-600">공지사항</Link>
              {!adminLoading && isAdmin && (
                <Link href="/admin" className="block text-gray-700 hover:text-blue-600 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  관리자페이지
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
