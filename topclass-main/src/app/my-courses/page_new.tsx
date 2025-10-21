'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BookOpen, Star, User, Clock, Play } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  price: number
  original_price: number
  duration: number
  level: string
  thumbnail_url?: string
  video_url?: string
  vimeo_url?: string
  created_at: string
  
  // Enrollment specific fields
  enrollment_id?: string
  enrollment_status?: string
  enrolled_at?: string
  progress_percentage?: number
  type: 'enrollment' | 'purchase'
  
  // Purchase specific fields
  purchase_id?: string
  purchase_amount?: number
  purchased_at?: string
}

const supabase = createClient()

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchMyCourses()
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading])

  const fetchMyCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🎓 내 강의 목록 조회 시작...')

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await fetch('/api/my-courses', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      console.log('📡 API 응답:', {
        success: data.success,
        count: data.count,
        dataLength: data.data?.length,
        error: data.error,
        firstCourse: data.data?.[0]
      })

      if (!data.success) {
        throw new Error(data.error || '강의 목록을 불러오는데 실패했습니다.')
      }

      console.log('✅ 내 강의 목록 조회 성공:', data.data.length, '개 강의')
      console.log('📚 강의 목록 상세:', data.data)
      setCourses(data.data)
      
    } catch (error) {
      console.error('❌ 내 강의 목록 조회 오류:', error)
      setError(error instanceof Error ? error.message : '강의 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '초급'
      case 'intermediate': return '중급'
      case 'advanced': return '고급'
      default: return level
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}시간 ${mins}분`
    }
    return `${mins}분`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">❌ 오류가 발생했습니다</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchMyCourses}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-gray-600 text-lg mb-4">로그인이 필요합니다</div>
            <Link 
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              로그인하기
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">내 강의</h1>
            </div>
            <button
              onClick={fetchMyCourses}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              🔄 새로고침
            </button>
          </div>
          <p className="text-gray-600">
            수강신청하거나 구매한 강의들을 확인하고 학습을 진행하세요.
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 강의 수</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">무료강의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.type === 'enrollment').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">구매한 강의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.type === 'purchase').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 강의 목록 */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 수강 중인 강의가 없습니다</h3>
            <p className="text-gray-600 mb-6">새로운 강의를 찾아보세요!</p>
            <Link 
              href="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              강의 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="block group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col border-2 border-blue-200">
                  {/* 썸네일 - 정사각형 */}
                  <div className="aspect-square relative overflow-hidden flex-shrink-0">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <div className="text-white text-4xl">📚</div>
                      </div>
                    )}
                    
                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    
                    {/* 상태 배지 */}
                    <div className="absolute top-3 left-3">
                      {course.type === 'enrollment' ? (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          무료강의
                        </span>
                      ) : (
                        <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          구매완료
                        </span>
                      )}
                    </div>
                    
                    {/* 레벨 배지 */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>
                        {getLevelText(course.level)}
                      </span>
                    </div>

                    {/* 호버 플레이 버튼 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* 강의 정보 - 메인 페이지와 동일한 구조 */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-xs text-blue-600 mb-2">{course.category || '무료강의'}</div>
                    
                    {/* 제목과 설명 - 고정 높이 영역 */}
                    <div className="flex-1 mb-3">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight h-8">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed h-6">
                        {course.description}
                      </p>
                    </div>

                    {/* 가격 정보 - 고정 높이 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col h-8 justify-end w-full">
                        {course.original_price > course.price ? (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              ₩{course.original_price.toLocaleString()}
                            </div>
                            <div className="text-xl font-bold text-blue-600">
                              {course.price === 0 ? '무료' : `₩${course.price.toLocaleString()}`}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="h-5"></div>
                            <div className="text-xl font-bold text-blue-600">
                              {course.price === 0 ? '무료' : `₩${course.price.toLocaleString()}`}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span>4.8</span>
                      </div>
                    </div>
                    
                    {/* 진도율 (수강신청한 경우만) */}
                    {course.type === 'enrollment' && course.progress_percentage !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>진도율</span>
                          <span>{course.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* 수강 상태 */}
                    <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded text-center">
                      {course.type === 'enrollment' ? '수강중' : '구매완료'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
