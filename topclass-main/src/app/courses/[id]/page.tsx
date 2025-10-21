'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VimeoPlayer from '@/components/VimeoPlayer'
import { useAuth } from '@/contexts/AuthContext'
import { Clock, Users, Star, Play, ShoppingCart, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'


interface Course {
  id: string
  title: string
  description: string
  instructor: string
  price: number
  original_price?: number
  thumbnail_url?: string
  detail_image_url?: string
  duration: number
  level: string
  category: string
  status: string
  published: boolean
  is_featured: boolean
  is_free: boolean
  student_count: number
  rating: number
  review_count: number
  tags: string[]
  video_url?: string // 자체 호스팅 비디오 URL
  vimeo_url?: string // Vimeo 비디오 URL
  created_at: string
  updated_at: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const { user } = useAuth()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPurchased, setIsPurchased] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    fetchCourse()
    if (user) {
      checkPurchaseStatus()
      checkEnrollmentStatus()
    }
  }, [courseId, user])

  // 수강신청 상태 확인 (실제 데이터베이스에서 조회)
  // useEffect(() => {
  //   console.log('🔧 강제 수강신청 상태 설정')
  //   setIsEnrolled(true)
  // }, [])

  const fetchCourse = async () => {
    try {
      // 강의 목록 API를 사용하여 특정 강의 조회
      const response = await fetch(`/api/courses`)
      const data = await response.json()

      if (data.success && data.data.courses) {
        // ID로 특정 강의 찾기
        const foundCourse = data.data.courses.find((c: any) => c.id === courseId)
        if (foundCourse) {
          console.log('📚 강의 데이터 로드됨:', foundCourse)
          console.log('🎬 비디오 URL:', foundCourse.video_url)
          
          // video_url은 데이터베이스에서 조회됨 (URL 또는 임베드 코드)
          
          setCourse(foundCourse)
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkPurchaseStatus = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/purchases/check?courseId=${courseId}`)
      const data = await response.json()
      
      if (data.success) {
        setIsPurchased(data.purchased)
      }
    } catch (error) {
      console.error('Error checking purchase status:', error)
    }
  }

  const checkEnrollmentStatus = async () => {
    if (!user) return

    try {
      console.log('🔍 수강신청 상태 확인 시작:', {
        courseCategory: course?.category,
        userId: user?.id
      })
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        console.log('❌ 세션이 없습니다.')
        return
      }

      const response = await fetch(`/api/enrollments/check?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      const data = await response.json()
      
      console.log('📋 수강신청 상태 응답:', data)
      
      if (data.success) {
        console.log('✅ 수강신청 상태:', data.enrolled)
        setIsEnrolled(data.enrolled)
      } else {
        console.log('❌ 수강신청 상태 확인 실패:', data.error)
        setIsEnrolled(false)
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error)
      // 오류 발생 시 무료강의인 경우 수강신청 완료로 처리
      if (course?.category === '무료강의') {
        setIsEnrolled(true)
      }
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login'
      return
    }

    setPurchasing(true)
    try {
      // Supabase에서 현재 사용자의 세션 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        alert('로그인이 필요합니다.')
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          courseId: courseId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to payment page or show success message
        setIsPurchased(true)
        alert('강의 구매가 완료되었습니다!')
      } else {
        alert('구매 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error purchasing course:', error)
      alert('구매 중 오류가 발생했습니다.')
    } finally {
      setPurchasing(false)
    }
  }

  const handleFreeEnrollment = async () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    setEnrolling(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        alert('로그인이 필요합니다.')
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('/api/enrollments/free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          courseId: courseId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsEnrolled(true)
        alert('무료 강의 수강신청이 완료되었습니다!')
        // 수강신청 완료 후 내 강의 페이지로 이동할지 묻기
        const goToMyCourses = confirm('내 강의 페이지로 이동하시겠습니까?')
        if (goToMyCourses) {
          window.location.href = '/my-courses'
        }
      } else {
        alert(data.message || '수강신청 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error enrolling in free course:', error)
      alert('수강신청 중 오류가 발생했습니다.')
    } finally {
      setEnrolling(false)
    }
  }

  const handlePaidEnrollment = async () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    setEnrolling(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        alert('로그인이 필요합니다.')
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('/api/enrollments/paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          courseId: courseId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsEnrolled(true)
        alert('유료 강의 수강신청이 완료되었습니다!')
        // 수강신청 완료 후 내 강의 페이지로 이동할지 묻기
        const goToMyCourses = confirm('내 강의 페이지로 이동하시겠습니까?')
        if (goToMyCourses) {
          window.location.href = '/my-courses'
        }
      } else {
        alert(data.message || '수강신청 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error enrolling in paid course:', error)
      alert('수강신청 중 오류가 발생했습니다.')
    } finally {
      setEnrolling(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`
    }
    return `${remainingSeconds}초`
  }

  const getTotalDuration = () => {
    return course?.duration || 0
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return '초급'
      case 'intermediate':
        return '중급'
      case 'advanced':
        return '고급'
      default:
        return level
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 비디오 ID 추출 함수 (다중 플랫폼 지원)
  const getVideoId = (url: string) => {
    console.log('🔍 URL 파싱 시작:', url)
    
    // 먼저 임베드 코드인지 확인 (iframe 태그가 포함된 경우)
    if (url.includes('<iframe') || url.includes('src=')) {
      console.log('🔍 임베드 코드 감지 시도:', url)
      
      // src 속성 추출
      const srcMatch = url.match(/src=["']([^"']+)["']/i)
      if (srcMatch) {
        const srcUrl = srcMatch[1]
        console.log('✅ src URL 추출:', srcUrl)
        
        // 추출된 URL이 어떤 플랫폼인지 확인
        if (srcUrl.includes('vimeo.com')) {
          const vimeoMatch = srcUrl.match(/vimeo\.com\/video\/(\d+)/)
          if (vimeoMatch) {
            console.log('✅ Vimeo 임베드 코드 감지:', vimeoMatch[1])
            return { type: 'vimeo', id: vimeoMatch[1] }
          }
        }
        
        if (srcUrl.includes('youtube.com') || srcUrl.includes('youtu.be')) {
          const youtubeMatch = srcUrl.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/)
          if (youtubeMatch) {
            console.log('✅ YouTube 임베드 코드 감지:', youtubeMatch[1])
            return { type: 'youtube', id: youtubeMatch[1] }
          }
        }
        
        // 기타 플랫폼은 직접 임베드로 처리
        console.log('✅ 일반 임베드 코드 감지:', srcUrl)
        return { type: 'embed', id: srcUrl }
      }
    }
    
    // Vimeo URL 처리
    const vimeoPatterns = [
      /vimeo\.com\/(\d+)/,  // https://vimeo.com/123456789
      /vimeo\.com\/.*\/(\d+)/,  // https://vimeo.com/channels/staffpicks/123456789
      /vimeo\.com\/video\/(\d+)/,  // https://vimeo.com/video/123456789
    ]
    
    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern)
      if (match) {
        console.log('✅ Vimeo URL 감지:', match[1])
        return { type: 'vimeo', id: match[1] }
      }
    }
    
    // YouTube URL 처리
    const youtubePatterns = [
      /youtube\.com\/watch\?v=([^&\n?#]+)/,  // https://youtube.com/watch?v=VIDEO_ID
      /youtu\.be\/([^&\n?#]+)/,  // https://youtu.be/VIDEO_ID
      /youtube\.com\/embed\/([^&\n?#]+)/,  // https://youtube.com/embed/VIDEO_ID
    ]
    
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern)
      if (match) {
        console.log('✅ YouTube URL 감지:', match[1])
        return { type: 'youtube', id: match[1] }
      }
    }
    
    // Loom URL 처리
    const loomPatterns = [
      /loom\.com\/share\/([^&\n?#]+)/,  // https://loom.com/share/VIDEO_ID
      /loom\.com\/embed\/([^&\n?#]+)/,  // https://loom.com/embed/VIDEO_ID
    ]
    
    for (const pattern of loomPatterns) {
      const match = url.match(pattern)
      if (match) {
        console.log('✅ Loom URL 감지:', match[1])
        return { type: 'loom', id: match[1] }
      }
    }
    
    // Wistia URL 처리
    const wistiaPatterns = [
      /wistia\.com\/medias\/([^&\n?#]+)/,  // https://wistia.com/medias/VIDEO_ID
      /wistia\.net\/embed\/([^&\n?#]+)/,  // https://wistia.net/embed/VIDEO_ID
    ]
    
    for (const pattern of wistiaPatterns) {
      const match = url.match(pattern)
      if (match) {
        console.log('✅ Wistia URL 감지:', match[1])
        return { type: 'wistia', id: match[1] }
      }
    }
    
    // 자체 호스팅 비디오 (MP4, WebM 등)
    const selfHostedPatterns = [
      /\.(mp4|webm|ogg|mov)$/i,  // 비디오 파일 확장자
    ]
    
    for (const pattern of selfHostedPatterns) {
      if (pattern.test(url)) {
        console.log('✅ 자체 호스팅 비디오 감지:', url)
        return { type: 'self-hosted', id: url }
      }
    }
    
    
    console.log('❌ 지원하지 않는 URL 형식')
    return null
  }

  // 비디오 플레이어 렌더링 함수
  const renderVideoPlayer = (videoUrl: string) => {
    console.log('🎬 비디오 URL:', videoUrl)
    console.log('🔍 URL 분석:', {
      length: videoUrl?.length,
      isIframe: videoUrl?.includes('<iframe'),
      isUrl: videoUrl?.startsWith('http'),
      firstChars: videoUrl?.substring(0, 50)
    })
    const videoInfo = getVideoId(videoUrl)
    console.log('🔍 비디오 정보:', videoInfo)
    
    if (!videoInfo) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">지원하지 않는 동영상 형식</p>
            <p className="text-sm">Vimeo 또는 YouTube URL을 입력해주세요.</p>
            <p className="text-xs mt-2">입력된 URL: {videoUrl}</p>
          </div>
        </div>
      )
    }

    if (videoInfo.type === 'vimeo') {
      const vimeoUrl = `https://player.vimeo.com/video/${videoInfo.id}?autoplay=0&title=0&byline=0&portrait=0&color=ffffff`
      console.log('🎥 Vimeo 플레이어 URL:', vimeoUrl)
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={vimeoUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title="Vimeo video player"
            onLoad={() => console.log('✅ Vimeo iframe 로드 완료')}
            onError={(e) => console.error('❌ Vimeo iframe 로드 오류:', e)}
          ></iframe>
        </div>
      )
    }

    if (videoInfo.type === 'youtube') {
      const youtubeUrl = `https://www.youtube.com/embed/${videoInfo.id}?autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0`
      console.log('🎥 YouTube 플레이어 URL:', youtubeUrl)
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={youtubeUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title="YouTube video player"
          ></iframe>
        </div>
      )
    }

    if (videoInfo.type === 'loom') {
      const loomUrl = `https://loom.com/embed/${videoInfo.id}`
      console.log('🎥 Loom 플레이어 URL:', loomUrl)
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={loomUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title="Loom video player"
          ></iframe>
        </div>
      )
    }

    if (videoInfo.type === 'wistia') {
      const wistiaUrl = `https://fast.wistia.net/embed/iframe/${videoInfo.id}`
      console.log('🎥 Wistia 플레이어 URL:', wistiaUrl)
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={wistiaUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title="Wistia video player"
          ></iframe>
        </div>
      )
    }

    if (videoInfo.type === 'self-hosted') {
      console.log('🎥 자체 호스팅 비디오:', videoInfo.id)
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={videoInfo.id}
            width="100%"
            height="100%"
            controls
            preload="metadata"
            className="w-full h-full"
            title="Self-hosted video"
            onLoadStart={() => console.log('✅ 비디오 로딩 시작')}
            onCanPlay={() => console.log('✅ 비디오 재생 준비 완료')}
            onError={(e) => console.error('❌ 비디오 로드 오류:', e)}
          >
            <source src={videoInfo.id} type="video/mp4" />
            <source src={videoInfo.id} type="video/webm" />
            <source src={videoInfo.id} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    if (videoInfo.type === 'embed') {
      console.log('🎥 임베드 코드 비디오:', videoInfo.id)
      console.log('🔍 임베드 URL 분석:', {
        url: videoInfo.id,
        isVimeo: videoInfo.id.includes('vimeo.com'),
        isYouTube: videoInfo.id.includes('youtube.com') || videoInfo.id.includes('youtu.be'),
        isLoom: videoInfo.id.includes('loom.com'),
        isWistia: videoInfo.id.includes('wistia.com') || videoInfo.id.includes('wistia.net')
      })
      
      // URL이 완전한지 확인하고 필요시 https 추가
      let embedUrl = videoInfo.id
      if (!embedUrl.startsWith('http')) {
        embedUrl = 'https:' + embedUrl
      }
      
      console.log('🔧 최종 임베드 URL:', embedUrl)
      
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="w-full h-full"
            title="Embedded video"
            onLoad={() => console.log('✅ iframe 로드 완료')}
            onError={(e) => console.error('❌ iframe 로드 오류:', e)}
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
        </div>
      )
    }

    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
              </div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              강의를 찾을 수 없습니다
            </h1>
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-500"
            >
              강의 목록으로 돌아가기
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {course.detail_image_url ? (
                  <img
                    src={course.detail_image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {course.title}
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <span className="text-blue-600 text-sm font-medium">
                  {course.category || '무료강의'}
                </span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getLevelBadgeColor(course.level)}`}>
                  {getLevelText(course.level)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-6">
                {course.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDuration(getTotalDuration())}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.student_count}명 수강
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {course.rating > 0 ? `${course.rating.toFixed(1)} (${course.review_count} 리뷰)` : '리뷰 없음'}
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {course.category === '무료강의' ? '무료' : formatPrice(course.price)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* 비디오 섹션 - Vimeo 우선, 자체 비디오 대체 */}
            <div id="video-section" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">강의 영상</h2>
              {(() => {
                console.log('🎬 비디오 섹션 렌더링:', {
                  vimeo_url: course.vimeo_url,
                  video_url: course.video_url,
                  hasVimeoUrl: !!course.vimeo_url,
                  hasVideoUrl: !!course.video_url
                })
                
                // Vimeo URL이 있으면 Vimeo 플레이어 사용
                if (course.vimeo_url) {
                  console.log('🎥 Vimeo 플레이어 사용:', course.vimeo_url)
                  return (
                    <VimeoPlayer 
                      vimeoUrl={course.vimeo_url}
                      width="100%"
                      height="auto"
                      autoplay={false}
                      controls={true}
                      className="rounded-lg shadow-lg"
                    />
                  )
                }
                
                // Vimeo URL이 없으면 기존 비디오 URL 또는 임베드 코드 사용
                if (course.video_url) {
                  console.log('🎥 비디오 URL/임베드 코드 사용:', course.video_url)
                  
                  // iframe 임베드 코드인지 확인
                  if (course.video_url.includes('<iframe') || course.video_url.includes('src=')) {
                    console.log('🎬 iframe 임베드 코드 감지')
                    return (
                      <div 
                        className="aspect-video bg-black rounded-lg overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: course.video_url }}
                      />
                    )
                  }
                  
                  // 일반 URL인 경우 기존 플레이어 사용
                  return renderVideoPlayer(course.video_url)
                }
                
                // 비디오가 없는 경우
                return (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">동영상 준비 중</p>
                      <p className="text-sm">강의 영상이 곧 업로드될 예정입니다.</p>
                      <div className="text-xs mt-2 text-gray-400">
                        <p>Vimeo URL: {course.vimeo_url || '없음'}</p>
                        <p>비디오 URL: {course.video_url || '없음'}</p>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            <div id="course-intro-section" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">강의 소개</h2>
              <div className="prose max-w-none">
                <p>{course.description}</p>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                커리큘럼
              </h2>
              <div className="space-y-3">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-4">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      강의 소개 및 기초 개념
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      강의에 대한 전반적인 소개와 기본 개념을 학습합니다.
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(Math.floor(course.duration * 0.2))}
                  </div>
                </div>
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-4">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      실습 및 예제
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      실제 예제를 통해 핵심 내용을 학습합니다.
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(Math.floor(course.duration * 0.6))}
                  </div>
                </div>
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-4">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      마무리 및 정리
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      학습 내용을 정리하고 추가 학습 방향을 제시합니다.
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(Math.floor(course.duration * 0.2))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {course.category === '무료강의' ? '무료' : formatPrice(course.price)}
                </div>
                <p className="text-gray-500">평생 수강 가능</p>
              </div>

              {(() => {
                console.log('🔍 강의 시청하기 버튼 조건 확인:', {
                  isPurchased,
                  isEnrolled,
                  showButton: (isPurchased || isEnrolled),
                  courseTitle: course?.title,
                  courseCategory: course?.category
                })
                
                // 디버깅: 상태 값 상세 확인
                console.log('📊 상태 상세 정보:', {
                  'isPurchased 타입': typeof isPurchased,
                  'isPurchased 값': isPurchased,
                  'isEnrolled 타입': typeof isEnrolled,
                  'isEnrolled 값': isEnrolled,
                  '조건 결과': (isPurchased || isEnrolled)
                })
                
                return (isPurchased || isEnrolled)
              })() ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {isPurchased ? '구매 완료' : '수강신청 완료'}
                  </div>
                  <button
                    onClick={() => {
                      console.log('🎬 강의 시청하기 버튼 클릭됨')
                      
                      // 먼저 비디오 섹션 찾기
                      const videoSection = document.getElementById('video-section')
                      console.log('📹 비디오 섹션:', videoSection)
                      
                      if (videoSection) {
                        console.log('✅ 비디오 섹션으로 스크롤')
                        videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        return
                      }
                      
                      // 비디오 섹션이 없으면 강의 소개 섹션 찾기
                      const courseIntroSection = document.getElementById('course-intro-section')
                      console.log('📖 강의 소개 섹션:', courseIntroSection)
                      
                      if (courseIntroSection) {
                        console.log('✅ 강의 소개 섹션으로 스크롤')
                        courseIntroSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        return
                      }
                      
                      // 둘 다 없으면 페이지 상단으로 스크롤
                      console.log('⚠️ 스크롤 대상 섹션을 찾을 수 없음 - 페이지 상단으로 이동')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    강의 시청하기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user ? (
                    course.category === '무료강의' ? (
                      <button
                        onClick={handleFreeEnrollment}
                        disabled={enrolling}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {enrolling ? (
                          '수강신청 중...'
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            무료 수강신청
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={handlePaidEnrollment}
                          disabled={enrolling}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {enrolling ? (
                            '수강신청 중...'
                          ) : (
                            <>
                              <Play className="w-5 h-5 mr-2" />
                              수강신청하기
                            </>
                          )}
                        </button>
                        <div className="text-center text-sm text-gray-500">또는</div>
                        <button
                          onClick={handlePurchase}
                          disabled={purchasing}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {purchasing ? (
                            '구매 중...'
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              지금 구매하기
                            </>
                          )}
                        </button>
                      </div>
                    )
                  ) : (
                    <Link
                      href="/auth/login"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      로그인 후 {course.category === '무료강의' ? '수강신청하기' : '수강신청/구매하기'}
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  이 강의에 포함된 내용
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    3개의 강의
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    총 {formatDuration(getTotalDuration())} 분량
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    평생 수강 가능
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    모바일/PC 시청 가능
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    수료증 발급
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
