import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle, Users, TrendingUp, Award, DollarSign, Clock } from 'lucide-react'

export default function InstructorApplyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            타이탄클래스 강사가 되어보세요
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            당신의 전문 지식으로 많은 사람들의 성공을 도와주세요
          </p>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            검증된 노하우와 실무 경험을 가진 전문가라면 누구나 타이탄클래스 강사가 될 수 있습니다.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              타이탄클래스 강사의 혜택
            </h2>
            <p className="text-lg text-gray-600">
              강사님만을 위한 특별한 혜택들을 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">높은 수익률</h3>
              <p className="text-gray-600 mb-4">
                강의 판매 수익의 최대 70%를 강사님께 지급합니다
              </p>
              <div className="text-2xl font-bold text-blue-600">최대 70%</div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">마케팅 지원</h3>
              <p className="text-gray-600 mb-4">
                전문 마케팅 팀이 강의 홍보를 적극 지원합니다
              </p>
              <div className="text-2xl font-bold text-green-600">100% 지원</div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">브랜딩 지원</h3>
              <p className="text-gray-600 mb-4">
                개인 브랜드 구축을 위한 전문적인 지원을 제공합니다
              </p>
              <div className="text-2xl font-bold text-purple-600">전문 지원</div>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">제작 지원</h3>
              <p className="text-gray-600 mb-4">
                강의 촬영부터 편집까지 전 과정을 지원합니다
              </p>
              <div className="text-2xl font-bold text-yellow-600">풀 서비스</div>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">빠른 런칭</h3>
              <p className="text-gray-600 mb-4">
                강의 기획부터 런칭까지 최대 4주 내 완료
              </p>
              <div className="text-2xl font-bold text-red-600">4주 이내</div>
            </div>

            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">커뮤니티</h3>
              <p className="text-gray-600 mb-4">
                강사님들만의 전용 커뮤니티와 네트워킹 기회
              </p>
              <div className="text-2xl font-bold text-indigo-600">전용 커뮤니티</div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              강사 지원 자격
            </h2>
            <p className="text-lg text-gray-600">
              아래 조건 중 하나라도 해당되시면 지원 가능합니다
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">필수 조건</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">실무 경험 3년 이상</h4>
                    <p className="text-gray-600">해당 분야에서 최소 3년 이상의 실무 경험</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">검증 가능한 성과</h4>
                    <p className="text-gray-600">수익, 성장률 등 객관적으로 검증 가능한 성과</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">강의 열정</h4>
                    <p className="text-gray-600">지식 공유에 대한 열정과 책임감</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">우대 조건</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">온라인 강의 경험</h4>
                    <p className="text-gray-600">이전 온라인 강의 제작 및 운영 경험</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">SNS 팔로워</h4>
                    <p className="text-gray-600">관련 분야 SNS 팔로워 1만명 이상</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">저서 또는 블로그</h4>
                    <p className="text-gray-600">관련 분야 저서 출간 또는 인기 블로그 운영</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              강사 지원 프로세스
            </h2>
            <p className="text-lg text-gray-600">
              간단한 4단계로 타이탄클래스 강사가 되실 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">지원서 제출</h3>
              <p className="text-gray-600">
                온라인 지원서와 포트폴리오를 제출해주세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">서류 심사</h3>
              <p className="text-gray-600">
                제출해주신 자료를 바탕으로 1차 심사를 진행합니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">면접 진행</h3>
              <p className="text-gray-600">
                화상 면접을 통해 강의 계획과 비전을 공유해주세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">계약 체결</h3>
              <p className="text-gray-600">
                최종 합격 후 강사 계약을 체결하고 강의 제작을 시작합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 지원하세요!
            </h2>
            <p className="text-xl text-blue-100">
              여러분의 전문 지식을 기다리고 있습니다
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 text-gray-900">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="010-1234-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전문 분야 *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="블로그">블로그</option>
                    <option value="유튜브">유튜브</option>
                    <option value="마케팅">마케팅</option>
                    <option value="이커머스">이커머스</option>
                    <option value="디자인">디자인</option>
                    <option value="프로그래밍">프로그래밍</option>
                    <option value="재테크">재테크</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  경력 및 성과 *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="관련 분야 경력과 주요 성과를 구체적으로 작성해주세요 (예: 블로그 월 방문자 10만명, 월 수익 300만원 등)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  강의 주제 및 계획 *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="어떤 주제로 강의를 진행하고 싶으신지, 수강생들에게 어떤 가치를 제공할 수 있는지 작성해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  포트폴리오 링크
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-portfolio.com"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
                  개인정보 수집 및 이용에 동의합니다 *
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                강사 지원하기
              </button>
            </form>
          </div>

          <div className="text-center mt-8 text-blue-100">
            <p className="mb-2">문의사항이 있으시면 언제든지 연락주세요</p>
            <p>이메일: instructor@titanz.co.kr | 전화: 070-4138-2146</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
