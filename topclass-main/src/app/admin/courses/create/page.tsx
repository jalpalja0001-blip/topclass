'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  BookOpen, 
  Save, 
  X, 
  Home,
  Upload,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react'
import CourseForm, { CourseFormData } from '../components/CourseForm'

interface CourseForm {
  title: string
  description: string
  instructor: string
  category: string
  price: number
  original_price: number
  duration: number
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'published' | 'draft' | 'archived'
  is_featured: boolean
  tags: string[]
  thumbnail_url: string
  detail_image_url: string
  video_url: string
}

interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

export default function CreateCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const [form, setForm] = useState<CourseForm>({
    title: '',
    description: '',
    instructor: '',
    category: '무료강의',
    price: 0,
    original_price: 0,
    duration: 0,
    level: 'beginner',
    status: 'draft',
    is_featured: false,
    tags: [],
    thumbnail_url: '',
    detail_image_url: '',
    video_url: ''
  })
  const [customCategory, setCustomCategory] = useState('')

  const handleImageUpload = async (file: File, type: 'thumbnail' | 'detail') => {
    try {
      console.log('📤 이미지 업로드 시작:', { fileName: file.name, type })
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      console.log('📡 업로드 응답 상태:', response.status, response.ok)

      const data: UploadResponse = await response.json()
      console.log('📦 업로드 응답 데이터:', data)

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`)
      }

      if (!data.success || !data.url) {
        throw new Error(data.error || '이미지 업로드에 실패했습니다.')
      }

      console.log('✅ 이미지 업로드 성공:', data.url)

      setForm(prev => ({
        ...prev,
        [type === 'thumbnail' ? 'thumbnail_url' : 'detail_image_url']: data.url
      }))

      return data.url
    } catch (error) {
      console.error('❌ 이미지 업로드 오류:', error)
      setError(`이미지 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      return null
    }
  }

  const handleInputChange = (field: keyof CourseForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (value: string) => {
    if (value === '기타') {
      setForm(prev => ({ ...prev, category: '기타' }))
    } else {
      setForm(prev => ({ ...prev, category: value }))
      setCustomCategory('')
      
      // 무료강의 선택 시 가격을 0으로 설정하고 추천 강의 해제
      if (value === '무료강의') {
        setForm(prev => ({ ...prev, price: 0, original_price: 0, is_featured: false }))
      } else {
        // 유료강의 선택 시 추천 강의 설정은 사용자가 직접 선택
        // 기본값은 false로 설정 (사용자가 체크박스로 선택)
        setForm(prev => ({ ...prev, is_featured: false }))
      }
    }
  }

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value)
    setForm(prev => ({ ...prev, category: value }))
  }

  const handleNumberFieldClick = (field: 'price' | 'original_price' | 'duration') => {
    if (form[field] === 0) {
      setForm(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNumberFieldBlur = (field: 'price' | 'original_price' | 'duration') => {
    if (form[field] === '' || form[field] === null || form[field] === undefined) {
      setForm(prev => ({ ...prev, [field]: 0 }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleCreate = async (form: CourseFormData) => {
    console.log('🔥 handleCreate 함수 호출됨!')
    console.log('📋 전달받은 form 데이터:', form)
    
    // 로딩 상태 확인
    if (loading) {
      console.log('⚠️ 이미 처리 중입니다. 중복 요청 방지');
      return;
    }
    
    setLoading(true)
    setError(null)
    try {
      console.log('🚀 강의 생성 시작:', form)
      
      // JSON 데이터로 전송 (FormData 대신)
      const requestData = {
        title: form.title,
        description: form.description,
        instructor: form.instructor,
        category: form.category,
        price: form.price,
        original_price: form.original_price,
        duration: form.duration,
        level: form.level,
        status: form.status,
        is_featured: form.is_featured,
        tags: form.tags,
        thumbnail_url: form.thumbnail_url || '',
        detail_image_url: form.detail_image_url || '',
        video_url: form.video_url || ''
        // vimeo_url: form.vimeo_url || '' // 임시로 주석 처리
      }
      
      console.log('📤 JSON 데이터 전송 시작...')
      console.log('📊 전송할 데이터:', requestData)
      
      const response = await fetch('/api/admin/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      
      console.log('📡 응답 상태:', response.status, response.ok)
      console.log('📡 응답 헤더:', Object.fromEntries(response.headers.entries()))
      
      // 응답 텍스트를 먼저 확인
      const responseText = await response.text()
      console.log('📦 원본 응답 텍스트:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log('📦 파싱된 응답 데이터:', data)
        console.log('📦 응답 데이터 타입:', typeof data)
        console.log('📦 success 값:', data.success)
        console.log('📦 error 값:', data.error)
        console.log('📦 message 값:', data.message)
      } catch (jsonError) {
        console.error('❌ JSON 파싱 실패:', jsonError)
        console.error('❌ 원본 응답:', responseText)
        throw new Error('서버 응답을 파싱할 수 없습니다.')
      }
      
      // 응답이 빈 객체인 경우 처리
      if (!data || Object.keys(data).length === 0) {
        console.error('❌ 빈 응답 데이터')
        throw new Error('서버에서 빈 응답을 받았습니다.')
      }
      
      // success 필드 확인
      console.log('🔍 success 필드 상세 분석:')
      console.log('  - data.success:', data.success)
      console.log('  - typeof data.success:', typeof data.success)
      console.log('  - data.success === true:', data.success === true)
      console.log('  - data.success === false:', data.success === false)
      console.log('  - data.success === undefined:', data.success === undefined)
      
      // success 필드가 명시적으로 false이거나 undefined인 경우
      if (data && (data.success === false || data.success === undefined)) {
        try {
          console.error('❌ API 응답 실패:', data)
          
          // 간단하고 안전한 오류 메시지 생성
          let errorMessage = '강의 생성에 실패했습니다.'
          
          // 오류 메시지 우선순위: error > message > details
          if (data && data.error) {
            errorMessage = String(data.error)
          } else if (data && data.message) {
            errorMessage = String(data.message)
          } else if (data && data.details) {
            errorMessage = String(data.details)
          }
          
          console.error('❌ 최종 오류 메시지:', errorMessage)
          throw new Error(errorMessage)
        } catch (errorHandlingError) {
          console.error('❌ 오류 처리 중 예외 발생:', errorHandlingError)
          throw new Error('강의 생성에 실패했습니다.')
        }
      }
      
      console.log('✅ 강의 생성 성공!')
      alert('강의가 성공적으로 생성되었습니다!')
      window.location.href = '/admin/courses?refresh=' + Date.now()
    } catch (error: any) {
      console.error('❌ 강의 생성 오류:', error)
      setError(error.message || '강의 생성 오류')
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">새 강의 만들기</h1>
          <p className="text-gray-600 mt-2">새로운 강의를 생성하고 설정하세요</p>
        </div>
        <Link href="/admin/courses" className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5 mr-2" />취소
        </Link>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div>
              <h3 className="text-sm font-medium text-red-800">오류가 발생했습니다</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      <CourseForm mode="create" onSubmit={handleCreate} loading={loading} onCancel={() => {window.location.href = '/admin/courses'}} />
      
      {/* 임시 디버깅 버튼 */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold text-yellow-800">🔧 디버깅 도구</h3>
        <button 
          onClick={() => {
            console.log('🔥 수동 테스트 시작!');
            handleCreate({
              title: '테스트 강의',
              description: '테스트 설명',
              instructor: '테스트 강사',
              category: '무료강의',
              price: 0,
              original_price: 0,
              duration: 0,
              level: 'beginner',
              status: 'draft',
              is_featured: false,
              tags: [],
              thumbnail_url: '',
              detail_image_url: '',
              video_url: '',
              video_file: null
            });
          }}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          🧪 수동 테스트 실행
        </button>
      </div>
    </div>
  )
}
