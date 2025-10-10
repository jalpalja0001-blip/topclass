'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Home,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  X
} from 'lucide-react'

interface RevenueStats {
  totalRevenue: number
  monthlyRevenue: number
  dailyRevenue: number
  totalOrders: number
  averageOrderValue: number
  refundRate: number
  topSellingCourses: Array<{
    id: string
    title: string
    revenue: number
    orders: number
  }>
  monthlyTrend: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

interface Purchase {
  id: string
  user_id: string
  user_name: string
  user_email: string
  course_id: string
  course_title: string
  amount: number
  status: 'completed' | 'pending' | 'refunded' | 'cancelled'
  payment_method: string
  created_at: string
  updated_at: string
}

interface RevenueData {
  stats: RevenueStats
  purchases: Purchase[]
  total: number
  page: number
  limit: number
}

export default function RevenuePage() {
  const { user } = useAuth()
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const purchasesPerPage = 10

  useEffect(() => {
    fetchRevenueData()
  }, [currentPage, searchTerm, statusFilter, dateFilter, activeFilter])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      // 더미 매출 데이터 생성
      const dummyStats: RevenueStats = {
        totalRevenue: 125000000,
        monthlyRevenue: 18500000,
        dailyRevenue: 650000,
        totalOrders: 1247,
        averageOrderValue: 100240,
        refundRate: 2.3,
        topSellingCourses: [
          { id: 'course-1', title: 'AI 사진작가로 월300 버는 무료강의', revenue: 0, orders: 1234 },
          { id: 'course-2', title: '초보자도 추가 월급 벌기 무료강의', revenue: 0, orders: 987 },
          { id: 'course-3', title: 'AI쿠팡로켓 수익화 무료강의', revenue: 0, orders: 2156 },
          { id: 'course-4', title: 'Next.js 실전 프로젝트', revenue: 127500000, orders: 850 },
          { id: 'course-5', title: 'React 완벽 가이드', revenue: 86400000, orders: 720 },
        ],
        monthlyTrend: [
          { month: '1월', revenue: 12000000, orders: 120 },
          { month: '2월', revenue: 15000000, orders: 150 },
          { month: '3월', revenue: 18000000, orders: 180 },
          { month: '4월', revenue: 22000000, orders: 220 },
          { month: '5월', revenue: 25000000, orders: 250 },
          { month: '6월', revenue: 28000000, orders: 280 },
        ]
      }

      const dummyPurchases: Purchase[] = [
        {
          id: 'purchase-1',
          user_id: 'user-1',
          user_name: '김학생',
          user_email: 'student1@example.com',
          course_id: 'course-4',
          course_title: 'Next.js 실전 프로젝트',
          amount: 150000,
          status: 'completed',
          payment_method: '카드',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 'purchase-2',
          user_id: 'user-2',
          user_name: '이개발자',
          user_email: 'dev2@example.com',
          course_id: 'course-5',
          course_title: 'React 완벽 가이드',
          amount: 120000,
          status: 'completed',
          payment_method: '카드',
          created_at: '2024-01-14T14:20:00Z',
          updated_at: '2024-01-14T14:20:00Z'
        },
        {
          id: 'purchase-3',
          user_id: 'user-3',
          user_name: '박프론트',
          user_email: 'frontend3@example.com',
          course_id: 'course-6',
          course_title: 'UI/UX 디자인 기초',
          amount: 80000,
          status: 'completed',
          payment_method: '계좌이체',
          created_at: '2024-01-13T09:15:00Z',
          updated_at: '2024-01-13T09:15:00Z'
        },
        {
          id: 'purchase-4',
          user_id: 'user-4',
          user_name: '최마케터',
          user_email: 'marketer4@example.com',
          course_id: 'course-7',
          course_title: '디지털 마케팅 전략',
          amount: 95000,
          status: 'pending',
          payment_method: '카드',
          created_at: '2024-01-12T16:45:00Z',
          updated_at: '2024-01-12T16:45:00Z'
        },
        {
          id: 'purchase-5',
          user_id: 'user-5',
          user_name: '정데이터',
          user_email: 'data5@example.com',
          course_id: 'course-8',
          course_title: '파이썬 데이터 분석',
          amount: 130000,
          status: 'refunded',
          payment_method: '카드',
          created_at: '2024-01-11T11:30:00Z',
          updated_at: '2024-01-11T15:20:00Z'
        },
        {
          id: 'purchase-6',
          user_id: 'user-6',
          user_name: '한영상',
          user_email: 'video6@example.com',
          course_id: 'course-9',
          course_title: '영상 편집 마스터클래스',
          amount: 110000,
          status: 'completed',
          payment_method: '카드',
          created_at: '2024-01-10T13:20:00Z',
          updated_at: '2024-01-10T13:20:00Z'
        },
        {
          id: 'purchase-7',
          user_id: 'user-7',
          user_name: '윤비즈니스',
          user_email: 'biz7@example.com',
          course_id: 'course-10',
          course_title: '엑셀 실무 활용',
          amount: 70000,
          status: 'completed',
          payment_method: '계좌이체',
          created_at: '2024-01-09T08:10:00Z',
          updated_at: '2024-01-09T08:10:00Z'
        },
        {
          id: 'purchase-8',
          user_id: 'user-8',
          user_name: '조프로그래머',
          user_email: 'prog8@example.com',
          course_id: 'course-4',
          course_title: 'Next.js 실전 프로젝트',
          amount: 150000,
          status: 'cancelled',
          payment_method: '카드',
          created_at: '2024-01-08T12:00:00Z',
          updated_at: '2024-01-08T14:30:00Z'
        }
      ]

      let filteredPurchases = dummyPurchases

      // 검색어 필터링
      if (searchTerm) {
        filteredPurchases = filteredPurchases.filter(purchase =>
          purchase.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.course_title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // 상태 필터링
      if (statusFilter !== 'all') {
        filteredPurchases = filteredPurchases.filter(purchase => purchase.status === statusFilter)
      }

      // 날짜 필터링
      if (dateFilter !== 'all') {
        const now = new Date()
        const filterDate = new Date()
        
        switch (dateFilter) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setMonth(now.getMonth() - 1)
            break
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1)
            break
        }
        
        filteredPurchases = filteredPurchases.filter(purchase => 
          new Date(purchase.created_at) >= filterDate
        )
      }

      // 활성 필터 (통계 카드 클릭)
      if (activeFilter === 'completed') {
        filteredPurchases = filteredPurchases.filter(purchase => purchase.status === 'completed')
      } else if (activeFilter === 'pending') {
        filteredPurchases = filteredPurchases.filter(purchase => purchase.status === 'pending')
      } else if (activeFilter === 'refunded') {
        filteredPurchases = filteredPurchases.filter(purchase => purchase.status === 'refunded')
      }

      const totalPurchases = filteredPurchases.length
      const totalPages = Math.ceil(totalPurchases / purchasesPerPage)
      const startIndex = (currentPage - 1) * purchasesPerPage
      const endIndex = startIndex + purchasesPerPage
      const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex)

