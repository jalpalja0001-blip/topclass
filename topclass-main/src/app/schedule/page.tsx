'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar, Clock, MapPin, Users, BookOpen, Filter, Search } from 'lucide-react'

const scheduleData = [
  {
    id: 1,
    title: '웹 개발 기초 과정',
    instructor: '김개발',
    date: '2024-01-15',
    time: '10:00 - 12:00',
    location: '온라인 (Zoom)',
    maxStudents: 30,
    currentStudents: 25,
    price: '무료',
    level: '초급',
    description: 'HTML, CSS, JavaScript 기초를 배우는 과정입니다.',
    status: '모집중'
  },
  {
    id: 2,
    title: 'React 심화 과정',
    instructor: '박리액트',
    date: '2024-01-20',
    time: '14:00 - 16:00',
    location: '강남 캠퍼스',
    maxStudents: 20,
    currentStudents: 18,
    price: '150,000원',
    level: '중급',
    description: 'React 고급 패턴과 최적화 기법을 학습합니다.',
    status: '모집중'
  },
  {
    id: 3,
    title: 'Node.js 백엔드 개발',
    instructor: '이노드',
    date: '2024-01-25',
    time: '19:00 - 21:00',
    location: '온라인 (Zoom)',
    maxStudents: 25,
    currentStudents: 22,
    price: '200,000원',
    level: '중급',
    description: 'Express.js와 MongoDB를 활용한 백엔드 개발',
    status: '모집중'
  },
  {
    id: 4,
    title: 'UI/UX 디자인 워크샵',
    instructor: '최디자인',
    date: '2024-02-01',
    time: '10:00 - 17:00',
    location: '홍대 캠퍼스',
    maxStudents: 15,
    currentStudents: 12,
    price: '300,000원',
    level: '초급',
    description: 'Figma를 활용한 UI/UX 디자인 실습',
    status: '모집중'
  },
  {
    id: 5,
    title: '데이터 분석 기초',
    instructor: '정데이터',
    date: '2024-02-05',
    time: '13:00 - 15:00',
    location: '온라인 (Zoom)',
    maxStudents: 30,
    currentStudents: 28,
    price: '무료',
    level: '초급',
    description: 'Python과 pandas를 활용한 데이터 분석',
    status: '모집중'
  },
  {
    id: 6,
    title: 'AI/ML 입문 과정',
    instructor: '한AI',
    date: '2024-02-10',
    time: '09:00 - 12:00',
    location: '강남 캠퍼스',
    maxStudents: 20,
    currentStudents: 15,
    price: '400,000원',
    level: '중급',
    description: '머신러닝과 딥러닝의 기초 이론과 실습',
    status: '모집중'
  }
]

export default function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const filteredData = scheduleData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = !selectedLevel || course.level === selectedLevel
    const matchesStatus = !selectedStatus || course.status === selectedStatus
    const matchesLocation = !selectedLocation || course.location.includes(selectedLocation)
    
    return matchesSearch && matchesLevel && matchesStatus && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            교육 일정
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            잘파는클래스의 다양한 강의 일정을 확인하고 원하는 강의에 신청하세요
          </p>
        </div>

        {/* 필터 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="강의명 또는 강사명 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">전체 레벨</option>
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
            </select>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">전체 상태</option>
              <option value="모집중">모집중</option>
              <option value="마감">마감</option>
              <option value="진행중">진행중</option>
            </select>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">전체 장소</option>
              <option value="온라인">온라인</option>
              <option value="강남">강남</option>
              <option value="홍대">홍대</option>
            </select>
          </div>
        </div>

        {/* 일정 목록 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* 상태 배지 */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.status === '모집중' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.level === '초급' 
                      ? 'bg-blue-100 text-blue-800'
                      : course.level === '중급'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                </div>

                {/* 강의 제목 */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>

                {/* 강사명 */}
                <div className="flex items-center text-gray-600 mb-3">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm">{course.instructor}</span>
                </div>

                {/* 일정 정보 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{course.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{course.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{course.location}</span>
                  </div>
                </div>

                {/* 수강생 수 */}
                <div className="flex items-center text-gray-600 mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {course.currentStudents}/{course.maxStudents}명
                  </span>
                  <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(course.currentStudents / course.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* 설명 */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* 가격과 신청 버튼 */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {course.price}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    신청하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            더 많은 일정 보기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
