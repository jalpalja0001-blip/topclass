'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Eye,
  Star,
  Clock,
  UserCheck,
  UserX,
  ShoppingCart,
  CreditCard,
  FileText,
  Home,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

// --- Interfaces for Analytics ---
interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    monthlyRevenue: number
    totalCourses: number
    publishedCourses: number
    totalInstructors: number
    activeInstructors: number
  }
  userAnalytics: {
    newUsers: { date: string; count: number }[]
    userGrowth: number
    retentionRate: number
    userSatisfaction: number
  }
  revenueAnalytics: {
    dailyRevenue: { date: string; amount: number }[]
    monthlyRevenue: { month: string; amount: number }[]
    revenueGrowth: number
    averageOrderValue: number
    topSellingCourses: { course: string; revenue: number }[]
  }
  courseAnalytics: {
    courseViews: { course: string; views: number }[]
    courseCompletions: { course: string; completions: number }[]
    averageRating: number
    totalLessons: number
    completedLessons: number
  }
  instructorAnalytics: {
    instructorPerformance: { instructor: string; students: number; rating: number }[]
    averageRating: number
    totalStudents: number
  }
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    setError(null)

    if (!user) {
      setError('로그인이 필요합니다.')
      setLoading(false)
      return
    }

    // Simulate API call with dummy data
    await new Promise(resolve => setTimeout(resolve, 1000))

    const dummyData: AnalyticsData = {
      overview: {
        totalUsers: 1250,
        activeUsers: 890,
        totalRevenue: 15750000,
        monthlyRevenue: 3200000,
        totalCourses: 45,
        publishedCourses: 38,
        totalInstructors: 12,
        activeInstructors: 10
      },
      userAnalytics: {
        newUsers: [
          { date: '2024-01-01', count: 15 },
          { date: '2024-01-02', count: 23 },
          { date: '2024-01-03', count: 18 },
          { date: '2024-01-04', count: 31 },
          { date: '2024-01-05', count: 27 },
          { date: '2024-01-06', count: 35 },
          { date: '2024-01-07', count: 42 },
          { date: '2024-01-08', count: 38 },
          { date: '2024-01-09', count: 29 },
          { date: '2024-01-10', count: 33 },
          { date: '2024-01-11', count: 41 },
          { date: '2024-01-12', count: 37 },
          { date: '2024-01-13', count: 44 },
          { date: '2024-01-14', count: 39 },
          { date: '2024-01-15', count: 46 }
        ],
        userGrowth: 12.5,
        retentionRate: 78.3,
        userSatisfaction: 4.6
      },
      revenueAnalytics: {
        dailyRevenue: [
          { date: '2024-01-01', amount: 120000 },
          { date: '2024-01-02', amount: 150000 },
          { date: '2024-01-03', amount: 98000 },
          { date: '2024-01-04', amount: 180000 },
          { date: '2024-01-05', amount: 210000 },
          { date: '2024-01-06', amount: 165000 },
          { date: '2024-01-07', amount: 195000 },
          { date: '2024-01-08', amount: 220000 },
          { date: '2024-01-09', amount: 175000 },
          { date: '2024-01-10', amount: 190000 },
          { date: '2024-01-11', amount: 205000 },
          { date: '2024-01-12', amount: 180000 },
          { date: '2024-01-13', amount: 230000 },
          { date: '2024-01-14', amount: 195000 },
          { date: '2024-01-15', amount: 250000 }
        ],
        monthlyRevenue: [
          { month: '2023-10', amount: 2800000 },
          { month: '2023-11', amount: 3100000 },
          { month: '2023-12', amount: 2900000 },
          { month: '2024-01', amount: 3200000 }
        ],
        revenueGrowth: 8.7,
        averageOrderValue: 125000,
        topSellingCourses: [
          { course: 'React 완벽 가이드', revenue: 2500000 },
          { course: 'Next.js 실전 프로젝트', revenue: 1800000 },
          { course: 'TypeScript 마스터', revenue: 1500000 },
          { course: 'Node.js 백엔드 개발', revenue: 1200000 },
          { course: 'AWS 클라우드 아키텍처', revenue: 1000000 }
        ]
      },
      courseAnalytics: {
        courseViews: [
          { course: 'React 완벽 가이드', views: 1250 },
          { course: 'Next.js 실전 프로젝트', views: 980 },
          { course: 'TypeScript 마스터', views: 850 },
          { course: 'Node.js 백엔드 개발', views: 720 },
          { course: 'AWS 클라우드 아키텍처', views: 650 }
        ],
        courseCompletions: [
          { course: 'React 완벽 가이드', completions: 180 },
          { course: 'Next.js 실전 프로젝트', completions: 145 },
          { course: 'TypeScript 마스터', completions: 120 },
          { course: 'Node.js 백엔드 개발', completions: 95 },
          { course: 'AWS 클라우드 아키텍처', completions: 80 }
        ],
        averageRating: 4.6,
        totalLessons: 320,
        completedLessons: 245
      },
      instructorAnalytics: {
        instructorPerformance: [
          { instructor: '김개발자', students: 450, rating: 4.8 },
          { instructor: '이넥스트', students: 380, rating: 4.7 },
          { instructor: '박타입스크립트', students: 320, rating: 4.9 },
          { instructor: '최노드', students: 280, rating: 4.6 },
          { instructor: '정AWS', students: 250, rating: 4.5 }
        ],
        averageRating: 4.7,
        totalStudents: 1680
      }
    }

    setAnalyticsData(dummyData)
    setLoading(false)
  }

  // --- Utility Functions ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  }

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const handleExportReport = () => {
    console.log('리포트 내보내기:', exportFormat)
    // 실제로는 PDF 또는 Excel 파일 생성
    alert(`${exportFormat.toUpperCase()} 형태로 리포트가 생성되었습니다!`)
    setShowExportModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">분석 데이터를 불러오는 중...</p>
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

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">분석 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">분석 및 리포트</h1>
          <p className="text-gray-600 mt-2">사용자 행동, 매출, 강의 성과를 분석하고 리포트를 생성하세요</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
            <option value="90d">최근 90일</option>
            <option value="1y">최근 1년</option>
          </select>
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            리포트 내보내기
          </button>
          <button
            onClick={() => fetchAnalyticsData()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            새로고침
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: '개요', icon: BarChart3 },
            { id: 'users', name: '사용자 분석', icon: Users },
            { id: 'revenue', name: '매출 분석', icon: DollarSign },
            { id: 'courses', name: '강의 분석', icon: BookOpen },
            { id: 'instructors', name: '강사 분석', icon: UserCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">총 사용자</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalUsers)}</p>
                  <div className="flex items-center mt-1">
                    {getGrowthIcon(analyticsData.userAnalytics.userGrowth)}
                    <span className={`text-sm ${getGrowthColor(analyticsData.userAnalytics.userGrowth)}`}>
                      {formatPercentage(analyticsData.userAnalytics.userGrowth)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">총 매출</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                  <div className="flex items-center mt-1">
                    {getGrowthIcon(analyticsData.revenueAnalytics.revenueGrowth)}
                    <span className={`text-sm ${getGrowthColor(analyticsData.revenueAnalytics.revenueGrowth)}`}>
                      {formatPercentage(analyticsData.revenueAnalytics.revenueGrowth)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">총 강의</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalCourses}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    발행됨: {analyticsData.overview.publishedCourses}개
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <UserCheck className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">활성 강사</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeInstructors}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    총 {analyticsData.overview.totalInstructors}명
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">신규 사용자 추이</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {selectedPeriod}
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">차트 영역</p>
                  <p className="text-sm text-gray-400">실제 구현 시 Chart.js 또는 Recharts 사용</p>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">일별 매출</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {formatCurrency(analyticsData.revenueAnalytics.averageOrderValue)} 평균
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">차트 영역</p>
                  <p className="text-sm text-gray-400">실제 구현 시 Chart.js 또는 Recharts 사용</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">사용자 만족도</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.userAnalytics.userSatisfaction}/5.0</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">사용자 유지율</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.userAnalytics.retentionRate}%</p>
                </div>
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">강의 완료율</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((analyticsData.courseAnalytics.completedLessons / analyticsData.courseAnalytics.totalLessons) * 100)}%
                  </p>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 성장 추이</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">사용자 성장 차트</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 유형 분포</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">사용자 유형 파이차트</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">사용자 활동 분석</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{analyticsData.overview.activeUsers}</div>
                  <div className="text-sm text-gray-600">활성 사용자</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analyticsData.userAnalytics.retentionRate}%</div>
                  <div className="text-sm text-gray-600">유지율</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{analyticsData.userAnalytics.userSatisfaction}/5</div>
                  <div className="text-sm text-gray-600">만족도</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {selectedTab === 'revenue' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">매출 추이</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">매출 추이 차트</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">월별 매출</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">월별 매출 차트</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">인기 강의 매출</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.revenueAnalytics.topSellingCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{course.course}</div>
                        <div className="text-sm text-gray-500">강의</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(course.revenue)}</div>
                      <div className="text-sm text-gray-500">매출</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {selectedTab === 'courses' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">강의 조회수</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">강의 조회수 차트</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">강의 완료율</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">강의 완료율 차트</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">강의 성과 분석</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">인기 강의 (조회수)</h4>
                  <div className="space-y-3">
                    {analyticsData.courseAnalytics.courseViews.map((course, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{course.course}</span>
                        <span className="text-sm font-medium text-gray-900">{formatNumber(course.views)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">완료율 높은 강의</h4>
                  <div className="space-y-3">
                    {analyticsData.courseAnalytics.courseCompletions.map((course, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{course.course}</span>
                        <span className="text-sm font-medium text-gray-900">{course.completions}명</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructors Tab */}
      {selectedTab === 'instructors' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">강사 성과 분석</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.instructorAnalytics.instructorPerformance.map((instructor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{instructor.instructor}</div>
                        <div className="text-sm text-gray-500">강사</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-medium text-gray-900">{instructor.students}</div>
                        <div className="text-sm text-gray-500">학생 수</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-lg font-medium text-gray-900">{instructor.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">평점</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-blue-600">{analyticsData.instructorAnalytics.averageRating}</div>
              <div className="text-sm text-gray-600 mt-1">평균 평점</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-green-600">{formatNumber(analyticsData.instructorAnalytics.totalStudents)}</div>
              <div className="text-sm text-gray-600 mt-1">총 학생 수</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-purple-600">{analyticsData.overview.activeInstructors}</div>
              <div className="text-sm text-gray-600 mt-1">활성 강사</div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">리포트 내보내기</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">파일 형식</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="7d">최근 7일</option>
                    <option value="30d">최근 30일</option>
                    <option value="90d">최근 90일</option>
                    <option value="1y">최근 1년</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleExportReport}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  내보내기
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
