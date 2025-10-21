# 🔧 환경 변수 수동 설정 가이드

## 1. .env.local 파일 생성

프로젝트 루트 디렉토리(`topclass-main`)에 `.env.local` 파일을 생성하고 다음 내용을 복사하여 붙여넣으세요:

```bash
# Supabase 환경 변수
NEXT_PUBLIC_SUPABASE_URL=https://mpejkujtaiqgmbazobjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZWprdWp0YWlxZ21iYXpvYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODIwMDAsImV4cCI6MjA3NjE1ODAwMH0.cpFLDyB2QsPEh-8UT5DtXIdIyeN8--Z7V8fdVs3bZII

# Service Role Key (Supabase 대시보드에서 복사)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 2. Supabase 대시보드에서 Service Role Key 복사

1. **Supabase 대시보드** → **Settings** → **API**
2. **service_role** 키를 복사
3. `.env.local` 파일의 `your_service_role_key_here` 부분을 실제 키로 교체

## 3. Storage Bucket 확인

Supabase 대시보드에서:
1. **Storage** → **Buckets**
2. `course-videos` bucket이 있는지 확인
3. 없으면 **New bucket** 클릭하여 생성:
   - **Name**: `course-videos`
   - **Public**: `false`
   - **File size limit**: `500MB`

## 4. 개발 서버 재시작

```bash
# 현재 서버 중지 (Ctrl+C)
npm run dev
```

## 5. 테스트

1. 브라우저에서 `http://localhost:3000/admin/courses/create` 접속
2. 강의 정보 입력 후 비디오 파일 선택
3. 저장 버튼 클릭
4. 개발자 도구(F12) → Console에서 로그 확인

## 6. 문제 해결

### Storage Bucket이 없는 경우
Supabase 대시보드에서 Storage → Buckets → New bucket으로 `course-videos` 생성

### RLS 정책 오류
Supabase 대시보드에서 Authentication → Policies에서 Storage 정책 확인

### 환경 변수 오류
`.env.local` 파일이 프로젝트 루트에 올바르게 위치했는지 확인
