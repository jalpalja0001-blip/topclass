'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  Settings,
  Save,
  RefreshCw,
  Home,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Plus,
  Edit,
  Globe,
  Users,
  BookOpen,
  CreditCard,
  Mail,
  Shield,
  Info,
  Bell,
  Lock,
  Key,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Cloud,
  Zap,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'

// --- Interfaces for Settings ---
interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  logo: string
  favicon: string
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  currency: string
  dateFormat: string
  timeFormat: '12h' | '24h'
}

interface UserSettings {
  allowRegistration: boolean
  requireEmailVerification: boolean
  allowSocialLogin: boolean
  maxUsers: number
  userRoles: string[]
  defaultRole: string
  sessionTimeout: number
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSymbols: boolean
  }
}

interface CourseSettings {
  allowCourseCreation: boolean
  requireApproval: boolean
  maxCoursesPerInstructor: number
  courseCategories: string[]
  defaultCategory: string
  allowComments: boolean
  allowReviews: boolean
  maxFileSize: number
  allowedFileTypes: string[]
}

interface PaymentSettings {
  enablePayments: boolean
  paymentMethods: string[]
  currency: string
  taxRate: number
  commissionRate: number
  refundPolicy: string
  subscriptionEnabled: boolean
  freeTrialDays: number
}

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  enableNotifications: boolean
  emailTemplates: {
    welcome: boolean
    courseEnrollment: boolean
    paymentConfirmation: boolean
    passwordReset: boolean
  }
}

interface SecuritySettings {
  enableTwoFactor: boolean
  maxLoginAttempts: number
  lockoutDuration: number
  enableCORS: boolean
  allowedOrigins: string[]
  enableRateLimiting: boolean
  rateLimitRequests: number
  rateLimitWindow: number
  enableAuditLog: boolean
  dataRetentionDays: number
}


