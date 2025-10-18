'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { Clock, Users, Star, Play, ShoppingCart, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'


interface Course {
  id: string
  title: string
  description: string
  instructor: string
  price: number
  original_price?: number
  thumbnail_url?: string
  detail_image_url?: string
  duration: number
  level: string
  category: string
  status: string
  published: boolean
  is_featured: boolean
  student_count: number
  rating: number
  review_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const { user } = useAuth()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPurchased, setIsPurchased] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchCourse()
    if (user) {
      checkPurchaseStatus()
    }
  }, [courseId, user])

  const fetchCourse = async () => {
    try {
      // 강의 목록 API를 사용하여 특정 강의 조회
      const response = await fetch(`/api/courses`)
      const data = await response.json()

      if (data.success && data.data.courses) {
        // ID로 특정 강의 찾기
        const foundCourse = data.data.courses.find((c: any) => c.id === courseId)
        if (foundCourse) {
          setCourse(foundCourse)
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkPurchaseStatus = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/purchases/check?courseId=${courseId}`)
      const data = await response.json()
      
      if (data.success) {
        setIsPurchased(data.purchased)
      }
    } catch (error) {
      console.error('Error checking purchase status:', error)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login'
      return
    }

    setPurchasing(true)
    try {
      // Supabase에서 현재 사용자의 세션 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        alert('로그인이 필요합니다.')
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          courseId: courseId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to payment page or show success message
        setIsPurchased(true)
        alert('강의 구매가 완료되었습니다!')
      } else {
        alert('구매 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error purchasing course:', error)
      alert('구매 중 오류가 발생했습니다.')
    } finally {
      setPurchasing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`
    }
    return `${remainingSeconds}초`
  }

  const getTotalDuration = () => {
    return course?.duration || 0
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return '초급'
      case 'intermediate':
        return '중급'
      case 'advanced':
        return '고급'
      default:
        return level
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
              </div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              강의를 찾을 수 없습니다
            </h1>
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-500"
            >
              강의 목록으로 돌아가기
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {course.detail_image_url ? (
                  <img
                    src={course.detail_image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {course.title}
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <span className="text-blue-600 text-sm font-medium">
                  {course.category || '무료강의'}
                </span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getLevelBadgeColor(course.level)}`}>
                  {getLevelText(course.level)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-6">
                {course.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDuration(getTotalDuration())}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.student_count}명 수강
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {course.rating > 0 ? `${course.rating.toFixed(1)} (${course.review_count} 리뷰)` : '리뷰 없음'}
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(course.price)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">강의 소개</h2>
              <div className="prose max-w-none">
                <p>{course.description}</p>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                커리큘럼
              </h2>
              <div className="space-y-3">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-4">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      강의 소개 및 기초 개념
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      강의에 대한 전반적인 소개와 기본 개념을 학습합니다.
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(Math.floor(course.duration * 0.2))}
                  </div>
                </div>
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-4">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      실습 및 예제
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      실제 예제를 통해 핵심 내용을 학습합니다.
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(Math.floor(course.duration * 0.6))}
                  </div>
                </div>
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-4">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      마무리 및 정리
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      학습 내용을 정리하고 추가 학습 방향을 제시합니다.
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(Math.floor(course.duration * 0.2))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPrice(course.price)}
                </div>
                <p className="text-gray-500">평생 수강 가능</p>
              </div>

              {isPurchased ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    구매 완료
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    강의 시청하기
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user ? (
                    <button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {purchasing ? (
                        '구매 중...'
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          지금 구매하기
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      로그인 후 구매하기
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  이 강의에 포함된 내용
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    3개의 강의
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    총 {formatDuration(getTotalDuration())} 분량
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    평생 수강 가능
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    모바일/PC 시청 가능
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    수료증 발급
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
