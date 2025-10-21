-- Supabase Storage 버킷 생성
-- Storage > Buckets에서 실행하거나 SQL Editor에서 실행

-- 썸네일 이미지용 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-thumbnails',
  'course-thumbnails', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 디테일 이미지용 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS 정책 생성 (공개 읽기 허용)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'course-thumbnails');
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'course-images');

-- 업로드 정책 (인증된 사용자만 업로드 가능)
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  (bucket_id = 'course-thumbnails' OR bucket_id = 'course-images')
);

-- 업데이트 정책
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (
  auth.role() = 'authenticated' AND 
  (bucket_id = 'course-thumbnails' OR bucket_id = 'course-images')
);

-- 삭제 정책
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (
  auth.role() = 'authenticated' AND 
  (bucket_id = 'course-thumbnails' OR bucket_id = 'course-images')
);
