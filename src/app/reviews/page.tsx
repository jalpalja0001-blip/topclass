import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Star, Quote, Calendar, User, ThumbsUp } from 'lucide-react'

const reviews = [
  {
    id: 1,
    author: '김**',
    course: '블로그 수익화 완벽 가이드',
    rating: 5,
    content: '정말 실무에 도움이 되는 강의였습니다. 작은성공 강사님 덕분에 월 100만원 수익을 달성할 수 있었어요!',
    date: '2024-12-01',
    likes: 24,
    verified: true
  },
  {
    id: 2,
    author: '박**',
    course: '구글 애드센스 마스터클래스',
    rating: 5,
    content: '노베이스에서 시작했는데 정말 체계적으로 알려주셔서 감사합니다. 3개월 만에 승인받았어요!',
    date: '2024-11-28',
    likes: 18,
    verified: true
  },
  {
    id: 3,
    author: '이**',
    course: '유튜브 채널 성장 전략',
    rating: 5,
    content: '구독자 0명에서 시작해서 1만명까지 달성했습니다. 정말 감사합니다!',
    date: '2024-11-25',
    likes: 32,
    verified: true
  },
  {
    id: 4,
    author: '최**',
    course: '쿠팡 파트너스 마스터',
    rating: 5,
    content: '주부인데도 충분히 따라할 수 있었어요. 월 50만원 수익 달성했습니다!',
    date: '2024-11-20',
    likes: 29,
    verified: true
  },
  {
    id: 5,
    author: '정**',
    course: 'AI 도구로 시작하는 부업',
    rating: 5,
    content: 'ChatGPT 활용법을 정말 잘 알려주셔서 새로운 수익원을 만들 수 있었습니다.',
    date: '2024-11-15',
    likes: 21,
    verified: true
  },
  {
    id: 6,
    author: '한**',
    course: '인스타그램 마케팅 실전',
    rating: 5,
    content: '팔로워 0명에서 5만명까지! 정말 체계적인 방법을 알려주셔서 감사합니다.',
    date: '2024-11-10',
    likes: 27,
    verified: true
  },
  {
    id: 7,
    author: '윤**',
    course: '직장인을 위한 부업 가이드',
    rating: 5,
    content: '회사 다니면서도 충분히 할 수 있는 현실적인 방법들을 알려주셔서 좋았어요.',
    date: '2024-11-05',
    likes: 19,
    verified: true
  },
  {
    id: 8,
    author: '강**',
    course: '디지털 노마드 생활 가이드',
    rating: 5,
    content: '자유로운 삶을 꿈꿨는데 정말 실현 가능한 방법들을 알려주셔서 감사합니다.',
    date: '2024-10-30',
    likes: 25,
    verified: true
  }
]

export default function ReviewsPage() {
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
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            수강후기
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            실제 수강생들의 생생한 후기를 확인해보세요
          </p>
          <p className="text-lg text-blue-100 mb-8">
            검증된 성과와 솔직한 후기로 여러분의 성공을 도와드립니다
          </p>
          <Link
            href="/reviews/write"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            <Quote className="w-5 h-5 mr-2" />
            후기 작성하기
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.9</div>
              <div className="text-gray-600">평균 평점</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">2,847</div>
              <div className="text-gray-600">총 후기 수</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">만족도</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">1,234</div>
              <div className="text-gray-600">성공 사례</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Link key={review.id} href={`/reviews/${review.id}`}>
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md hover:border-blue-300 border border-transparent transition-all duration-200 cursor-pointer group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.author}</div>
                      <div className="text-sm text-gray-500">{review.course}</div>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      인증완료
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500 ml-2">{review.rating}.0</span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <Quote className="w-5 h-5 text-gray-400 mb-2" />
                  <div className="text-gray-700 leading-relaxed">
                    <div className="line-clamp-3 h-20 overflow-hidden relative">
                      {review.content}
                      <div className="absolute bottom-0 right-0 bg-white pl-2">
                        <span className="text-blue-600 text-sm">...더보기</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(review.date)}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {review.likes}
                  </div>
                </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            여러분도 성공의 주인공이 되어보세요!
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            검증된 강의로 새로운 도전을 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              강의 둘러보기
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              무료 회원가입
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
