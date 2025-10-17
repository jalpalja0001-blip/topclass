# 온라인 강의 플랫폼 - LearnHub

Next.js와 TypeScript로 구축된 현대적인 온라인 강의 플랫폼입니다.

## 주요 기능

- 🔐 **사용자 인증**: 회원가입, 로그인, JWT 기반 인증
- 📚 **강의 관리**: 강의 목록, 상세 정보, 카테고리별 분류
- 💳 **결제 시스템**: 강의 구매 및 결제 처리
- 🎥 **비디오 플레이어**: 커스텀 비디오 플레이어와 진도 관리
- 📊 **대시보드**: 구매한 강의 관리 및 학습 진도 추적
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (개발용), PostgreSQL (프로덕션 권장)
- **Authentication**: JWT, bcryptjs
- **Video Player**: React Player
- **UI Components**: Lucide React Icons

## 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd online-course-platform
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 설정

```bash
# 데이터베이스 생성 및 스키마 적용
npx prisma db push

# Prisma 클라이언트 생성
npx prisma generate

# 샘플 데이터 추가
npm run db:seed
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 샘플 계정

개발용 샘플 계정:
- **이메일**: user@example.com
- **비밀번호**: password123

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── auth/              # 인증 페이지
│   ├── courses/           # 강의 관련 페이지
│   └── dashboard/         # 사용자 대시보드
├── components/            # 재사용 가능한 컴포넌트
├── contexts/              # React Context
└── lib/                   # 유틸리티 함수

prisma/
├── schema.prisma          # 데이터베이스 스키마
└── seed.ts               # 샘플 데이터
```

## 주요 페이지

- **홈페이지** (`/`): 플랫폼 소개 및 인기 강의
- **강의 목록** (`/courses`): 모든 강의 목록과 검색
- **강의 상세** (`/courses/[id]`): 강의 정보 및 구매
- **강의 시청** (`/courses/[id]/lessons/[lessonId]`): 비디오 시청
- **대시보드** (`/dashboard`): 구매한 강의 관리
- **로그인/회원가입** (`/auth/login`, `/auth/register`)

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 강의
- `GET /api/courses` - 강의 목록 조회
- `GET /api/courses/[id]` - 강의 상세 정보
- `GET /api/lessons/[id]` - 강의 영상 정보 (구매 확인 필요)

### 구매
- `POST /api/purchases` - 강의 구매
- `GET /api/purchases` - 구매 내역 조회
- `GET /api/purchases/check` - 구매 여부 확인

### 진도 관리
- `PUT /api/lessons/[id]/progress` - 학습 진도 업데이트

## 데이터베이스 스키마

주요 테이블:
- **User**: 사용자 정보
- **Category**: 강의 카테고리
- **Course**: 강의 정보
- **Lesson**: 개별 강의 영상
- **Purchase**: 구매 내역
- **CourseProgress**: 강의 진도
- **LessonProgress**: 개별 영상 시청 진도

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅
npm run lint

# 데이터베이스 관리
npx prisma studio          # 데이터베이스 GUI
npx prisma db push         # 스키마 변경사항 적용
npx prisma generate        # 클라이언트 재생성
npm run db:seed            # 샘플 데이터 추가
```

## 프로덕션 배포

### 환경 변수 설정
프로덕션 환경에서는 다음 환경 변수를 설정해야 합니다:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="strong-random-secret-key"
NEXTAUTH_SECRET="another-strong-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

### 데이터베이스 마이그레이션

```bash
npx prisma migrate deploy
npx prisma generate
```

## 추가 기능 구현 가능 항목

- 📧 이메일 인증 및 비밀번호 재설정
- 💰 Stripe 결제 연동
- 🔔 알림 시스템
- 📝 강의 리뷰 및 평점
- 🎓 수료증 발급
- 👨‍🏫 강사용 관리 패널
- 📈 학습 분석 및 통계
- 🔍 고급 검색 및 필터링
- 📱 모바일 앱 (React Native)

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.