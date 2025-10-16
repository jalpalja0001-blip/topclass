-- Supabase 테이블 생성 및 샘플 데이터 삽입

-- 1. 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 강의 테이블
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  thumbnail TEXT,
  duration INTEGER, -- 분 단위
  level TEXT NOT NULL DEFAULT 'beginner',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 강의 테이블
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 0, -- 초 단위
  order_position INTEGER NOT NULL DEFAULT 0,
  video_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 구매 테이블
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 5. 강의 진도 테이블
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 6. 강의 진도 테이블
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_progress_id UUID REFERENCES course_progress(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  watch_time INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_progress_id, lesson_id)
);

-- RLS (Row Level Security) 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- 카테고리는 모든 사용자가 읽기 가능
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- 강의는 모든 사용자가 읽기 가능
CREATE POLICY "Courses are viewable by everyone" ON courses
  FOR SELECT USING (true);

-- 강의는 모든 사용자가 읽기 가능
CREATE POLICY "Lessons are viewable by everyone" ON lessons
  FOR SELECT USING (true);

-- 구매는 본인 것만 조회 가능
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- 구매는 인증된 사용자만 생성 가능
CREATE POLICY "Users can create purchases" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 강의 진도는 본인 것만 조회/수정 가능
CREATE POLICY "Users can view own course progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create course progress" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- 강의 진도는 본인 것만 조회/수정 가능
CREATE POLICY "Users can view own lesson progress" ON lesson_progress
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM course_progress WHERE id = course_progress_id));

CREATE POLICY "Users can create lesson progress" ON lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM course_progress WHERE id = course_progress_id));

CREATE POLICY "Users can update own lesson progress" ON lesson_progress
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM course_progress WHERE id = course_progress_id));

-- 샘플 데이터 삽입
-- 1. 카테고리 데이터
INSERT INTO categories (name, description) VALUES
  ('무료강의', '무료로 제공되는 강의들'),
  ('유료강의', '유료로 제공되는 강의들'),
  ('마케팅', '마케팅 관련 강의들'),
  ('이커머스', '이커머스 관련 강의들')
ON CONFLICT (name) DO NOTHING;

-- 2. 강의 데이터
INSERT INTO courses (title, description, price, duration, level, category_id, published) VALUES
  ('[파파준스] 나만의 AI 사진작가로 월300 버는 올인원 무료강의', 'AI 기술을 활용한 사진작가로 월 300만원을 벌 수 있는 실전 노하우를 무료로 배워보세요. 초보자도 쉽게 따라할 수 있는 단계별 가이드입니다.', 0, 90, 'beginner', (SELECT id FROM categories WHERE name = '무료강의'), true),
  ('[내일은편하게] 0원으로 초보자도 추가 월급 벌기 무료강의', '투자 없이도 시작할 수 있는 다양한 부업 방법을 배워보세요. 초보자도 쉽게 따라할 수 있는 실전 가이드입니다.', 0, 120, 'beginner', (SELECT id FROM categories WHERE name = '무료강의'), true),
  ('[광마] 주부도 억대 매출 낸 AI쿠팡로켓 수익화 무료강의', 'AI를 활용한 쿠팡로켓 수익화 방법을 배워보세요. 주부도 쉽게 따라할 수 있는 실전 가이드입니다.', 0, 100, 'beginner', (SELECT id FROM categories WHERE name = '무료강의'), true),
  ('[홍시삼분] 노베이스 초보자도 가능! AI 자동화 해외구매대행 무료강의', 'AI 자동화를 활용한 해외구매대행 사업을 시작해보세요. 초보자도 쉽게 따라할 수 있습니다.', 0, 110, 'beginner', (SELECT id FROM categories WHERE name = '무료강의'), true),
  ('[현우] 초보자도 가능한 소개부업 수익화 무료강의', '소개부업을 통한 수익화 방법을 배워보세요. 초보자도 쉽게 시작할 수 있습니다.', 0, 85, 'beginner', (SELECT id FROM categories WHERE name = '무료강의'), true),
  ('[자생법] 노베이스도 가능한 유튜브 멱살캐리 무료특강', '유튜브 채널 성장을 위한 실전 노하우를 배워보세요. 노베이스도 쉽게 따라할 수 있습니다.', 0, 95, 'beginner', (SELECT id FROM categories WHERE name = '무료강의'), true);

-- 3. 강의 데이터는 나중에 관리자 페이지에서 추가
-- (UUID 형식 문제로 샘플 데이터 생략)

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(published);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_course_id ON purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_progress_id ON lesson_progress(course_progress_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- 통계 업데이트
ANALYZE;
