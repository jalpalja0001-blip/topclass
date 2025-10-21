'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  Mail,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  AlertTriangle,
  Home
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'admin' | 'instructor' | 'user'
  is_active: boolean
  created_at: string
  last_login?: string
  purchase_count?: number
  total_spent?: number
  memo?: string
}

interface UsersData {
  users: User[]
  total: number
  page: number
  totalPages: number
}

export default function UsersPage() {
  const { user } = useAuth()
  const [usersData, setUsersData] = useState<UsersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    role: 'user' as 'admin' | 'instructor' | 'user',
    is_active: true
  })

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter, statusFilter, activeFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      if (!user?.email) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      // 실제 API 호출로 사용자 데이터 가져오기
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || '사용자 데이터를 가져오는데 실패했습니다.')
      }

      const allUsers = data.users || []

      // 필터링 적용
      let filteredUsers = allUsers

      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter)
      }

      if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          statusFilter === 'active' ? user.is_active : !user.is_active
        )
      }

      // 페이지네이션
      const itemsPerPage = 10
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

      setUsersData({
        users: paginatedUsers,
        total: filteredUsers.length,
        page: currentPage,
        totalPages: Math.ceil(filteredUsers.length / itemsPerPage)
      })

    } catch (error) {
      console.error('사용자 목록 로드 오류:', error)
      setError('사용자 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'instructor': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자'
      case 'instructor': return '강사'
      case 'user': return '사용자'
      default: return '사용자'
    }
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleCloseModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  const handleCardClick = (filterType: string) => {
    setActiveFilter(filterType)
    setCurrentPage(1)
    
    switch (filterType) {
      case 'total':
        setRoleFilter('all')
        setStatusFilter('all')
        setSearchTerm('')
        break
      case 'active':
        setRoleFilter('all')
        setStatusFilter('active')
        setSearchTerm('')
        break
      case 'admin':
        setRoleFilter('admin')
        setStatusFilter('all')
        setSearchTerm('')
        break
      case 'instructor':
        setRoleFilter('instructor')
        setStatusFilter('all')
        setSearchTerm('')
        break
    }
  }

  const clearFilters = () => {
    setActiveFilter(null)
    setRoleFilter('all')
    setStatusFilter('all')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      full_name: user.full_name || '',
      email: user.email,
      role: user.role,
      is_active: user.is_active
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    
    try {
      console.log('사용자 정보 업데이트:', editingUser.id, editForm)
      
      // 실제 API 호출로 사용자 정보 업데이트
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editingUser.id,
          updates: {
            name: editForm.full_name,
            email: editForm.email,
            role: editForm.role,
            is_active: editForm.is_active
          }
        })
      })

      const result = await response.json()
      
      console.log('🔍 API 응답 디버깅:', {
        status: response.status,
        ok: response.ok,
        result: result
      })
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || '사용자 정보 업데이트에 실패했습니다.')
      }

      console.log('✅ 사용자 정보 업데이트 성공:', result)

      // 로컬 상태 업데이트
      setUsersData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          users: prev.users.map(user => 
            user.id === editingUser.id 
              ? { ...user, ...editForm }
              : user
          )
        }
      })
      
      setShowEditModal(false)
      setEditingUser(null)
      
      // 성공 메시지 표시
      alert('사용자 정보가 성공적으로 업데이트되었습니다.')
      
    } catch (error) {
      console.error('❌ 사용자 정보 업데이트 오류:', error)
      alert('사용자 정보 업데이트 중 오류가 발생했습니다: ' + (error as Error).message)
    }
  }


  const handleDeleteUser = (user: User) => {
    setEditingUser(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingUser) return
    
    try {
      console.log('사용자 삭제:', editingUser.id)
      
      // 실제 API 호출로 사용자 삭제
      const response = await fetch(`/api/admin/users?userId=${editingUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || '사용자 삭제에 실패했습니다.')
      }

      console.log('✅ 사용자 삭제 성공:', result)

      // 로컬 상태에서 제거
      setUsersData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          users: prev.users.filter(user => user.id !== editingUser.id),
          total: prev.total - 1
        }
      })
      
      setShowDeleteModal(false)
      setEditingUser(null)
      
      // 성공 메시지 표시
      alert('사용자가 성공적으로 삭제되었습니다.')
      
    } catch (error) {
      console.error('❌ 사용자 삭제 오류:', error)
      alert('사용자 삭제 중 오류가 발생했습니다: ' + (error as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-gray-600 mt-2">전체 사용자를 관리하고 권한을 설정하세요</p>
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
              <Users className={`w-6 h-6 ${activeFilter === 'total' ? 'text-blue-700' : 'text-blue-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'total' ? 'text-blue-700' : 'text-gray-600'}`}>
                총 사용자
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'total' ? 'text-blue-900' : 'text-gray-900'}`}>
                {usersData?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div 
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'active' ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}
          onClick={() => handleCardClick('active')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'active' ? 'bg-green-200' : 'bg-green-100'}`}>
              <Activity className={`w-6 h-6 ${activeFilter === 'active' ? 'text-green-700' : 'text-green-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'active' ? 'text-green-700' : 'text-gray-600'}`}>
                활성 사용자
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'active' ? 'text-green-900' : 'text-gray-900'}`}>
                {usersData?.users.filter(u => u.is_active).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div 
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'admin' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
          }`}
          onClick={() => handleCardClick('admin')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'admin' ? 'bg-purple-200' : 'bg-purple-100'}`}>
              <Shield className={`w-6 h-6 ${activeFilter === 'admin' ? 'text-purple-700' : 'text-purple-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'admin' ? 'text-purple-700' : 'text-gray-600'}`}>
                관리자
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'admin' ? 'text-purple-900' : 'text-gray-900'}`}>
                {usersData?.users.filter(u => u.role === 'admin').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div 
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'instructor' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
          }`}
          onClick={() => handleCardClick('instructor')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'instructor' ? 'bg-orange-200' : 'bg-orange-100'}`}>
              <Users className={`w-6 h-6 ${activeFilter === 'instructor' ? 'text-orange-700' : 'text-orange-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'instructor' ? 'text-orange-700' : 'text-gray-600'}`}>
                강사
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'instructor' ? 'text-orange-900' : 'text-gray-900'}`}>
                {usersData?.users.filter(u => u.role === 'instructor').length || 0}
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
                {activeFilter === 'total' && '총 사용자'}
                {activeFilter === 'active' && '활성 사용자'}
                {activeFilter === 'admin' && '관리자'}
                {activeFilter === 'instructor' && '강사'}
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
                placeholder="이메일 또는 이름으로 검색..."
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
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setActiveFilter(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 역할</option>
              <option value="admin">관리자</option>
              <option value="instructor">강사</option>
              <option value="user">사용자</option>
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
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  구매 내역
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마지막 로그인
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData?.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.full_name && user.full_name !== user.email 
                              ? user.full_name.charAt(0).toUpperCase() 
                              : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name && user.full_name !== user.email ? user.full_name : '이름 없음'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{user.purchase_count || 0}건</div>
                      <div className="text-gray-500">{formatCurrency(user.total_spent || 0)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? formatDate(user.last_login) : '없음'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUserClick(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user)}
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
        {usersData && usersData.totalPages > 1 && (
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
                onClick={() => setCurrentPage(Math.min(usersData.totalPages, currentPage + 1))}
                disabled={currentPage === usersData.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  총 <span className="font-medium">{usersData.total}</span>명 중{' '}
                  <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>-
                  <span className="font-medium">
                    {Math.min(currentPage * 10, usersData.total)}
                  </span>
                  명 표시
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
                  {Array.from({ length: usersData.totalPages }, (_, i) => i + 1).map((page) => (
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
                    onClick={() => setCurrentPage(Math.min(usersData.totalPages, currentPage + 1))}
                    disabled={currentPage === usersData.totalPages}
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

      {/* 사용자 상세 모달 */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">사용자 상세 정보</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.full_name || '이름 없음'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">이메일</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">역할</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                    {getRoleLabel(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">상태</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.is_active ? '활성' : '비활성'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">가입일</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">마지막 로그인</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.last_login ? formatDate(selectedUser.last_login) : '없음'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">구매 내역</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.purchase_count || 0}건 ({formatCurrency(selectedUser.total_spent || 0)})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">메모</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.memo || '메모가 없습니다.'}
                  </p>
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

      {/* 사용자 수정 모달 */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">사용자 정보 수정</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">이메일</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">역할</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'instructor' | 'user'})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="user">사용자</option>
                    <option value="instructor">강사</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    활성 계정
                  </label>
                </div>
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
      {showDeleteModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">사용자 삭제</h3>
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
                      <strong>{editingUser.full_name || editingUser.email}</strong>의 계정이 영구적으로 삭제됩니다.
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    ⚠️ 이 작업은 되돌릴 수 없습니다. 사용자의 모든 데이터가 삭제됩니다.
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
