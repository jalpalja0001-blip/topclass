import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 얼리버드 강의 데이터
const earlyBirdCourses: { [key: string]: any } = {
  'earlybird-1': {
    id: 'earlybird-1',
    title: '[얼리버드] AI 마케팅 자동화 완전정복 - 30% 할인',
    description: 'AI를 활용한 마케팅 자동화의 모든 것을 배워보세요. 얼리버드 특가로 30% 할인된 가격에 제공됩니다. 이 강의에서는 ChatGPT, Midjourney, 그리고 다양한 AI 도구들을 활용하여 마케팅을 완전히 자동화하는 방법을 배웁니다.',
    price: 70000,
    originalPrice: 100000,
    thumbnail: null,
    duration: 180,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    lessons: [
      {
        id: 'lesson-eb1-1',
        title: '1. AI 마케팅 자동화 개론',
        description: 'AI 마케팅 자동화의 기본 개념과 장점을 이해합니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-eb1-2',
        title: '2. ChatGPT를 활용한 콘텐츠 제작',
        description: 'ChatGPT를 활용한 효과적인 콘텐츠 제작 방법을 배웁니다.',
        duration: 2700,
        order: 2
      },
      {
        id: 'lesson-eb1-3',
        title: '3. Midjourney로 이미지 자동 생성',
        description: 'Midjourney를 활용한 고품질 이미지 자동 생성 방법을 배웁니다.',
        duration: 2400,
        order: 3
      },
      {
        id: 'lesson-eb1-4',
        title: '4. 소셜미디어 자동 포스팅',
        description: '소셜미디어 플랫폼에 자동으로 포스팅하는 방법을 배웁니다.',
        duration: 2100,
        order: 4
      },
      {
        id: 'lesson-eb1-5',
        title: '5. 이메일 마케팅 자동화',
        description: '이메일 마케팅을 완전히 자동화하는 방법을 배웁니다.',
        duration: 1800,
        order: 5
      },
      {
        id: 'lesson-eb1-6',
        title: '6. 고객 응답 자동화',
        description: '고객 문의에 자동으로 응답하는 시스템을 구축합니다.',
        duration: 2400,
        order: 6
      },
      {
        id: 'lesson-eb1-7',
        title: '7. 데이터 분석 및 최적화',
        description: '마케팅 성과를 분석하고 자동으로 최적화하는 방법을 배웁니다.',
        duration: 2100,
        order: 7
      },
      {
        id: 'lesson-eb1-8',
        title: '8. 실전 프로젝트 및 수익화',
        description: '실제 프로젝트를 통해 수익화하는 방법을 배웁니다.',
        duration: 2700,
        order: 8
      }
    ],
    _count: {
      purchases: 456
    }
  },
  'earlybird-2': {
    id: 'earlybird-2',
    title: '[얼리버드] 프리랜서 디자이너 수익 극대화 전략',
    description: '프리랜서 디자이너로서 수익을 극대화하는 실전 전략을 배워보세요. 얼리버드 특가 제공! 클라이언트 확보부터 프로젝트 관리, 가격 책정까지 모든 것을 배웁니다.',
    price: 56000,
    originalPrice: 80000,
    thumbnail: null,
    duration: 150,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    lessons: [
      {
        id: 'lesson-eb2-1',
        title: '1. 프리랜서 디자이너 마인드셋',
        description: '성공적인 프리랜서 디자이너가 되기 위한 마인드셋을 배웁니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-eb2-2',
        title: '2. 포트폴리오 제작 및 관리',
        description: '매력적인 포트폴리오를 제작하고 관리하는 방법을 배웁니다.',
        duration: 2400,
        order: 2
      },
      {
        id: 'lesson-eb2-3',
        title: '3. 클라이언트 확보 전략',
        description: '지속적으로 클라이언트를 확보하는 전략을 배웁니다.',
        duration: 2700,
        order: 3
      },
      {
        id: 'lesson-eb2-4',
        title: '4. 가격 책정 및 계약 관리',
        description: '적절한 가격을 책정하고 계약을 관리하는 방법을 배웁니다.',
        duration: 2100,
        order: 4
      },
      {
        id: 'lesson-eb2-5',
        title: '5. 프로젝트 관리 및 커뮤니케이션',
        description: '효율적인 프로젝트 관리와 클라이언트와의 커뮤니케이션을 배웁니다.',
        duration: 2400,
        order: 5
      },
      {
        id: 'lesson-eb2-6',
        title: '6. 수익 극대화 전략',
        description: '프리랜서 디자이너로서 수익을 극대화하는 전략을 배웁니다.',
        duration: 2700,
        order: 6
      }
    ],
    _count: {
      purchases: 234
    }
  }
}

