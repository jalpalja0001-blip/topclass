# Supabase CLI를 사용한 설정 가이드

## 1. Supabase CLI 설치

```bash
# npm으로 설치
npm install -g supabase

# 또는 yarn으로 설치
yarn global add supabase
```

## 2. Supabase에 로그인

```bash
supabase login
```

## 3. 프로젝트 연결

```bash
# 프로젝트 ID로 연결
supabase link --project-ref mpejkujtaiqgmbazobjv
```

## 4. SQL 파일 실행

```bash
# fix-rls-policies.sql 파일 실행
supabase db reset --file fix-rls-policies.sql
```

## 5. 연결 테스트

```bash
# 데이터베이스 연결 테스트
supabase db ping
```

## 6. 정책 확인

```bash
# 정책 목록 확인
supabase db diff
```

## 문제 해결

### CLI 설치 오류 시
```bash
# Node.js 버전 확인
node --version

# npm 캐시 정리
npm cache clean --force

# 다시 설치
npm install -g supabase@latest
```

### 연결 오류 시
```bash
# 로그아웃 후 재로그인
supabase logout
supabase login

# 프로젝트 재연결
supabase link --project-ref mpejkujtaiqgmbazobjv
```
