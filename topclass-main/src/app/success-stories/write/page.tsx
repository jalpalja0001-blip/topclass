'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  ArrowLeft, 
  TrendingUp, 
  Upload, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Tag
} from 'lucide-react'

const categories = [
  '블로그 수익화',
  '유튜브 수익화',
  '쿠팡 파트너스',
  '인스타그램 마케팅',
  '온라인 쇼핑몰',
  '부업/사이드잡',
  '기타'
]

const platforms = [
  '구글 애드센스',
  '유튜브',
  '쿠팡 파트너스',
  '인스타그램',
  '네이버 블로그',
  '티스토리',
  '기타'
]

export default function WriteSuccessStoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    platform: '',
    revenue: '',
    period: '',
    description: '',
    detailedStory: '',
    challenges: '',
    solutions: '',
    tips: '',
    tags: '',
    email: '',
    verified: false
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요.'
    if (!formData.author.trim()) newErrors.author = '작성자명을 입력해주세요.'
    if (!formData.category) newErrors.category = '카테고리를 선택해주세요.'
    if (!formData.platform) newErrors.platform = '플랫폼을 선택해주세요.'
    if (!formData.revenue.trim()) newErrors.revenue = '수익을 입력해주세요.'
    if (!formData.period.trim()) newErrors.period = '달성 기간을 입력해주세요.'
    if (!formData.description.trim()) newErrors.description = '간단한 설명을 입력해주세요.'
    if (!formData.detailedStory.trim()) newErrors.detailedStory = '상세한 스토리를 입력해주세요.'
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식을 입력해주세요.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // 현재 날짜를 자동으로 추가
      const storyData = {
        ...formData,
        publishDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
        verified: formData.verified,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }
      
      // 실제로는 API 호출
      console.log('성공 스토리 데이터:', storyData)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('성공 스토리가 성공적으로 작성되었습니다!')
      router.push('/success-stories')
    } catch (error) {
      alert('스토리 작성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/success-stories"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            수익화 인증으로 돌아가기
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold">성공 스토리 작성</h1>
            </div>
            <p className="text-green-100">
              여러분의 성공 경험을 공유해주세요. 다른 수강생들에게 큰 동기부여가 됩니다.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* 기본 정보 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    스토리 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="예: 3개월 만에 월 100만원 달성!"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    작성자명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="예: 김**"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.author}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 카테고리 및 플랫폼 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">수익화 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">카테고리를 선택해주세요</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    플랫폼 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.platform ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">플랫폼을 선택해주세요</option>
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                  {errors.platform && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.platform}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 수익 정보 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">수익 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    달성 수익 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    placeholder="예: 월 100만원"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.revenue ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.revenue && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.revenue}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    달성 기간 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="period"
                    value={formData.period}
                    onChange={handleInputChange}
                    placeholder="예: 3개월"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.period ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.period && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.period}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 스토리 내용 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">스토리 내용</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    간단한 설명 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="성공 스토리를 간단히 요약해주세요."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세한 스토리 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="detailedStory"
                    value={formData.detailedStory}
                    onChange={handleInputChange}
                    rows={8}
                    placeholder="성공 과정을 자세히 설명해주세요. 어떤 방법을 사용했는지, 어떤 어려움이 있었는지, 어떻게 극복했는지 등 구체적으로 작성해주세요."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 resize-none ${
                      errors.detailedStory ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.detailedStory && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.detailedStory}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 추가 정보 (선택사항) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">추가 정보 (선택사항)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    어려웠던 점
                  </label>
                  <textarea
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="수익화 과정에서 겪었던 어려움을 작성해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    해결 방법
                  </label>
                  <textarea
                    name="solutions"
                    value={formData.solutions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="어려움을 어떻게 해결했는지 작성해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    다른 분들을 위한 팁
                  </label>
                  <textarea
                    name="tips"
                    value={formData.tips}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="다른 분들에게 도움이 될 만한 팁을 작성해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="예: 블로그, 애드센스, 수익화, 부업"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">연락처 정보</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/success-stories"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    작성 중...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    스토리 작성하기
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
