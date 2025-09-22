import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 임시 더미 데이터 (Supabase에 데이터가 없을 때 사용)
const dummyCourses = [
  {
    id: 'course-1',
    title: '[파파준스] 나만의 AI 사진작가로 월300 버는 올인원 무료강의',
    description: 'AI 기술을 활용한 사진작가로 월 300만원을 벌 수 있는 실전 노하우를 무료로 배워보세요. 초보자도 쉽게 따라할 수 있는 단계별 가이드입니다.',
    price: 0,
    duration: 90,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 3,
      purchases: 1234
    }
  },
  {
    id: 'course-2',
    title: '[내일은편하게] 0원으로 초보자도 추가 월급 벌기 무료강의',
    description: '투자 없이도 시작할 수 있는 다양한 부업 방법을 배워보세요. 초보자도 쉽게 따라할 수 있는 실전 가이드입니다.',
    price: 0,
    duration: 120,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 2,
      purchases: 987
    }
  },
  {
    id: 'course-3',
    title: '[광마] 주부도 억대 매출 낸 AI쿠팡로켓 수익화 무료강의',
    description: 'AI를 활용한 쿠팡로켓 수익화 방법을 배워보세요. 주부도 쉽게 따라할 수 있는 실전 가이드입니다.',
    price: 0,
    duration: 100,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 3,
      purchases: 2156
    }
  },
  {
    id: 'course-4',
    title: '[홍시삼분] 노베이스 초보자도 가능! AI 자동화 해외구매대행 무료강의',
    description: 'AI 자동화를 활용한 해외구매대행 사업을 시작해보세요. 초보자도 쉽게 따라할 수 있습니다.',
    price: 0,
    duration: 110,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 3,
      purchases: 756
    }
  },
  {
    id: 'course-5',
    title: '[현우] 초보자도 가능한 소개부업 수익화 무료강의',
    description: '소개부업을 통한 수익화 방법을 배워보세요. 초보자도 쉽게 시작할 수 있습니다.',
    price: 0,
    duration: 85,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 2,
      purchases: 1543
    }
  },
  {
    id: 'course-6',
    title: '[자생법] 노베이스도 가능한 유튜브 멱살캐리 무료특강',
    description: '유튜브 채널 성장을 위한 실전 노하우를 배워보세요. 노베이스도 쉽게 따라할 수 있습니다.',
    price: 0,
    duration: 95,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 3,
      purchases: 2341
    }
  },
  {
    id: 'course-7',
    title: '[제휴마케팅] 초보자도 월 100만원 벌 수 있는 제휴마케팅 무료강의',
    description: '제휴마케팅의 기본부터 실전까지 모든 것을 배워보세요. 초보자도 쉽게 따라할 수 있는 단계별 가이드입니다.',
    price: 0,
    duration: 120,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 4,
      purchases: 1856
    }
  },
  {
    id: 'course-8',
    title: '[제휴마케팅] 제휴마케팅 수익화 4기 무료강의',
    description: '제휴마케팅을 통한 수익화 방법을 배워보세요. 실제 사례와 함께 실전 노하우를 전수합니다.',
    price: 0,
    duration: 150,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-1',
      name: '무료강의'
    },
    _count: {
      lessons: 5,
      purchases: 3247
    }
  }
]

// 프로그래밍 강의 데이터
const programmingCourses = [
  {
    id: 'prog-1',
    title: '[프로그래밍] React로 웹 개발 완전정복',
    description: 'React를 활용한 현대적인 웹 애플리케이션 개발을 배워보세요. 초보자도 쉽게 따라할 수 있습니다.',
    price: 89000,
    duration: 200,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-3',
      name: '프로그래밍'
    },
    _count: {
      lessons: 12,
      purchases: 1234
    }
  },
  {
    id: 'prog-2',
    title: '[프로그래밍] Python 데이터 분석 마스터',
    description: 'Python을 활용한 데이터 분석과 시각화를 배워보세요. 실무에서 바로 사용할 수 있는 기술입니다.',
    price: 75000,
    duration: 180,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-3',
      name: '프로그래밍'
    },
    _count: {
      lessons: 10,
      purchases: 987
    }
  },
  {
    id: 'prog-3',
    title: '[프로그래밍] JavaScript 기초부터 고급까지',
    description: 'JavaScript의 기본 개념부터 고급 기능까지 체계적으로 배워보세요.',
    price: 65000,
    duration: 150,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-3',
      name: '프로그래밍'
    },
    _count: {
      lessons: 8,
      purchases: 2156
    }
  }
]

