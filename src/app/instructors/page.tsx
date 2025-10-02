import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Star, Users, FileText, Award, TrendingUp, Play } from 'lucide-react'

const instructors = [
  {
    id: 1,
    name: '작은성공',
    nickname: '작은성공 강사님',
    specialty: '블로그 수익화 전문가',
    description: '월 300만원 블로그 수익의 비밀을 알려드립니다',
    avatar: '🎯',
    rating: 4.9,
    students: 15234,
    courses: 8,
    totalRevenue: '월 300만원+',
    experience: '5년',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    achievements: [
      '월 300만원 블로그 수익 달성',
      '수강생 만족도 99%',
      '네이버 블로그 상위 노출 전문가',
      '구글 애드센스 최적화 마스터'
    ],
    courses_taught: [
      '블로그 수익화 완벽 가이드',
      '구글 애드센스 마스터클래스',
      '네이버 블로그 최적화 전략'
    ],
    intro: '안녕하세요, 작은성공입니다. 평범한 직장인에서 시작해 블로그만으로 월 300만원의 수익을 만들어낸 노하우를 여러분과 공유하고 싶습니다.'
  },
  {
    id: 2,
    name: '잘나가는서과장',
    nickname: '잘나가는서과장 강사님',
    specialty: '직장인 부업 전문가',
    description: '회사 다니면서도 월 500만원 버는 부업 노하우',
    avatar: '💼',
    rating: 4.8,
    students: 12876,
    courses: 6,
    totalRevenue: '월 500만원+',
    experience: '7년',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    achievements: [
      '직장인 부업 분야 1위',
      '실제 수익 인증 완료',
      '부업으로 연봉 2배 달성',
      '1만명+ 수강생 배출'
    ],
    courses_taught: [
      '직장인을 위한 부업 가이드',
      '투잡으로 연봉 2배 만들기',
      '시간 관리 마스터클래스'
    ],
    intro: '직장 생활 10년차, 부업으로 본업 수입을 넘어선 노하우를 전수합니다. 시간이 부족한 직장인들도 충분히 할 수 있는 현실적인 방법들을 알려드려요.'
  },
  {
    id: 3,
    name: '알파남',
    nickname: '알파남 강사님',
    specialty: '구글 애드센스 전문가',
    description: '노베이스도 구글 애드센스로 성공하는 방법',
    avatar: '🚀',
    rating: 4.9,
    students: 18543,
    courses: 12,
    totalRevenue: '월 1000만원+',
    experience: '6년',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    achievements: [
      '구글 애드센스 전문가',
      '월 1000만원 수익 달성',
      '승인률 95% 달성',
      '2만명+ 수강생 멘토링'
    ],
    courses_taught: [
      '구글 애드센스 완벽 가이드',
      '블로그 트래픽 폭발 전략',
      'SEO 최적화 마스터'
    ],
    intro: '구글 애드센스 하나로 월 1000만원을 달성한 노하우를 공개합니다. 초보자도 쉽게 따라할 수 있는 체계적인 방법을 알려드려요.'
  },
  {
    id: 4,
    name: '어비',
    nickname: '어비 강사님',
    specialty: '유튜브 크리에이터',
    description: '구독자 10만 달성 비법 대공개',
    avatar: '📺',
    rating: 4.7,
    students: 9876,
    courses: 5,
    totalRevenue: '월 800만원+',
    experience: '4년',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    achievements: [
      '유튜브 구독자 50만+',
      '월 800만원 수익 달성',
      '바이럴 영상 100개+ 제작',
      '크리에이터 멘토링 전문가'
    ],
    courses_taught: [
      '유튜브 채널 성장 전략',
      '바이럴 영상 제작법',
      '유튜브 수익화 완벽 가이드'
    ],
    intro: '0명에서 시작해 구독자 50만을 달성한 유튜브 성장 비법을 알려드립니다. 영상 제작부터 수익화까지 모든 과정을 함께해요.'
  },
  {
    id: 5,
    name: '광마스터',
    nickname: '광마 강사님',
    specialty: '쿠팡 파트너스 전문가',
    description: '주부도 억대 매출을 낸 쿠팡 파트너스 비법',
    avatar: '💰',
    rating: 5.0,
    students: 23451,
    courses: 15,
    totalRevenue: '연 10억+',
    experience: '8년',
    background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    achievements: [
      '쿠팡 파트너스 분야 1위',
      '연 매출 10억 달성',
      '주부 수강생 95% 수익 달성',
      '이커머스 마케팅 전문가'
    ],
    courses_taught: [
      '쿠팡 파트너스 마스터',
      'AI 활용 이커머스 전략',
      '온라인 쇼핑몰 창업 가이드'
    ],
    intro: '평범한 주부에서 시작해 연 매출 10억을 달성한 쿠팡 파트너스의 모든 것을 알려드립니다. 누구나 따라할 수 있는 체계적인 방법을 공유해요.'
  },
  {
    id: 6,
    name: '자생법',
    nickname: '자생법 강사님',
    specialty: '유튜브 성장 전문가',
    description: '멱살캐리 채널 성장법의 창시자',
    avatar: '🎬',
    rating: 4.9,
    students: 16789,
    courses: 11,
    totalRevenue: '월 1200만원+',
    experience: '5년',
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    achievements: [
      '유튜브 성장 전문가',
      '구독자 100만 달성',
      '멱살캐리 방법론 개발',
      '월 1200만원 수익 달성'
    ],
    courses_taught: [
      '유튜브 멱살캐리 성장법',
      '쇼츠 바이럴 전략',
      '유튜브 알고리즘 공략법'
    ],
    intro: '노베이스에서 시작해 구독자 100만을 달성한 멱살캐리 성장법을 공개합니다. 빠르고 확실한 채널 성장 비법을 알려드려요.'
  }
]

