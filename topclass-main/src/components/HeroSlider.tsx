'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'AI 사진작가로 월 300만원 수익 창출',
    subtitle: '파파준스 강사의 올인원 무료강의',
    description: '나만의 AI 사진작가로 부업부터 창업까지! 완전 초보자도 가능한 수익화 방법을 공개합니다.',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    badge: '무료강의',
    instructor: '파파준스',
    link: '/courses/cmfqnzqm90015uqgg5klvc51f'
  },
  {
    id: 2,
    title: '0원으로 시작하는 추가 월급 벌기',
    subtitle: '내일은편하게 강사의 실전 노하우',
    description: '투자금 없이도 시작할 수 있는 온라인 수익화 전략을 단계별로 알려드립니다.',
    image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    badge: '무료강의',
    instructor: '내일은편하게',
    link: '/courses/cmfqnzqn5001duqggk5tm4zg8'
  },
  {
    id: 3,
    title: '주부도 억대 매출 낸 쿠팡로켓',
    subtitle: '광마 강사의 AI 자동화 비법',
    description: 'AI 도구를 활용한 쿠팡로켓 수익화! 주부도 가능한 억대 매출의 비밀을 공개합니다.',
    image: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    badge: '무료강의',
    instructor: '광마',
    link: '/courses/cmfqnzqny001luqgg6ath2mde'
  },
  {
    id: 4,
    title: '유튜브 멱살캐리 무료특강',
    subtitle: '자생법 강사의 채널 성장 비법',
    description: '노베이스도 가능한 유튜브 채널 성장 전략! 구독자부터 수익화까지 완벽 가이드.',
    image: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    badge: '무료강의',
    instructor: '자생법',
    link: '/courses/cmfqnzqr50029uqgghazc3scw'
  },
  {
    id: 5,
    title: 'AI 자동화 해외구매대행 무료강의',
    subtitle: '홍시삼분 강사의 노베이스 가이드',
    description: '노베이스 초보자도 가능한 AI 자동화 해외구매대행! 완전 무료로 배우는 수익화 비법.',
    image: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    badge: '무료강의',
    instructor: '홍시삼분',
    link: '/courses/cmfqnzqom001tuqggwa2jcs40'
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // 5초마다 자동 슬라이드

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ background: slide.image }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl text-white">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      slide.badge === '무료강의' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      {slide.badge}
                    </span>
                    <span className="ml-3 text-sm opacity-90">강사: {slide.instructor}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-lg md:text-xl mb-6 opacity-90">
                    {slide.subtitle}
                  </h2>
                  <p className="text-base md:text-lg mb-8 opacity-80 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/courses?category=무료강의"
                      className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                    >
                      무료 신청하기
                    </Link>
                    <Link
                      href="/courses"
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-center"
                    >
                      모든 강의 보기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 bg-black/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  )
}
