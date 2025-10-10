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
    thumbnail_url: ''
  })

  const handleInputChange = (field: keyof CourseForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
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
      // Supabase에서 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      // 실제로는 API 호출로 강의 생성
      console.log('새 강의 생성:', form)
      
      // 성공 시 강의 관리 페이지로 이동
      router.push('/admin/courses')
      
    } catch (error) {
      console.error('강의 생성 오류:', error)
      setError('강의 생성 중 오류가 발생했습니다.')
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
                value={form.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="무료강의">무료강의</option>
                <option value="프로그래밍">프로그래밍</option>
                <option value="디자인">디자인</option>
                <option value="마케팅">마케팅</option>
                <option value="비즈니스">비즈니스</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수강 시간 (분)
              </label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격 (원)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
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
                추천 강의로 설정
              </label>
            </div>
          </div>
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
