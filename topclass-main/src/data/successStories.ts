export interface SuccessStory {
  id: number
  title: string
  author: string
  category: string
  revenue: number
  period: string
  platform: string
  description: string
  tags: string[]
  verified: boolean
  publishDate: string
  detailedStory: string
  challenges: string[]
  solutions: string[]
  tips: string[]
  beforeStats: {
    followers: number
    revenue: number
    engagement: number
  }
  afterStats: {
    followers: number
    revenue: number
    engagement: number
  }
  timeline: {
    month: string
    achievement: string
    revenue: number
  }[]
  resources: {
    name: string
    type: string
    url: string
  }[]
}

export const successStories: SuccessStory[] = [
  {
    id: 1,
    title: '블로그로 월 500만원 수익 달성',
    author: '김블로거',
    category: '블로그',
    revenue: 5000000,
    period: '6개월',
    platform: '네이버 블로그',
    description: '제휴마케팅과 애드센스를 활용해 월 500만원의 안정적인 수익을 만들어냈습니다.',
    tags: ['블로그', '제휴마케팅', '애드센스', '수익화'],
    verified: true,
    publishDate: '2024.12.15',
    detailedStory: `안녕하세요! 김블로거입니다. 오늘은 제가 6개월 만에 블로그로 월 500만원 수익을 달성한 과정을 상세히 공유해드리겠습니다.

**시작점: 완전 초보자**
저는 블로그를 시작하기 전까지는 일반 직장인이었습니다. 마케팅이나 글쓰기에 대한 경험이 전혀 없었고, 단순히 '블로그로 돈을 벌 수 있을까?'라는 호기심으로 시작했습니다.

**첫 달: 방향성 잡기**
첫 달에는 블로그의 방향성을 정하는 데 집중했습니다. 제가 관심 있는 '생활정보' 카테고리로 정하고, 매일 1-2개의 포스팅을 꾸준히 작성했습니다. 이때는 수익보다는 독자들과의 소통에 집중했습니다.

**2-3개월: 콘텐츠 품질 향상**
두 번째 달부터는 콘텐츠의 품질을 높이기 위해 노력했습니다. 검색량이 높은 키워드를 찾아서 포스팅하고, 독자들의 피드백을 적극적으로 수용했습니다. 이 시기에 구글 애드센스 승인을 받았습니다.

**4-5개월: 제휴마케팅 시작**
네 번째 달부터 제휴마케팅을 본격적으로 시작했습니다. 제가 실제로 사용해본 제품들에 대한 솔직한 리뷰를 작성하고, 독자들에게 도움이 되는 정보를 제공했습니다.

**6개월: 월 500만원 달성**
여섯 번째 달에 드디어 월 500만원 수익을 달성했습니다. 애드센스 수익과 제휴마케팅 수익이 각각 50:50 비율로 구성되어 있었습니다.`,
    challenges: [
      '블로그 초기 방문자 수가 매우 적었음',
      '검색엔진 최적화(SEO)에 대한 지식 부족',
      '제휴 제품 선정의 어려움',
      '일관된 포스팅 스케줄 유지의 어려움'
    ],
    solutions: [
      'SNS를 통한 블로그 홍보 및 커뮤니티 참여',
      'SEO 관련 온라인 강의 수강 및 실습',
      '제품 리뷰 사이트에서 인기 제품 분석',
      '포스팅 캘린더 작성 및 알림 설정'
    ],
    tips: [
      '독자 입장에서 생각하며 콘텐츠 작성',
      '제품 리뷰는 솔직하고 객관적으로 작성',
      '꾸준한 포스팅이 가장 중요',
      '독자들과의 소통을 소홀히 하지 말 것'
    ],
    beforeStats: { followers: 0, revenue: 0, engagement: 0 },
    afterStats: { followers: 15000, revenue: 5000000, engagement: 8.5 },
    timeline: [
      { month: '1개월', achievement: '블로그 개설 및 첫 포스팅', revenue: 0 },
      { month: '2개월', achievement: '구글 애드센스 승인', revenue: 50000 },
      { month: '3개월', achievement: '첫 제휴마케팅 수익', revenue: 200000 },
      { month: '4개월', achievement: '월 100만원 수익 달성', revenue: 1000000 },
      { month: '5개월', achievement: '월 300만원 수익 달성', revenue: 3000000 },
      { month: '6개월', achievement: '월 500만원 수익 달성', revenue: 5000000 }
    ],
    resources: [
      { name: '블로그 SEO 완벽 가이드', type: '전자책', url: '/ebooks/seo-guide' },
      { name: '제휴마케팅 마스터 클래스', type: '온라인강의', url: '/courses/affiliate-marketing' },
      { name: '블로그 수익화 도구 모음', type: '도구', url: '/tools/blog-monetization' }
    ]
  },
  {
    id: 2,
    title: '유튜브 채널 10만 구독자 달성',
    author: '유튜버맘',
    category: '유튜브',
    revenue: 3000000,
    period: '8개월',
    platform: '유튜브',
    description: '육아 콘텐츠로 10만 구독자를 달성하고 월 300만원의 광고 수익을 얻었습니다.',
    tags: ['유튜브', '육아', '구독자', '광고수익'],
    verified: true,
    publishDate: '2024.12.10',
    detailedStory: `안녕하세요! 유튜버맘입니다. 육아 유튜버로 시작해서 8개월 만에 10만 구독자를 달성하고 월 300만원의 수익을 얻은 과정을 공유합니다.

**시작: 육아 고민을 나누고 싶어서**
첫 아이를 낳고 육아에 대한 고민이 많았습니다. 다른 엄마들과 경험을 나누고 싶어서 유튜브를 시작했는데, 생각보다 많은 분들이 공감해주셨습니다.

**첫 달: 콘텐츠 기획과 촬영**
육아 일상, 육아 팁, 육아용품 리뷰 등 다양한 콘텐츠를 기획했습니다. 처음엔 촬영이 어려웠지만 점점 익숙해졌습니다.

**2-3개월: 구독자 1만명 달성**
꾸준한 업로드와 진정성 있는 콘텐츠로 구독자가 늘어나기 시작했습니다. 특히 육아용품 리뷰가 인기가 많았습니다.

**4-6개월: 수익화 시작**
구독자 1만명을 넘어서면서 유튜브 파트너십에 가입하고 수익화를 시작했습니다. 광고 수익과 제휴마케팅이 주요 수익원이었습니다.

**7-8개월: 10만 구독자 달성**
8개월 만에 드디어 10만 구독자를 달성했습니다. 이제는 월 300만원의 안정적인 수익을 얻고 있습니다.`,
    challenges: [
      '육아와 유튜브 촬영을 동시에 하는 어려움',
      '콘텐츠 아이디어 고갈',
      '촬영 및 편집 기술 부족',
      '구독자 증가 속도가 느림'
    ],
    solutions: [
      '아이 수면 시간을 활용한 촬영',
      '구독자 댓글에서 콘텐츠 아이디어 수집',
      '유튜브 편집 강의 수강',
      '다른 육아 유튜버들과 협업'
    ],
    tips: [
      '진정성 있는 콘텐츠가 가장 중요',
      '구독자와의 소통을 적극적으로',
      '꾸준한 업로드 스케줄 유지',
      '트렌드에 민감하게 반응하기'
    ],
    beforeStats: { followers: 0, revenue: 0, engagement: 0 },
    afterStats: { followers: 100000, revenue: 3000000, engagement: 12.3 },
    timeline: [
      { month: '1개월', achievement: '채널 개설 및 첫 영상', revenue: 0 },
      { month: '2개월', achievement: '구독자 1천명 달성', revenue: 0 },
      { month: '3개월', achievement: '구독자 5천명 달성', revenue: 0 },
      { month: '4개월', achievement: '구독자 1만명 달성', revenue: 500000 },
      { month: '6개월', achievement: '구독자 5만명 달성', revenue: 1500000 },
      { month: '8개월', achievement: '구독자 10만명 달성', revenue: 3000000 }
    ],
    resources: [
      { name: '유튜브 성장 전략서', type: '전자책', url: '/ebooks/youtube-strategy' },
      { name: '유튜브 편집 마스터 클래스', type: '온라인강의', url: '/courses/youtube-editing' },
      { name: '유튜브 분석 도구', type: '도구', url: '/tools/youtube-analytics' }
    ]
  },
  {
    id: 3,
    title: '쿠팡 파트너스로 억대 매출',
    author: '쇼핑마스터',
    category: '이커머스',
    revenue: 15000000,
    period: '1년',
    platform: '쿠팡 파트너스',
    description: '제품 리뷰와 추천으로 쿠팡 파트너스에서 연 1억 5천만원의 매출을 달성했습니다.',
    tags: ['쿠팡', '파트너스', '리뷰', '추천'],
    verified: true,
    publishDate: '2024.12.05',
    detailedStory: `안녕하세요! 쇼핑마스터입니다. 쿠팡 파트너스로 연 1억 5천만원의 매출을 달성한 과정을 공유합니다.

**시작: 취미로 시작한 제품 리뷰**
처음엔 그냥 취미로 제품을 사서 리뷰를 올리기 시작했습니다. 쿠팡 파트너스 링크를 달아놓았는데 생각보다 수익이 나오기 시작했어요.

**3개월: 본격적인 리뷰 활동**
리뷰가 인기를 얻기 시작하면서 더 많은 제품을 리뷰하게 되었습니다. 특히 전자제품과 생활용품 리뷰가 인기가 많았습니다.

**6개월: 월 500만원 수익 달성**
6개월 만에 월 500만원의 수익을 달성했습니다. 이때부터 본격적으로 쿠팡 파트너스에 집중하기 시작했습니다.

**1년: 연 1억 5천만원 달성**
1년 만에 연 1억 5천만원의 매출을 달성했습니다. 이제는 제품 리뷰 전문가로 활동하고 있습니다.`,
    challenges: [
      '제품 구매 비용 부담',
      '리뷰 품질 유지의 어려움',
      '경쟁자 증가',
      '제품 선정의 어려움'
    ],
    solutions: [
      '제휴 제품 우선 리뷰',
      '리뷰 템플릿 제작',
      '차별화된 리뷰 포인트 개발',
      '데이터 기반 제품 선정'
    ],
    tips: [
      '솔직하고 객관적인 리뷰 작성',
      '사용 후기를 자세히 기록',
      '사진과 영상으로 생생하게',
      '독자 관심사 파악하기'
    ],
    beforeStats: { followers: 0, revenue: 0, engagement: 0 },
    afterStats: { followers: 50000, revenue: 15000000, engagement: 15.2 },
    timeline: [
      { month: '1개월', achievement: '첫 제품 리뷰', revenue: 100000 },
      { month: '3개월', achievement: '월 100만원 수익', revenue: 1000000 },
      { month: '6개월', achievement: '월 500만원 수익', revenue: 5000000 },
      { month: '9개월', achievement: '월 1000만원 수익', revenue: 10000000 },
      { month: '12개월', achievement: '월 1500만원 수익', revenue: 15000000 }
    ],
    resources: [
      { name: '쿠팡 파트너스 완벽 가이드', type: '전자책', url: '/ebooks/coupang-guide' },
      { name: '제품 리뷰 작성법', type: '온라인강의', url: '/courses/product-review' },
      { name: '리뷰 분석 도구', type: '도구', url: '/tools/review-analytics' }
    ]
  },
  {
    id: 4,
    title: '인스타그램으로 브랜드 런칭',
    author: '인플루언서김',
    category: '마케팅',
    revenue: 8000000,
    period: '1년 2개월',
    platform: '인스타그램',
    description: '인스타그램 마케팅으로 자체 브랜드를 런칭하고 월 800만원의 매출을 달성했습니다.',
    tags: ['인스타그램', '브랜드', '마케팅', '런칭'],
    verified: true,
    publishDate: '2024.11.28',
    detailedStory: `안녕하세요! 인플루언서김입니다. 인스타그램을 통해 자체 브랜드를 런칭하고 월 800만원의 매출을 달성한 과정을 공유합니다.

**시작: 패션에 대한 관심**
패션에 관심이 많아서 인스타그램에 코디 사진을 올리기 시작했습니다. 점점 팔로워가 늘어나면서 브랜드 제안이 들어오기 시작했어요.

**6개월: 인플루언서 활동 시작**
팔로워 5만명을 달성하면서 본격적인 인플루언서 활동을 시작했습니다. 다양한 브랜드와 협업하며 경험을 쌓았습니다.

**1년: 자체 브랜드 런칭**
충분한 경험과 팔로워를 확보한 후 자체 패션 브랜드를 런칭했습니다. 인스타그램을 통한 마케팅이 주요 수익원이 되었습니다.

**1년 2개월: 월 800만원 달성**
브랜드 런칭 2개월 만에 월 800만원의 매출을 달성했습니다. 이제는 안정적인 브랜드 운영을 하고 있습니다.`,
    challenges: [
      '팔로워 증가 속도가 느림',
      '브랜드 신뢰도 구축의 어려움',
      '경쟁자와의 차별화',
      '콘텐츠 기획의 어려움'
    ],
    solutions: [
      '해시태그 전략 수립',
      '다른 인플루언서와 협업',
      '고유한 스타일 개발',
      '트렌드 분석 및 적용'
    ],
    tips: [
      '일관된 브랜드 이미지 유지',
      '팔로워와의 적극적인 소통',
      '고품질 콘텐츠 제작',
      '데이터 기반 마케팅'
    ],
    beforeStats: { followers: 0, revenue: 0, engagement: 0 },
    afterStats: { followers: 200000, revenue: 8000000, engagement: 6.8 },
    timeline: [
      { month: '1개월', achievement: '인스타그램 시작', revenue: 0 },
      { month: '3개월', achievement: '팔로워 1만명', revenue: 0 },
      { month: '6개월', achievement: '팔로워 5만명', revenue: 1000000 },
      { month: '12개월', achievement: '자체 브랜드 런칭', revenue: 5000000 },
      { month: '14개월', achievement: '월 800만원 달성', revenue: 8000000 }
    ],
    resources: [
      { name: '인스타그램 마케팅 전략', type: '전자책', url: '/ebooks/instagram-marketing' },
      { name: '브랜드 런칭 가이드', type: '온라인강의', url: '/courses/brand-launch' },
      { name: '인스타그램 분석 도구', type: '도구', url: '/tools/instagram-analytics' }
    ]
  },
  {
    id: 5,
    title: 'AI 도구로 자동화 비즈니스',
    author: 'AI마스터',
    category: 'AI',
    revenue: 12000000,
    period: '10개월',
    platform: '다양한 플랫폼',
    description: 'ChatGPT와 다양한 AI 도구를 활용해 완전 자동화된 온라인 비즈니스를 구축했습니다.',
    tags: ['AI', '자동화', 'ChatGPT', '비즈니스'],
    verified: true,
    publishDate: '2024.11.20',
    detailedStory: `안녕하세요! AI마스터입니다. AI 도구를 활용해 완전 자동화된 온라인 비즈니스를 구축하고 월 1200만원의 수익을 달성한 과정을 공유합니다.

**시작: AI에 대한 호기심**
ChatGPT가 화제가 되면서 AI에 대한 관심이 생겼습니다. AI를 활용해서 어떤 비즈니스를 만들 수 있을지 연구하기 시작했어요.

**3개월: 첫 AI 서비스 런칭**
ChatGPT API를 활용한 첫 번째 서비스를 런칭했습니다. 간단한 텍스트 생성 서비스였지만 생각보다 많은 사용자가 찾아주셨어요.

**6개월: 자동화 시스템 구축**
더 복잡한 AI 워크플로우를 구축하고 완전 자동화된 시스템을 만들었습니다. 이제는 거의 수동 작업 없이 운영이 가능합니다.

**10개월: 월 1200만원 달성**
10개월 만에 월 1200만원의 수익을 달성했습니다. AI의 힘으로 확장 가능한 비즈니스를 구축할 수 있었습니다.`,
    challenges: [
      'AI 기술 학습의 어려움',
      'API 비용 관리',
      '서비스 품질 유지',
      '경쟁자 대응'
    ],
    solutions: [
      'AI 관련 강의 및 자료 학습',
      '사용량 기반 과금 모델 도입',
      '지속적인 모니터링 시스템',
      '차별화된 기능 개발'
    ],
    tips: [
      'AI 도구의 한계를 이해하기',
      '사용자 피드백 적극 수용',
      '지속적인 기술 업데이트',
      '비용 효율성 고려하기'
    ],
    beforeStats: { followers: 0, revenue: 0, engagement: 0 },
    afterStats: { followers: 30000, revenue: 12000000, engagement: 9.2 },
    timeline: [
      { month: '1개월', achievement: 'AI 기술 학습', revenue: 0 },
      { month: '3개월', achievement: '첫 AI 서비스 런칭', revenue: 500000 },
      { month: '6개월', achievement: '자동화 시스템 구축', revenue: 3000000 },
      { month: '8개월', achievement: '월 800만원 수익', revenue: 8000000 },
      { month: '10개월', achievement: '월 1200만원 수익', revenue: 12000000 }
    ],
    resources: [
      { name: 'AI 비즈니스 구축 가이드', type: '전자책', url: '/ebooks/ai-business' },
      { name: 'ChatGPT 마스터 클래스', type: '온라인강의', url: '/courses/chatgpt-master' },
      { name: 'AI 도구 모음', type: '도구', url: '/tools/ai-tools' }
    ]
  },
  {
    id: 6,
    title: '온라인 강의로 수익 창출',
    author: '강사박',
    category: '교육',
    revenue: 25000000,
    period: '2년',
    platform: '온라인 강의 플랫폼',
    description: '전문 지식을 온라인 강의로 만들어 연 2억 5천만원의 수익을 달성했습니다.',
    tags: ['온라인강의', '교육', '지식', '수익화'],
    verified: true,
    publishDate: '2024.11.15',
    detailedStory: `안녕하세요! 강사박입니다. 전문 지식을 온라인 강의로 만들어 연 2억 5천만원의 수익을 달성한 과정을 공유합니다.

**시작: 회사에서의 강의 경험**
회사에서 신입사원 교육을 담당하면서 강의에 대한 재능을 발견했습니다. 더 많은 사람들에게 지식을 전달하고 싶어서 온라인 강의를 시작했어요.

**6개월: 첫 강의 런칭**
6개월간의 준비 끝에 첫 번째 온라인 강의를 런칭했습니다. 생각보다 많은 수강생이 찾아주셨어요.

**1년: 강의 시리즈 확장**
첫 강의의 성공을 바탕으로 관련 강의들을 시리즈로 제작했습니다. 이때부터 본격적인 수익이 나오기 시작했어요.

**2년: 연 2억 5천만원 달성**
2년 만에 연 2억 5천만원의 수익을 달성했습니다. 이제는 온라인 강의 전문가로 활동하고 있습니다.`,
    challenges: [
      '강의 콘텐츠 기획의 어려움',
      '영상 제작 기술 부족',
      '마케팅 경험 부족',
      '경쟁자와의 차별화'
    ],
    solutions: [
      '시장 조사 및 수요 분석',
      '영상 제작 강의 수강',
      'SNS 마케팅 전략 수립',
      '고유한 강의 스타일 개발'
    ],
    tips: [
      '수강생 입장에서 생각하기',
      '실용적인 내용 중심으로',
      '지속적인 피드백 수집',
      '강의 품질에 집중하기'
    ],
    beforeStats: { followers: 0, revenue: 0, engagement: 0 },
    afterStats: { followers: 100000, revenue: 25000000, engagement: 11.5 },
    timeline: [
      { month: '6개월', achievement: '첫 강의 런칭', revenue: 2000000 },
      { month: '12개월', achievement: '강의 시리즈 확장', revenue: 10000000 },
      { month: '18개월', achievement: '월 1500만원 수익', revenue: 15000000 },
      { month: '24개월', achievement: '연 2억 5천만원 달성', revenue: 25000000 }
    ],
    resources: [
      { name: '온라인 강의 제작 가이드', type: '전자책', url: '/ebooks/online-course' },
      { name: '강의 마케팅 전략', type: '온라인강의', url: '/courses/course-marketing' },
      { name: '강의 분석 도구', type: '도구', url: '/tools/course-analytics' }
    ]
  }
]