export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('site')
  const [showPassword, setShowPassword] = useState(false)
  const [showTestEmailModal, setShowTestEmailModal] = useState(false)
  const [testEmailData, setTestEmailData] = useState({
    to: '',
    subject: '',
    content: ''
  })

  // Settings states
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: '온라인 강의 플랫폼',
    siteDescription: '최고의 온라인 강의를 제공하는 플랫폼입니다.',
    siteUrl: 'https://example.com',
    logo: '',
    favicon: '',
    theme: 'light',
    language: 'ko',
    timezone: 'Asia/Seoul',
    currency: 'KRW',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h'
  })

  const [userSettings, setUserSettings] = useState<UserSettings>({
    allowRegistration: true,
    requireEmailVerification: true,
    allowSocialLogin: true,
    maxUsers: 10000,
    userRoles: ['admin', 'instructor', 'student'],
    defaultRole: 'student',
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false
    }
  })

  const [courseSettings, setCourseSettings] = useState<CourseSettings>({
    allowCourseCreation: true,
    requireApproval: true,
    maxCoursesPerInstructor: 50,
    courseCategories: ['프로그래밍', '디자인', '마케팅', '비즈니스', '기타'],
    defaultCategory: '프로그래밍',
    allowComments: true,
    allowReviews: true,
    maxFileSize: 100,
    allowedFileTypes: ['mp4', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip']
  })

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    enablePayments: true,
    paymentMethods: ['card', 'bank', 'paypal'],
    currency: 'KRW',
    taxRate: 10,
    commissionRate: 5,
    refundPolicy: '7일 이내 무료 환불',
    subscriptionEnabled: false,
    freeTrialDays: 7
  })

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@example.com',
    fromName: '온라인 강의 플랫폼',
    enableNotifications: true,
    emailTemplates: {
      welcome: true,
      courseEnrollment: true,
      paymentConfirmation: true,
      passwordReset: true
    }
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enableTwoFactor: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableCORS: true,
    allowedOrigins: ['https://example.com'],
    enableRateLimiting: true,
    rateLimitRequests: 100,
    rateLimitWindow: 15,
    enableAuditLog: true,
    dataRetentionDays: 365
  })


  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    setError(null)

    if (!user) {
      setError('로그인이 필요합니다.')
      setLoading(false)
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const handleSaveSettings = async (settingsType: string) => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`${settingsType} 설정 저장:`, {
        siteSettings,
        userSettings,
        courseSettings,
        paymentSettings,
        emailSettings,
        securitySettings
      })
      alert(`${settingsType} 설정이 저장되었습니다!`)
    } catch (error) {
      console.error('설정 저장 오류:', error)
      alert('설정 저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = (type: 'logo' | 'favicon') => {
    console.log(`${type} 파일 업로드`)
    // 실제로는 파일 업로드 로직 구현
    alert(`${type} 파일 업로드 기능을 구현하세요.`)
  }

  const handleTestEmail = () => {
    setShowTestEmailModal(true)
  }

  const handleSendTestEmail = () => {
    if (!testEmailData.to || !testEmailData.subject || !testEmailData.content) {
      alert('모든 필드를 입력해주세요.')
      return
    }
    
    console.log('테스트 이메일 발송:', testEmailData)
    alert(`테스트 이메일이 ${testEmailData.to}로 발송되었습니다!`)
    setShowTestEmailModal(false)
    setTestEmailData({ to: '', subject: '', content: '' })
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">설정을 불러오는 중...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
          <p className="text-gray-600 mt-2">사이트 설정, 보안, 사용자 관리 등 모든 시스템 설정을 관리하세요</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchSettings()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            새로고침
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'site', name: '사이트 설정', icon: Globe },
            { id: 'users', name: '사용자 관리', icon: Users },
            { id: 'courses', name: '강의 설정', icon: BookOpen },
            { id: 'payment', name: '결제 설정', icon: CreditCard },
            { id: 'email', name: '이메일 설정', icon: Mail },
            { id: 'security', name: '보안 설정', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
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

      {/* Site Settings Tab */}
      {activeTab === 'site' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">기본 정보</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사이트 이름</label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사이트 URL</label>
                  <input
                    type="url"
                    value={siteSettings.siteUrl}
                    onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사이트 설명</label>
                <textarea
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">로고</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {siteSettings.logo ? (
                        <img src={siteSettings.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Image className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => handleFileUpload('logo')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      <Upload className="w-4 h-4 mr-2 inline" />
                      업로드
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">파비콘</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      {siteSettings.favicon ? (
                        <img src={siteSettings.favicon} alt="Favicon" className="w-full h-full object-contain" />
                      ) : (
                        <Globe className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => handleFileUpload('favicon')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      <Upload className="w-4 h-4 mr-2 inline" />
                      업로드
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">테마</label>
                  <select
                    value={siteSettings.theme}
                    onChange={(e) => setSiteSettings({...siteSettings, theme: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">라이트</option>
                    <option value="dark">다크</option>
                    <option value="auto">자동</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">언어</label>
                  <select
                    value={siteSettings.language}
                    onChange={(e) => setSiteSettings({...siteSettings, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">통화</label>
                  <select
                    value={siteSettings.currency}
                    onChange={(e) => setSiteSettings({...siteSettings, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="KRW">₩ 원</option>
                    <option value="USD">$ 달러</option>
                    <option value="EUR">€ 유로</option>
                    <option value="JPY">¥ 엔</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleSaveSettings('사이트')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Settings Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">사용자 등록 설정</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">사용자 등록 허용</h4>
                    <p className="text-sm text-gray-500">새 사용자가 계정을 생성할 수 있도록 허용</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.allowRegistration}
                      onChange={(e) => setUserSettings({...userSettings, allowRegistration: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">이메일 인증 필수</h4>
                    <p className="text-sm text-gray-500">사용자가 이메일 인증을 완료해야 로그인 가능</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.requireEmailVerification}
                      onChange={(e) => setUserSettings({...userSettings, requireEmailVerification: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">소셜 로그인 허용</h4>
                    <p className="text-sm text-gray-500">Google, Facebook 등 소셜 계정으로 로그인 허용</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.allowSocialLogin}
                      onChange={(e) => setUserSettings({...userSettings, allowSocialLogin: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">최대 사용자 수</label>
                  <input
                    type="number"
                    value={userSettings.maxUsers}
                    onChange={(e) => setUserSettings({...userSettings, maxUsers: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기본 역할</label>
                  <select
                    value={userSettings.defaultRole}
                    onChange={(e) => setUserSettings({...userSettings, defaultRole: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">학생</option>
                    <option value="instructor">강사</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">비밀번호 정책</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최소 길이</label>
                    <input
                      type="number"
                      value={userSettings.passwordPolicy.minLength}
                      onChange={(e) => setUserSettings({
                        ...userSettings,
                        passwordPolicy: {...userSettings.passwordPolicy, minLength: parseInt(e.target.value) || 8}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userSettings.passwordPolicy.requireUppercase}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          passwordPolicy: {...userSettings.passwordPolicy, requireUppercase: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">대문자 필수</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userSettings.passwordPolicy.requireLowercase}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          passwordPolicy: {...userSettings.passwordPolicy, requireLowercase: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">소문자 필수</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userSettings.passwordPolicy.requireNumbers}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          passwordPolicy: {...userSettings.passwordPolicy, requireNumbers: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">숫자 필수</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userSettings.passwordPolicy.requireSymbols}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          passwordPolicy: {...userSettings.passwordPolicy, requireSymbols: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">특수문자 필수</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleSaveSettings('사용자')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Settings Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">강의 관리 설정</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">강의 생성 허용</h4>
                    <p className="text-sm text-gray-500">강사가 새 강의를 생성할 수 있도록 허용</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseSettings.allowCourseCreation}
                      onChange={(e) => setCourseSettings({...courseSettings, allowCourseCreation: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">강의 승인 필요</h4>
                    <p className="text-sm text-gray-500">새 강의가 관리자 승인을 받아야 발행</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseSettings.requireApproval}
                      onChange={(e) => setCourseSettings({...courseSettings, requireApproval: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">댓글 허용</h4>
                    <p className="text-sm text-gray-500">강의에 댓글 작성 허용</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseSettings.allowComments}
                      onChange={(e) => setCourseSettings({...courseSettings, allowComments: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">리뷰 허용</h4>
                    <p className="text-sm text-gray-500">강의에 리뷰 작성 허용</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseSettings.allowReviews}
                      onChange={(e) => setCourseSettings({...courseSettings, allowReviews: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">강사당 최대 강의 수</label>
                  <input
                    type="number"
                    value={courseSettings.maxCoursesPerInstructor}
                    onChange={(e) => setCourseSettings({...courseSettings, maxCoursesPerInstructor: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기본 카테고리</label>
                  <select
                    value={courseSettings.defaultCategory}
                    onChange={(e) => setCourseSettings({...courseSettings, defaultCategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {courseSettings.courseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">최대 파일 크기 (MB)</label>
                  <input
                    type="number"
                    value={courseSettings.maxFileSize}
                    onChange={(e) => setCourseSettings({...courseSettings, maxFileSize: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">허용 파일 형식</label>
                  <input
                    type="text"
                    value={courseSettings.allowedFileTypes.join(', ')}
                    onChange={(e) => setCourseSettings({...courseSettings, allowedFileTypes: e.target.value.split(', ').filter(t => t.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="mp4, pdf, doc, docx"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleSaveSettings('강의')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">결제 설정</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">결제 기능 활성화</h4>
                  <p className="text-sm text-gray-500">사용자가 강의를 구매할 수 있도록 결제 기능 활성화</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.enablePayments}
                    onChange={(e) => setPaymentSettings({...paymentSettings, enablePayments: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">결제 방법</label>
                  <div className="space-y-2">
                    {['card', 'bank', 'paypal', 'kakao', 'naver'].map(method => (
                      <label key={method} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentSettings.paymentMethods.includes(method)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPaymentSettings({
                                ...paymentSettings,
                                paymentMethods: [...paymentSettings.paymentMethods, method]
                              })
                            } else {
                              setPaymentSettings({
                                ...paymentSettings,
                                paymentMethods: paymentSettings.paymentMethods.filter(m => m !== method)
                              })
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">통화</label>
                  <select
                    value={paymentSettings.currency}
                    onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="KRW">₩ 원 (KRW)</option>
                    <option value="USD">$ 달러 (USD)</option>
                    <option value="EUR">€ 유로 (EUR)</option>
                    <option value="JPY">¥ 엔 (JPY)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">세율 (%)</label>
                  <input
                    type="number"
                    value={paymentSettings.taxRate}
                    onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">수수료율 (%)</label>
                  <input
                    type="number"
                    value={paymentSettings.commissionRate}
                    onChange={(e) => setPaymentSettings({...paymentSettings, commissionRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">환불 정책</label>
                <textarea
                  value={paymentSettings.refundPolicy}
                  onChange={(e) => setPaymentSettings({...paymentSettings, refundPolicy: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">구독 기능 활성화</h4>
                  <p className="text-sm text-gray-500">월/년 단위 구독 서비스 제공</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.subscriptionEnabled}
                    onChange={(e) => setPaymentSettings({...paymentSettings, subscriptionEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {paymentSettings.subscriptionEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">무료 체험 기간 (일)</label>
                  <input
                    type="number"
                    value={paymentSettings.freeTrialDays}
                    onChange={(e) => setPaymentSettings({...paymentSettings, freeTrialDays: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleSaveSettings('결제')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Settings Tab */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">SMTP 설정</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 호스트</label>
                  <input
                    type="text"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 포트</label>
                  <input
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value) || 587})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사용자명</label>
                  <input
                    type="text"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">발신자 이메일</label>
                  <input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">발신자 이름</label>
                  <input
                    type="text"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">알림 이메일 활성화</h4>
                  <p className="text-sm text-gray-500">사용자에게 자동 알림 이메일 발송</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.enableNotifications}
                    onChange={(e) => setEmailSettings({...emailSettings, enableNotifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">이메일 템플릿</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(emailSettings.emailTemplates).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setEmailSettings({
                          ...emailSettings,
                          emailTemplates: {...emailSettings.emailTemplates, [key]: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleTestEmail}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  테스트 이메일 발송
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleSaveSettings('이메일')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Email Modal */}
      {showTestEmailModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">테스트 이메일 발송</h3>
                <button
                  onClick={() => setShowTestEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">받는 사람 이메일</label>
                  <input
                    type="email"
                    value={testEmailData.to}
                    onChange={(e) => setTestEmailData({...testEmailData, to: e.target.value})}
                    placeholder="test@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    value={testEmailData.subject}
                    onChange={(e) => setTestEmailData({...testEmailData, subject: e.target.value})}
                    placeholder="테스트 이메일 제목"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    value={testEmailData.content}
                    onChange={(e) => setTestEmailData({...testEmailData, content: e.target.value})}
                    rows={6}
                    placeholder="테스트 이메일 내용을 입력하세요..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTestEmailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleSendTestEmail}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  이메일 발송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">보안 설정</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">2단계 인증</h4>
                    <p className="text-sm text-gray-500">관리자 계정에 2단계 인증 활성화</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableTwoFactor}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">CORS 활성화</h4>
                    <p className="text-sm text-gray-500">Cross-Origin Resource Sharing 허용</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableCORS}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableCORS: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">속도 제한</h4>
                    <p className="text-sm text-gray-500">API 요청 속도 제한 활성화</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableRateLimiting}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableRateLimiting: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">감사 로그</h4>
                    <p className="text-sm text-gray-500">사용자 활동 로그 기록</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableAuditLog}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableAuditLog: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">최대 로그인 시도</label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value) || 5})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">잠금 시간 (분)</label>
                  <input
                    type="number"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value) || 15})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">속도 제한 요청 수</label>
                  <input
                    type="number"
                    value={securitySettings.rateLimitRequests}
                    onChange={(e) => setSecuritySettings({...securitySettings, rateLimitRequests: parseInt(e.target.value) || 100})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">속도 제한 윈도우 (분)</label>
                  <input
                    type="number"
                    value={securitySettings.rateLimitWindow}
                    onChange={(e) => setSecuritySettings({...securitySettings, rateLimitWindow: parseInt(e.target.value) || 15})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">허용된 도메인</label>
                <textarea
                  value={securitySettings.allowedOrigins.join('\n')}
                  onChange={(e) => setSecuritySettings({...securitySettings, allowedOrigins: e.target.value.split('\n').filter(o => o.trim())})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com&#10;https://app.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">데이터 보존 기간 (일)</label>
                <input
                  type="number"
                  value={securitySettings.dataRetentionDays}
                  onChange={(e) => setSecuritySettings({...securitySettings, dataRetentionDays: parseInt(e.target.value) || 365})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleSaveSettings('보안')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '저장 중...' : '저장'}
              </button>
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
