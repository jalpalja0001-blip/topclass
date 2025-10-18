'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star, Users, FileText } from 'lucide-react'

const instructors = [
  {
    id: 1,
    name: '작은성공',
    nickname: '작은성공 강사님',
    specialty: '블로그 수익화',
    description: '월 300만원 블로그 수익의 비밀',
    avatar: '🎯',
    rating: 4.9,
    students: 15234,
    courses: 8,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    achievements: ['월 300만원 달성', '수강생 만족도 99%']
  },
  {
    id: 2,
    name: '잘나가는서과장',
    nickname: '잘나가는서과장 강사님',
    specialty: '직장인 부업',
    description: '회사 다니며 월 500 버는 법',
    avatar: '💼',
    rating: 4.8,
    students: 12876,
    courses: 6,
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    achievements: ['직장인 부업 1위', '실제 수익 인증']
  },
  {
    id: 3,
    name: '알파남',
    nickname: '알파남 강사님',
    specialty: '구글 애드센스',
    description: '노베이스도 구글 애드센스 성공',
    avatar: '🚀',
    rating: 4.9,
    students: 18543,
    courses: 12,
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    achievements: ['애드센스 전문가', '월 1000만원 달성']
  },
  {
    id: 4,
    name: '어비',
    nickname: '어비 강사님',
    specialty: '유튜브 채널',
    description: '구독자 10만 달성 비법',
    avatar: '📺',
    rating: 4.7,
    students: 9876,
    courses: 5,
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    achievements: ['유튜브 크리에이터', '구독자 50만+']
  },
  {
    id: 5,
    name: '광마스터',
    nickname: '광마 강사님',
    specialty: '쿠팡 파트너스',
    description: '주부도 억대 매출 가능',
    avatar: '💰',
    rating: 5.0,
    students: 23451,
    courses: 15,
    background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    achievements: ['쿠팡 파트너스 1위', '억대 매출 달성']
  },
  {
    id: 6,
    name: '김다솔',
    nickname: '김다솔 강사님',
    specialty: '온라인 쇼핑몰',
    description: '무재고 쇼핑몰 창업 성공기',
    avatar: '🛍️',
    rating: 4.8,
    students: 11234,
    courses: 9,
    background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    achievements: ['쇼핑몰 창업 성공', '무재고 전문가']
  },
  {
    id: 7,
    name: '자생법',
    nickname: '자생법 강사님',
    specialty: '유튜브 성장',
    description: '멱살캐리 채널 성장법',
    avatar: '🎬',
    rating: 4.9,
    students: 16789,
    courses: 11,
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    achievements: ['유튜브 성장 전문가', '채널 100만 달성']
  },
  {
    id: 8,
    name: '현우',
    nickname: '원현우 강사님',
    specialty: '제휴마케팅',
    description: '제휴마케팅으로 안정 수익',
    avatar: '📊',
    rating: 4.8,
    students: 14567,
    courses: 7,
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    achievements: ['제휴마케팅 전문가', '월 1000만원+']
  }
]

export default function InstructorSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(4)

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(2)
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3)
      } else {
        setSlidesToShow(4)
      }
    }

    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow)
    return () => window.removeEventListener('resize', updateSlidesToShow)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % instructors.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % instructors.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + instructors.length) % instructors.length)
  }

  const getVisibleInstructors = () => {
    const visible = []
    for (let i = 0; i < slidesToShow; i++) {
      visible.push(instructors[(currentIndex + i) % instructors.length])
    }
    return visible
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">잘파는클래스 강사</h2>
            <p className="text-gray-600">각 분야 최고의 전문가들을 만나보세요</p>
          </div>
          <Link href="/instructors" className="text-blue-600 hover:text-blue-700 font-medium">
            더보기 →
          </Link>
        </div>

        {/* Instructor Slider */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getVisibleInstructors().map((instructor, index) => (
              <Link
                key={`${instructor.id}-${currentIndex}-${index}`}
                href={`/instructors?instructor=${encodeURIComponent(instructor.name)}`}
                className="group cursor-pointer block"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-2">
                  {/* Instructor Avatar */}
                  <div
                    className="aspect-square relative flex items-center justify-center"
                    style={{ background: instructor.background }}
                  >
                    <div className="text-4xl">{instructor.avatar}</div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>

                  {/* Instructor Info */}
                  <div className="p-4">
                    <div className="text-center mb-3">
                      <h3 className="font-bold text-gray-900 mb-1">{instructor.name}</h3>
                      <p className="text-sm text-gray-600">{instructor.specialty}</p>
                    </div>

                    <p className="text-xs text-gray-500 text-center mb-3 line-clamp-2">
                      {instructor.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="font-semibold">{instructor.rating}</span>
                        </div>
                        <div className="text-gray-500">평점</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-3 h-3 text-blue-500 mr-1" />
                          <span className="font-semibold">{(instructor.students / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="text-gray-500">수강생</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <FileText className="w-3 h-3 text-green-500 mr-1" />
                          <span className="font-semibold">{instructor.courses}</span>
                        </div>
                        <div className="text-gray-500">강의</div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-1">
                      {instructor.achievements.slice(0, 2).map((achievement, idx) => (
                        <div key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded text-center">
                          ✨ {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {instructors.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
