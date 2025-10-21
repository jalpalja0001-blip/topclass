'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  Users,
  Star,
  DollarSign,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  X,
  AlertTriangle,
  Home,
  Play,
  Pause,
  EyeOff
} from 'lucide-react'
import CourseForm, { CourseFormData } from './components/CourseForm'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  price: number
  original_price?: number
  thumbnail_url?: string
  video_url?: string // video_url 필드 추가
  duration: number // 분 단위
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'published' | 'draft' | 'archived'
  is_featured: boolean
  created_at: string
  updated_at: string
  student_count?: number
  rating?: number
  review_count?: number
  tags: string[]
}

interface CoursesData {
  courses: Course[]
  total: number
  page: number
  totalPages: number
}

export default function CoursesPage() {
  const { user } = useAuth()
  const [coursesData, setCoursesData] = useState<CoursesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    price: 0,
    original_price: 0,
    duration: 0,
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    status: 'published' as 'published' | 'draft' | 'archived',
    is_featured: false,
    tags: [] as string[]
  })

  useEffect(() => {
    fetchCourses()
  }, [currentPage, searchTerm, categoryFilter, statusFilter, levelFilter, activeFilter])

  // URL 쿼리 파라미터 변경 감지 (강의 생성 후 새로고침)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('refresh')) {
      // 새로고침 쿼리 파라미터가 있으면 강의 목록 다시 로드
      fetchCourses()
      // URL에서 쿼리 파라미터 제거
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user?.email) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      console.log('🔍 강의 데이터 조회 시작...')
      
      // 데이터베이스에서 강의 데이터 가져오기
      const response = await fetch('/api/courses')
      console.log('📡 강의 API 응답:', { status: response.status, ok: response.ok })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '강의 데이터를 가져오는데 실패했습니다.')
      }
      
      const coursesData = await response.json()
      console.log('📦 강의 API 데이터:', coursesData)
      
      const courses: Course[] = coursesData.data?.courses || []
      console.log('📚 조회된 강의 수:', courses.length)

      // 필터링 적용
      let filteredCourses = courses

      if (searchTerm) {
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (categoryFilter !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.category === categoryFilter)
      }

      if (statusFilter !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.status === statusFilter)
      }

      if (levelFilter !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.level === levelFilter)
      }

      // 페이지네이션
      const itemsPerPage = 10
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex)

      setCoursesData({
        courses: paginatedCourses,
        total: filteredCourses.length,
        page: currentPage,
        totalPages: Math.ceil(filteredCourses.length / itemsPerPage)
      })

    } catch (error: any) {
      console.error('❌ 강의 목록 로드 오류:', error)
      setError(error.message || '강의 목록을 불러오는 중 오류가 발생했습니다.')
      setCoursesData({
        courses: [],
        total: 0,
        page: currentPage,
        totalPages: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}시간 ${mins}분`
    }
    return `${mins}분`
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case 'published': return '공개'
      case 'draft': return '초안'
      case 'archived': return '보관'
      default: return '알 수 없음'
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-orange-100 text-orange-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '초급'
      case 'intermediate': return '중급'
      case 'advanced': return '고급'
      default: return '알 수 없음'
    }
  }

  const formatCategory = (category: string | undefined) => {
    if (!category || category === '-') return '-';
    return category === '무료강의' ? '무료강의' : '유료강의';
  }

  const handleCardClick = (filterType: string) => {
    setActiveFilter(filterType)
    setCurrentPage(1)
    
    switch (filterType) {
      case 'total':
        setCategoryFilter('all')
        setStatusFilter('all')
        setLevelFilter('all')
        setSearchTerm('')
        break
      case 'published':
        setCategoryFilter('all')
        setStatusFilter('published')
        setLevelFilter('all')
        setSearchTerm('')
        break
      case 'draft':
        setCategoryFilter('all')
        setStatusFilter('draft')
        setLevelFilter('all')
        setSearchTerm('')
        break
      case 'featured':
        setCategoryFilter('all')
        setStatusFilter('all')
        setLevelFilter('all')
        setSearchTerm('')
        // 추후 featured 필터링 로직 추가
        break
    }
  }

  const clearFilters = () => {
    setActiveFilter(null)
    setCategoryFilter('all')
    setStatusFilter('all')
    setLevelFilter('all')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
  }

  const handleCloseModal = () => {
    setShowCourseModal(false)
    setSelectedCourse(null)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setEditForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
      price: course.price,
      original_price: course.original_price || 0,
      duration: course.duration,
      level: course.level,
      status: course.status,
      is_featured: course.is_featured,
      tags: course.tags
    })
    setShowEditModal(true)
  }

  // 수정 저장 처리 함수 실제 DB 반영
  const handleSaveEdit = async (form: CourseFormData) => {
    if (!editingCourse) return;
    try {
      // DB에 실제로 저장
      const response = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || '수정 실패');
      // 프론트 상태도 반영 (option)
      setCoursesData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          courses: prev.courses.map(course =>
            course.id === editingCourse.id ? { ...course, ...form, updated_at: new Date().toISOString() } : course
          )
        };
      });
      setShowEditModal(false);
      setEditingCourse(null);
      alert('수정 완료!');
    } catch (e: any) {
      alert(e.message || '수정 오류');
    }
  };

  const handleDeleteCourse = (course: Course) => {
    setEditingCourse(course)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingCourse) return
    
    try {
      // 실제 API 호출로 강의 삭제
      console.log('강의 삭제 시작:', editingCourse.id)
      
      const response = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || '강의 삭제에 실패했습니다.')
      }
      
      console.log('강의 삭제 성공:', editingCourse.id)
      
      // 성공시 프론트엔드 상태에서도 제거
      setCoursesData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          courses: prev.courses.filter(course => course.id !== editingCourse.id),
          total: prev.total - 1
        }
      })
      
      // 모달 닫기
      setShowDeleteModal(false)
      setEditingCourse(null)
      
      // 성공 메시지
      alert('강의가 성공적으로 삭제되었습니다.')
      
      // 강의 목록 새로고침 (최신 상태 반영)
      await fetchCourses()
      
    } catch (error: any) {
      console.error('강의 삭제 오류:', error)
      alert(error.message || '강의 삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">강의 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오류가 발생했습니다</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">강의 관리</h1>
          <p className="text-gray-600 mt-2">전체 강의를 관리하고 상태를 설정하세요</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          새 강의 만들기
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'total' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => handleCardClick('total')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'total' ? 'bg-blue-200' : 'bg-blue-100'}`}>
              <BookOpen className={`w-6 h-6 ${activeFilter === 'total' ? 'text-blue-700' : 'text-blue-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'total' ? 'text-blue-700' : 'text-gray-600'}`}>
                총 강의
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'total' ? 'text-blue-900' : 'text-gray-900'}`}>
                {coursesData?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div 
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'published' ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}
          onClick={() => handleCardClick('published')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'published' ? 'bg-green-200' : 'bg-green-100'}`}>
              <Play className={`w-6 h-6 ${activeFilter === 'published' ? 'text-green-700' : 'text-green-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'published' ? 'text-green-700' : 'text-gray-600'}`}>
                공개 강의
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'published' ? 'text-green-900' : 'text-gray-900'}`}>
                {coursesData?.courses.filter(c => c.status === 'published').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div 
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'draft' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
          }`}
          onClick={() => handleCardClick('draft')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'draft' ? 'bg-yellow-200' : 'bg-yellow-100'}`}>
              <Pause className={`w-6 h-6 ${activeFilter === 'draft' ? 'text-yellow-700' : 'text-yellow-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'draft' ? 'text-yellow-700' : 'text-gray-600'}`}>
                초안 강의
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'draft' ? 'text-yellow-900' : 'text-gray-900'}`}>
                {coursesData?.courses.filter(c => c.status === 'draft').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div 
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'featured' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
          }`}
          onClick={() => handleCardClick('featured')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'featured' ? 'bg-purple-200' : 'bg-purple-100'}`}>
              <Star className={`w-6 h-6 ${activeFilter === 'featured' ? 'text-purple-700' : 'text-purple-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'featured' ? 'text-purple-700' : 'text-gray-600'}`}>
                추천 강의
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'featured' ? 'text-purple-900' : 'text-gray-900'}`}>
                {coursesData?.courses.filter(c => c.is_featured).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {/* 활성 필터 표시 */}
        {activeFilter && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">현재 필터:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {activeFilter === 'total' && '총 강의'}
                {activeFilter === 'published' && '공개 강의'}
                {activeFilter === 'draft' && '초안 강의'}
                {activeFilter === 'featured' && '추천 강의'}
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              필터 초기화
            </button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="강의명, 설명, 강사명으로 검색..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setActiveFilter(null)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setActiveFilter(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 카테고리</option>
              <option value="무료강의">무료강의</option>
              <option value="프로그래밍">프로그래밍</option>
              <option value="디자인">디자인</option>
              <option value="마케팅">마케팅</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setActiveFilter(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 상태</option>
              <option value="published">공개</option>
              <option value="draft">초안</option>
              <option value="archived">보관</option>
            </select>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value)
                setActiveFilter(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 레벨</option>
              <option value="beginner">초급</option>
              <option value="intermediate">중급</option>
              <option value="advanced">고급</option>
            </select>
          </div>
        </div>
      </div>

      {/* 강의 목록 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강의명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강사</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수강생
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  평점
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coursesData?.courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 h-16 aspect-square rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-gray-300">No image</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {course.title}
                          {course.is_featured && (
                            <Star className="w-4 h-4 text-yellow-500 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDuration(course.duration)} • {getLevelLabel(course.level)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(course.created_at)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.instructor ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {formatCategory(course.category ?? '-')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {course.price === 0 ? (
                        <span className="text-green-600 font-medium">무료</span>
                      ) : (
                        <div>
                          <div className="font-medium">{formatCurrency(course.price)}</div>
                          {course.original_price && course.original_price > course.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatCurrency(course.original_price)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(course.status ?? 'draft')}`}>
                      {getStatusLabel(course.status ?? undefined)}
                    </span>
                    {course.is_featured && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">★ 추천</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {course.student_count?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {course.rating && course.rating > 0 ? course.rating.toFixed(1) : '-'}
                      <span className="text-gray-500 ml-1">({course.review_count || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleCourseClick(course)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditCourse(course)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {coursesData && coursesData.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(coursesData.totalPages, currentPage + 1))}
                disabled={currentPage === coursesData.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  총 <span className="font-medium">{coursesData.total}</span>개 중{' '}
                  <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>-
                  <span className="font-medium">
                    {Math.min(currentPage * 10, coursesData.total)}
                  </span>
                  개 표시
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: coursesData.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(coursesData.totalPages, currentPage + 1))}
                    disabled={currentPage === coursesData.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 강의 상세 모달 */}
      {showCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">강의 상세 정보</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">강의명</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCourse.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">설명</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCourse.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">강사</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCourse.instructor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">카테고리</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCourse.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">가격</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCourse.price === 0 ? '무료' : formatCurrency(selectedCourse.price)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">수강 시간</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDuration(selectedCourse.duration)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">레벨</label>
                  <p className="mt-1 text-sm text-gray-900">{getLevelLabel(selectedCourse.level)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">상태</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedCourse.status ?? 'draft')}`}>
                    {getStatusLabel(selectedCourse.status ?? undefined)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">수강생 수</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCourse.student_count?.toLocaleString() || '0'}명</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">평점</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCourse.rating && selectedCourse.rating > 0 ? `${selectedCourse.rating.toFixed(1)} (${selectedCourse.review_count}개 리뷰)` : '리뷰 없음'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">태그</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedCourse.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 강의 수정 모달 */}
      {showEditModal && editingCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[520px] max-w-full shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">강의 정보 수정</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <CourseForm
                mode="edit"
                initialData={{
                  ...editingCourse,
                  tags: editingCourse.tags || [],
                  thumbnail_url: editingCourse.thumbnail_url || editingCourse.thumbnail || '',
                  original_price: editingCourse.original_price || 0,
                  price: editingCourse.price || 0,
                  detail_image_url: editingCourse.detail_image_url || '',
                  video_url: editingCourse.video_url || '', // video_url 필드 추가
                }}
                onSubmit={handleSaveEdit}
                loading={false}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && editingCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">강의 삭제</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">정말로 삭제하시겠습니까?</p>
                    <p className="text-sm text-gray-600">
                      <strong>{editingCourse.title}</strong> 강의가 영구적으로 삭제됩니다.
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    ⚠️ 이 작업은 되돌릴 수 없습니다. 강의의 모든 데이터가 삭제됩니다.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 관리자 메인페이지 돌아가기 버튼 */}
      <div className="flex justify-center mt-8">
        <Link 
          href="/admin"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Home className="w-5 h-5 mr-2" />
          관리자 메인페이지
        </Link>
      </div>
    </div>
  )
}
