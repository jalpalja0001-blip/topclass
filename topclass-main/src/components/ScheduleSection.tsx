'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  price: number
  category?: {
    name: string
  }
  level: string
  duration: string
  students: number
  rating: number
  imageUrl?: string
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

export default function ScheduleSection() {
  const [freeCourses, setFreeCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        const response = await fetch('/api/courses?category=무료강의&limit=4')
        const data = await response.json()
        
        if (data.success) {
          setFreeCourses(data.data.courses)
        }
      } catch (error) {
        console.error('무료강의 로드 실패:', error)
        // API 실패 시 더미 데이터 사용
        setFreeCourses([
          {
            id: 'course-1',
            title: 'AI 사진작가로 월300 버는 무료강의',
            description: 'AI 기술을 활용한 사진작가로 월 300만원을 벌 수 있는 실전 노하우를 무료로 배워보세요.',
            price: 0,
            level: 'beginner',
            duration: '90분',
            students: 1234,
            rating: 4.8,
            category: { name: '무료강의' }
          },
          {
            id: 'course-2',
            title: '초보자도 추가 월급 벌기 무료강의',
            description: '초보자도 쉽게 따라할 수 있는 부업 노하우를 무료로 배워보세요.',
            price: 0,
            level: 'beginner',
            duration: '120분',
            students: 856,
            rating: 4.6,
            category: { name: '무료강의' }
          },
          {
            id: 'course-3',
            title: 'AI쿠팡로켓 수익화 무료강의',
            description: 'AI를 활용한 쿠팡로켓 수익화 전략을 무료로 배워보세요.',
            price: 0,
            level: 'intermediate',
            duration: '150분',
            students: 642,
            rating: 4.7,
            category: { name: '무료강의' }
          },
          {
            id: 'course-4',
            title: '유튜브 멱살캐리 무료특강',
            description: '유튜브로 수익을 내는 실전 노하우를 무료로 배워보세요.',
            price: 0,
            level: 'intermediate',
            duration: '180분',
            students: 423,
            rating: 4.5,
            category: { name: '무료강의' }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFreeCourses()
  }, [])

  // 강의 일정 데이터 (실제로는 API에서 가져와야 함)
  const scheduleData = [
    { date: '12월 10일', courseId: freeCourses[0]?.id || 'course-1' },
    { date: '12월 16일', courseId: freeCourses[1]?.id || 'course-2' },
    { date: '12월 23일', courseId: freeCourses[2]?.id || 'course-3' },
    { date: '12월 24일', courseId: freeCourses[3]?.id || 'course-4' },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">무료 강의 일정</h2>
            <p className="text-gray-600">이번 달 무료 강의 스케줄을 확인하세요</p>
          </div>
          <Link href="/schedule" className="text-blue-600 hover:text-blue-700 font-medium">
            더보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mini Calendar */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">2024년 12월</h3>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="p-2 font-medium text-gray-600">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                <div
                  key={date}
                  className={`p-2 rounded ${
                    [10, 16, 23, 24].includes(date)
                      ? 'bg-blue-500 text-white font-bold'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {date}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule List */}
          <div className="space-y-4">
            {loading ? (
              // 로딩 스켈레톤
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg animate-pulse">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              scheduleData.map((schedule, index) => {
                const course = freeCourses[index]
                return (
                  <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-sm text-blue-600 font-medium">{schedule.date}</div>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="font-medium text-gray-900">
                        {course?.title || '강의 제목을 불러오는 중...'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course?.category?.name || '무료강의'}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link 
                        href={`/courses/${schedule.courseId}`} 
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        신청하기
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
