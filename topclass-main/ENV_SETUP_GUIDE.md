# 환경 변수 설정 가이드

## Supabase 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 환경 변수
NEXT_PUBLIC_SUPABASE_URL=https://mpejkujtaiqgmbazobjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZWprdWp0YWlxZ21iYXpvYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODIwMDAsImV4cCI6MjA3NjE1ODAwMH0.cpFLDyB2QsPEh-8UT5DtXIdIyeN8--Z7V8fdVs3bZII
```

## 설정 방법

1. **프로젝트 루트에 `.env.local` 파일 생성**
   ```bash
   touch .env.local
   ```

2. **위의 환경 변수를 복사하여 붙여넣기**

3. **개발 서버 재시작**
   ```bash
   npm run dev
   ```

## 주의사항

- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 프로덕션 환경에서는 실제 Supabase 프로젝트의 URL과 키를 사용하세요.
- 현재 설정된 값은 개발용 임시 설정입니다.

## 문제 해결

환경 변수를 설정한 후에도 오류가 발생한다면:

1. 개발 서버를 완전히 종료하고 다시 시작하세요.
2. 브라우저 캐시를 지우고 새로고침하세요.
3. `.env.local` 파일이 프로젝트 루트에 올바르게 위치했는지 확인하세요.
