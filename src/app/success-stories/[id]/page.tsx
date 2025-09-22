'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { successStories } from '@/data/successStories'
import { 
  Star, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Heart,
  MessageCircle,
  Eye,
  Download,
  CheckCircle,
  Clock,
  Target,
  DollarSign
} from 'lucide-react'

export default function SuccessStoryDetailPage() {
  const params = useParams()
  const [story, setStory] = useState<SuccessStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const storyId = parseInt(params.id as string)
    const foundStory = successStories.find(s => s.id === storyId)
    setStory(foundStory || null)
    setLoading(false)
    setLikes(Math.floor(Math.random() * 100) + 50) // 랜덤 좋아요 수
  }, [params.id])

  const formatRevenue = (revenue: number) => {
    if (revenue >= 100000000) {
      return `${(revenue / 100000000).toFixed(1)}억원`
    } else if (revenue >= 10000) {
      return `${(revenue / 10000).toFixed(0)}만원`
    } else {
      return `${revenue.toLocaleString()}원`
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title,
        text: story?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다!')
    }
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
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">스토리를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">요청하신 성공 스토리가 존재하지 않습니다.</p>
          <Link
            href="/success-stories"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            수익화 인증 목록으로 돌아가기
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
            href="/success-stories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            수익화 인증 목록으로 돌아가기
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full mr-3">
                  {story.category}
                </span>
                {story.verified && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    검증완료
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {story.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {story.description}
              </p>
              
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="mr-4">{story.publishDate}</span>
                <Users className="w-4 h-4 mr-1" />
                <span>작성자: {story.author}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 ml-8">
              <button
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                {likes}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-t py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">수익 현황</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatRevenue(story.revenue)}
              </div>
              <div className="text-gray-600">월 수익</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {story.period}
              </div>
              <div className="text-gray-600">달성 기간</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {story.platform}
              </div>
              <div className="text-gray-600">주요 플랫폼</div>
            </div>
          </div>

          {/* Before/After Stats Comparison */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Before vs After 비교</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">시작 전</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">팔로워 수</span>
                    <span className="font-semibold">{story.beforeStats.followers.toLocaleString()}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">월 수익</span>
                    <span className="font-semibold">{formatRevenue(story.beforeStats.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">참여도</span>
                    <span className="font-semibold">{story.beforeStats.engagement}%</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">현재</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">팔로워 수</span>
                    <span className="font-semibold text-green-600">{story.afterStats.followers.toLocaleString()}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">월 수익</span>
                    <span className="font-semibold text-green-600">{formatRevenue(story.afterStats.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">참여도</span>
                    <span className="font-semibold text-green-600">{story.afterStats.engagement}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Story */}
      <section className="bg-white border-t py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">상세 스토리</h2>
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {story.detailedStory}
            </div>
          </div>
        </div>
      </section>


      {/* Challenges & Solutions */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-500" />
                어려웠던 점
              </h3>
              <ul className="space-y-3">
                {story.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-700">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                해결 방법
              </h3>
              <ul className="space-y-3">
                {story.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">성공 팁</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {story.tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            여러분도 성공할 수 있습니다!
          </h2>
          <p className="text-xl mb-8 text-green-100">
            검증된 방법으로 안전하고 확실한 성공을 시작하세요
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
