'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Home,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Video,
  BookOpen,
  MessageSquare,
  Star,
  Save,
  User,
  Tag
} from 'lucide-react'

// --- Interfaces for Schedule ---
interface Schedule {
  id: string
  title: string
  description: string
  type: 'lecture' | 'meeting' | 'event' | 'other'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  location: string
  instructor_id?: string
  instructor_name?: string
  course_id?: string
  course_title?: string
  max_participants?: number
  current_participants?: number
  is_online: boolean
  meeting_url?: string
  tags: string[]
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export default function ScheduleManagementPage() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modals states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [editForm, setEditForm] = useState<Partial<Schedule>>({})
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState<Partial<Schedule>>({
    type: 'lecture',
    status: 'scheduled',
    priority: 'medium',
    is_online: false,
    tags: []
  })

  useEffect(() => {
    fetchSchedules()
  }, [currentPage, searchTerm, typeFilter, statusFilter])

  const fetchSchedules = async () => {
    setLoading(true)
    setError(null)

    if (!user) {
      setError('로그인이 필요합니다.')
      setLoading(false)
      return
    }

    // 실제 API 호출로 일정 데이터 가져오기
    const response = await fetch('/api/admin/schedule', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('일정 데이터를 가져오는데 실패했습니다.')
    }

    const data = await response.json()
    const allSchedules = data.schedules || []

    let filteredSchedules = allSchedules.filter(schedule => {
      const matchesSearch = searchTerm === '' ||
        schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === 'all' || schedule.type === typeFilter
      const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })

    setSchedules(filteredSchedules)
    setLoading(false)
  }