      setRevenueData({
        stats: dummyStats,
        purchases: paginatedPurchases,
        total: totalPurchases,
        page: currentPage,
        limit: purchasesPerPage,
      })

    } catch (err) {
      console.error('매출 데이터 로드 오류:', err)
      setError('매출 데이터를 불러오는 중 오류가 발생했습니다.')
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
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('ko-KR', options)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'refunded':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료'
      case 'pending':
        return '대기중'
      case 'refunded':
        return '환불됨'
      case 'cancelled':
        return '취소됨'
      default:
        return status
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePurchaseClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedPurchase(null)
  }

  const handleRefund = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setRefundReason('')
    setShowRefundModal(true)
  }

  const handleConfirmRefund = () => {
    if (!selectedPurchase) return

    console.log('환불 처리:', selectedPurchase.id, refundReason)

    // 실제로는 API 호출로 환불 처리
    setRevenueData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        purchases: prev.purchases.map(purchase =>
          purchase.id === selectedPurchase.id
            ? { ...purchase, status: 'refunded', updated_at: new Date().toISOString() }
            : purchase
        )
      }
    })

    setShowRefundModal(false)
    setSelectedPurchase(null)
    setRefundReason('')
  }

  const handleCardClick = (filterType: string) => {
    setActiveFilter(filterType)
    setCurrentPage(1)
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter('all')
  }

  const clearFilters = () => {
    setActiveFilter(null)
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter('all')
    setCurrentPage(1)
  }

  const exportRevenueData = () => {
    if (!revenueData) return
    
    // CSV 헤더 생성
    const headers = ['주문ID', '사용자명', '이메일', '강의명', '금액', '상태', '결제방법', '구매일']
    
    // CSV 데이터 생성
    const csvData = revenueData.purchases.map(purchase => [
      purchase.id,
      purchase.user_name,
      purchase.user_email,
      purchase.course_title,
      purchase.amount,
      getStatusText(purchase.status),
      purchase.payment_method,
      formatDate(purchase.created_at)
    ])
    
    // CSV 문자열 생성
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')
    
    // BOM 추가 (한글 깨짐 방지)
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // 파일 다운로드
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `매출데이터_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('매출 데이터 CSV 파일로 내보내기 완료')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">매출 데이터를 불러오는 중...</p>
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

  if (!revenueData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">매출 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const completedPurchases = revenueData.purchases.filter(p => p.status === 'completed').length
  const pendingPurchases = revenueData.purchases.filter(p => p.status === 'pending').length
  const refundedPurchases = revenueData.purchases.filter(p => p.status === 'refunded').length

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">매출 관리</h1>
          <p className="text-gray-600 mt-2">매출 현황을 확인하고 구매 내역을 관리하세요</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportRevenueData}
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            데이터 내보내기
          </button>
          <button
            onClick={() => {
              setCurrentPage(1)
              fetchRevenueData()
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            새로고침
          </button>
        </div>
      </div>

      {/* 매출 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'total' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => handleCardClick('total')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'total' ? 'bg-blue-200' : 'bg-blue-100'}`}>
              <DollarSign className={`w-6 h-6 ${activeFilter === 'total' ? 'text-blue-700' : 'text-blue-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'total' ? 'text-blue-700' : 'text-gray-600'}`}>
                총 매출
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'total' ? 'text-blue-900' : 'text-gray-900'}`}>
                {formatCurrency(revenueData.stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'completed' ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}
          onClick={() => handleCardClick('completed')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'completed' ? 'bg-green-200' : 'bg-green-100'}`}>
              <CheckCircle className={`w-6 h-6 ${activeFilter === 'completed' ? 'text-green-700' : 'text-green-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'completed' ? 'text-green-700' : 'text-gray-600'}`}>
                완료된 주문
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'completed' ? 'text-green-900' : 'text-gray-900'}`}>
                {completedPurchases}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'pending' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
          }`}
          onClick={() => handleCardClick('pending')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'pending' ? 'bg-yellow-200' : 'bg-yellow-100'}`}>
              <Clock className={`w-6 h-6 ${activeFilter === 'pending' ? 'text-yellow-700' : 'text-yellow-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'pending' ? 'text-yellow-700' : 'text-gray-600'}`}>
                대기중인 주문
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'pending' ? 'text-yellow-900' : 'text-gray-900'}`}>
                {pendingPurchases}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'refunded' ? 'ring-2 ring-red-500 bg-red-50' : ''
          }`}
          onClick={() => handleCardClick('refunded')}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activeFilter === 'refunded' ? 'bg-red-200' : 'bg-red-100'}`}>
              <XCircle className={`w-6 h-6 ${activeFilter === 'refunded' ? 'text-red-700' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${activeFilter === 'refunded' ? 'text-red-700' : 'text-gray-600'}`}>
                환불된 주문
              </p>
              <p className={`text-2xl font-bold ${activeFilter === 'refunded' ? 'text-red-900' : 'text-gray-900'}`}>
                {refundedPurchases}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">월간 매출</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.stats.monthlyRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 주문 금액</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.stats.averageOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">환불률</p>
              <p className="text-2xl font-bold text-gray-900">{revenueData.stats.refundRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {activeFilter && (activeFilter !== 'total') && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">현재 필터:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {activeFilter === 'completed' && '완료된 주문'}
                {activeFilter === 'pending' && '대기중인 주문'}
                {activeFilter === 'refunded' && '환불된 주문'}
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
                placeholder="사용자명, 이메일, 강의명으로 검색..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setActiveFilter(null)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setActiveFilter(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 상태</option>
              <option value="completed">완료</option>
              <option value="pending">대기중</option>
              <option value="refunded">환불됨</option>
              <option value="cancelled">취소됨</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setActiveFilter(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 기간</option>
              <option value="today">오늘</option>
              <option value="week">최근 7일</option>
              <option value="month">최근 30일</option>
              <option value="year">최근 1년</option>
            </select>
          </div>
        </div>
      </div>

      {/* 구매 내역 목록 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주문 정보
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  강의명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  결제일
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{purchase.id.slice(-8)}</div>
                    <div className="text-sm text-gray-500">{purchase.payment_method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{purchase.user_name}</div>
                    <div className="text-sm text-gray-500">{purchase.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{purchase.course_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(purchase.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(purchase.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handlePurchaseClick(purchase)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {purchase.status === 'completed' && (
                        <button
                          onClick={() => handleRefund(purchase)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="환불 처리"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {revenueData.total > purchasesPerPage && (
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                총 <span className="font-medium">{revenueData.total}</span>개 중{' '}
                <span className="font-medium">{(revenueData.page - 1) * revenueData.limit + 1}</span> -{' '}
                <span className="font-medium">{Math.min(revenueData.page * revenueData.limit, revenueData.total)}</span>개 표시
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => handlePageChange(revenueData.page - 1)}
                disabled={revenueData.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <button
                onClick={() => handlePageChange(revenueData.page + 1)}
                disabled={revenueData.page * revenueData.limit >= revenueData.total}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* 구매 상세 모달 */}
      {showDetailModal && selectedPurchase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">구매 상세 정보</h3>
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
                    <p><strong>주문 ID:</strong> {selectedPurchase.id}</p>
                    <p><strong>사용자명:</strong> {selectedPurchase.user_name}</p>
                    <p><strong>이메일:</strong> {selectedPurchase.user_email}</p>
                  </div>
                  <div>
                    <p><strong>강의명:</strong> {selectedPurchase.course_title}</p>
                    <p><strong>금액:</strong> {formatCurrency(selectedPurchase.amount)}</p>
                    <p><strong>결제 방법:</strong> {selectedPurchase.payment_method}</p>
                  </div>
                </div>
                <div>
                  <p><strong>상태:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedPurchase.status)}`}>
                    {getStatusText(selectedPurchase.status)}
                  </span></p>
                  <p><strong>구매일:</strong> {formatDate(selectedPurchase.created_at)}</p>
                  <p><strong>최종 수정일:</strong> {formatDate(selectedPurchase.updated_at)}</p>
                </div>
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

      {/* 환불 처리 모달 */}
      {showRefundModal && selectedPurchase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">환불 처리</h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>{selectedPurchase.user_name}</strong>님의 <strong>{selectedPurchase.course_title}</strong> 강의 구매를 환불 처리합니다.
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    환불 금액: <strong>{formatCurrency(selectedPurchase.amount)}</strong>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    환불 사유
                  </label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="환불 사유를 입력하세요"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmRefund}
                  disabled={!refundReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  환불 처리
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
