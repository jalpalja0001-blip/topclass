'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Users, Clock } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  price: number
  duration: number | null
  level: string
  category: {
    name: string
  }
  _count: {
    lessons: number
    purchases: number
  }
}

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
]

export default function FreeCourseSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(4)
  const [freeCourses, setFreeCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  // 무료 강의 데이터 가져오기
  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        const response = await fetch('/api/courses?category=무료강의&limit=6')
        const data = await response.json()
        
        console.log('API Response:', data) // 디버깅용
        
        if (data.success) {
          setFreeCourses(data.data.courses)
        } else {
          console.error('API Error:', data.error)
          // 임시 하드코딩된 데이터 사용
          setFreeCourses([
            {
              id: 'course-1',
              title: '[파파준스] 나만의 AI 사진작가로 월300 버는 올인원 무료강의',
              description: 'AI 기술을 활용한 사진작가로 월 300만원을 벌 수 있는 실전 노하우를 무료로 배워보세요.',
              price: 0,
              duration: 90,
              level: 'beginner',
              category: { name: '무료강의' },
              _count: { lessons: 3, purchases: 1234 }
            },
            {
              id: 'course-2',
              title: '[내일은편하게] 0원으로 초보자도 추가 월급 벌기 무료강의',
              description: '투자 없이도 시작할 수 있는 다양한 부업 방법을 배워보세요.',
              price: 0,
              duration: 120,
              level: 'beginner',
              category: { name: '무료강의' },
              _count: { lessons: 2, purchases: 987 }
            },
            {
              id: 'course-3',
              title: '[광마] 주부도 억대 매출 낸 AI쿠팡로켓 수익화 무료강의',
              description: 'AI를 활용한 쿠팡로켓 수익화 방법을 배워보세요.',
              price: 0,
              duration: 100,
              level: 'beginner',
              category: { name: '무료강의' },
              _count: { lessons: 3, purchases: 2156 }
            },
            {
              id: 'course-4',
              title: '[홍시삼분] 노베이스 초보자도 가능! AI 자동화 해외구매대행 무료강의',
              description: 'AI 자동화를 활용한 해외구매대행 사업을 시작해보세요.',
              price: 0,
              duration: 110,
              level: 'beginner',
              category: { name: '무료강의' },
              _count: { lessons: 3, purchases: 756 }
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching free courses:', error)
        // 에러 시에도 하드코딩된 데이터 사용
        setFreeCourses([
          {
            id: 'course-1',
            title: '[파파준스] 나만의 AI 사진작가로 월300 버는 올인원 무료강의',
            description: 'AI 기술을 활용한 사진작가로 월 300만원을 벌 수 있는 실전 노하우를 무료로 배워보세요.',
            price: 0,
            duration: 90,
            level: 'beginner',
            category: { name: '무료강의' },
            _count: { lessons: 3, purchases: 1234 }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFreeCourses()
  }, [])

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1)
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2)
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(3)
      } else {
        setSlidesToShow(4)
      }
    }

    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow)
    return () => window.removeEventListener('resize', updateSlidesToShow)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (freeCourses.length - slidesToShow + 1))
    }, 4000)

    return () => clearInterval(timer)
  }, [slidesToShow])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (freeCourses.length - slidesToShow + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (freeCourses.length - slidesToShow + 1)) % (freeCourses.length - slidesToShow + 1))
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">무료강의</h2>
            <p className="text-gray-600">전문가들의 노하우를 무료로 만나보세요</p>
          </div>
          <Link href="/courses?category=무료강의" className="text-blue-600 hover:text-blue-700 font-medium">
            더보기 →
          </Link>
        </div>

        {/* Course Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                width: `${(freeCourses.length / slidesToShow) * 100}%`
              }}
            >
              {loading ? (
                // 로딩 스켈레톤
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="px-3"
                    style={{ width: `${100 / 4}%` }}
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                freeCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="px-3"
                    style={{ width: `${100 / freeCourses.length}%` }}
                  >
                    <Link href={`/courses/${course.id}`} className="block group">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                        {/* Course Image */}
                        <div
                          className="h-48 relative"
                          style={{ background: gradients[index % gradients.length] }}
                        >
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                          <div className="absolute top-3 left-3">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              무료강의
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 rounded-full p-3">
                              <Play className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="text-white text-sm font-medium line-clamp-2">
                              {course.title}
                            </div>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-4">
                          <div className="text-xs text-blue-600 mb-2">{course.category?.name || '무료강의'}</div>
                          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                            {course.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {course.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{course._count?.purchases || 0}명 수강</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{course.duration ? `${course.duration}분` : '시간 정보 없음'}</span>
                            </div>
                          </div>
                          
                          {/* 강의 레벨과 수강생 수 */}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {course.level === 'beginner' ? '초급' : course.level === 'intermediate' ? '중급' : '고급'}
                            </span>
                            <span>{course._count?.lessons || 0}개 강의</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: freeCourses.length - slidesToShow + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
