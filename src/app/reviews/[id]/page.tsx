'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Star, 
  Quote, 
  Calendar, 
  User, 
  ThumbsUp, 
  Share2,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Review {
  id: number
  author: string
  course: string
  rating: number
  title: string
  content: string
  date: string
  likes: number
  verified: boolean
  email?: string
  detailedContent?: string
  challenges?: string
  tips?: string
  beforeIncome?: string
  afterIncome?: string
  period?: string
}

// 더미 데이터 (실제로는 API에서 가져와야 함)
const reviews: Review[] = [
  {
    id: 1,
    author: '김**',
    course: '블로그 수익화 완벽 가이드',
    rating: 5,
    title: '정말 실무에 도움이 되는 강의였습니다!',
    content: '정말 실무에 도움이 되는 강의였습니다. 작은성공 강사님 덕분에 월 100만원 수익을 달성할 수 있었어요!',
    detailedContent: `안녕하세요! 블로그 수익화 완벽 가이드 강의를 수강한 김**입니다.

**강의 수강 전 상황:**
- 블로그 운영 경험 전무
- 수익화에 대한 지식 전혀 없음
- 월 수익: 0원

**강의 수강 후 달성한 성과:**
- 구글 애드센스 승인 (수강 2개월 후)
- 월 수익: 100만원 달성
- 블로그 방문자: 일 500명 → 일 3,000명
- 구독자: 0명 → 2,500명

**강의에서 가장 도움이 된 부분:**
1. **키워드 연구 방법**: 정말 체계적으로 알려주셔서 검색 상위 노출이 가능했습니다.
2. **콘텐츠 기획**: 어떤 주제로 글을 써야 하는지 명확하게 알 수 있었습니다.
3. **수익화 전략**: 애드센스 외에도 다양한 수익화 방법을 배웠습니다.

**어려웠던 점과 극복 방법:**
- 초기에는 키워드 연구가 어려웠는데, 강사님이 제공해주신 도구들을 활용하니 쉽게 할 수 있었습니다.
- 일관된 포스팅이 어려웠는데, 강사님이 알려주신 콘텐츠 캘린더를 만들어서 해결했습니다.

**다른 수강생분들께 드리는 팁:**
1. 꾸준함이 가장 중요합니다. 하루에 30분이라도 매일 블로그에 시간을 투자하세요.
2. 키워드 연구를 소홀히 하지 마세요. 이것이 성공의 핵심입니다.
3. 다른 블로거들의 글을 많이 읽어보세요. 좋은 아이디어를 얻을 수 있습니다.

정말 감사합니다!`,
    date: '2024-12-01',
    likes: 24,
    verified: true,
    beforeIncome: '0원',
    afterIncome: '월 100만원',
    period: '3개월',
    challenges: '키워드 연구와 일관된 포스팅',
    tips: '꾸준함과 키워드 연구가 핵심'
  },
  {
    id: 2,
    author: '박**',
    course: '구글 애드센스 마스터클래스',
    rating: 5,
    title: '노베이스에서 시작했는데 정말 체계적으로 알려주셔서 감사합니다!',
    content: '노베이스에서 시작했는데 정말 체계적으로 알려주셔서 감사합니다. 3개월 만에 승인받았어요!',
    detailedContent: `구글 애드센스 마스터클래스 수강 후기입니다.

**수강 전 상황:**
- 웹사이트 운영 경험 전무
- 애드센스에 대한 지식 전혀 없음
- 승인 시도: 0회

**수강 후 성과:**
- 애드센스 승인: 3개월 만에 성공
- 현재 월 수익: 50만원
- 웹사이트 트래픽: 월 10만 방문자

**강의의 장점:**
1. **단계별 가이드**: 정말 차근차근 알려주셔서 따라하기 쉬웠습니다.
2. **실제 사례**: 강사님의 실제 경험담이 정말 도움이 되었습니다.
3. **지속적인 지원**: 질문에 대한 답변이 정말 빠르고 정확했습니다.

**특히 도움이 된 부분:**
- 사이트 구조 최적화 방법
- 콘텐츠 품질 향상 전략
- 트래픽 증가 방법

정말 감사합니다!`,
    date: '2024-11-28',
    likes: 18,
    verified: true,
    beforeIncome: '0원',
    afterIncome: '월 50만원',
    period: '3개월',
    challenges: '웹사이트 구조 이해',
    tips: '콘텐츠 품질이 승인의 핵심'
  }
  // 다른 후기들도 비슷하게 추가 가능
]

export default function ReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const reviewId = parseInt(params.id as string)
    const foundReview = reviews.find(r => r.id === reviewId)
    setReview(foundReview || null)
    setLoading(false)
    if (foundReview) {
      setLikes(foundReview.likes)
    }
  }, [params.id])

  const handleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: review?.title,
        text: review?.content,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다!')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">후기를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">요청하신 후기가 존재하지 않습니다.</p>
          <Link
            href="/reviews"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            수강후기로 돌아가기
          </Link>
        </div>
        <Footer />
      </div>
    )
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

      {/* Review Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{review.author}</div>
                  <div className="text-sm text-gray-500">{review.course}</div>
                </div>
              </div>
              {review.verified && (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  인증완료
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{review.title}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              {renderStars(review.rating)}
              <span className="text-lg font-medium text-gray-700">{review.rating}.0</span>
            </div>

            {/* Review Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(review.date)}
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {likes}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
                    liked 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                  좋아요
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  공유
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {review.detailedContent || review.content}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
