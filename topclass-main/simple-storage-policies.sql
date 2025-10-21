-- 🔧 간단한 Storage 정책 생성 (권한 오류 해결)

-- 1단계: Storage bucket 생성 (없는 경우)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos', 
  false,  -- 비공개 (보안)
  524288000,  -- 500MB 제한
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

-- 2단계: courses 테이블에 video_file_path 컬럼 추가 (없는 경우)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS video_file_path TEXT;

-- 3단계: 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_courses_video_file_path ON courses(video_file_path);

-- 4단계: 정책 생성 확인 (실행 후 확인용)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
