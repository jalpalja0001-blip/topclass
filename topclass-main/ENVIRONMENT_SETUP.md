# 🔧 환경 변수 설정 가이드

## 📋 개요

Supabase와의 연동을 위해 환경 변수를 설정해야 합니다. 이 가이드를 따라 `.env.local` 파일을 생성하세요.

---

## 🚀 설정 방법

### 1. `.env.local` 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하세요:

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

### 2. 환경 변수 추가

`.env.local` 파일에 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://likscdiwibbmqnamicon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7fvcqr7Pb9Hz2ptfjkjj7Q_ubZyQNky

# 개발 환경 설정
NODE_ENV=development

# 기타 설정 (선택사항)
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔍 환경 변수 설명

### 필수 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://your-project-ref.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 API 키 | `sb_publishable_...` |

### 선택 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NODE_ENV` | 실행 환경 | `development` |
| `NEXT_PUBLIC_APP_URL` | 애플리케이션 URL | `http://localhost:3000` |

---

## ⚠️ 보안 주의사항

### 1. `.env.local` 파일 보안
- **절대 Git에 커밋하지 마세요**
- `.gitignore`에 이미 포함되어 있습니다
- 프로덕션에서는 다른 방법으로 환경 변수를 설정하세요

### 2. API 키 보안
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서 접근 가능합니다
- 민감한 정보는 서버 사이드에서만 사용하세요
- 프로덕션에서는 정기적으로 API 키를 갱신하세요

---

## 🧪 설정 확인

### 1. 개발 서버 재시작
```bash
npm run dev
```

### 2. 콘솔 로그 확인
환경 변수가 올바르게 설정되면 다음과 같은 로그가 표시됩니다:

```
✅ Supabase 환경 변수가 올바르게 설정되었습니다.
```

환경 변수가 설정되지 않으면 다음과 같은 경고가 표시됩니다:

```
❌ Supabase 환경 변수가 설정되지 않았습니다.
⚠️ 경고: 하드코딩된 Supabase 설정을 사용합니다.
```

---

## 🔧 문제 해결

### 환경 변수가 인식되지 않는 경우

1. **파일 위치 확인**
   - `.env.local` 파일이 프로젝트 루트에 있는지 확인
   - 파일명이 정확한지 확인 (`.env.local`)

2. **서버 재시작**
   - 환경 변수 변경 후 개발 서버를 재시작해야 함

3. **문법 확인**
   - `KEY=value` 형식으로 작성
   - 공백이나 특수문자 확인
   - 따옴표 사용하지 않기

### API 키가 유효하지 않은 경우

1. **Supabase 대시보드 확인**
   - 프로젝트가 활성화되어 있는지 확인
   - API 키가 올바른지 확인

2. **네트워크 연결 확인**
   - 인터넷 연결 상태 확인
   - 방화벽 설정 확인

---

## 📚 추가 리소스

- [Next.js 환경 변수 문서](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase 환경 변수 설정](https://supabase.com/docs/guides/getting-started/local-development#env-vars)
- [환경 변수 보안 모범 사례](https://12factor.net/config)

---

## 🎯 다음 단계

환경 변수 설정이 완료되면:

1. **데이터베이스 스키마 배포**
   - `supabase-setup.sql` 실행
   - 테이블 생성 확인

2. **연동 테스트**
   - API 엔드포인트 테스트
   - 실제 데이터 조회 확인

3. **프로덕션 배포**
   - 환경 변수를 안전하게 설정
   - API 키 보안 강화
