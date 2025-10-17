import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Users, Target, Award, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            잘파는클래스
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            실무 전문가들과 함께하는 온라인 교육 플랫폼
          </p>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            누구나 쉽게 배우고, 실제로 수익을 만들 수 있는 실무 중심의 온라인 강의를 제공합니다.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                우리의 미션
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                잘파는클래스는 실무 전문가들의 검증된 노하우를 통해 누구나 쉽게 배우고 
                실제 수익을 창출할 수 있도록 돕는 것이 목표입니다.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                단순한 이론이 아닌, 실제로 성과를 낸 전문가들의 생생한 경험과 
                노하우를 전달하여 학습자들이 빠르게 성장할 수 있도록 지원합니다.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">우리의 약속</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Target className="w-5 h-5 mr-3" />
                    실무 중심의 검증된 콘텐츠
                  </li>
                  <li className="flex items-center">
                    <Users className="w-5 h-5 mr-3" />
                    현업 전문가 강사진
                  </li>
                  <li className="flex items-center">
                    <Award className="w-5 h-5 mr-3" />
                    실제 수익 창출 가능한 교육
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-5 h-5 mr-3" />
                    빠른 성과를 위한 체계적 커리큘럼
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              핵심 가치
            </h2>
            <p className="text-lg text-gray-600">
              잘파는클래스가 추구하는 가치와 철학입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">실무 중심</h3>
              <p className="text-gray-600">
                이론보다는 실제 현장에서 사용할 수 있는 실무 중심의 교육을 제공합니다.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">전문성</h3>
              <p className="text-gray-600">
                각 분야에서 검증된 성과를 낸 전문가들이 직접 강의를 진행합니다.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">성과 지향</h3>
              <p className="text-gray-600">
                단순한 지식 전달이 아닌, 실제 성과와 수익 창출을 목표로 합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">회사 정보</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">회사명</h3>
                    <p className="text-gray-300">주식회사 타이탄컴퍼니</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">대표이사</h3>
                    <p className="text-gray-300">오윤록</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">사업자등록번호</h3>
                    <p className="text-gray-300">409-86-55803</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">통신판매업신고번호</h3>
                    <p className="text-gray-300">2025-서울강남-02444호</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">연락처</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">주소:</span>
                    <p className="text-gray-300">서울특별시 강남구 선릉로 611, 2층 (논현동)</p>
                  </div>
                  <div>
                    <span className="font-medium">전화:</span>
                    <p className="text-gray-300">070-4138-2146</p>
                  </div>
                  <div>
                    <span className="font-medium">이메일:</span>
                    <p className="text-gray-300">titanclass@titanz.co.kr</p>
                  </div>
                  <div>
                    <span className="font-medium">고객센터:</span>
                    <p className="text-gray-300">주중 10:00~18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
