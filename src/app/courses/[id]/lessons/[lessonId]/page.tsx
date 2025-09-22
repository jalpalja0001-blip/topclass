'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import VideoPlayer from '@/components/VideoPlayer'
import { ChevronLeft, ChevronRight, CheckCircle, Clock, List, X } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  videoUrl: string
  duration: number
  order: number
  course: {
    id: string
    title: string
    category: {
      name: string
    }
    lessons: {
      id: string
      title: string
      order: number
      duration: number
    }[]
  }
}

interface LessonProgress {
  id: string
  completed: boolean
  watchTime: number
  completedAt: string | null
}

interface LessonData {
  lesson: Lesson
  progress: LessonProgress | null
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lessonId as string
  const courseId = params.id as string

  const [lessonData, setLessonData] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      const data = await response.json()

      if (data.success) {
        setLessonData(data.data)
      } else {
        router.push(`/courses/${courseId}`)
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
      router.push(`/courses/${courseId}`)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (watchTime: number, completed?: boolean) => {
    if (!lessonData) return

    try {
      await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watchTime: Math.floor(watchTime),
          completed,
        }),
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleProgress = (progress: { playedSeconds: number; played: number }) => {
    const now = Date.now()
    // Update progress every 5 seconds to avoid too many requests
    if (now - lastProgressUpdate > 5000) {
      updateProgress(progress.playedSeconds)
      setLastProgressUpdate(now)
    }
  }

  const handleVideoEnd = () => {
    if (lessonData) {
      updateProgress(lessonData.lesson.duration, true)
    }
  }

  const getCurrentLessonIndex = () => {
    if (!lessonData) return -1
    return lessonData.lesson.course.lessons.findIndex(l => l.id === lessonId)
  }

  const getNextLesson = () => {
    if (!lessonData) return null
    const currentIndex = getCurrentLessonIndex()
    if (currentIndex < lessonData.lesson.course.lessons.length - 1) {
      return lessonData.lesson.course.lessons[currentIndex + 1]
    }
    return null
  }

  const getPreviousLesson = () => {
    if (!lessonData) return null
    const currentIndex = getCurrentLessonIndex()
    if (currentIndex > 0) {
      return lessonData.lesson.course.lessons[currentIndex - 1]
    }
    return null
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return `${mins}분 ${secs}초`
    }
    return `${secs}초`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">강의를 찾을 수 없습니다.</div>
        </div>
      </div>
    )
  }

  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showPlaylist ? 'mr-80' : ''}`}>
          {/* Video Player */}
          <div className="relative">
            <div className="aspect-video">
              <VideoPlayer
                url={lessonData.lesson.videoUrl}
                onProgress={handleProgress}
                onEnded={handleVideoEnd}
                initialTime={lessonData.progress?.watchTime || 0}
              />
            </div>

            {/* Playlist Toggle Button */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Lesson Info */}
          <div className="p-6 bg-white">
            <div className="mb-4">
              <Link
                href={`/courses/${courseId}`}
                className="text-blue-600 hover:text-blue-500 text-sm mb-2 inline-block"
              >
                ← {lessonData.lesson.course.title}
              </Link>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{lessonData.lesson.course.category?.name || '무료강의'}</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatDuration(lessonData.lesson.duration)}</span>
                {lessonData.progress?.completed && (
                  <>
                    <span className="mx-2">•</span>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">완료</span>
                  </>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {lessonData.lesson.title}
            </h1>

            {lessonData.lesson.description && (
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{lessonData.lesson.description}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                {previousLesson && (
                  <Link
                    href={`/courses/${courseId}/lessons/${previousLesson.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-500"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    이전 강의: {previousLesson.title}
                  </Link>
                )}
              </div>
              <div>
                {nextLesson && (
                  <Link
                    href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-500"
                  >
                    다음 강의: {nextLesson.title}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
            showPlaylist ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">강의 목록</h2>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {lessonData.lesson.course.lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/courses/${courseId}/lessons/${lesson.id}`}
                className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  lesson.id === lessonId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm mr-3 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm mb-1 ${
                      lesson.id === lessonId ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {lesson.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(lesson.duration)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Overlay */}
        {showPlaylist && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowPlaylist(false)}
          />
        )}
      </div>
    </div>
  )
}