// 임시 더미 데이터 (Supabase에 데이터가 없을 때 사용)
const dummyCourses: { [key: string]: any } = {
  'course-1': {
    id: 'course-1',
    title: '[파파준스] 나만의 AI 사진작가로 월300 버는 올인원 무료강의',
    description: 'AI 기술을 활용한 사진작가로 월 300만원을 벌 수 있는 실전 노하우를 무료로 배워보세요. 초보자도 쉽게 따라할 수 있는 단계별 가이드입니다.',
    price: 0,
    thumbnail: null,
    duration: 90,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-1',
        title: '1. AI 사진작가란? 기본 개념 이해',
        description: 'AI 사진작가의 개념과 수익 모델을 이해합니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-2',
        title: '2. AI 도구 활용법 - 실전 노하우',
        description: 'AI 사진 생성 도구들을 효과적으로 활용하는 방법을 배웁니다.',
        duration: 2700,
        order: 2
      },
      {
        id: 'lesson-3',
        title: '3. 수익화 전략과 마케팅',
        description: 'AI 사진을 수익화하는 다양한 방법과 마케팅 전략을 배웁니다.',
        duration: 1800,
        order: 3
      }
    ],
    _count: {
      purchases: 1234
    }
  },
  'course-2': {
    id: 'course-2',
    title: '[내일은편하게] 0원으로 초보자도 추가 월급 벌기 무료강의',
    description: '투자 없이도 시작할 수 있는 다양한 부업 방법을 배워보세요. 초보자도 쉽게 따라할 수 있는 실전 가이드입니다.',
    price: 0,
    thumbnail: null,
    duration: 120,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-4',
        title: '1. 부업의 기본 개념과 준비사항',
        description: '성공적인 부업을 위한 기본 개념과 준비사항을 배웁니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-5',
        title: '2. 온라인 부업 방법들',
        description: '다양한 온라인 부업 방법과 시작하는 방법을 배웁니다.',
        duration: 3600,
        order: 2
      }
    ],
    _count: {
      purchases: 987
    }
  },
  'course-3': {
    id: 'course-3',
    title: '[광마] 주부도 억대 매출 낸 AI쿠팡로켓 수익화 무료강의',
    description: 'AI를 활용한 쿠팡로켓 수익화 방법을 배워보세요. 주부도 쉽게 따라할 수 있는 실전 가이드입니다.',
    price: 0,
    thumbnail: null,
    duration: 100,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-6',
        title: '1. 쿠팡로켓 기본 이해',
        description: '쿠팡로켓의 기본 개념과 시작 방법을 배웁니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-7',
        title: '2. AI 활용 상품 선정',
        description: 'AI를 활용한 상품 선정과 시장 분석 방법을 배웁니다.',
        duration: 2700,
        order: 2
      },
      {
        id: 'lesson-8',
        title: '3. 수익화 전략',
        description: '쿠팡로켓을 통한 수익화 전략과 마케팅 방법을 배웁니다.',
        duration: 1800,
        order: 3
      }
    ],
    _count: {
      purchases: 2156
    }
  },
  'course-4': {
    id: 'course-4',
    title: '[홍시삼분] 노베이스 초보자도 가능! AI 자동화 해외구매대행 무료강의',
    description: 'AI 자동화를 활용한 해외구매대행 사업을 시작해보세요. 초보자도 쉽게 따라할 수 있습니다.',
    price: 0,
    thumbnail: null,
    duration: 110,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-9',
        title: '1. 해외구매대행 기본 이해',
        description: '해외구매대행의 기본 개념과 시작 방법을 배웁니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-10',
        title: '2. AI 자동화 도구 활용',
        description: 'AI 자동화 도구를 활용한 효율적인 운영 방법을 배웁니다.',
        duration: 2700,
        order: 2
      },
      {
        id: 'lesson-11',
        title: '3. 수익화와 고객 관리',
        description: '해외구매대행을 통한 수익화와 고객 관리 방법을 배웁니다.',
        duration: 1800,
        order: 3
      }
    ],
    _count: {
      purchases: 756
    }
  },
  'course-5': {
    id: 'course-5',
    title: '[현우] 초보자도 가능한 소개부업 수익화 무료강의',
    description: '소개부업을 통한 수익화 방법을 배워보세요. 초보자도 쉽게 시작할 수 있습니다.',
    price: 0,
    thumbnail: null,
    duration: 85,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-12',
        title: '1. 소개부업 기본 이해',
        description: '소개부업의 기본 개념과 시작 방법을 배웁니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-13',
        title: '2. 수익화 전략',
        description: '소개부업을 통한 수익화 전략과 마케팅 방법을 배웁니다.',
        duration: 2700,
        order: 2
      }
    ],
    _count: {
      purchases: 1543
    }
  },
  'course-6': {
    id: 'course-6',
    title: '[자생법] 노베이스도 가능한 유튜브 멱살캐리 무료특강',
    description: '유튜브 채널 성장을 위한 실전 노하우를 배워보세요. 노베이스도 쉽게 따라할 수 있습니다.',
    price: 0,
    thumbnail: null,
    duration: 95,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-14',
        title: '1. 유튜브 채널 기본 설정',
        description: '유튜브 채널의 기본 설정과 시작 방법을 배웁니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-15',
        title: '2. 콘텐츠 기획과 제작',
        description: '효과적인 콘텐츠 기획과 제작 방법을 배웁니다.',
        duration: 2700,
        order: 2
      },
      {
        id: 'lesson-16',
        title: '3. 채널 성장 전략',
        description: '유튜브 채널 성장을 위한 실전 전략을 배웁니다.',
        duration: 1800,
        order: 3
      }
    ],
    _count: {
      purchases: 2341
    }
  },
  'course-7': {
    id: 'course-7',
    title: '[제휴마케팅] 초보자도 월 100만원 벌 수 있는 제휴마케팅 무료강의',
    description: '제휴마케팅의 기본부터 실전까지 모든 것을 배워보세요. 초보자도 쉽게 따라할 수 있는 단계별 가이드입니다. 이 강의에서는 제휴마케팅의 기본 개념부터 시작하여 실제 수익을 창출하는 방법까지 모든 것을 배웁니다.',
    price: 0,
    thumbnail: null,
    duration: 120,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-7-1',
        title: '1. 제휴마케팅 기본 개념 이해',
        description: '제휴마케팅이 무엇인지, 어떻게 작동하는지 기본 개념을 배웁니다.',
        duration: 1800,
        order: 1
      },
      {
        id: 'lesson-7-2',
        title: '2. 제휴 프로그램 선택하기',
        description: '수익성이 높은 제휴 프로그램을 선택하는 방법을 배웁니다.',
        duration: 2400,
        order: 2
      },
      {
        id: 'lesson-7-3',
        title: '3. 트래픽 유입 방법',
        description: '제휴 상품에 트래픽을 유입하는 다양한 방법을 배웁니다.',
        duration: 2700,
        order: 3
      },
      {
        id: 'lesson-7-4',
        title: '4. 수익 극대화 전략',
        description: '제휴마케팅 수익을 극대화하는 실전 전략을 배웁니다.',
        duration: 2100,
        order: 4
      }
    ],
    _count: {
      purchases: 1856
    }
  },
  'course-8': {
    id: 'course-8',
    title: '[제휴마케팅] 제휴마케팅 수익화 4기 무료강의',
    description: '제휴마케팅을 통한 수익화 방법을 배워보세요. 실제 사례와 함께 실전 노하우를 전수합니다. 4기 특별 강의로 더욱 실전적인 내용을 담았습니다.',
    price: 0,
    thumbnail: null,
    duration: 150,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    lessons: [
      {
        id: 'lesson-8-1',
        title: '1. 제휴마케팅 고급 전략',
        description: '제휴마케팅의 고급 전략과 기법을 배웁니다.',
        duration: 2400,
        order: 1
      },
      {
        id: 'lesson-8-2',
        title: '2. 실제 사례 분석',
        description: '성공한 제휴마케팅 사례를 분석하고 배웁니다.',
        duration: 2700,
        order: 2
      },
      {
        id: 'lesson-8-3',
        title: '3. 수익 최적화 방법',
        description: '제휴마케팅 수익을 최적화하는 방법을 배웁니다.',
        duration: 2400,
        order: 3
      },
      {
        id: 'lesson-8-4',
        title: '4. 장기적 수익 창출',
        description: '지속 가능한 제휴마케팅 수익을 창출하는 방법을 배웁니다.',
        duration: 2700,
        order: 4
      },
      {
        id: 'lesson-8-5',
        title: '5. 실전 프로젝트',
        description: '실제 제휴마케팅 프로젝트를 진행하며 배웁니다.',
        duration: 3000,
        order: 5
      }
    ],
    _count: {
      purchases: 3247
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('Looking for course with ID:', id)
    console.log('Available course IDs:', Object.keys(dummyCourses))
    console.log('Available earlybird course IDs:', Object.keys(earlyBirdCourses))

    // 얼리버드 강의에서 먼저 찾기
    let course = earlyBirdCourses[id]
    
    // 얼리버드 강의에 없으면 일반 더미 데이터에서 찾기
    if (!course) {
      course = dummyCourses[id]
    }

    if (!course) {
      console.log('Course not found for ID:', id)
      return NextResponse.json(
        { success: false, error: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { success: false, error: '강의 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
