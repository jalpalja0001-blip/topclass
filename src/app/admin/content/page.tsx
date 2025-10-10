'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  FileText,
  MessageSquare,
  Star,
  Award,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Home,
  Calendar,
  User,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  RefreshCw
} from 'lucide-react'

interface Notice {
  id: string
  title: string
  content: string
  author: string
  status: 'published' | 'draft' | 'archived'
  priority: 'high' | 'medium' | 'low'
  views: number
  created_at: string
  updated_at: string
}

interface CommunityPost {
  id: string
  title: string
  content: string
  author: string
  author_email: string
  category: string
  status: 'published' | 'pending' | 'rejected' | 'archived'
  likes: number
  comments: number
  views: number
  created_at: string
  updated_at: string
}

interface Review {
  id: string
  course_id: string
  course_title: string
  user_name: string
  user_email: string
  rating: number
  content: string
  status: 'published' | 'pending' | 'rejected' | 'archived'
  helpful: number
  created_at: string
  updated_at: string
}

interface SuccessStory {
  id: string
  title: string
  content: string
  author: string
  author_email: string
  category: string
  status: 'published' | 'pending' | 'rejected' | 'archived'
  featured: boolean
  views: number
  created_at: string
  updated_at: string
}

type ContentType = 'notices' | 'community' | 'reviews' | 'success-stories'

