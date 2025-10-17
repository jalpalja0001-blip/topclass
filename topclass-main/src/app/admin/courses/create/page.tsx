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
    detail_image_url: ''
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
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.title.trim()) {
      setError('강의명을 입력해주세요.')
      return
    }
    
    if (!form.description.trim()) {
      setError('강의 설명을 입력해주세요.')
      return
    }
    
    if (!form.instructor.trim()) {
      setError('강사명을 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('📤 강의 생성 요청 시작:', form)
      
      // API 호출로 강의 생성
      const response = await fetch('/api/admin/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      })

      console.log('📡 API 응답 상태:', response.status, response.ok)
      console.log('📡 API 응답 헤더:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('📦 API 응답 데이터:', JSON.stringify(data, null, 2))
      console.log('📦 응답 데이터 타입:', typeof data)
      console.log('📦 응답 데이터 키들:', Object.keys(data))

      if (!data.success) {
        console.error('❌ 강의 생성 오류 상세 정보:')
        console.error('  - success:', data.success)
        console.error('  - error:', data.error)
        console.error('  - details:', data.details)
        console.error('  - 전체 응답:', data)
        
        const errorMessage = data.error || '강의 생성에 실패했습니다.'
        const detailsMessage = data.details ? ` (상세: ${JSON.stringify(data.details)})` : ''
        throw new Error(errorMessage + detailsMessage)
      }

      // 성공 시 관리자 강의 목록 페이지로 이동 (새로고침을 위한 쿼리 파라미터 추가)
      console.log('✅ 강의 생성 완료, 관리자 강의 목록 페이지로 이동')
      alert('강의가 성공적으로 생성되었습니다!')
      
      // 강제 새로고침을 위해 페이지 리로드
      console.log('✅ 강의 생성 성공! 페이지 새로고침 중...')
      window.location.href = '/admin/courses?refresh=' + Date.now()
      
    } catch (error) {
      console.error('강의 생성 오류:', error)
      const errorMessage = error instanceof Error ? error.message : '강의 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
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
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">새 강의 만들기</h1>
          <p className="text-gray-600 mt-2">새로운 강의를 생성하고 설정하세요</p>
        </div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 mr-2" />
          취소
        </Link>
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">오류가 발생했습니다</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 강의 생성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">이미지 업로드</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메인 카드 이미지 (썸네일)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative">
                {form.thumbnail_url ? (
                  <div className="space-y-2">
                    <img
                      src={form.thumbnail_url}
                      alt="썸네일 미리보기"
                      className="max-h-40 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, thumbnail_url: '' }))}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      이미지 제거
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                        <span>이미지 업로드</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, 'thumbnail')
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (최대 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 페이지 이미지
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative">
                {form.detail_image_url ? (
                  <div className="space-y-2">
                    <img
                      src={form.detail_image_url}
                      alt="상세 이미지 미리보기"
                      className="max-h-40 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, detail_image_url: '' }))}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      이미지 제거
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                        <span>이미지 업로드</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, 'detail')
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (최대 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">기본 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                강의명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="강의명을 입력하세요"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                강의 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="강의에 대한 상세한 설명을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                강사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="강사명을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={form.category === '기타' ? '기타' : form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="무료강의">무료강의</option>
                <option value="프로그래밍">프로그래밍</option>
                <option value="디자인">디자인</option>
                <option value="마케팅">마케팅</option>
                <option value="비즈니스">비즈니스</option>
                <option value="기타">기타</option>
              </select>
              
              {form.category === '기타' && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => handleCustomCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="카테고리를 직접 입력하세요"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수강 시간 (분)
              </label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                onClick={() => handleNumberFieldClick('duration')}
                onBlur={() => handleNumberFieldBlur('duration')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                레벨
              </label>
              <select
                value={form.level}
                onChange={(e) => handleInputChange('level', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">가격 설정</h2>
          
          {form.category === '무료강의' ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="text-green-600 text-2xl mr-3">🆓</div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">무료 강의</h3>
                  <p className="text-sm text-green-700 mt-1">
                    무료 강의로 설정되어 가격 입력이 비활성화됩니다.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가격 (원)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  onClick={() => handleNumberFieldClick('price')}
                  onBlur={() => handleNumberFieldBlur('price')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
                {form.price > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatCurrency(form.price)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정가 (원) - 할인 전 가격
                </label>
                <input
                  type="number"
                  value={form.original_price}
                  onChange={(e) => handleInputChange('original_price', parseInt(e.target.value) || 0)}
                  onClick={() => handleNumberFieldClick('original_price')}
                  onBlur={() => handleNumberFieldBlur('original_price')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
                {form.original_price > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatCurrency(form.original_price)}
                  </p>
                )}
              </div>
            </div>
          )}

          {form.category !== '무료강의' && (
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                  추천 강의로 설정 (얼리버드 메인페이지에 표시)
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                유료 강의는 클래스 카테고리에 표시됩니다. 추천 강의로 설정하면 얼리버드에도 동시 표시됩니다.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">태그 설정</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="태그를 입력하고 Enter를 누르세요"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">발행 설정</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                발행 상태
              </label>
              <select
                value={form.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'published' | 'draft' | 'archived')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">초안 (나중에 발행)</option>
                <option value="published">즉시 발행</option>
                <option value="archived">보관 (발행하지 않음)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {form.status === 'draft' && '강의를 저장하지만 아직 발행하지 않습니다.'}
                {form.status === 'published' && '강의가 즉시 발행되어 사용자들이 볼 수 있습니다.'}
                {form.status === 'archived' && '강의가 보관되어 발행되지 않습니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/courses"
            className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                생성 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                강의 생성
              </>
            )}
          </button>
        </div>
      </form>

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
