# Supabase Storage 설정 가이드

## 🎯 비디오 업로드를 위한 Supabase 설정

### 1. Storage Bucket 생성 및 설정

#### A. Supabase 대시보드에서:
1. **Storage** → **Buckets** → **New bucket**
2. **Bucket name**: `course-videos`
3. **Public**: `false` (보안)
4. **File size limit**: `500MB` (또는 원하는 크기)
5. **Allowed MIME types**: `video/mp4,video/webm,video/ogg,video/quicktime`

#### B. SQL Editor에서 실행:
```sql
-- Storage bucket 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos', 
  false,  -- 비공개 (보안)
  524288000,  -- 500MB 제한 (50MB → 500MB로 변경)
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
);

-- 기존 bucket이 있다면 업데이트
UPDATE storage.buckets 
SET file_size_limit = 524288000  -- 500MB
WHERE id = 'course-videos';
```

### 2. RLS (Row Level Security) 정책 설정

```sql
-- Storage 정책 생성
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view videos" ON storage.objects
FOR SELECT USING (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" ON storage.objects
FOR DELETE USING (bucket_id = 'course-videos' AND auth.role() = 'authenticated');
```

### 3. courses 테이블에 컬럼 추가

```sql
-- video_file_path 컬럼 추가
ALTER TABLE courses ADD COLUMN video_file_path TEXT;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_courses_video_file_path ON courses(video_file_path);
```

## 🚀 대안 솔루션들

### A. Cloudflare R2 (무료 10GB)
- **장점**: 무료, 빠른 CDN
- **단점**: 별도 설정 필요

### B. AWS S3 + CloudFront
- **장점**: 저렴, 확장성
- **단점**: 복잡한 설정

### C. Vercel Blob Storage
- **장점**: Next.js 통합
- **단점**: 비용

## 📊 비용 비교

| 솔루션 | 저장공간 | 대역폭 | 월 비용 |
|--------|----------|--------|---------|
| Supabase Pro | 8GB | 250GB | $25 |
| Cloudflare R2 | 10GB | 무제한 | 무료 |
| AWS S3 | 무제한 | 무제한 | $0.023/GB |

## 🎯 권장 설정

1. **Supabase Storage** 파일 크기 제한을 500MB로 변경
2. **Cloudflare R2** 연동 (장기적)
3. **비디오 압축** 적용