export default function ContentPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<ContentType>('notices')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editForm, setEditForm] = useState<any>({})

  const itemsPerPage = 10

  useEffect(() => {
    fetchContent()
  }, [activeTab, currentPage, searchTerm, statusFilter])

  // 핸들러 함수들
  const handleItemClick = (item: any) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedItem(null)
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setEditForm({
      title: item.title,
      content: item.content,
      status: item.status,
      priority: item.priority,
      featured: item.featured
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    console.log('콘텐츠 수정 저장:', editForm)
    // 실제 API 호출 로직 추가
    setShowEditModal(false)
    setEditingItem(null)
    setEditForm({})
    // 데이터 새로고침
    fetchContent()
  }

  const handleDeleteItem = (item: any) => {
    setEditingItem(item)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    console.log('콘텐츠 삭제:', editingItem)
    // 실제 API 호출 로직 추가
    setShowDeleteModal(false)
    setEditingItem(null)
    // 데이터 새로고침
    fetchContent()
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'published': '발행됨',
      'draft': '초안',
      'pending': '대기중',
      'rejected': '거부됨',
      'archived': '보관됨'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-blue-100 text-blue-800',
      'rejected': 'bg-red-100 text-red-800',
      'archived': 'bg-gray-100 text-gray-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'high': '높음',
      'medium': '보통',
      'low': '낮음'
    }
    return priorityMap[priority] || priority
  }

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    }
    return colorMap[priority] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      // 더미 데이터 생성
      const dummyNotices: Notice[] = [
        {
          id: 'notice-1',
          title: '새로운 강의 출시 안내',
          content: '다음 주에 새로운 React 강의가 출시됩니다. 많은 관심 부탁드립니다.',
          author: '관리자',
          status: 'published',
          priority: 'high',
          views: 1250,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'notice-2',
          title: '시스템 점검 안내',
          content: '1월 20일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다.',
          author: '관리자',
          status: 'published',
          priority: 'medium',
          views: 890,
          created_at: '2024-01-14T14:30:00Z',
          updated_at: '2024-01-14T14:30:00Z'
        },
        {
          id: 'notice-3',
          title: '강의 할인 이벤트',
          content: '2월 한 달간 모든 강의 30% 할인 이벤트를 진행합니다.',
          author: '관리자',
          status: 'draft',
          priority: 'high',
          views: 0,
          created_at: '2024-01-13T09:15:00Z',
          updated_at: '2024-01-13T09:15:00Z'
        }
      ]

      const dummyCommunityPosts: CommunityPost[] = [
        {
          id: 'post-1',
          title: 'React 학습 후기',
          content: 'React 강의를 수강하고 정말 도움이 되었습니다.',
          author: '김학생',
          author_email: 'student1@example.com',
          category: '후기',
          status: 'published',
          likes: 15,
          comments: 8,
          views: 120,
          created_at: '2024-01-15T11:00:00Z',
          updated_at: '2024-01-15T11:00:00Z'
        },
        {
          id: 'post-2',
          title: 'Next.js 질문있습니다',
          content: 'Next.js에서 API 라우트를 사용할 때 주의사항이 있나요?',
          author: '이개발자',
          author_email: 'dev2@example.com',
          category: '질문',
          status: 'published',
          likes: 5,
          comments: 12,
          views: 85,
          created_at: '2024-01-14T16:20:00Z',
          updated_at: '2024-01-14T16:20:00Z'
        },
        {
          id: 'post-3',
          title: '부적절한 내용',
          content: '스팸성 내용입니다.',
          author: '스팸유저',
          author_email: 'spam@example.com',
          category: '기타',
          status: 'rejected',
          likes: 0,
          comments: 0,
          views: 5,
          created_at: '2024-01-13T20:45:00Z',
          updated_at: '2024-01-13T21:00:00Z'
        }
      ]

      const dummyReviews: Review[] = [
        {
          id: 'review-1',
          course_id: 'course-1',
          course_title: 'AI 사진작가로 월300 버는 무료강의',
          user_name: '김학생',
          user_email: 'student1@example.com',
          rating: 5,
          content: '정말 유용한 강의였습니다. 추천합니다!',
          status: 'published',
          helpful: 23,
          created_at: '2024-01-15T12:00:00Z',
          updated_at: '2024-01-15T12:00:00Z'
        },
        {
          id: 'review-2',
          course_id: 'course-2',
          course_title: '초보자도 추가 월급 벌기 무료강의',
          user_name: '이개발자',
          user_email: 'dev2@example.com',
          rating: 4,
          content: '초보자에게 적합한 내용이었습니다.',
          status: 'published',
          helpful: 15,
          created_at: '2024-01-14T14:30:00Z',
          updated_at: '2024-01-14T14:30:00Z'
        },
        {
          id: 'review-3',
          course_id: 'course-3',
          course_title: 'AI쿠팡로켓 수익화 무료강의',
          user_name: '박마케터',
          user_email: 'marketer3@example.com',
          rating: 2,
          content: '내용이 부실합니다.',
          status: 'pending',
          helpful: 2,
          created_at: '2024-01-13T10:15:00Z',
          updated_at: '2024-01-13T10:15:00Z'
        }
      ]

      const dummySuccessStories: SuccessStory[] = [
        {
          id: 'story-1',
          title: 'React로 취업 성공!',
          content: '이 사이트의 React 강의를 통해 개발자로 취업했습니다.',
          author: '정개발자',
          author_email: 'dev4@example.com',
          category: '취업',
          status: 'published',
          featured: true,
          views: 450,
          created_at: '2024-01-15T09:00:00Z',
          updated_at: '2024-01-15T09:00:00Z'
        },
        {
          id: 'story-2',
          title: '프리랜서로 전환',
          content: '강의를 통해 프리랜서로 전환하여 수익을 올리고 있습니다.',
          author: '최프리랜서',
          author_email: 'freelancer5@example.com',
          category: '수익',
          status: 'published',
          featured: false,
          views: 320,
          created_at: '2024-01-14T13:20:00Z',
          updated_at: '2024-01-14T13:20:00Z'
        },
        {
          id: 'story-3',
          title: '스킬 업그레이드',
          content: '강의를 통해 새로운 기술을 배웠습니다.',
          author: '한학습자',
          author_email: 'learner6@example.com',
          category: '학습',
          status: 'pending',
          featured: false,
          views: 0,
          created_at: '2024-01-13T15:45:00Z',
          updated_at: '2024-01-13T15:45:00Z'
        }
      ]

      let filteredItems: any[] = []
      let totalItems = 0

      switch (activeTab) {
        case 'notices':
          filteredItems = dummyNotices
          break
        case 'community':
          filteredItems = dummyCommunityPosts
          break
        case 'reviews':
          filteredItems = dummyReviews
          break
        case 'success-stories':
          filteredItems = dummySuccessStories
          break
      }

      // 검색어 필터링
      if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // 상태 필터링
      if (statusFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.status === statusFilter)
      }

      totalItems = filteredItems.length
      const totalPages = Math.ceil(totalItems / itemsPerPage)
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedItems = filteredItems.slice(startIndex, endIndex)

      // 상태 업데이트는 각 탭별로 다르게 처리
      setLoading(false)

    } catch (err) {
      console.error('콘텐츠 데이터 로드 오류:', err)
      setError('콘텐츠 데이터를 불러오는 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }





  const tabs = [
    { id: 'notices', label: '공지사항', icon: FileText, count: 3 },
    { id: 'community', label: '커뮤니티', icon: MessageSquare, count: 3 },
    { id: 'reviews', label: '리뷰', icon: Star, count: 3 },
    { id: 'success-stories', label: '성공 스토리', icon: Award, count: 3 }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">콘텐츠 데이터를 불러오는 중...</p>
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

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">콘텐츠 관리</h1>
          <p className="text-gray-600 mt-2">공지사항, 커뮤니티, 리뷰, 성공 스토리를 관리하세요</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'notices' && (
            <button
              onClick={() => {
                const newItem = {
                  id: `new-${activeTab}-${Date.now()}`,
                  title: '새 공지사항',
                  content: '새로운 공지사항입니다.',
                  author: '관리자',
                  status: 'draft',
                  priority: 'medium',
                  views: 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
                handleEditItem(newItem)
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              새 공지사항 작성
            </button>
          )}
          <button
            onClick={() => {
              setCurrentPage(1)
              setSearchTerm('')
              setStatusFilter('all')
              fetchContent()
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            새로고침
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ContentType)
                setCurrentPage(1)
                setSearchTerm('')
                setStatusFilter('all')
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="제목, 내용, 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 상태</option>
              <option value="published">발행됨</option>
              <option value="draft">초안</option>
              <option value="pending">대기중</option>
              <option value="rejected">거부됨</option>
              <option value="archived">보관됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* 콘텐츠 목록 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                {activeTab === 'notices' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    우선순위
                  </th>
                )}
                {activeTab === 'community' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                )}
                {activeTab === 'reviews' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평점
                  </th>
                )}
                {activeTab === 'success-stories' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    추천
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  조회수
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* 공지사항 데이터 */}
              {activeTab === 'notices' && (
                <>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">새로운 강의 출시 안내</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">관리자</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        높음
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,250</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 15일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleItemClick({
                            id: 'notice-1',
                            title: '새로운 강의 출시 안내',
                            content: '다음 주에 새로운 React 강의가 출시됩니다. 많은 관심 부탁드립니다.',
                            author: '관리자',
                            status: 'published',
                            priority: 'high',
                            views: 1250,
                            created_at: '2024-01-15T10:00:00Z',
                            updated_at: '2024-01-15T10:00:00Z'
                          })}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="상세보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditItem({
                            id: 'notice-1',
                            title: '새로운 강의 출시 안내',
                            content: '다음 주에 새로운 React 강의가 출시됩니다. 많은 관심 부탁드립니다.',
                            author: '관리자',
                            status: 'published',
                            priority: 'high',
                            views: 1250,
                            created_at: '2024-01-15T10:00:00Z',
                            updated_at: '2024-01-15T10:00:00Z'
                          })}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                          title="수정"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem({
                            id: 'notice-1',
                            title: '새로운 강의 출시 안내',
                            content: '다음 주에 새로운 React 강의가 출시됩니다. 많은 관심 부탁드립니다.',
                            author: '관리자',
                            status: 'published',
                            priority: 'high',
                            views: 1250,
                            created_at: '2024-01-15T10:00:00Z',
                            updated_at: '2024-01-15T10:00:00Z'
                          })}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">시스템 점검 안내</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">관리자</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        보통
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">890</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 14일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">강의 할인 이벤트</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">관리자</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        초안
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        높음
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 13일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </>
              )}

              {/* 커뮤니티 데이터 */}
              {activeTab === 'community' && (
                <>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">React 학습 후기</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">김학생</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">후기</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 15일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Next.js 질문있습니다</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">이개발자</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">질문</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">85</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 14일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">부적절한 내용</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">스팸유저</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        거부됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">기타</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 13일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </>
              )}

              {/* 리뷰 데이터 */}
              {activeTab === 'reviews' && (
                <>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">AI 사진작가로 월300 버는 무료강의</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">김학생</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">5.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 15일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">초보자도 추가 월급 벌기 무료강의</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">이개발자</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">4.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 14일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">AI쿠팡로켓 수익화 무료강의</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">박마케터</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        대기중
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">2.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 13일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </>
              )}

              {/* 성공 스토리 데이터 */}
              {activeTab === 'success-stories' && (
                <>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">React로 취업 성공!</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">정개발자</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="ml-1">추천</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">450</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 15일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">프리랜서로 전환</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">최프리랜서</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        발행됨
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">320</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 14일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">스킬 업그레이드</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">한학습자</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        대기중
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024년 1월 13일</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">콘텐츠 상세 정보</h3>
                <button
                  onClick={handleCloseDetailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>제목:</strong> {selectedItem.title}</p>
                    <p><strong>작성자:</strong> {selectedItem.author}</p>
                    <p><strong>상태:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedItem.status)}`}>
                      {getStatusText(selectedItem.status)}
                    </span></p>
                  </div>
                  <div>
                    <p><strong>조회수:</strong> {selectedItem.views?.toLocaleString() || 0}</p>
                    <p><strong>작성일:</strong> {formatDate(selectedItem.created_at)}</p>
                    <p><strong>수정일:</strong> {formatDate(selectedItem.updated_at)}</p>
                  </div>
                </div>
                <div>
                  <p><strong>내용:</strong></p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-800">{selectedItem.content}</p>
                  </div>
                </div>
                {selectedItem.priority && (
                  <div>
                    <p><strong>우선순위:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedItem.priority)}`}>
                      {getPriorityText(selectedItem.priority)}
                    </span></p>
                  </div>
                )}
                {selectedItem.category && (
                  <div>
                    <p><strong>카테고리:</strong> {selectedItem.category}</p>
                  </div>
                )}
                {selectedItem.rating && (
                  <div>
                    <p><strong>평점:</strong> 
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{selectedItem.rating}</span>
                      </div>
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseDetailModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">콘텐츠 수정</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    value={editForm.content || ''}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <select
                      value={editForm.status || 'draft'}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">초안</option>
                      <option value="published">발행됨</option>
                      <option value="pending">대기중</option>
                      <option value="rejected">거부됨</option>
                      <option value="archived">보관됨</option>
                    </select>
                  </div>
                  {activeTab === 'notices' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                      <select
                        value={editForm.priority || 'medium'}
                        onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">낮음</option>
                        <option value="medium">보통</option>
                        <option value="high">높음</option>
                      </select>
                    </div>
                  )}
                </div>
                {activeTab === 'success-stories' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={editForm.featured || false}
                      onChange={(e) => setEditForm({...editForm, featured: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      추천 스토리
                    </label>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && editingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">콘텐츠 삭제</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">정말로 삭제하시겠습니까?</p>
                    <p className="text-sm text-gray-600">
                      <strong>{editingItem.title}</strong> 콘텐츠가 영구적으로 삭제됩니다.
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    ⚠️ 이 작업은 되돌릴 수 없습니다. 콘텐츠와 관련된 모든 데이터가 삭제됩니다.
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
