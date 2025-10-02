'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Star, 
  FileText, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Quote
} from 'lucide-react'

const courses = [
  { id: 1, title: '블로그 수익화 완벽 가이드' },
  { id: 2, title: '구글 애드센스 마스터클래스' },
  { id: 3, title: '유튜브 채널 성장 전략' },
  { id: 4, title: '쿠팡 파트너스 마스터' },
  { id: 5, title: 'AI 도구로 시작하는 부업' },
  { id: 6, title: '인스타그램 마케팅 실전' },
  { id: 7, title: '직장인을 위한 부업 가이드' },
  { id: 8, title: '디지털 노마드 생활 가이드' }
]

export default function WriteReviewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    courseId: '',
    rating: 0,
    title: '',
    content: '',
    author: '',
    email: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

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

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.courseId) newErrors.courseId = '강의를 선택해주세요.'
    if (formData.rating === 0) newErrors.rating = '평점을 선택해주세요.'
    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요.'
    if (!formData.content.trim()) newErrors.content = '후기 내용을 입력해주세요.'
    if (!formData.author.trim()) newErrors.author = '작성자명을 입력해주세요.'
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
      const reviewData = {
        ...formData,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
        likes: 0,
        verified: false
      }
      
      // 실제로는 API 호출
      console.log('후기 데이터:', reviewData)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('후기가 성공적으로 작성되었습니다!')
      router.push('/reviews')
    } catch (error) {
      alert('후기 작성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isFilled = starValue <= (hoveredStar || formData.rating)
      
      return (
        <button
          key={i}
          type="button"
          className={`w-8 h-8 transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
        >
          <Star className={`w-full h-full ${isFilled ? 'fill-current' : ''}`} />
        </button>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/reviews"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            수강후기로 돌아가기
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
            <div className="flex items-center mb-4">
              <Quote className="w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold">수강후기 작성</h1>
            </div>
            <p className="text-blue-100">
              여러분의 소중한 경험을 공유해주세요. 다른 수강생들에게 큰 도움이 됩니다.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* 강의 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수강한 강의 <span className="text-red-500">*</span>
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.courseId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">강의를 선택해주세요</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.courseId}
                </p>
              )}
            </div>

            {/* 평점 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평점 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {renderStars()}
                <span className="ml-3 text-sm text-gray-600">
                  {formData.rating > 0 && `${formData.rating}.0점`}
                </span>
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rating}
                </p>
              )}
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                후기 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="예: 정말 도움이 된 강의였습니다!"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
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

            {/* 후기 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                후기 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                placeholder="강의를 수강하신 후기를 자세히 작성해주세요. 어떤 부분이 도움이 되었는지, 어떤 성과를 얻으셨는지 등 구체적으로 작성해주시면 다른 수강생들에게 큰 도움이 됩니다."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="mt-1 text-sm text-gray-500">
                {formData.content.length}/1000자
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.content}
                </p>
              )}
            </div>


            {/* 작성자 정보 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">작성자 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
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
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/reviews"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    작성 중...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    후기 작성하기
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