// 디자인 강의 데이터
const designCourses = [
  {
    id: 'design-1',
    title: '[디자인] Figma로 UI/UX 디자인하기',
    description: 'Figma를 활용한 전문적인 UI/UX 디자인을 배워보세요. 실무 프로젝트 중심으로 진행됩니다.',
    price: 95000,
    duration: 160,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-4',
      name: '디자인'
    },
    _count: {
      lessons: 9,
      purchases: 756
    }
  },
  {
    id: 'design-2',
    title: '[디자인] Adobe Photoshop 완전정복',
    description: 'Photoshop의 모든 기능을 마스터하고 전문적인 이미지 편집을 배워보세요.',
    price: 85000,
    duration: 140,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-4',
      name: '디자인'
    },
    _count: {
      lessons: 7,
      purchases: 1543
    }
  },
  {
    id: 'design-3',
    title: '[디자인] 브랜드 아이덴티티 디자인',
    description: '로고, 명함, 브랜드 가이드라인 등 브랜드 아이덴티티를 완성하는 방법을 배워보세요.',
    price: 78000,
    duration: 120,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-4',
      name: '디자인'
    },
    _count: {
      lessons: 6,
      purchases: 892
    }
  }
]

// 마케팅 강의 데이터
const marketingCourses = [
  {
    id: 'marketing-1',
    title: '[마케팅] 디지털 마케팅 전략 수립',
    description: '효과적인 디지털 마케팅 전략을 수립하고 실행하는 방법을 배워보세요.',
    price: 92000,
    duration: 170,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-5',
      name: '마케팅'
    },
    _count: {
      lessons: 11,
      purchases: 1234
    }
  },
  {
    id: 'marketing-2',
    title: '[마케팅] 구글 애드워즈 완전정복',
    description: '구글 애드워즈를 활용한 효과적인 광고 운영 방법을 배워보세요.',
    price: 88000,
    duration: 130,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-5',
      name: '마케팅'
    },
    _count: {
      lessons: 8,
      purchases: 987
    }
  },
  {
    id: 'marketing-3',
    title: '[마케팅] 소셜미디어 마케팅 전략',
    description: '인스타그램, 페이스북, 유튜브 등 소셜미디어를 활용한 마케팅을 배워보세요.',
    price: 76000,
    duration: 110,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-5',
      name: '마케팅'
    },
    _count: {
      lessons: 7,
      purchases: 1456
    }
  }
]

// 비즈니스 강의 데이터
const businessCourses = [
  {
    id: 'business-1',
    title: '[비즈니스] 스타트업 창업 가이드',
    description: '아이디어부터 사업화까지 스타트업 창업의 모든 과정을 배워보세요.',
    price: 120000,
    duration: 240,
    level: 'advanced',
    published: true,
    category: {
      id: 'cat-6',
      name: '비즈니스'
    },
    _count: {
      lessons: 15,
      purchases: 567
    }
  },
  {
    id: 'business-2',
    title: '[비즈니스] 프리랜서 성공 전략',
    description: '프리랜서로서 성공하는 방법과 지속 가능한 수익 창출을 배워보세요.',
    price: 98000,
    duration: 180,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-6',
      name: '비즈니스'
    },
    _count: {
      lessons: 10,
      purchases: 789
    }
  },
  {
    id: 'business-3',
    title: '[비즈니스] 온라인 쇼핑몰 운영',
    description: '온라인 쇼핑몰을 성공적으로 운영하는 방법을 배워보세요.',
    price: 110000,
    duration: 200,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-6',
      name: '비즈니스'
    },
    _count: {
      lessons: 12,
      purchases: 634
    }
  }
]

