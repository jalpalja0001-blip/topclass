'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MessageCircle, Users, TrendingUp, Clock, ThumbsUp, MessageSquare, User, Search, Filter } from 'lucide-react'

const posts = [
  {
    id: 1,
    title: '인스타그램 마케팅 팁 공유',
    author: '한인스타',
    category: '정보공유',
    content: '인스타그램 알고리즘 이해하고 팔로워 늘리는 방법들 정리해봤습니다.',
    replies: 36,
    likes: 52,
    views: 1890,
    timeAgo: '1일 전',
    isHot: true
  },
  {
    id: 2,
    title: '직장인 부업 시간 관리 노하우',
    author: '윤직장인',
    category: '정보공유',
    content: '회사 다니면서 부업하는 시간 관리 방법들을 공유합니다.',
    replies: 19,
    likes: 33,
    views: 967,
    timeAgo: '1일 전',
    isHot: false
  },
  {
    id: 3,
    title: '디지털 노마드 준비 과정',
    author: '강노마드',
    category: '정보공유',
    content: '디지털 노마드로 전환하기까지의 과정과 준비사항들을 정리했습니다.',
    replies: 27,
    likes: 38,
    views: 1345,
    timeAgo: '2일 전',
    isHot: false
  },
  {
    id: 4,
    title: '구글 애드센스 승인 조건이 궁금해요',
    author: '초보자김',
    category: '질문답변',
    content: '블로그 시작한 지 3개월인데 애드센스 승인 받을 수 있을까요?',
    replies: 15,
    likes: 8,
    views: 234,
    timeAgo: '3시간 전',
    isHot: false
  },
  {
    id: 5,
    title: '유튜브 썸네일 만드는 프로그램 추천',
    author: '유튜버준비생',
    category: '질문답변',
    content: '무료로 썸네일 잘 만들 수 있는 프로그램 있나요?',
    replies: 23,
    likes: 12,
    views: 456,
    timeAgo: '5시간 전',
    isHot: false
  },
  {
    id: 6,
    title: '쿠팡 파트너스 수수료 계산법',
    author: '이커머스',
    category: '질문답변',
    content: '쿠팡 파트너스 수수료가 어떻게 계산되는지 궁금합니다.',
    replies: 18,
    likes: 9,
    views: 312,
    timeAgo: '7시간 전',
    isHot: false
  },
  {
    id: 7,
    title: '오늘 하루도 화이팅!',
    author: '동기부여왕',
    category: '자유게시판',
    content: '모두들 수익화 목표 달성하시길 바랍니다. 함께 화이팅!',
    replies: 45,
    likes: 67,
    views: 789,
    timeAgo: '1시간 전',
    isHot: true
  },
  {
    id: 8,
    title: '새해 목표 설정했어요',
    author: '목표설정러',
    category: '자유게시판',
    content: '2024년 목표로 월 100만원 수익 달성하기로 했습니다.',
    replies: 32,
    likes: 41,
    views: 567,
    timeAgo: '2일 전',
    isHot: false
  }
]

// 카테고리별 게시글 수 계산
const getCategoryCount = (categoryName: string) => {
  if (categoryName === '전체') return posts.length
  return posts.filter(post => post.category === categoryName).length
}

const categories = [
  { name: '전체', count: getCategoryCount('전체'), active: true },
  { name: '정보공유', count: getCategoryCount('정보공유'), active: false },
  { name: '질문답변', count: getCategoryCount('질문답변'), active: false },
  { name: '자유게시판', count: getCategoryCount('자유게시판'), active: false }
]

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 필터링된 게시글
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // 페이지네이션
  const postsPerPage = 8
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setCurrentPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            커뮤니티
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            함께 성장하는 학습자들의 소통 공간
          </p>
          <p className="text-lg text-blue-100">
            성공 후기, 정보 공유, 질문과 답변을 통해 함께 발전해보세요
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* 검색 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">검색</h3>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="제목, 내용, 작성자 검색..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  검색
                </button>
              </form>
            </div>

            {/* 카테고리 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">카테고리</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">인기 태그</h3>
              <div className="flex flex-wrap gap-2">
                {['#블로그수익화', '#구글애드센스', '#유튜브성장', '#쿠팡파트너스', '#AI부업', '#인스타마케팅'].map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === '전체' ? '최신 게시글' : `${selectedCategory} 게시글`}
                  </h2>
                  <p className="text-gray-600">총 {filteredPosts.length}개의 게시글이 있습니다</p>
                </div>
                <Link
                  href="/community/write"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  글쓰기
                </Link>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {paginatedPosts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-500 text-lg mb-4">검색 결과가 없습니다</div>
                  <p className="text-gray-400">다른 검색어나 카테고리를 시도해보세요</p>
                </div>
              ) : (
                paginatedPosts.map((post) => (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md hover:border-blue-300 border border-transparent transition-all duration-200 cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{post.author}</div>
                          <div className="text-sm text-gray-500">{post.timeAgo}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {post.isHot && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            HOT
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.replies}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {post.views}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.timeAgo}
                      </div>
                    </div>
                  </div>
                </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex space-x-2">
                  <button 
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-2 text-sm rounded ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
