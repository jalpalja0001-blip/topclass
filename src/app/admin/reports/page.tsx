'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  DollarSign, 
  BookOpen, 
  TrendingUp,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  X,
  Printer,
  ArrowLeft,
} from 'lucide-react'

interface ReportData {
  id: string
  title: string
  type: 'user' | 'revenue' | 'course' | 'instructor'
  period: string
  createdAt: string
  status: 'completed' | 'processing' | 'failed'
  fileSize?: string
  downloadCount: number
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'user' | 'revenue' | 'course' | 'instructor'
  icon: any
  color: string
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'reports'>('templates')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [previewReport, setPreviewReport] = useState<ReportData | null>(null)

  // 리포트 템플릿
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'user-report',
      name: '사용자 리포트',
      description: '사용자 가입, 활동, 통계 데이터',
      type: 'user',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'revenue-report',
      name: '매출 리포트',
      description: '매출 통계, 구매 패턴, 수익 분석',
      type: 'revenue',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      id: 'course-report',
      name: '강의 리포트',
      description: '강의 성과, 수강률, 인기도 분석',
      type: 'course',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      id: 'instructor-report',
      name: '강사 리포트',
      description: '강사 성과, 수강생 만족도, 수익 분석',
      type: 'instructor',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  // 더미 리포트 데이터
  const dummyReports: ReportData[] = [
    {
      id: '1',
      title: '2024년 1월 사용자 리포트',
      type: 'user',
      period: '2024-01-01 ~ 2024-01-31',
      createdAt: '2024-01-31T10:30:00Z',
      status: 'completed',
      fileSize: '2.3MB',
      downloadCount: 15
    },
    {
      id: '2',
      title: '2024년 1월 매출 리포트',
      type: 'revenue',
      period: '2024-01-01 ~ 2024-01-31',
      createdAt: '2024-01-31T11:15:00Z',
      status: 'completed',
      fileSize: '1.8MB',
      downloadCount: 8
    },
    {
      id: '3',
      title: '2024년 1월 강의 리포트',
      type: 'course',
      period: '2024-01-01 ~ 2024-01-31',
      createdAt: '2024-01-31T12:00:00Z',
      status: 'completed',
      fileSize: '3.1MB',
      downloadCount: 12
    },
    {
      id: '4',
      title: '2024년 2월 사용자 리포트',
      type: 'user',
      period: '2024-02-01 ~ 2024-02-29',
      createdAt: '2024-02-29T09:45:00Z',
      status: 'processing',
      fileSize: undefined,
      downloadCount: 0
    },
    {
      id: '5',
      title: '2024년 2월 매출 리포트',
      type: 'revenue',
      period: '2024-02-01 ~ 2024-02-29',
      createdAt: '2024-02-29T10:20:00Z',
      status: 'failed',
      fileSize: undefined,
      downloadCount: 0
    }
  ]

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    try {
      // 실제 API 호출 대신 더미 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000))
      setReports(dummyReports)
    } catch (error) {
      console.error('리포트 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async (template: ReportTemplate) => {
    setIsGenerating(true)
    try {
      // 리포트 생성 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `${new Date().toLocaleDateString('ko-KR')} ${template.name}`,
        type: template.type,
        period: getPeriodString(selectedPeriod),
        createdAt: new Date().toISOString(),
        status: 'completed',
        fileSize: `${(Math.random() * 5 + 1).toFixed(1)}MB`,
        downloadCount: 0
      }
      
      setReports(prev => [newReport, ...prev])
      alert(`${template.name}이 성공적으로 생성되었습니다!`)
    } catch (error) {
      console.error('리포트 생성 실패:', error)
      alert('리포트 생성에 실패했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getPeriodString = (period: string) => {
    const now = new Date()
    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return `${weekAgo.toLocaleDateString('ko-KR')} ~ ${now.toLocaleDateString('ko-KR')}`
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return `${monthAgo.toLocaleDateString('ko-KR')} ~ ${now.toLocaleDateString('ko-KR')}`
      case 'quarter':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        return `${quarterAgo.toLocaleDateString('ko-KR')} ~ ${now.toLocaleDateString('ko-KR')}`
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        return `${yearAgo.toLocaleDateString('ko-KR')} ~ ${now.toLocaleDateString('ko-KR')}`
      default:
        return '전체 기간'
    }
  }

  const handleDownload = (report: ReportData) => {
    // CSV 데이터 생성
    const csvData = generateCSVData(report)
    
    // CSV 파일 다운로드
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${report.title}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 다운로드 횟수 증가
    setReports(prev => prev.map(r => 
      r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
    ))
  }

  const handlePreview = (report: ReportData) => {
    setPreviewReport(report)
    setShowPreview(true)
  }

  const generateCSVData = (report: ReportData) => {
    const headers = getReportHeaders(report.type)
    const data = getReportData(report.type)
    
    let csvContent = headers.join(',') + '\n'
    data.forEach(row => {
      csvContent += row.join(',') + '\n'
    })
    
    return csvContent
  }

  const getReportHeaders = (type: string) => {
    switch (type) {
      case 'user':
        return ['사용자ID', '이름', '이메일', '가입일', '마지막 로그인', '상태', '구매 횟수']
      case 'revenue':
        return ['구매ID', '사용자', '강의명', '금액', '구매일', '상태', '결제방법']
      case 'course':
        return ['강의ID', '강의명', '강사', '카테고리', '수강생 수', '평점', '수익']
      case 'instructor':
        return ['강사ID', '이름', '이메일', '강의 수', '총 수강생', '평균 평점', '총 수익']
      default:
        return ['항목', '값']
    }
  }

  const getReportData = (type: string) => {
    switch (type) {
      case 'user':
        return [
          ['U001', '김철수', 'kim@example.com', '2024-01-15', '2024-02-28', '활성', '3'],
          ['U002', '이영희', 'lee@example.com', '2024-01-20', '2024-02-27', '활성', '1'],
          ['U003', '박민수', 'park@example.com', '2024-02-01', '2024-02-25', '비활성', '0'],
          ['U004', '정수진', 'jung@example.com', '2024-02-10', '2024-02-28', '활성', '2'],
          ['U005', '최동현', 'choi@example.com', '2024-02-15', '2024-02-26', '활성', '1']
        ]
      case 'revenue':
        return [
          ['P001', '김철수', 'AI 사진작가 강의', '0', '2024-01-20', '완료', '무료'],
          ['P002', '이영희', '추가 월급 벌기 강의', '0', '2024-01-25', '완료', '무료'],
          ['P003', '박민수', 'AI쿠팡로켓 강의', '0', '2024-02-05', '완료', '무료'],
          ['P004', '정수진', '해외구매대행 강의', '0', '2024-02-12', '완료', '무료'],
          ['P005', '최동현', '소개부업 강의', '0', '2024-02-18', '완료', '무료']
        ]
      case 'course':
        return [
          ['C001', 'AI 사진작가 강의', '파파준스', '무료강의', '1234', '4.8', '0'],
          ['C002', '추가 월급 벌기 강의', '내일은편하게', '무료강의', '987', '4.6', '0'],
          ['C003', 'AI쿠팡로켓 강의', '광마', '무료강의', '2156', '4.7', '0'],
          ['C004', '해외구매대행 강의', '홍시삼분', '무료강의', '856', '4.5', '0'],
          ['C005', '소개부업 강의', '현우', '무료강의', '642', '4.4', '0']
        ]
      case 'instructor':
        return [
          ['I001', '파파준스', 'papa@example.com', '1', '1234', '4.8', '0'],
          ['I002', '내일은편하게', 'tomorrow@example.com', '1', '987', '4.6', '0'],
          ['I003', '광마', 'gwangma@example.com', '1', '2156', '4.7', '0'],
          ['I004', '홍시삼분', 'hongsi@example.com', '1', '856', '4.5', '0'],
          ['I005', '현우', 'hyunwoo@example.com', '1', '642', '4.4', '0']
        ]
      default:
        return [['데이터', '없음']]
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료'
      case 'processing': return '생성 중'
      case 'failed': return '실패'
      default: return '알 수 없음'
    }
  }

  const filteredReports = reports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">리포트를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리포트 생성</h1>
          <p className="text-gray-600">다양한 리포트를 생성하고 다운로드하세요</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchReports}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            리포트 템플릿
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            생성된 리포트 ({reports.length})
          </button>
        </nav>
      </div>

