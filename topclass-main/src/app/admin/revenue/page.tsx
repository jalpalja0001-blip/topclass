'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Calendar,
  CreditCard,
  Home,
  BarChart,
  PieChart,
  LineChart,
  Download
} from 'lucide-react'

interface RevenueStats {
  overview: {
    totalRevenue: number
    monthlyRevenue: number
    weeklyRevenue: number
    dailyRevenue: number
    totalTransactions: number
    averageOrderValue: number
    refundRate: number
  }
  revenueByCategory: Array<{
    category: string
    revenue: number
    percentage: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    transactions: number
  }>
  topCourses: Array<{
    id: string
    title: string
    revenue: number
    sales: number
    instructor: string
  }>
  recentTransactions: Array<{
    id: string
    date: string
    amount: number
    course: string
    user: string
    status: 'completed' | 'pending' | 'refunded'
  }>
}

export default function RevenuePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<RevenueStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?.email) {
          setError('로그인이 필요합니다.')
          setLoading(false)
          return
        }

        // 임시 데이터
        const dummyStats: RevenueStats = {
          overview: {
            totalRevenue: 15678900,
            monthlyRevenue: 2345678,
            weeklyRevenue: 567890,
            dailyRevenue: 123456,
            totalTransactions: 234,
            averageOrderValue: 67890,
            refundRate: 2.5
          },
          revenueByCategory: [
            { category: '무료강의', revenue: 0, percentage: 0 },
            { category: '프로그래밍', revenue: 7890000, percentage: 50.3 },
            { category: '디자인', revenue: 4567890, percentage: 29.1 },
            { category: '마케팅', revenue: 3221010, percentage: 20.6 }
          ],
          revenueByMonth: [
            { month: '2024-01', revenue: 2345678, transactions: 45 },
            { month: '2024-02', revenue: 3456789, transactions: 67 },
            { month: '2024-03', revenue: 4567890, transactions: 89 }
          ],
          topCourses: [
            {
              id: 'course-1',
              title: 'Next.js 완벽 가이드',
              revenue: 2345678,
              sales: 45,
              instructor: '최강사'
            },
            {
              id: 'course-2',
              title: 'React 심화 과정',
              revenue: 1234567,
              sales: 23,
              instructor: '정강사'
            },
            {
              id: 'course-3',
              title: 'Figma 디자인 마스터',
              revenue: 987654,
              sales: 18,
              instructor: '한강사'
            }
          ],
          recentTransactions: [
            {
              id: 'tx-1',
              date: '2024-03-15T10:30:00Z',
              amount: 80000,
              course: 'Next.js 완벽 가이드',
              user: 'user1@example.com',
              status: 'completed'
            },
            {
              id: 'tx-2',
              date: '2024-03-15T09:15:00Z',
              amount: 60000,
              course: 'React 심화 과정',
              user: 'user2@example.com',
              status: 'completed'
            },
            {
              id: 'tx-3',
              date: '2024-03-14T16:45:00Z',
              amount: 50000,
              course: 'Figma 디자인 마스터',
              user: 'user3@example.com',
              status: 'refunded'
            }
          ]
        }

        setStats(dummyStats)
        setLoading(false)
      } catch (error) {
        console.error('매출 통계 로드 오류:', error)
        setError('매출 통계를 불러오는 중 오류가 발생했습니다.')
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.email])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '완료'
      case 'pending': return '대기'
      case 'refunded': return '환불'
      default: return '알 수 없음'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">매출 통계를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오류가 발생했습니다</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">매출 관리</h1>
          <p className="text-gray-600 mt-2">매출 현황과 거래 내역을 관리하세요</p>
        </div>
        <button
          onClick={() => console.log('매출 보고서 다운로드')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          매출 보고서 다운로드
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 매출</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overview.totalRevenue)}</p>
              <p className="text-sm text-green-600">+{formatCurrency(stats.overview.monthlyRevenue)} 이번 달</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">거래 건수</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalTransactions.toLocaleString()}건</p>
              <p className="text-sm text-gray-600">평균 {formatCurrency(stats.overview.averageOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">일일 매출</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overview.dailyRevenue)}</p>
              <p className="text-sm text-green-600">+{formatCurrency(stats.overview.weeklyRevenue)} 이번 주</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">환불률</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.refundRate}%</p>
              <p className="text-sm text-gray-600">전월 대비 -0.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리별 매출 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 매출</h2>
        <div className="space-y-4">
          {stats.revenueByCategory.map((category, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm text-gray-600">{category.category}</div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-32 text-right">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(category.revenue)}</div>
                <div className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 인기 강의 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">인기 강의 TOP 3</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강의명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강사</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매량</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">매출</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topCourses.map((course, index) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.sales}명</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(course.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 거래 내역 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 거래 내역</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">거래 ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강의</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구매자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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