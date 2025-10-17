'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  BookOpen, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  FileText, 
  Calendar,
  Download,
  Award,
  Clock,
  TrendingUp,
  DollarSign,
  Star,
  AlertCircle,
  Home
} from 'lucide-react'

interface AdminStats {
  overview: {
    totalUsers: number
    recentUsers: number
    totalCourses: number
    recentCourses: number
    totalPurchases: number
    recentPurchases: number
    totalRevenue: number
    recentRevenue: number
  }
  popularCourses: Array<{
    id: string
    title: string
    purchases: number
    revenue: number
    rating: number
  }>
  recentActivities: Array<{
    id: number
    type: string
    message: string
    timestamp: string
    icon: string
    color: string
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
  }>
  categoryStats: Array<{
    category: string
    count: number
    revenue: number
  }>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?.email) {
          setError('로그인이 필요합니다.')
          setLoading(false)
          return
        }

        // 실제 API 호출로 통계 데이터 가져오기
        const response = await fetch('/api/admin/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('통계 데이터를 가져오는데 실패했습니다.')
        }

        const data = await response.json()
        console.log('📊 대시보드 통계 데이터:', data)
        
        // API 응답 구조에 따라 데이터 추출
        if (data.success && data.data) {
          setStats(data.data)
        } else {
          setStats(data)
        }
        setLoading(false)
      } catch (error) {
        console.error('통계 데이터 로드 오류:', error)
        setError('통계 데이터를 불러오는 중 오류가 발생했습니다.')
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.email])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return `${Math.floor(diffInMinutes / 1440)}일 전`
  }

  const adminMenuItems = [
    {
      title: '대시보드',
      description: '전체 통계 및 현황',
      icon: BarChart3,
      href: '/admin',
      color: 'bg-blue-500',
      stats: stats?.overview ? `${stats.overview.totalUsers}명 사용자` : '로딩 중...'
    },
    {
      title: '사용자 관리',
      description: '사용자 목록 및 권한 관리',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-500',
      stats: stats?.overview ? `${stats.overview.totalUsers}명 등록` : '로딩 중...'
    },
    {
      title: '강의 관리',
      description: '강의 생성, 수정, 삭제',
      icon: BookOpen,
      href: '/admin/courses',
      color: 'bg-purple-500',
      stats: stats?.overview ? `${stats.overview.totalCourses}개 강의` : '로딩 중...'
    },
    {
      title: '매출 관리',
      description: '구매 내역 및 매출 분석',
      icon: ShoppingCart,
      href: '/admin/revenue',
      color: 'bg-orange-500',
      stats: stats?.overview ? formatCurrency(stats.overview.totalRevenue) : '로딩 중...'
    },
    {
      title: '콘텐츠 관리',
      description: '공지사항, 커뮤니티 관리',
      icon: FileText,
      href: '/admin/content',
      color: 'bg-indigo-500',
      stats: '콘텐츠 관리'
    },
    {
      title: '전자책 관리',
      description: '전자책 업로드 및 관리',
      icon: Download,
      href: '/admin/ebooks',
      color: 'bg-pink-500',
      stats: '전자책 관리'
    },
    {
      title: '강사 관리',
      description: '강사 신청 및 관리',
      icon: Award,
      href: '/admin/instructors',
      color: 'bg-yellow-500',
      stats: '강사 관리'
    },
    {
      title: '일정 관리',
      description: '강의 일정 및 예약 관리',
      icon: Calendar,
      href: '/admin/schedule',
      color: 'bg-teal-500',
      stats: '일정 관리'
    },
    {
      title: '분석 및 리포트',
      description: '사용자 분석 및 비즈니스 리포트',
      icon: TrendingUp,
      href: '/admin/analytics',
      color: 'bg-red-500',
      stats: '분석 도구'
    },
    {
      title: '시스템 설정',
      description: '사이트 설정 및 보안 관리',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
      stats: '시스템 설정'
    },
    {
      title: '리포트 생성',
      description: '다양한 리포트 생성 및 다운로드',
      icon: FileText,
      href: '/admin/reports',
      color: 'bg-indigo-500',
      stats: '리포트 생성'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오류가 발생했습니다</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">전체 시스템 현황을 한눈에 확인하세요</p>
        </div>
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          메인화면으로 돌아가기
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 사용자</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview?.totalUsers?.toLocaleString() || '0'}</p>
              <p className="text-sm text-green-600">+{stats?.overview?.recentUsers || 0} 이번 주</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 강의</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview?.totalCourses || 0}</p>
              <p className="text-sm text-green-600">+{stats?.overview?.recentCourses || 0} 이번 주</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 구매</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview?.totalPurchases?.toLocaleString() || '0'}</p>
              <p className="text-sm text-green-600">+{stats?.overview?.recentPurchases || 0} 이번 주</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 매출</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.overview?.totalRevenue || 0)}</p>
              <p className="text-sm text-green-600">+{formatCurrency(stats?.overview?.recentRevenue || 0)} 이번 주</p>
            </div>
          </div>
        </div>
      </div>

      {/* 관리 메뉴 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">관리 메뉴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start">
                <div className={`p-3 ${item.color} rounded-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <p className="text-sm text-blue-600 font-medium mt-2">{item.stats}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 인기 강의 TOP 5 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 강의 TOP 5</h3>
        <div className="space-y-3">
          {stats?.popularCourses?.length > 0 ? stats.popularCourses.map((course, index) => (
            <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{course.title}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {course.purchases.toLocaleString()}명
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {course.rating}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatCurrency(course.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>인기 강의 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
        <div className="space-y-3">
          {stats?.recentActivities?.length > 0 ? stats.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center text-sm">
              <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mr-3`}></div>
              <span className="text-gray-600">{activity.message}</span>
              <span className="text-gray-400 ml-auto">{formatTimeAgo(activity.timestamp)}</span>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>최근 활동이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