      {/* 리포트 템플릿 탭 */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* 기간 선택 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">리포트 기간 선택</h3>
            <div className="flex space-x-4">
              {[
                { value: 'week', label: '최근 1주일' },
                { value: 'month', label: '최근 1개월' },
                { value: 'quarter', label: '최근 3개월' },
                { value: 'year', label: '최근 1년' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    value={option.value}
                    checked={selectedPeriod === option.value}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 템플릿 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon
              return (
                <div key={template.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${template.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        기간: {getPeriodString(selectedPeriod)}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleGenerateReport(template)}
                      disabled={isGenerating}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          생성 중...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          리포트 생성
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 생성된 리포트 탭 */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* 필터 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">타입:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">전체</option>
                  <option value="user">사용자</option>
                  <option value="revenue">매출</option>
                  <option value="course">강의</option>
                  <option value="instructor">강사</option>
                </select>
              </div>
            </div>
          </div>

          {/* 리포트 목록 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      리포트명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      타입
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      기간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      파일 크기
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      다운로드
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {reportTemplates.find(t => t.type === report.type)?.name || report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.fileSize || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.downloadCount}회
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePreview(report)}
                            className="text-blue-600 hover:text-blue-900"
                            title="미리보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(report)}
                            disabled={report.status !== 'completed'}
                            className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                            title="다운로드"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">생성된 리포트가 없습니다</h3>
              <p className="text-gray-500">리포트 템플릿에서 새로운 리포트를 생성해보세요.</p>
            </div>
          )}
        </div>
      )}

      {/* 관리자 메인페이지로 돌아가기 버튼 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.location.href = '/admin'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          관리자 메인페이지
        </button>
      </div>

      {/* 미리보기 모달 */}
      {showPreview && previewReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">{previewReport.title} 미리보기</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(previewReport)}
                    className="px-3 py-1 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    다운로드
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* 리포트 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">타입:</span>
                      <p className="text-gray-600">{reportTemplates.find(t => t.type === previewReport.type)?.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">기간:</span>
                      <p className="text-gray-600">{previewReport.period}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">파일 크기:</span>
                      <p className="text-gray-600">{previewReport.fileSize || '-'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">다운로드:</span>
                      <p className="text-gray-600">{previewReport.downloadCount}회</p>
                    </div>
                  </div>
                </div>

                {/* 데이터 테이블 */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {getReportHeaders(previewReport.type).map((header, index) => (
                            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getReportData(previewReport.type).map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 통계 요약 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">총 레코드</p>
                        <p className="text-2xl font-bold text-blue-600">{getReportData(previewReport.type).length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <PieChart className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-900">데이터 타입</p>
                        <p className="text-lg font-bold text-green-600">{previewReport.type.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <LineChart className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-900">생성일</p>
                        <p className="text-sm font-bold text-purple-600">
                          {new Date(previewReport.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  닫기
                </button>
                <button
                  onClick={() => handleDownload(previewReport)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSV 다운로드
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
