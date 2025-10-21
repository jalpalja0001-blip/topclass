-- courses 테이블에 vimeo_url 컬럼 추가
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS vimeo_url TEXT;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_courses_vimeo_url ON courses(vimeo_url);
