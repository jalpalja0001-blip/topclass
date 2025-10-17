'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { Play, Clock, FileText, Award, TrendingUp, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Purchase {
  id: string
  amount: number
  createdAt: string
  course: {
    id: string
    title: string
    description: string
    thumbnail: string | null
    category: {
      name: string
    }
    _count: {
      lessons: number
    }
  }
}

interface CourseProgress {
  courseId: string
  progressPercent: number
  completedAt: string | null
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'courses' | 'progress' | 'certificates'>('courses')

  useEffect(() => {
    if (user) {
      fetchPurchases()
    }
  }, [user])

  const fetchPurchases = async () => {
    try {
      // Supabase에서 현재 사용자의 세션 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        console.log('❌ 세션 토큰이 없습니다.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/purchases', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      const data = await response.json()

      if (data.success) {
        console.log('✅ 구매 내역 조회 성공:', data.data.length, '개')
        setPurchases(data.data)
      } else {
        console.error('❌ 구매 내역 조회 실패:', data.error)
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getTotalSpent = () => {
    return purchases.reduce((total, purchase) => total + purchase.amount, 0)
  }

  const getCompletedCourses = () => {
    // In a real app, you would fetch this from the progress API
    return Math.floor(purchases.length * 0.3) // Mock: 30% completion rate
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              로그인이 필요합니다
            </h1>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500"
            >
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {user.name || user.email}님!
          </h1>
          <p className="text-lg text-gray-600">
            학습 현황을 확인하고 강의를 계속 진행하세요.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">구매한 강의</p>
                <p className="text-2xl font-bold text-gray-900">{purchases.length}개</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">완료한 강의</p>
                <p className="text-2xl font-bold text-gray-900">{getCompletedCourses()}개</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">총 학습 시간</p>
                <p className="text-2xl font-bold text-gray-900">24시간</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">총 지출</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(getTotalSpent())}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              내 강의
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              학습 진도
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'certificates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              수료증
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : purchases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                      {purchase.course.thumbnail ? (
                        <img
                          src={purchase.course.thumbnail}
                          alt={purchase.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-lg font-semibold">
                          {purchase.course.title}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-blue-600 mb-1">
                        {purchase.course.category?.name || '무료강의'}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {purchase.course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {purchase.course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {purchase.course._count.lessons}개 강의
                        </div>
                        <div>
                          구매일: {formatDate(purchase.createdAt)}
                        </div>
                      </div>
                      <Link
                        href={`/courses/${purchase.course.id}`}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        강의 시청하기
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  구매한 강의가 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  새로운 강의를 구매하여 학습을 시작해보세요.
                </p>
                <Link
                  href="/courses"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  강의 둘러보기
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">학습 진도</h2>
            {purchases.length > 0 ? (
              <div className="space-y-4">
                {purchases.map((purchase) => {
                  const progress = Math.floor(Math.random() * 100) // Mock progress
                  return (
                    <div key={purchase.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {purchase.course.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {purchase.course.category?.name || '무료강의'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">
                            {progress}%
                          </div>
                          <div className="text-sm text-gray-500">완료</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">진도 정보가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">수료증</h2>
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">아직 완료한 강의가 없습니다.</p>
              <p className="text-sm text-gray-400">
                강의를 완료하면 수료증을 받을 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
