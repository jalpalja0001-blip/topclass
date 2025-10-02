-- 간단한 테스트용 스키마

-- 1. 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 강의 테이블
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  thumbnail TEXT,
  duration INTEGER,
  level TEXT NOT NULL DEFAULT 'beginner',
  category_id UUID REFERENCES categories(id),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 구매 테이블
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT REFERENCES courses(id),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 샘플 데이터 삽입
INSERT INTO categories (name, description) VALUES 
('프로그래밍', '프로그래밍 관련 강의'),
('디자인', '디자인 관련 강의'),
('마케팅', '마케팅 관련 강의'),
('비즈니스', '비즈니스 관련 강의')
ON CONFLICT (name) DO NOTHING;

INSERT INTO courses (id, title, description, price, duration, level, category_id) VALUES 
('course-1', 'React 기초 강의', 'React를 처음 배우는 분들을 위한 강의', 50000, 1200, 'beginner', (SELECT id FROM categories WHERE name = '프로그래밍')),
('course-2', 'Next.js 완벽 가이드', 'Next.js를 활용한 풀스택 웹 개발', 80000, 1800, 'intermediate', (SELECT id FROM categories WHERE name = '프로그래밍')),
('course-3', 'TypeScript 마스터', 'TypeScript 완벽 마스터하기', 60000, 1500, 'intermediate', (SELECT id FROM categories WHERE name = '프로그래밍')),
('course-4', 'Node.js 백엔드 개발', 'Node.js로 백엔드 API 개발하기', 70000, 2000, 'advanced', (SELECT id FROM categories WHERE name = '프로그래밍')),
('course-5', 'Python 데이터 분석', 'Python을 활용한 데이터 분석', 90000, 1600, 'intermediate', (SELECT id FROM categories WHERE name = '프로그래밍')),
('course-6', 'JavaScript ES6+', '모던 JavaScript 완벽 가이드', 40000, 1000, 'beginner', (SELECT id FROM categories WHERE name = '프로그래밍')),
('course-7', 'Vue.js 3 완벽 가이드', 'Vue.js 3 프레임워크 마스터', 75000, 1400, 'intermediate', (SELECT id FROM categories WHERE name = '프로그래밍')),
('course-8', 'Angular 프레임워크', 'Angular로 엔터프라이즈 앱 개발', 85000, 2200, 'advanced', (SELECT id FROM categories WHERE name = '프로그래밍'))
ON CONFLICT (id) DO NOTHING;

-- 5. RLS 정책 설정
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);
