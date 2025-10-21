-- 🔧 Supabase RLS 정책 오류 해결 스크립트

-- 1단계: 기존 정책 삭제 (오류 방지)
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

-- 2단계: RLS 활성화 확인
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3단계: Storage bucket 생성 (없는 경우)
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

-- 4단계: 정책 생성 (하나씩 실행)
CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view videos" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" 
ON storage.objects
FOR DELETE 
USING (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

-- 5단계: courses 테이블에 video_file_path 컬럼 추가 (없는 경우)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS video_file_path TEXT;

-- 6단계: 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_courses_video_file_path ON courses(video_file_path);

-- 7단계: 정책 생성 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