// 얼리버드 전용 강의 데이터
const earlyBirdCourses = [
  {
    id: 'earlybird-1',
    title: '[얼리버드] AI 마케팅 자동화 완전정복 - 30% 할인',
    description: 'AI를 활용한 마케팅 자동화의 모든 것을 배워보세요. 얼리버드 특가로 30% 할인된 가격에 제공됩니다.',
    price: 70000, // 원가 100,000원에서 30% 할인
    originalPrice: 100000,
    duration: 180,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    _count: {
      lessons: 8,
      purchases: 456
    },
    discount: 30,
    isEarlyBird: true
  },
  {
    id: 'earlybird-2',
    title: '[얼리버드] 프리랜서 디자이너 수익 극대화 전략',
    description: '프리랜서 디자이너로서 수익을 극대화하는 실전 전략을 배워보세요. 얼리버드 특가 제공!',
    price: 56000, // 원가 80,000원에서 30% 할인
    originalPrice: 80000,
    duration: 150,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    _count: {
      lessons: 6,
      purchases: 234
    },
    discount: 30,
    isEarlyBird: true
  },
  {
    id: 'earlybird-3',
    title: '[얼리버드] 유튜브 채널 10만 구독자 달성 비법',
    description: '유튜브 채널을 10만 구독자까지 성장시키는 비법을 배워보세요. 얼리버드 한정 특가!',
    price: 84000, // 원가 120,000원에서 30% 할인
    originalPrice: 120000,
    duration: 200,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    _count: {
      lessons: 10,
      purchases: 789
    },
    discount: 30,
    isEarlyBird: true
  },
  {
    id: 'earlybird-4',
    title: '[얼리버드] 온라인 쇼핑몰 성공 비즈니스 모델',
    description: '온라인 쇼핑몰을 성공적으로 운영하는 비즈니스 모델을 배워보세요. 얼리버드 특가!',
    price: 105000, // 원가 150,000원에서 30% 할인
    originalPrice: 150000,
    duration: 240,
    level: 'advanced',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    _count: {
      lessons: 12,
      purchases: 345
    },
    discount: 30,
    isEarlyBird: true
  },
  {
    id: 'earlybird-5',
    title: '[얼리버드] 코딩 없이 웹사이트 만들기 완전정복',
    description: '코딩 지식 없이도 전문적인 웹사이트를 만들 수 있는 방법을 배워보세요. 얼리버드 특가!',
    price: 49000, // 원가 70,000원에서 30% 할인
    originalPrice: 70000,
    duration: 120,
    level: 'beginner',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    _count: {
      lessons: 5,
      purchases: 567
    },
    discount: 30,
    isEarlyBird: true
  },
  {
    id: 'earlybird-6',
    title: '[얼리버드] 소상공인 디지털 마케팅 전략',
    description: '소상공인을 위한 디지털 마케팅 전략을 배워보세요. 얼리버드 한정 특가!',
    price: 63000, // 원가 90,000원에서 30% 할인
    originalPrice: 90000,
    duration: 160,
    level: 'intermediate',
    published: true,
    category: {
      id: 'cat-2',
      name: '얼리버드'
    },
    _count: {
      lessons: 7,
      purchases: 123
    },
    discount: 30,
    isEarlyBird: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // 얼리버드 태그 요청 시 얼리버드 강의 데이터 반환 (가장 먼저 처리)
    if (tag === '얼리버드') {
      let filteredCourses = earlyBirdCourses
      
      // 검색어가 있으면 필터링
      if (search) {
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      const paginatedCourses = filteredCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: paginatedCourses,
          pagination: {
            page,
            limit,
            total: filteredCourses.length,
            totalPages: Math.ceil(filteredCourses.length / limit),
          },
        },
      })
    }

    // 무료강의 카테고리 요청 시 더미 데이터 반환
    if (category === '무료강의') {
      let filteredCourses = dummyCourses
      
      // 검색어가 있으면 필터링
      if (search) {
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      const paginatedCourses = filteredCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: paginatedCourses,
          pagination: {
            page,
            limit,
            total: filteredCourses.length,
            totalPages: Math.ceil(filteredCourses.length / limit),
          },
        },
      })
    }

    // 얼리버드 카테고리 요청 시 얼리버드 강의 데이터 반환
    if (category === '얼리버드') {
      let filteredCourses = earlyBirdCourses
      
      // 검색어가 있으면 필터링
    if (search) {
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      const paginatedCourses = filteredCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: paginatedCourses,
          pagination: {
            page,
            limit,
            total: filteredCourses.length,
            totalPages: Math.ceil(filteredCourses.length / limit),
          },
        },
      })
    }

    // 프로그래밍 카테고리 요청 시 프로그래밍 강의 데이터 반환
    if (category === '프로그래밍') {
      const filteredCourses = programmingCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: filteredCourses,
          pagination: {
            page,
            limit,
            total: programmingCourses.length,
            totalPages: Math.ceil(programmingCourses.length / limit),
          },
        },
      })
    }

    // 디자인 카테고리 요청 시 디자인 강의 데이터 반환
    if (category === '디자인') {
      const filteredCourses = designCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: filteredCourses,
          pagination: {
            page,
            limit,
            total: designCourses.length,
            totalPages: Math.ceil(designCourses.length / limit),
          },
        },
      })
    }

    // 마케팅 카테고리 요청 시 마케팅 강의 데이터 반환
    if (category === '마케팅') {
      const filteredCourses = marketingCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: filteredCourses,
          pagination: {
            page,
            limit,
            total: marketingCourses.length,
            totalPages: Math.ceil(marketingCourses.length / limit),
          },
        },
      })
    }

    // 비즈니스 카테고리 요청 시 비즈니스 강의 데이터 반환
    if (category === '비즈니스') {
      const filteredCourses = businessCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: filteredCourses,
          pagination: {
            page,
            limit,
            total: businessCourses.length,
            totalPages: Math.ceil(businessCourses.length / limit),
          },
        },
      })
    }


    // 카테고리가 없거나 'all'인 경우 모든 더미 데이터 반환 (모든 카테고리 강의)
    if (!category || category === 'all') {
      let allCourses = [
        ...dummyCourses, 
        ...earlyBirdCourses, 
        ...programmingCourses, 
        ...designCourses, 
        ...marketingCourses, 
        ...businessCourses
      ]
      
      // 검색어가 있으면 필터링
      if (search) {
        allCourses = allCourses.filter(course => 
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      const filteredCourses = allCourses.slice(offset, offset + limit)
      
      return NextResponse.json({
        success: true,
        data: {
          courses: filteredCourses,
          pagination: {
            page,
            limit,
            total: allCourses.length,
            totalPages: Math.ceil(allCourses.length / limit),
          },
        },
      })
    }

    // 기본 쿼리 빌더
    let query = supabase
      .from('courses')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          description
        ),
        lessons (count),
        purchases (count)
      `)
      .eq('published', true)

    // 카테고리 필터
    if (category) {
      query = query.eq('categories.name', category)
    }

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // 페이지네이션
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    const { data: courses, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // 총 개수 조회
    const { count: totalCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)

    return NextResponse.json({
      success: true,
      data: {
        courses: courses || [],
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: '강의 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
