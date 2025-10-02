'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { successStories } from '@/data/successStories'
import { Star, TrendingUp, Users, Award, Calendar, Search, Filter } from 'lucide-react'

export default function SuccessStoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')

  const filteredStories = successStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || story.category === selectedCategory
    const matchesPlatform = !selectedPlatform || story.platform === selectedPlatform
    
    return matchesSearch && matchesCategory && matchesPlatform
  })

  const formatRevenue = (revenue: number) => {
    if (revenue >= 100000000) {
      return `${(revenue / 100000000).toFixed(1)}억원`
    } else if (revenue >= 10000) {
      return `${(revenue / 10000).toFixed(0)}만원`
    } else {
      return `${revenue.toLocaleString()}원`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            수익화 인증
          </h1>
          <p className="text-xl mb-8 text-green-100">
            실제 수강생들의 성공 스토리와 수익화 사례를 확인하세요
          </p>
          <p className="text-lg text-green-100 mb-8">
            검증된 수익화 방법으로 여러분도 성공할 수 있습니다
          </p>
          <Link
            href="/success-stories/write"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            성공 스토리 작성하기
          </Link>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">모든 카테고리</option>
              <option value="블로그">블로그</option>
              <option value="유튜브">유튜브</option>
              <option value="이커머스">이커머스</option>
              <option value="마케팅">마케팅</option>
              <option value="AI">AI</option>
              <option value="교육">교육</option>
            </select>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">모든 플랫폼</option>
              <option value="네이버 블로그">네이버 블로그</option>
              <option value="유튜브">유튜브</option>
              <option value="쿠팡 파트너스">쿠팡 파트너스</option>
              <option value="인스타그램">인스타그램</option>
              <option value="다양한 플랫폼">다양한 플랫폼</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSelectedPlatform('')
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <Link key={story.id} href={`/success-stories/${story.id}`} className="group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">
                  {/* Category Badge */}
                  <div className="h-48 bg-gradient-to-r from-green-500 to-blue-600 relative rounded-t-lg">
                    <div className="absolute inset-0 bg-black/20" />
                    
                    
                    {/* Category */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm opacity-90">{story.category}</div>
                      <div className="text-lg font-bold">{story.title}</div>
                    </div>
                  </div>

                  {/* Story Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                        {story.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{story.publishDate}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {story.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {story.description}
                    </p>

                    {/* Revenue Stats */}
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatRevenue(story.revenue)}
                          </div>
                          <div className="text-xs text-gray-500">월 수익</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {story.period}
                          </div>
                          <div className="text-xs text-gray-500">달성 기간</div>
                        </div>
                      </div>
                    </div>

                    {/* Platform */}
                    <div className="text-sm text-gray-600 mb-4">
                      플랫폼: <span className="font-medium text-gray-900">{story.platform}</span>
                    </div>

                    {/* Author */}
                    <div className="text-sm text-gray-600 mb-4">
                      작성자: <span className="font-medium text-gray-900">{story.author}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-auto">
                      <div className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        상세 보기
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            여러분도 성공할 수 있습니다!
          </h2>
          <p className="text-xl mb-8 text-green-100">
            검증된 방법으로 안전하고 확실한 수익화를 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              강의 보러가기
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
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
