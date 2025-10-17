'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Filter, Clock, Users, Star, Play } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  price: number
  thumbnail_url?: string
  duration: number
  level: string
  category?: string
  status: string
  published: boolean
  created_at: string
  is_featured?: boolean
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

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const [coursesData, setCoursesData] = useState<CoursesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // 카테고리 옵션
  const categories = [
    { value: '', label: '전체' },
    { value: '무료강의', label: '무료강의' },
    { value: '얼리버드', label: '얼리버드' },
    { value: '클래스', label: '클래스' },
    { value: '프로그래밍', label: '프로그래밍' },
    { value: '디자인', label: '디자인' },
    { value: '마케팅', label: '마케팅' },
    { value: '비즈니스', label: '비즈니스' }
  ]

  const fetchCourses = async (category?: string, tag?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      })

      if (searchTerm) params.append('search', searchTerm)
      if (category && category !== 'all') params.append('category', category)
      if (tag) params.append('tag', tag)

      console.log('Fetching courses with params:', params.toString()) // 디버깅용

      const response = await fetch(`/api/courses?${params}`)
      const data = await response.json()

      console.log('API Response:', data) // 디버깅용
      console.log('🔍 강의 목록 데이터:', data.data?.courses?.map(c => ({ 
        id: c.id, 
        title: c.title, 
        category: c.category, 
        is_featured: c.is_featured,
        price: c.price 
      })))

      if (data.success) {
        setCoursesData(data.data)
      } else {
        console.error('API Error:', data.error)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  // URL 파라미터에서 초기 카테고리 설정
  useEffect(() => {
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const refresh = searchParams.get('refresh')
    
    console.log('URL params - category:', category, 'tag:', tag, 'refresh:', refresh) // 디버깅용
    
    if (refresh) {
      // 새로고침 파라미터가 있으면 강의 목록 새로고침
      console.log('🔄 강의 목록 새로고침 요청')
      fetchCourses('all')
      // URL에서 refresh 파라미터 제거
      const newUrl = window.location.pathname + (category ? `?category=${category}` : '')
      window.history.replaceState({}, '', newUrl)
    } else if (category) {
      setSelectedCategory(category)
      fetchCourses(category)
    } else if (tag) {
      // 태그가 있으면 태그로 강의 검색
      setSelectedCategory('')
      fetchCourses(undefined, tag)
    } else {
      // 카테고리가 없으면 모든 강의를 가져옴
      fetchCourses('all')
    }
  }, [searchParams])

  // 검색어나 페이지 변경 시 강의 로드 (검색어는 디바운스 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // URL에서 태그가 있는지 확인
      const urlTag = searchParams.get('tag')
      
      if (urlTag) {
        // 태그가 있으면 태그로 검색
        fetchCourses(undefined, urlTag)
      } else {
        // 태그가 없으면 카테고리로 검색
        const category = selectedCategory || 'all'
        fetchCourses(category)
      }
    }, 300) // 300ms 디바운스

    return () => clearTimeout(timeoutId)
  }, [currentPage, searchTerm, selectedCategory, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    // 폼 제출 시에는 즉시 검색 실행
    const category = selectedCategory || 'all'
    fetchCourses(category)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price)
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '시간 정보 없음'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}시간 ${mins}분`
    }
    return `${mins}분`
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedCategory === '무료강의' && '무료 강의'}
            {selectedCategory === '얼리버드' && '얼리버드 추천 강의'}
            {selectedCategory === '클래스' && '클래스 강의'}
            {!selectedCategory && '모든 강의'}
          </h1>
          <p className="text-lg text-gray-600">
            {selectedCategory === '무료강의' && '완전 무료로 제공되는 고품질 강의를 만나보세요'}
            {selectedCategory === '얼리버드' && '추천 강의로 선별된 특별한 강의들을 만나보세요'}
            {selectedCategory === '클래스' && '유료 강의로 제공되는 전문가 강의를 만나보세요'}
            {!selectedCategory && '전문가들이 제작한 고품질 온라인 강의를 만나보세요'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="강의 제목이나 내용으로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 카테고리</option>
              <option value="무료강의">무료강의 (무료)</option>
              <option value="얼리버드">얼리버드 (추천강의)</option>
              <option value="클래스">클래스 (유료강의)</option>
              <option value="프로그래밍">프로그래밍</option>
              <option value="디자인">디자인</option>
              <option value="마케팅">마케팅</option>
              <option value="비즈니스">비즈니스</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              검색
            </button>
          </form>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : coursesData && coursesData.courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coursesData.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                    {/* Course Main Image */}
                    <div className="h-48 relative overflow-hidden">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <div className="text-white text-center p-4">
                            <div className="text-4xl">💡</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Level Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(course.level)}`}>
                          {getLevelText(course.level)}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {course.is_featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            ⭐ 추천
                          </span>
                        </div>
                      )}

                      {/* Hover Play Button */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <Play className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                          {course.category || '무료강의'}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span>4.8</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>


                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDuration(course.duration)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.instructor}
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          {course.price > 0 ? (
                            <div className="text-xl font-bold text-orange-600">
                              ₩{course.price.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-xl font-bold text-green-600">
                              무료
                            </div>
                          )}
                        </div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                          {course.price > 0 ? '구매하기' : '수강신청'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {coursesData.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  {[...Array(coursesData.pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 text-sm rounded ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(coursesData.pagination.totalPages, currentPage + 1))}
                    disabled={currentPage === coursesData.pagination.totalPages}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
