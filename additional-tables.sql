-- 추가 테이블 생성 (필요한 경우)

-- 1. 전자책 테이블
CREATE TABLE IF NOT EXISTS ebooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  thumbnail TEXT,
  file_url TEXT,
  author TEXT,
  pages INTEGER,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 전자책 구매 테이블
CREATE TABLE IF NOT EXISTS ebook_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ebook_id)
);

-- 3. 성공 스토리 테이블
CREATE TABLE IF NOT EXISTS success_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  revenue TEXT,
  period TEXT,
  image_url TEXT,
  verified BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 커뮤니티 게시글 테이블
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID,
  user_id UUID,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 활성화
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- 전자책은 모두가 볼 수 있음
CREATE POLICY "Ebooks are viewable by everyone" ON ebooks
  FOR SELECT USING (true);

-- 전자책 구매는 본인 것만
CREATE POLICY "Users can view own ebook purchases" ON ebook_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- 성공 스토리는 모두가 볼 수 있음
CREATE POLICY "Success stories are viewable by everyone" ON success_stories
  FOR SELECT USING (published = true);

-- 커뮤니티 게시글은 모두가 볼 수 있음
CREATE POLICY "Community posts are viewable by everyone" ON community_posts
  FOR SELECT USING (published = true);

-- 댓글은 모두가 볼 수 있음
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

-- 리뷰는 모두가 볼 수 있음
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_user_id ON ebook_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_published ON success_stories(published);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

