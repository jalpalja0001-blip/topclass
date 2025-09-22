'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User, 
  Clock, 
  MessageCircle, 
  ThumbsUp, 
  Users, 
  Share2, 
  Flag,
  Edit,
  Trash2
} from 'lucide-react'

interface Post {
  id: number
  title: string
  author: string
  category: string
  content: string
  replies: number
  likes: number
  views: number
  timeAgo: string
  isHot: boolean
  tags?: string[]
  createdAt: string
}

interface Comment {
  id: number
  author: string
  content: string
  timeAgo: string
  likes: number
}

// 더미 데이터 (실제로는 API에서 가져와야 함)
const posts: Post[] = [
  {
    id: 1,
    title: '인스타그램 마케팅 팁 공유',
    author: '한인스타',
    category: '정보공유',
    content: `안녕하세요! 인스타그램 마케팅에 대해 공유하고 싶은 팁들이 있어서 글을 작성합니다.

**1. 알고리즘 이해하기**
인스타그램의 알고리즘은 사용자의 관심사와 행동 패턴을 분석합니다. 따라서:
- 일관된 포스팅 시간 유지
- 해시태그 전략적 사용
- 스토리와 릴스 적극 활용

**2. 콘텐츠 전략**
- 고품질 이미지와 영상 제작
- 사용자와의 소통을 위한 질문이나 설문 활용
- 트렌드에 민감하게 반응

**3. 해시태그 활용법**
- 너무 많은 해시태그보다는 관련성 높은 10-15개 사용
- 인기 해시태그와 니치 해시태그 조합
- 브랜드 고유 해시태그 생성

**4. 스토리 마케팅**
- 24시간 제한을 활용한 긴급성 조성
- 스토리 하이라이트로 콘텐츠 보관
- 스토리 설문과 투표 기능 활용

이런 방법들로 3개월 만에 팔로워를 5천명에서 2만명으로 늘릴 수 있었습니다. 
궁금한 점 있으시면 댓글로 남겨주세요!`,
    replies: 36,
    likes: 52,
    views: 1890,
    timeAgo: '1일 전',
    isHot: true,
    tags: ['인스타그램', '마케팅', 'SNS', '팔로워'],
    createdAt: '2024-12-20'
  },
  {
    id: 2,
    title: '직장인 부업 시간 관리 노하우',
    author: '윤직장인',
    category: '정보공유',
    content: `직장인으로서 부업을 하면서 시간 관리가 가장 중요하다고 생각합니다.

**시간 관리 원칙:**
1. 아침 시간 활용 (5-7시)
2. 점심시간 활용 (12-1시)
3. 저녁 시간 활용 (7-10시)
4. 주말 집중 시간 (토요일 오전)

**효율적인 방법:**
- 할 일을 우선순위별로 정리
- 시간 블록으로 작업 구분
- 휴대폰 알림 끄고 집중
- 주간 목표 설정

이렇게 하니 월 50만원 부업 수익을 달성할 수 있었습니다.`,
    replies: 19,
    likes: 33,
    views: 967,
    timeAgo: '1일 전',
    isHot: false,
    tags: ['부업', '시간관리', '직장인'],
    createdAt: '2024-12-20'
  }
  // 다른 게시글들도 비슷하게 추가 가능
]

const comments: Comment[] = [
  {
    id: 1,
    author: '마케터김',
    content: '정말 유용한 정보네요! 특히 해시태그 전략 부분이 도움이 많이 됐습니다.',
    timeAgo: '2시간 전',
    likes: 5
  },
  {
    id: 2,
    author: '인플루언서박',
    content: '스토리 마케팅 팁 정말 좋네요. 바로 적용해보겠습니다!',
    timeAgo: '4시간 전',
    likes: 3
  },
  {
    id: 3,
    author: '초보자이',
    content: '궁금한 게 있는데 DM으로 연락드려도 될까요?',
    timeAgo: '6시간 전',
    likes: 1
  }
]

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(true)

  useEffect(() => {
    const postId = parseInt(params.id as string)
    const foundPost = posts.find(p => p.id === postId)
    setPost(foundPost || null)
    setLoading(false)
    if (foundPost) {
      setLikes(foundPost.likes)
    }
  }, [params.id])

  const handleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      // 실제로는 API 호출
      console.log('댓글 작성:', newComment)
      setNewComment('')
      alert('댓글이 작성되었습니다!')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + '...',
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
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">게시글을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">요청하신 게시글이 존재하지 않습니다.</p>
          <Link
            href="/community"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            커뮤니티로 돌아가기
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
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{post.author}</div>
                  <div className="text-sm text-gray-500">{post.timeAgo}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {post.isHot && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    HOT
                  </span>
                )}
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {post.category}
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.replies}
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {likes}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {post.views}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
                    liked 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                  좋아요
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  공유
                </button>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  댓글 {comments.length}개
                </h3>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {showComments ? '숨기기' : '보기'}
                </button>
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 작성해주세요..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        댓글 작성
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              {showComments && (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">{comment.timeAgo}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center hover:text-gray-700">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.likes}
                          </button>
                          <button className="hover:text-gray-700">답글</button>
                          <button className="hover:text-gray-700">신고</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
