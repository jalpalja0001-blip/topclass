'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Download, Star, Eye, Calendar, Search, Filter } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const ebooks = [
  {
    id: 1,
    title: '블로그 수익화 완벽 가이드',
    description: '월 300만원 블로그 수익의 모든 비밀을 담은 전자책',
    author: '작은성공',
    category: '블로그',
    price: 'FREE',
    originalPrice: 29000,
    downloads: 15234,
    rating: 4.9,
    pages: 120,
    publishDate: '2024.11.15',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['블로그', '수익화', '애드센스', '제휴마케팅']
  },
  {
    id: 2,
    title: 'AI 도구로 시작하는 부업 가이드',
    description: 'ChatGPT, 미드저니 등 AI 도구를 활용한 새로운 수익 창출법',
    author: '파파준스',
    category: 'AI',
    price: 'FREE',
    originalPrice: 39000,
    downloads: 12876,
    rating: 4.8,
    pages: 95,
    publishDate: '2024.11.20',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tags: ['AI', '부업', 'ChatGPT', '자동화']
  },
  {
    id: 3,
    title: '유튜브 채널 성장 전략서',
    description: '구독자 10만 달성을 위한 체계적인 유튜브 성장 로드맵',
    author: '자생법',
    category: '유튜브',
    price: 19000,
    originalPrice: 49000,
    downloads: 8543,
    rating: 4.7,
    pages: 150,
    publishDate: '2024.12.01',
    thumbnail: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    tags: ['유튜브', '채널성장', '구독자', '수익화']
  },
  {
    id: 4,
    title: '쿠팡 파트너스 마스터 가이드',
    description: '주부도 억대 매출을 낸 쿠팡 파트너스 완벽 활용법',
    author: '광마',
    category: '이커머스',
    price: 'FREE',
    originalPrice: 35000,
    downloads: 23451,
    rating: 5.0,
    pages: 88,
    publishDate: '2024.10.28',
    thumbnail: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    tags: ['쿠팡', '이커머스', '파트너스', '수익화']
  },
  {
    id: 5,
    title: '인스타그램 마케팅 실전 가이드',
    description: '팔로워 0명에서 시작해서 월 1000만원 매출 달성하기',
    author: '김다솔',
    category: '마케팅',
    price: 25000,
    originalPrice: 59000,
    downloads: 11234,
    rating: 4.8,
    pages: 180,
    publishDate: '2024.11.10',
    thumbnail: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    tags: ['인스타그램', '마케팅', 'SNS', '팔로워']
  },
  {
    id: 6,
    title: '디지털 노마드 생활 가이드',
    description: '장소에 구애받지 않고 자유롭게 일하며 살아가는 방법',
    author: '어비',
    category: '라이프스타일',
    price: 'FREE',
    originalPrice: 42000,
    downloads: 9876,
    rating: 4.6,
    pages: 95,
    publishDate: '2024.11.25',
    thumbnail: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    tags: ['디지털노마드', '자유', '원격근무', '라이프스타일']
  }
]

export default function EbooksPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ebook.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || ebook.category === selectedCategory
    const matchesPrice = !selectedPrice || 
      (selectedPrice === 'free' && ebook.price === 'FREE') ||
      (selectedPrice === 'paid' && ebook.price !== 'FREE')
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const formatPrice = (price: number | string) => {
    if (price === 'FREE') return '무료'
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price as number)
  }

  const handleDownloadOrPurchase = async (ebook: any) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    setLoading(prev => ({ ...prev, [ebook.id]: true }))

    try {
      const action = ebook.price === 'FREE' ? 'download' : 'purchase'
      
      const response = await fetch('/api/ebooks/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ebookId: ebook.id,
          action: action
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (action === 'download') {
          alert('무료 다운로드가 시작됩니다!')
          // 실제로는 파일 다운로드를 시작합니다
          window.open(data.downloadUrl, '_blank')
        } else {
          alert('구매가 완료되었습니다! 다운로드를 시작합니다.')
          // 실제로는 파일 다운로드를 시작합니다
          window.open(data.downloadUrl, '_blank')
        }
      } else {
        alert(data.error || '처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(prev => ({ ...prev, [ebook.id]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            전자책
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            전문가들의 노하우가 담긴 실무 중심 전자책을 만나보세요
          </p>
          <p className="text-lg text-blue-100">
            무료부터 프리미엄까지, 다양한 주제의 전자책이 준비되어 있습니다
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="제목, 저자, 내용으로 검색..."
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
              <option value="블로그">블로그</option>
              <option value="AI">AI</option>
              <option value="유튜브">유튜브</option>
              <option value="재테크">재테크</option>
              <option value="마케팅">마케팅</option>
              <option value="디자인">디자인</option>
            </select>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 가격</option>
              <option value="free">무료</option>
              <option value="paid">유료</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSelectedPrice('')
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </section>


      {/* Ebooks Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEbooks.map((ebook) => (
              <div key={ebook.id} className="group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">
                  {/* Ebook Cover */}
                  <div
                    className="h-64 relative"
                    style={{ background: ebook.thumbnail }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        ebook.price === 'FREE' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {ebook.price === 'FREE' ? '무료' : '유료'}
                      </span>
                    </div>

                    {/* Download Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-4">
                        <Download className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg line-clamp-2">
                        {ebook.title}
                      </h3>
                    </div>
                  </div>

                  {/* Ebook Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                        {ebook.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span>{ebook.rating}</span>
                      </div>
                    </div>

                    {/* 고정 높이로 설명 텍스트 설정 */}
                    <div className="mb-4 flex-grow">
                      <p className="text-gray-600 text-sm h-10 line-clamp-2">
                        {ebook.description}
                      </p>
                    </div>

                    {/* Tags - 고정 높이 */}
                    <div className="flex flex-wrap gap-1 mb-4 h-8">
                      {ebook.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {ebook.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {ebook.publishDate}
                        </div>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="text-sm text-gray-600 mb-4">
                      저자: <span className="font-medium text-gray-900">{ebook.author}</span>
                    </div>

                    {/* Price & Download - 하단 고정 */}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        {ebook.price === 'FREE' ? (
                          <div className="text-xl font-bold text-green-600">무료</div>
                        ) : (
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              {formatPrice(ebook.price)}
                            </div>
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(ebook.originalPrice)}
                            </div>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDownloadOrPurchase(ebook)}
                        disabled={loading[ebook.id]}
                        className={`px-6 py-2 rounded-lg text-sm transition-colors flex items-center ${
                          loading[ebook.id]
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {loading[ebook.id] 
                          ? '처리중...' 
                          : ebook.price === 'FREE' ? '무료 다운' : '구매하기'
                        }
                      </button>
                    </div>
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
            더 많은 전자책이 궁금하신가요?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            매주 새로운 전문가의 노하우가 담긴 전자책이 업데이트됩니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              온라인 강의 보기
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              회원가입하기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
