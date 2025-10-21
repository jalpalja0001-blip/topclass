# GitHub Secrets 설정 가이드

## 필수 GitHub Secrets 설정

GitHub 저장소와 Supabase를 연동하기 위해 다음 Secrets를 설정해야 합니다.

### 1. GitHub 저장소 Settings 접속
1. https://github.com/jalpalja0001-blip/topclass 접속
2. Settings 탭 클릭
3. 왼쪽 메뉴에서 "Secrets and variables" → "Actions" 클릭

### 2. 필수 Secrets 추가
"New repository secret" 버튼을 클릭하여 다음 값들을 추가:

#### Supabase 관련
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
  - **Value**: `https://mpejkujtaiqgmbazobjv.supabase.co`

- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZWprdWp0YWlxZ21iYXpvYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODIwMDAsImV4cCI6MjA3NjE1ODAwMH0.cpFLDyB2QsPEh-8UT5DtXIdIyeN8--Z7V8fdVs3bZII`

#### Supabase CLI 관련 (선택사항)
- **Name**: `SUPABASE_PROJECT_REF`
  - **Value**: `mpejkujtaiqgmbazobjv` (프로젝트 Reference ID)

- **Name**: `SUPABASE_ACCESS_TOKEN`
  - **Value**: Supabase Dashboard → Account Settings → Access Tokens에서 생성

### 3. Vercel 배포 설정 (선택사항)

Vercel로 자동 배포를 원하시면 다음 Secrets도 추가:

#### Vercel 관련
1. Vercel 계정 생성/로그인: https://vercel.com
2. 프로젝트 Import 또는 생성
3. 다음 값들을 GitHub Secrets에 추가:

- **Name**: `VERCEL_TOKEN`
  - **Value**: Vercel Dashboard → Settings → Tokens에서 생성

- **Name**: `VERCEL_ORG_ID`
  - **Value**: Vercel Dashboard → Settings → General에서 확인

- **Name**: `VERCEL_PROJECT_ID`
  - **Value**: Vercel 프로젝트 Settings → General에서 확인

## 환경변수 동기화

### Local 개발 환경 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://mpejkujtaiqgmbazobjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZWprdWp0YWlxZ21iYXpvYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODIwMDAsImV4cCI6MjA3NjE1ODAwMH0.cpFLDyB2QsPEh-8UT5DtXIdIyeN8--Z7V8fdVs3bZII
```

### Vercel 환경변수 (Vercel Dashboard에서 설정)
Vercel Dashboard → Project Settings → Environment Variables에서 동일한 값 설정

## 테스트

1. 코드 변경 후 main 브랜치에 push
2. GitHub Actions 탭에서 워크플로우 실행 확인
3. 성공적으로 완료되면 배포된 사이트 확인

## 추가 보안 설정

### Row Level Security (RLS)
Supabase Dashboard에서 RLS가 활성화되어 있는지 확인:
1. Table Editor → 각 테이블 선택
2. RLS 활성화 확인
3. 정책이 올바르게 설정되어 있는지 확인

### Service Role Key
프로덕션에서 관리자 기능이 필요한 경우:
- Service Role Key는 절대 클라이언트에 노출되면 안 됨
- 서버사이드에서만 사용
- GitHub Secrets에 `SUPABASE_SERVICE_ROLE_KEY`로 추가

## 문제 해결

### Build 실패 시
- GitHub Actions 로그 확인
- 환경변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 데이터베이스 연결 실패 시
- Supabase URL과 Anon Key 확인
- Supabase 프로젝트 상태 확인
- RLS 정책 확인
