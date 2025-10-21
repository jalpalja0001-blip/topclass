'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Star, Users, FileText, Award, TrendingUp, Play } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Instructor {
  id: number
  name: string
  nickname: string
  specialty: string
  description: string
  avatar: string
  rating: number
  students: number
  courses: number
  totalRevenue: string
  experience: string
  background: string
  achievements: string[]
  courses_taught: string[]
  intro: string
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/instructors')
      if (!response.ok) {
        throw new Error('강사 데이터를 가져오는데 실패했습니다.')
      }
      
      const data = await response.json()
      setInstructors(data.instructors || [])
    } catch (error) {
      console.error('강사 목록 로드 오류:', error)
      setError('강사 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            잘파는클래스 강사진
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            각 분야 최고의 전문가들이 여러분의 성공을 도와드립니다
          </p>
          <p className="text-lg text-blue-100">
            실제로 성과를 낸 검증된 전문가들의 생생한 노하우를 만나보세요
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">강사 목록을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchInstructors}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          ) : instructors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">등록된 강사가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {instructors.map((instructor) => (
              <div key={instructor.id} className="group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                  {/* Instructor Header */}
                  <div
                    className="h-32 relative flex items-center justify-center"
                    style={{ background: instructor.background }}
                  >
                    <div className="text-6xl">{instructor.avatar}</div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>

                  <div className="p-6">
                    {/* Basic Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                      <p className="text-blue-600 font-medium mb-1">{instructor.specialty}</p>
                      <p className="text-gray-600 text-sm">{instructor.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="font-bold text-lg">{instructor.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">평점</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="font-bold text-lg">{(instructor.students / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="text-xs text-gray-500">수강생</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FileText className="w-4 h-4 text-green-500 mr-1" />
                          <span className="font-bold text-lg">{instructor.courses}</span>
                        </div>
                        <div className="text-xs text-gray-500">강의</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="font-bold text-sm">{instructor.experience}</span>
                        </div>
                        <div className="text-xs text-gray-500">경력</div>
                      </div>
                    </div>

                    {/* Introduction */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">강사 소개</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {instructor.intro}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">주요 성과</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {instructor.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <Award className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">대표 강의</h4>
                      <div className="space-y-2">
                        {instructor.courses_taught.map((course, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <Play className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                            <span>{course}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Revenue Badge */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <span className="font-bold">{instructor.totalRevenue} 수익 달성</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/courses?instructor=${instructor.name}`}
                      className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-center block"
                    >
                      {instructor.name} 강사님 강의 보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            당신도 강사가 되어보세요!
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            전문 지식과 경험을 가지고 계신가요? 잘파는클래스와 함께하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/instructor-apply"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              강사 지원하기
            </Link>
            <Link
              href="/courses"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              강의 둘러보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
