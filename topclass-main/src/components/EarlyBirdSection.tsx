'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  price: number
  original_price?: number
  discountPercentage?: number
  category?: {
    name: string
  }
  level: string
  duration: string
  students: number
  rating: number
  imageUrl?: string
  thumbnail_url?: string
}

interface CoursesData {
  courses: Course[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function EarlyBirdSection() {
  const [coursesData, setCoursesData] = useState<CoursesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [coursesPerView, setCoursesPerView] = useState(4)

  useEffect(() => {
    const fetchEarlyBirdCourses = async () => {
      try {
        const response = await fetch('/api/courses?category=클래스&limit=8')
        const data = await response.json()
        
        if (data.success) {
          setCoursesData(data.data)
        }
      } catch (error) {
        console.error('얼리버드 강의 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarlyBirdCourses()
  }, [])

  // 반응형 카드 수 설정
  useEffect(() => {
    const updateCoursesPerView = () => {
      if (window.innerWidth < 640) {
        setCoursesPerView(1)
      } else if (window.innerWidth < 1024) {
        setCoursesPerView(2)
      } else {
        setCoursesPerView(4)
      }
    }

    updateCoursesPerView()
    window.addEventListener('resize', updateCoursesPerView)
    return () => window.removeEventListener('resize', updateCoursesPerView)
  }, [])

  const nextSlide = () => {
    if (coursesData) {
      setCurrentIndex((prev) => 
        prev + coursesPerView >= coursesData.courses.length 
          ? 0 
          : prev + coursesPerView
      )
    }
  }

  const prevSlide = () => {
    if (coursesData) {
      setCurrentIndex((prev) => 
        prev - coursesPerView < 0 
          ? Math.max(0, coursesData.courses.length - coursesPerView)
          : prev - coursesPerView
      )
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">얼리버드 진행 중</h2>
              <p className="text-gray-600">특가 할인으로 먼저 만나보세요!</p>
            </div>
            <div className="text-orange-600 font-medium">더보기 →</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!coursesData || coursesData.courses.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">얼리버드 진행 중</h2>
              <p className="text-gray-600">특가 할인으로 먼저 만나보세요!</p>
            </div>
            <Link href="/courses?tag=얼리버드" className="text-orange-600 hover:text-orange-700 font-medium">
              더보기 →
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">현재 진행 중인 얼리버드 강의가 없습니다.</p>
          </div>
        </div>
      </section>
    )
  }

  const visibleCourses = coursesData.courses.slice(currentIndex, currentIndex + coursesPerView)
  const canGoNext = currentIndex + coursesPerView < coursesData.courses.length
  const canGoPrev = currentIndex > 0

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">얼리버드 진행 중</h2>
            <p className="text-gray-600">특가 할인으로 먼저 만나보세요!</p>
          </div>
          <Link href="/courses?tag=얼리버드" className="text-orange-600 hover:text-orange-700 font-medium">
            더보기 →
          </Link>
        </div>

        <div className="relative">
          {/* 화살표 네비게이션 */}
          {coursesData.courses.length > coursesPerView && (
            <>
              <button
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all ${
                  canGoPrev 
                    ? 'text-orange-600 hover:bg-orange-50 hover:scale-110' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={!canGoNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all ${
                  canGoNext 
                    ? 'text-orange-600 hover:bg-orange-50 hover:scale-110' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* 강의 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="block group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 border-2 border-orange-200 h-full flex flex-col">
                  <div className="aspect-square relative overflow-hidden flex-shrink-0">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500">
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {/* 가격 정보 - 왼쪽 위 원래 자리 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 line-through">
                          ₩{course.original_price && course.original_price > course.price ? course.original_price.toLocaleString() : '200,000'}
                        </div>
                        <div className="text-xl font-bold text-orange-600">
                          ₩{course.price.toLocaleString()}
                        </div>
                      </div>
                      {/* 평점 - 더 위로 */}
                      <div className="flex items-center text-xs text-gray-400 -mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">4.8</span>
                      </div>
                    </div>
                    
                    {/* 강의 설명 추가 */}
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="mt-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs text-center">
                      🔥 한정 특가!
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                        {course.level === 'beginner' ? '초급' : course.level === 'intermediate' ? '중급' : '고급'}
                      </span>
                      <span>{typeof course.duration === 'string' ? course.duration : `${course.duration || 60}분`}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 페이지 인디케이터 */}
          {coursesData.courses.length > coursesPerView && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ 
                length: Math.ceil(coursesData.courses.length / coursesPerView) 
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * coursesPerView)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / coursesPerView) === index
                      ? 'bg-orange-600 w-6'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
