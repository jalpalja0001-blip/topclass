# 데이터베이스 스키마 배포 가이드

## 🚀 Supabase 데이터베이스 설정

### 1. Supabase 대시보드 접속
1. [https://supabase.com/dashboard](https://supabase.com/dashboard) 접속
2. 로그인 후 프로젝트 선택

### 2. SQL Editor에서 스키마 실행
1. 왼쪽 메뉴에서 **"SQL Editor"** 클릭
2. **"New Query"** 버튼 클릭
3. 아래 SQL 코드를 복사하여 붙여넣기
4. **"Run"** 버튼 클릭

### 3. 생성되는 테이블들
- `categories` - 강의 카테고리
- `courses` - 강의 정보
- `lessons` - 강의 레슨
- `purchases` - 구매 내역
- `course_progress` - 강의 진도
- `lesson_progress` - 레슨 진도
- `ebooks` - 전자책
- `ebook_purchases` - 전자책 구매
- `success_stories` - 성공 스토리

### 4. RLS (Row Level Security) 정책
- 사용자별 데이터 접근 제어
- 구매 내역은 구매자만 조회 가능
- 강의 진도는 해당 사용자만 수정 가능

### 5. 샘플 데이터
- 카테고리: 프로그래밍, 디자인, 마케팅, 비즈니스
- 강의: 8개 샘플 강의
- 레슨: 각 강의별 5-10개 레슨

## ✅ 배포 완료 후 확인사항

1. **Table Editor**에서 테이블 생성 확인
2. **Authentication** → **Users**에서 사용자 목록 확인
3. 웹사이트에서 실제 데이터로 테스트

## 🔧 문제 해결

### 테이블이 생성되지 않는 경우
- SQL 문법 오류 확인
- 권한 문제 확인
- Supabase 프로젝트 상태 확인

### 데이터가 보이지 않는 경우
- RLS 정책 확인
- 사용자 인증 상태 확인
- API 엔드포인트 테스트

## 📝 다음 단계

1. 데이터베이스 스키마 배포
2. 더미 데이터 제거
3. 실제 데이터로 테스트
4. 프로덕션 준비