  // --- Utility Functions ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const formatDateTime = (date: string, time: string) => {
    return `${formatDate(date)} ${time}`
  }

  const getTypeColor = (type: Schedule['type']) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800'
      case 'meeting': return 'bg-green-100 text-green-800'
      case 'event': return 'bg-purple-100 text-purple-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: Schedule['type']) => {
    switch (type) {
      case 'lecture': return '강의'
      case 'meeting': return '회의'
      case 'event': return '이벤트'
      case 'other': return '기타'
      default: return type
    }
  }

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Schedule['status']) => {
    switch (status) {
      case 'scheduled': return '예정'
      case 'in_progress': return '진행중'
      case 'completed': return '완료'
      case 'cancelled': return '취소'
      default: return status
    }
  }

  const getPriorityColor = (priority: Schedule['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: Schedule['priority']) => {
    switch (priority) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return priority
    }
  }

  // --- Handlers for Modals and Actions ---
  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedSchedule(null)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setEditForm({
      title: schedule.title,
      description: schedule.description,
      type: schedule.type,
      status: schedule.status,
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      location: schedule.location,
      instructor_name: schedule.instructor_name,
      course_title: schedule.course_title,
      max_participants: schedule.max_participants,
      is_online: schedule.is_online,
      meeting_url: schedule.meeting_url,
      tags: [...schedule.tags],
      priority: schedule.priority
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingSchedule) return
    console.log('일정 수정 저장:', editingSchedule.id, editForm)
    // Simulate update
    setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? { ...s, ...editForm } : s))
    setShowEditModal(false)
    setEditingSchedule(null)
    setEditForm({})
    fetchSchedules() // Refresh data
  }

  const handleDeleteSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (!editingSchedule) return
    console.log('일정 삭제:', editingSchedule.id)
    // Simulate delete
    setSchedules(prev => prev.filter(s => s.id !== editingSchedule.id))
    setShowDeleteModal(false)
    setEditingSchedule(null)
    fetchSchedules() // Refresh data
  }

  const handleCreateSchedule = () => {
    setCreateForm({
      type: 'lecture',
      status: 'scheduled',
      priority: 'medium',
      is_online: false,
      tags: []
    })
    setShowCreateModal(true)
  }

  const handleSaveCreate = () => {
    console.log('새 일정 생성:', createForm)
    // Simulate create
    const newSchedule: Schedule = {
      id: `schedule-${Date.now()}`,
      title: createForm.title || '새 일정',
      description: createForm.description || '',
      type: createForm.type || 'lecture',
      status: createForm.status || 'scheduled',
      start_date: createForm.start_date || new Date().toISOString().split('T')[0],
      end_date: createForm.end_date || new Date().toISOString().split('T')[0],
      start_time: createForm.start_time || '09:00',
      end_time: createForm.end_time || '10:00',
      location: createForm.location || '',
      instructor_name: createForm.instructor_name,
      course_title: createForm.course_title,
      max_participants: createForm.max_participants,
      is_online: createForm.is_online || false,
      meeting_url: createForm.meeting_url,
      tags: createForm.tags || [],
      priority: createForm.priority || 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setSchedules(prev => [newSchedule, ...prev])
    setShowCreateModal(false)
    setCreateForm({})
    fetchSchedules() // Refresh data
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSchedules = schedules.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(schedules.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Stats calculation
  const totalSchedules = schedules.length
  const scheduledCount = schedules.filter(s => s.status === 'scheduled').length
  const inProgressCount = schedules.filter(s => s.status === 'in_progress').length
  const completedCount = schedules.filter(s => s.status === 'completed').length
  const cancelledCount = schedules.filter(s => s.status === 'cancelled').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">일정 데이터를 불러오는 중...</p>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">일정 관리</h1>
          <p className="text-gray-600 mt-2">강의, 회의, 이벤트 일정을 관리하고 예약을 처리하세요</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateSchedule}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 일정 추가
          </button>
          <button
            onClick={() => {
              setCurrentPage(1)
              setSearchTerm('')
              setTypeFilter('all')
              setStatusFilter('all')
              fetchSchedules()
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            새로고침
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">총 일정</p>
            <p className="text-2xl font-bold text-gray-900">{totalSchedules}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full mr-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">예정</p>
            <p className="text-2xl font-bold text-gray-900">{scheduledCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <Video className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">진행중</p>
            <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">완료</p>
            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
          <div className="p-3 bg-red-100 rounded-full mr-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">취소</p>
            <p className="text-2xl font-bold text-gray-900">{cancelledCount}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="제목, 설명, 강사, 장소로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">모든 유형</option>
          <option value="lecture">강의</option>
          <option value="meeting">회의</option>
          <option value="event">이벤트</option>
          <option value="other">기타</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">모든 상태</option>
          <option value="scheduled">예정</option>
          <option value="in_progress">진행중</option>
          <option value="completed">완료</option>
          <option value="cancelled">취소</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm('')
            setTypeFilter('all')
            setStatusFilter('all')
            setCurrentPage(1)
          }}
          className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
        >
          <Filter className="w-5 h-5 inline-block mr-2" />
          필터 초기화
        </button>
      </div>

      {/* Schedule List Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  일정
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  일시
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  장소
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  강사/담당자
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  참가자
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{schedule.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{schedule.description}</div>
                      </div>
                      {schedule.priority === 'high' && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          긴급
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(schedule.type)}`}>
                      {getTypeText(schedule.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                      {getStatusText(schedule.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{formatDate(schedule.start_date)}</div>
                      <div className="text-gray-500">{schedule.start_time} - {schedule.end_time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {schedule.is_online ? (
                        <Video className="w-4 h-4 text-blue-500 mr-1" />
                      ) : (
                        <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                      )}
                      {schedule.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.instructor_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.max_participants ? 
                      `${schedule.current_participants || 0}/${schedule.max_participants}` : 
                      (schedule.current_participants || 0)
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(schedule)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule)}
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

        {/* Pagination */}
        <nav
          className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              총 <span className="font-medium">{schedules.length}</span>개 결과
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" /> 이전
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음 <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </nav>
      </div>

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">새 일정 추가</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSaveCreate(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={createForm.title || ''}
                      onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
                    <select
                      value={createForm.type || 'lecture'}
                      onChange={(e) => setCreateForm({...createForm, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="lecture">강의</option>
                      <option value="meeting">회의</option>
                      <option value="event">이벤트</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={createForm.description || ''}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시작일 <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={createForm.start_date || ''}
                      onChange={(e) => setCreateForm({...createForm, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                    <input
                      type="date"
                      value={createForm.end_date || ''}
                      onChange={(e) => setCreateForm({...createForm, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
                    <input
                      type="time"
                      value={createForm.start_time || ''}
                      onChange={(e) => setCreateForm({...createForm, start_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                    <input
                      type="time"
                      value={createForm.end_time || ''}
                      onChange={(e) => setCreateForm({...createForm, end_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">장소</label>
                    <input
                      type="text"
                      value={createForm.location || ''}
                      onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최대 참가자 수</label>
                    <input
                      type="number"
                      value={createForm.max_participants || ''}
                      onChange={(e) => setCreateForm({...createForm, max_participants: parseInt(e.target.value) || undefined})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">강사/담당자</label>
                    <input
                      type="text"
                      value={createForm.instructor_name || ''}
                      onChange={(e) => setCreateForm({...createForm, instructor_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                    <select
                      value={createForm.priority || 'medium'}
                      onChange={(e) => setCreateForm({...createForm, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={createForm.is_online || false}
                    onChange={(e) => setCreateForm({...createForm, is_online: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isOnline" className="ml-2 block text-sm text-gray-900">온라인 일정</label>
                </div>

                {createForm.is_online && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">회의 URL</label>
                    <input
                      type="url"
                      value={createForm.meeting_url || ''}
                      onChange={(e) => setCreateForm({...createForm, meeting_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    생성
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">일정 상세 정보</h3>
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
                    <p><strong>제목:</strong> {selectedSchedule.title}</p>
                    <p><strong>유형:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(selectedSchedule.type)}`}>
                      {getTypeText(selectedSchedule.type)}
                    </span></p>
                    <p><strong>상태:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedSchedule.status)}`}>
                      {getStatusText(selectedSchedule.status)}
                    </span></p>
                    <p><strong>우선순위:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedSchedule.priority)}`}>
                      {getPriorityText(selectedSchedule.priority)}
                    </span></p>
                  </div>
                  <div>
                    <p><strong>일시:</strong> {formatDateTime(selectedSchedule.start_date, selectedSchedule.start_time)}</p>
                    <p><strong>종료:</strong> {formatDateTime(selectedSchedule.end_date, selectedSchedule.end_time)}</p>
                    <p><strong>장소:</strong> {selectedSchedule.location}</p>
                    <p><strong>온라인:</strong> {selectedSchedule.is_online ? '예' : '아니오'}</p>
                  </div>
                </div>
                <div>
                  <p><strong>설명:</strong></p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-800">{selectedSchedule.description}</p>
                  </div>
                </div>
                {selectedSchedule.instructor_name && (
                  <div>
                    <p><strong>강사/담당자:</strong> {selectedSchedule.instructor_name}</p>
                  </div>
                )}
                {selectedSchedule.max_participants && (
                  <div>
                    <p><strong>참가자:</strong> {selectedSchedule.current_participants || 0}/{selectedSchedule.max_participants}명</p>
                  </div>
                )}
                {selectedSchedule.meeting_url && (
                  <div>
                    <p><strong>회의 URL:</strong> <a href={selectedSchedule.meeting_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedSchedule.meeting_url}</a></p>
                  </div>
                )}
                {selectedSchedule.tags && selectedSchedule.tags.length > 0 && (
                  <div>
                    <p><strong>태그:</strong></p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedSchedule.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Tag className="w-3 h-3 mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
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

      {/* Edit Schedule Modal */}
      {showEditModal && editingSchedule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">일정 수정</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
                    <select
                      value={editForm.type || 'lecture'}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="lecture">강의</option>
                      <option value="meeting">회의</option>
                      <option value="event">이벤트</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                    <input
                      type="date"
                      value={editForm.start_date || ''}
                      onChange={(e) => setEditForm({...editForm, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                    <input
                      type="date"
                      value={editForm.end_date || ''}
                      onChange={(e) => setEditForm({...editForm, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
                    <input
                      type="time"
                      value={editForm.start_time || ''}
                      onChange={(e) => setEditForm({...editForm, start_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                    <input
                      type="time"
                      value={editForm.end_time || ''}
                      onChange={(e) => setEditForm({...editForm, end_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">장소</label>
                    <input
                      type="text"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <select
                      value={editForm.status || 'scheduled'}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="scheduled">예정</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">강사/담당자</label>
                    <input
                      type="text"
                      value={editForm.instructor_name || ''}
                      onChange={(e) => setEditForm({...editForm, instructor_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                    <select
                      value={editForm.priority || 'medium'}
                      onChange={(e) => setEditForm({...editForm, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsOnline"
                    checked={editForm.is_online || false}
                    onChange={(e) => setEditForm({...editForm, is_online: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsOnline" className="ml-2 block text-sm text-gray-900">온라인 일정</label>
                </div>

                {editForm.is_online && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">회의 URL</label>
                    <input
                      type="url"
                      value={editForm.meeting_url || ''}
                      onChange={(e) => setEditForm({...editForm, meeting_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && editingSchedule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">일정 삭제</h3>
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
                      <strong>{editingSchedule.title}</strong> 일정이 영구적으로 삭제됩니다.
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    ⚠️ 이 작업은 되돌릴 수 없습니다. 일정과 관련된 모든 데이터가 삭제됩니다.
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

      {/* Admin Main Page Button */}
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