export default function InstructorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            타이탄클래스 강사진
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            각 분야 최고의 전문가들이 여러분의 성공을 도와드립니다
          </p>
          <p className="text-lg text-blue-100">
            실제로 성과를 낸 검증된 전문가들의 생생한 노하우를 만나보세요
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                  {/* Instructor Header */}
                  <div
                    className="h-32 relative flex items-center justify-center"
                    style={{ background: instructor.background }}
                  >
                    <div className="text-6xl">{instructor.avatar}</div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>

                  <div className="p-6">
                    {/* Basic Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                      <p className="text-blue-600 font-medium mb-1">{instructor.specialty}</p>
                      <p className="text-gray-600 text-sm">{instructor.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="font-bold text-lg">{instructor.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">평점</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="font-bold text-lg">{(instructor.students / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="text-xs text-gray-500">수강생</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FileText className="w-4 h-4 text-green-500 mr-1" />
                          <span className="font-bold text-lg">{instructor.courses}</span>
                        </div>
                        <div className="text-xs text-gray-500">강의</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="font-bold text-sm">{instructor.experience}</span>
                        </div>
                        <div className="text-xs text-gray-500">경력</div>
                      </div>
                    </div>

                    {/* Introduction */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">강사 소개</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {instructor.intro}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">주요 성과</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {instructor.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <Award className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">대표 강의</h4>
                      <div className="space-y-2">
                        {instructor.courses_taught.map((course, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <Play className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                            <span>{course}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Revenue Badge */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <span className="font-bold">{instructor.totalRevenue} 수익 달성</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/courses?instructor=${instructor.name}`}
                      className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-center block"
                    >
                      {instructor.name} 강사님 강의 보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            당신도 강사가 되어보세요!
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            전문 지식과 경험을 가지고 계신가요? 타이탄클래스와 함께하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/instructor-apply"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              강사 지원하기
            </Link>
            <Link
              href="/courses"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              강의 둘러보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
