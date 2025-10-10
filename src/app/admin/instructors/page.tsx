'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Home,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  RefreshCw,
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react'

interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  specialties: string[]
  experience_years: number
  education: string
  certifications: string[]
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  application_date: string
  approval_date?: string
  courses_count: number
  total_students: number
  average_rating: number
  profile_image?: string
  resume_url?: string
  portfolio_url?: string
  social_links: {
    linkedin?: string
    github?: string
    website?: string
  }
  bank_account?: {
    bank_name: string
    account_number: string
    account_holder: string
  }
}

export default function InstructorManagementPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showApplicationCardModal, setShowApplicationCardModal] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null)
  const [editForm, setEditForm] = useState<Partial<Instructor>>({})
  const [approvalNote, setApprovalNote] = useState('')
  const [applicationCardForm, setApplicationCardForm] = useState({
    title: '강사 신청서',
    company_name: '온라인 강의 플랫폼',
    company_address: '서울특별시 강남구 테헤란로 123',
    company_phone: '02-1234-5678',
    company_email: 'hr@example.com',
    application_period: '상시 모집',
    requirements: [
      '관련 분야 3년 이상 경력',
      '강의 경험 우대',
      '온라인 강의 가능',
      '열정적인 교육자'
    ],
    benefits: [
      '경쟁력 있는 강의료',
      '자유로운 강의 스케줄',
      '전문적인 강의 지원',
      '성장하는 플랫폼에서의 기회'
    ],
    application_method: '이메일로 이력서 및 포트폴리오 제출',
    contact_info: 'hr@example.com 또는 02-1234-5678'
  })

  const itemsPerPage = 10

  useEffect(() => {
    fetchInstructors()
  }, [currentPage, searchTerm, statusFilter, specialtyFilter])

  // 핸들러 함수들
  const handleInstructorClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedInstructor(null)
  }

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor)
    setEditForm({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      bio: instructor.bio,
      specialties: instructor.specialties,
      experience_years: instructor.experience_years,
      education: instructor.education,
      certifications: instructor.certifications,
      status: instructor.status,
      social_links: instructor.social_links,
      bank_account: instructor.bank_account
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingInstructor) return
    console.log('강사 정보 수정 저장:', editForm)
    setShowEditModal(false)
    setEditingInstructor(null)
    setEditForm({})
    fetchInstructors()
  }

  const handleDeleteInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (!editingInstructor) return
    console.log('강사 삭제:', editingInstructor.id)
    setShowDeleteModal(false)
    setEditingInstructor(null)
    fetchInstructors()
  }

  const handleApplicationCardFormChange = (field: string, value: any) => {
    setApplicationCardForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddRequirement = () => {
    const newRequirement = prompt('새로운 요구사항을 입력하세요:')
    if (newRequirement && newRequirement.trim()) {
      setApplicationCardForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
    }
  }

  const handleRemoveRequirement = (index: number) => {
    setApplicationCardForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const handleAddBenefit = () => {
    const newBenefit = prompt('새로운 혜택을 입력하세요:')
    if (newBenefit && newBenefit.trim()) {
      setApplicationCardForm(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
    }
  }

  const handleRemoveBenefit = (index: number) => {
    setApplicationCardForm(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const handleGenerateApplicationCard = () => {
    // 강사신청카드 생성 로직
    console.log('강사신청카드 생성:', applicationCardForm)
    
    // 실제로는 PDF 생성 또는 카드 템플릿 생성
    const cardData = {
      ...applicationCardForm,
      generated_at: new Date().toISOString(),
      card_id: `card-${Date.now()}`
    }
    
    // 카드 데이터를 JSON으로 다운로드 (실제로는 PDF 생성)
    const dataStr = JSON.stringify(cardData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `강사신청카드_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    alert('강사신청카드가 생성되었습니다!')
    setShowApplicationCardModal(false)
  }

  const handleApprovalClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor)
    setShowApprovalModal(true)
  }

  const handleApproveInstructor = () => {
    if (!selectedInstructor) return
    console.log('강사 승인:', selectedInstructor.id, approvalNote)
    setShowApprovalModal(false)
    setSelectedInstructor(null)
    setApprovalNote('')
    fetchInstructors()
  }

  const handleRejectInstructor = () => {
    if (!selectedInstructor) return
    console.log('강사 거부:', selectedInstructor.id, approvalNote)
    setShowApprovalModal(false)
    setSelectedInstructor(null)
    setApprovalNote('')
    fetchInstructors()
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': '대기중',
      'approved': '승인됨',
      'rejected': '거부됨',
      'suspended': '정지됨'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'suspended': 'bg-gray-100 text-gray-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      // 더미 데이터 생성
      const dummyInstructors: Instructor[] = [
        {
          id: 'instructor-1',
          name: '김개발자',
          email: 'kim.dev@example.com',
          phone: '010-1234-5678',
          bio: '10년 경력의 풀스택 개발자로 React, Node.js 전문가입니다.',
          specialties: ['React', 'Node.js', 'TypeScript', 'AWS'],
          experience_years: 10,
          education: '컴퓨터공학과 학사',
          certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
          status: 'approved',
          application_date: '2024-01-10T10:00:00Z',
          approval_date: '2024-01-12T14:00:00Z',
          courses_count: 5,
          total_students: 1250,
          average_rating: 4.8,
          profile_image: '/api/placeholder/100/100',
          resume_url: '/resumes/kim-dev.pdf',
          portfolio_url: 'https://kimdev.portfolio.com',
          social_links: {
            linkedin: 'https://linkedin.com/in/kimdev',
            github: 'https://github.com/kimdev',
            website: 'https://kimdev.com'
          },
          bank_account: {
            bank_name: '국민은행',
            account_number: '123456-78-901234',
            account_holder: '김개발자'
          }
        },
        {
          id: 'instructor-2',
          name: '이디자이너',
          email: 'lee.design@example.com',
          phone: '010-2345-6789',
          bio: 'UI/UX 디자인 전문가로 사용자 경험 설계에 특화되어 있습니다.',
          specialties: ['UI/UX', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
          experience_years: 7,
          education: '디자인학과 석사',
          certifications: ['Adobe Certified Expert', 'Google UX Design Certificate'],
          status: 'approved',
          application_date: '2024-01-15T09:00:00Z',
          approval_date: '2024-01-17T11:00:00Z',
          courses_count: 3,
          total_students: 890,
          average_rating: 4.6,
          profile_image: '/api/placeholder/100/100',
          resume_url: '/resumes/lee-design.pdf',
          portfolio_url: 'https://leedesign.portfolio.com',
          social_links: {
            linkedin: 'https://linkedin.com/in/leedesign',
            website: 'https://leedesign.com'
          },
          bank_account: {
            bank_name: '신한은행',
            account_number: '234567-89-012345',
            account_holder: '이디자이너'
          }
        },
        {
          id: 'instructor-3',
          name: '박마케터',
          email: 'park.marketing@example.com',
          phone: '010-3456-7890',
          bio: '디지털 마케팅 전문가로 SEO, SEM, 소셜미디어 마케팅에 강합니다.',
          specialties: ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing'],
          experience_years: 8,
          education: '경영학과 학사',
          certifications: ['Google Analytics Certified', 'Facebook Blueprint Certified'],
          status: 'pending',
          application_date: '2024-01-20T16:00:00Z',
          courses_count: 0,
          total_students: 0,
          average_rating: 0,
          profile_image: '/api/placeholder/100/100',
          resume_url: '/resumes/park-marketing.pdf',
          social_links: {
            linkedin: 'https://linkedin.com/in/parkmarketing',
            website: 'https://parkmarketing.com'
          }
        },
        {
          id: 'instructor-4',
          name: '최데이터',
          email: 'choi.data@example.com',
          phone: '010-4567-8901',
          bio: '데이터 사이언스 전문가로 Python, R, 머신러닝에 전문성을 가지고 있습니다.',
          specialties: ['Python', 'R', 'Machine Learning', 'Data Analysis', 'SQL'],
          experience_years: 6,
          education: '통계학과 석사',
          certifications: ['Microsoft Azure Data Scientist', 'Google Data Analytics Certificate'],
          status: 'rejected',
          application_date: '2024-01-05T14:00:00Z',
          courses_count: 0,
          total_students: 0,
          average_rating: 0,
          profile_image: '/api/placeholder/100/100',
          resume_url: '/resumes/choi-data.pdf',
          social_links: {
            linkedin: 'https://linkedin.com/in/choidata',
            github: 'https://github.com/choidata'
          }
        },
        {
          id: 'instructor-5',
          name: '정백엔드',
          email: 'jung.backend@example.com',
          phone: '010-5678-9012',
          bio: '백엔드 개발 전문가로 Java, Spring, 데이터베이스 설계에 특화되어 있습니다.',
          specialties: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker'],
          experience_years: 9,
          education: '컴퓨터공학과 학사',
          certifications: ['Oracle Java Certified', 'AWS Developer Associate'],
          status: 'suspended',
          application_date: '2024-01-08T11:00:00Z',
          approval_date: '2024-01-10T15:00:00Z',
          courses_count: 2,
          total_students: 450,
          average_rating: 4.2,
          profile_image: '/api/placeholder/100/100',
          resume_url: '/resumes/jung-backend.pdf',
          social_links: {
            linkedin: 'https://linkedin.com/in/jungbackend',
            github: 'https://github.com/jungbackend'
          },
          bank_account: {
            bank_name: '우리은행',
            account_number: '345678-90-123456',
            account_holder: '정백엔드'
          }
        }
      ]

      // 필터링 적용
      let filteredInstructors = dummyInstructors

      if (searchTerm) {
        filteredInstructors = filteredInstructors.filter(instructor =>
          instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.bio.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (statusFilter !== 'all') {
        filteredInstructors = filteredInstructors.filter(instructor => instructor.status === statusFilter)
      }

      if (specialtyFilter !== 'all') {
        filteredInstructors = filteredInstructors.filter(instructor => 
          instructor.specialties.includes(specialtyFilter)
        )
      }

      setInstructors(filteredInstructors)
    } catch (error) {
      console.error('강사 데이터 로드 오류:', error)
      setError('강사 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const specialties = ['React', 'Node.js', 'TypeScript', 'AWS', 'UI/UX', 'Figma', 'SEO', 'SEM', 'Python', 'R', 'Machine Learning', 'Java', 'Spring Boot', 'MySQL']
  const totalInstructors = instructors.length
  const pendingInstructors = instructors.filter(i => i.status === 'pending').length
  const approvedInstructors = instructors.filter(i => i.status === 'approved').length
  const totalStudents = instructors.reduce((sum, instructor) => sum + instructor.total_students, 0)
  const averageRating = instructors.length > 0 ? 
    (instructors.reduce((sum, instructor) => sum + instructor.average_rating, 0) / instructors.length).toFixed(1) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">강사 데이터를 불러오는 중...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">강사 관리</h1>
          <p className="text-gray-600 mt-2">강사 신청 관리, 승인/거부, 강사 정보를 관리하세요</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowApplicationCardModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            강사신청카드 만들기
          </button>
          <button
            onClick={() => {
              setCurrentPage(1)
              setSearchTerm('')
              setStatusFilter('all')
              setSpecialtyFilter('all')
              fetchInstructors()
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            새로고침
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 강사</p>
              <p className="text-2xl font-bold text-gray-900">{totalInstructors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">대기중</p>
              <p className="text-2xl font-bold text-gray-900">{pendingInstructors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">승인됨</p>
              <p className="text-2xl font-bold text-gray-900">{approvedInstructors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 수강생</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름, 이메일, 소개로 검색..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">전체</option>
              <option value="pending">대기중</option>
              <option value="approved">승인됨</option>
              <option value="rejected">거부됨</option>
              <option value="suspended">정지됨</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전문분야</label>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">전체</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setSpecialtyFilter('all')
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 강사 목록 */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  강사 정보
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전문분야
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  경력
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  강의 수
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  평점
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청일
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {instructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{instructor.bio}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.email}</div>
                    <div className="text-sm text-gray-500">{instructor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                      {instructor.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{instructor.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(instructor.status)}`}>
                      {getStatusText(instructor.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.experience_years}년</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.courses_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.average_rating > 0 ? (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{instructor.average_rating}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(instructor.application_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleInstructorClick(instructor)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {instructor.status === 'pending' && (
                        <button
                          onClick={() => handleApprovalClick(instructor)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="승인/거부"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditInstructor(instructor)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInstructor(instructor)}
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
      </div>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedInstructor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">강사 상세 정보</h3>
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
                    <p><strong>이름:</strong> {selectedInstructor.name}</p>
                    <p><strong>이메일:</strong> {selectedInstructor.email}</p>
                    <p><strong>전화번호:</strong> {selectedInstructor.phone}</p>
                    <p><strong>상태:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedInstructor.status)}`}>
                      {getStatusText(selectedInstructor.status)}
                    </span></p>
                  </div>
                  <div>
                    <p><strong>경력:</strong> {selectedInstructor.experience_years}년</p>
                    <p><strong>강의 수:</strong> {selectedInstructor.courses_count}개</p>
                    <p><strong>총 수강생:</strong> {selectedInstructor.total_students.toLocaleString()}명</p>
                    <p><strong>평균 평점:</strong> {selectedInstructor.average_rating > 0 ? selectedInstructor.average_rating : '-'}</p>
                  </div>
                </div>
                <div>
                  <p><strong>소개:</strong></p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-800">{selectedInstructor.bio}</p>
                  </div>
                </div>
                <div>
                  <p><strong>학력:</strong> {selectedInstructor.education}</p>
                </div>
                <div>
                  <p><strong>자격증:</strong></p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedInstructor.certifications.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p><strong>전문분야:</strong></p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedInstructor.specialties.map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedInstructor.social_links && (
                  <div>
                    <p><strong>소셜 링크:</strong></p>
                    <div className="mt-2 space-y-1">
                      {selectedInstructor.social_links.linkedin && (
                        <p className="text-blue-600"><a href={selectedInstructor.social_links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
                      )}
                      {selectedInstructor.social_links.github && (
                        <p className="text-blue-600"><a href={selectedInstructor.social_links.github} target="_blank" rel="noopener noreferrer">GitHub</a></p>
                      )}
                      {selectedInstructor.social_links.website && (
                        <p className="text-blue-600"><a href={selectedInstructor.social_links.website} target="_blank" rel="noopener noreferrer">Website</a></p>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>신청일:</strong> {formatDate(selectedInstructor.application_date)}</p>
                  {selectedInstructor.approval_date && (
                    <p><strong>승인일:</strong> {formatDate(selectedInstructor.approval_date)}</p>
                  )}
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

      {/* 승인/거부 모달 */}
      {showApprovalModal && selectedInstructor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">강사 승인/거부</h3>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>{selectedInstructor.name}</strong> 강사의 신청을 검토하고 승인 또는 거부하세요.
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="text-sm"><strong>전문분야:</strong> {selectedInstructor.specialties.join(', ')}</p>
                  <p className="text-sm"><strong>경력:</strong> {selectedInstructor.experience_years}년</p>
                  <p className="text-sm"><strong>학력:</strong> {selectedInstructor.education}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="승인/거부 사유를 입력하세요..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleRejectInstructor}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  거부
                </button>
                <button
                  onClick={handleApproveInstructor}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  승인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && editingInstructor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">강사 정보 수정</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">경력 (년)</label>
                    <input
                      type="number"
                      value={editForm.experience_years || 0}
                      onChange={(e) => setEditForm({...editForm, experience_years: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">소개</label>
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학력</label>
                    <input
                      type="text"
                      value={editForm.education || ''}
                      onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <select
                      value={editForm.status || 'pending'}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">대기중</option>
                      <option value="approved">승인됨</option>
                      <option value="rejected">거부됨</option>
                      <option value="suspended">정지됨</option>
                    </select>
                  </div>
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
      {showDeleteModal && editingInstructor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">강사 삭제</h3>
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
                      <strong>{editingInstructor.name}</strong> 강사가 영구적으로 삭제됩니다.
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    ⚠️ 이 작업은 되돌릴 수 없습니다. 강사와 관련된 모든 데이터가 삭제됩니다.
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

      {/* 강사신청카드 만들기 모달 */}
      {showApplicationCardModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">강사신청카드 만들기</h3>
                <button
                  onClick={() => setShowApplicationCardModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                      <input
                        type="text"
                        value={applicationCardForm.title}
                        onChange={(e) => handleApplicationCardFormChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">회사명</label>
                      <input
                        type="text"
                        value={applicationCardForm.company_name}
                        onChange={(e) => handleApplicationCardFormChange('company_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">회사 주소</label>
                      <input
                        type="text"
                        value={applicationCardForm.company_address}
                        onChange={(e) => handleApplicationCardFormChange('company_address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">회사 전화번호</label>
                      <input
                        type="text"
                        value={applicationCardForm.company_phone}
                        onChange={(e) => handleApplicationCardFormChange('company_phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">회사 이메일</label>
                      <input
                        type="email"
                        value={applicationCardForm.company_email}
                        onChange={(e) => handleApplicationCardFormChange('company_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">모집 기간</label>
                      <input
                        type="text"
                        value={applicationCardForm.application_period}
                        onChange={(e) => handleApplicationCardFormChange('application_period', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 요구사항 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">요구사항</h4>
                    <button
                      onClick={handleAddRequirement}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {applicationCardForm.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-700">{requirement}</span>
                        <button
                          onClick={() => handleRemoveRequirement(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 혜택 */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">혜택</h4>
                    <button
                      onClick={handleAddBenefit}
                      className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {applicationCardForm.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-700">{benefit}</span>
                        <button
                          onClick={() => handleRemoveBenefit(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 신청 방법 및 연락처 */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">신청 방법 및 연락처</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">신청 방법</label>
                      <textarea
                        value={applicationCardForm.application_method}
                        onChange={(e) => handleApplicationCardFormChange('application_method', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">연락처 정보</label>
                      <textarea
                        value={applicationCardForm.contact_info}
                        onChange={(e) => handleApplicationCardFormChange('contact_info', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowApplicationCardModal(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleGenerateApplicationCard}
                  className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  카드 생성
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
