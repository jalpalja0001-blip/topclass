-- Storage bucket 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-images', 'course-images', true);

-- Storage 정책 설정
CREATE POLICY "공개 읽기 접근 허용" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-images');

CREATE POLICY "관리자만 업로드 가능" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-images' AND
    auth.role() = 'authenticated' AND
    auth.email() = 'sprince1004@naver.com'
  );

CREATE POLICY "관리자만 삭제 가능" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'course-images' AND
    auth.role() = 'authenticated' AND
    auth.email() = 'sprince1004@naver.com'
  );

CREATE POLICY "관리자만 업데이트 가능" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'course-images' AND
    auth.role() = 'authenticated' AND
    auth.email() = 'sprince1004@naver.com'
  );
