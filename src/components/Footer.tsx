import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-blue-400 mb-4">타이탄클래스</h3>
            <p className="text-gray-300 mb-4">
              최고의 온라인 강의 플랫폼으로 여러분의 성장을 도와드립니다.
              전문가들이 제작한 고품질 강의를 만나보세요.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                Facebook
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                Twitter
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                Instagram
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-blue-400">
                  강의 목록
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-blue-400">
                  카테고리
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-blue-400">
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">고객 지원</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-blue-400">
                  도움말
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-blue-400">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-blue-400">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-blue-400">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 타이탄클래스. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  )
}
