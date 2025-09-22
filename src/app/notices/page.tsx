'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Calendar, Eye, Pin, Search, Filter } from 'lucide-react'

const notices = [
  {
    id: 1,
    title: '[중요] 2024년 12월 무료강의 일정 안내',
    content: '12월 한 달간 진행되는 무료강의 일정을 안내드립니다. 많은 참여 부탁드립니다.',
    date: '2024-12-01',
    views: 1234,
    isPinned: true,
    category: '공지사항'
  },
  {
    id: 2,
    title: '타이탄클래스 앱 출시 예정 안내',
    content: '더욱 편리한 학습을 위한 모바일 앱이 곧 출시됩니다.',
    date: '2024-11-28',
    views: 856,
    isPinned: true,
    category: '업데이트'
  },
  {
    id: 3,
    title: '2024년 연말 특별 할인 이벤트',
    content: '연말을 맞아 모든 유료강의 30% 할인 이벤트를 진행합니다.',
    date: '2024-11-25',
    views: 2341,
    isPinned: false,
    category: '이벤트'
  },
  {
    id: 4,
    title: '새로운 강사진 합류 안내',
    content: '실무 전문가 5명이 새롭게 타이탄클래스에 합류했습니다.',
    date: '2024-11-20',
    views: 567,
    isPinned: false,
    category: '공지사항'
  },
  {
    id: 5,
    title: '[점검] 서버 정기 점검 안내',
    content: '서비스 품질 향상을 위한 정기 점검이 진행됩니다.',
    date: '2024-11-15',
    views: 423,
    isPinned: false,
    category: '점검'
  },
  {
    id: 6,
    title: '수강생 성과 인증 이벤트',
    content: '여러분의 학습 성과를 인증하고 상금을 받아가세요!',
    date: '2024-11-10',
    views: 1876,
    isPinned: false,
    category: '이벤트'
  },
  {
    id: 7,
    title: '고객센터 운영시간 변경 안내',
    content: '더 나은 서비스 제공을 위해 고객센터 운영시간이 변경됩니다.',
    date: '2024-11-05',
    views: 234,
    isPinned: false,
    category: '공지사항'
  },
  {
    id: 8,
    title: '타이탄클래스 1주년 기념 이벤트',
    content: '타이탄클래스 1주년을 기념하여 다양한 이벤트를 준비했습니다.',
    date: '2024-10-30',
    views: 3456,
    isPinned: false,
    category: '이벤트'
  },
  {
    id: 9,
    title: '새로운 결제 시스템 도입 안내',
    content: '더욱 안전하고 편리한 결제를 위한 새로운 시스템이 도입됩니다.',
    date: '2024-10-25',
    views: 789,
    isPinned: false,
    category: '업데이트'
  },
  {
    id: 10,
    title: '강의 품질 개선을 위한 피드백 요청',
    content: '더 나은 강의 제작을 위해 여러분의 소중한 의견을 들려주세요.',
    date: '2024-10-20',
    views: 1123,
    isPinned: false,
    category: '공지사항'
  }
]

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공지사항':
        return 'bg-blue-100 text-blue-800'
      case '이벤트':
        return 'bg-red-100 text-red-800'
      case '업데이트':
        return 'bg-green-100 text-green-800'
      case '점검':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || notice.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const pinnedNotices = filteredNotices.filter(notice => notice.isPinned)
  const regularNotices = filteredNotices.filter(notice => !notice.isPinned)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            공지사항
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            타이탄클래스의 최신 소식과 중요한 안내사항을 확인하세요
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="제목이나 내용으로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 카테고리</option>
              <option value="공지사항">공지사항</option>
              <option value="이벤트">이벤트</option>
              <option value="업데이트">업데이트</option>
              <option value="점검">점검</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Pinned Notices */}
          {pinnedNotices.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Pin className="w-5 h-5 mr-2 text-red-500" />
                중요 공지
              </h2>
              <div className="space-y-4">
                {pinnedNotices.map((notice) => (
                  <div key={notice.id} className="bg-red-50 border-l-4 border-red-500 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(notice.category)}`}>
                            {notice.category}
                          </span>
                          <Pin className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {notice.views.toLocaleString()}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                        {notice.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {notice.content}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(notice.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Notices */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              일반 공지
            </h2>
            <div className="space-y-4">
              {regularNotices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(notice.category)}`}>
                        {notice.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {notice.views.toLocaleString()}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {notice.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {notice.content}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(notice.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex space-x-2">
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                이전
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 text-sm rounded ${
                    page === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                다음
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            문의사항이 있으신가요?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            고객센터를 통해 언제든지 문의해 주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              문의하기
            </Link>
            <Link
              href="/faq"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              자주 묻는 질문
            </Link>
          </div>
          <div className="mt-8 text-blue-100">
            <p>고객센터 운영시간: 주중 10:00~18:00</p>
            <p>이메일: titanclass@titanz.co.kr | 전화: 070-4138-2146</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
