# 🚀 Supabase 데이터베이스 스키마 배포 가이드

## 📋 배포 단계

### 1. Supabase 대시보드 접속
1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 `likscdiwibbmqnamicon` 선택

### 2. SQL Editor에서 스키마 실행
1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 버튼 클릭
3. `supabase-setup.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

### 3. 테이블 생성 확인
1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - `categories` (카테고리)
   - `courses` (강의)
   - `lessons` (강의)
   - `purchases` (구매)
   - `course_progress` (강의 진도)
   - `lesson_progress` (강의 진도)

### 4. RLS 정책 확인
1. **Authentication** > **Policies** 메뉴에서
2. 각 테이블에 RLS 정책이 올바르게 설정되었는지 확인

## 🔧 대안 방법: Supabase CLI 사용

### CLI 설치 및 로그인
```bash
# Supabase CLI 설치
npm install -g supabase

# Supabase에 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref likscdiwibbmqnamicon

# 스키마 배포
supabase db push
```

## ✅ 배포 완료 후 확인사항

1. **테이블 생성 확인**: 6개 테이블이 모두 생성되었는지 확인
2. **샘플 데이터 확인**: 카테고리와 강의 데이터가 삽입되었는지 확인
3. **RLS 정책 확인**: 보안 정책이 올바르게 설정되었는지 확인
4. **API 테스트**: 애플리케이션에서 데이터 조회가 정상 작동하는지 확인

## 🚨 주의사항

- **Service Role Key**: 프로덕션 환경에서는 Service Role Key를 사용하지 마세요
- **RLS 정책**: 모든 테이블에 적절한 RLS 정책이 설정되어 있는지 확인하세요
- **백업**: 중요한 데이터가 있다면 배포 전 백업을 수행하세요

## 📞 문제 해결

### 테이블이 생성되지 않는 경우
1. SQL 문법 오류 확인
2. 권한 문제 확인
3. Supabase 프로젝트 상태 확인

### RLS 정책 오류가 발생하는 경우
1. 정책 문법 확인
2. 사용자 권한 확인
3. 테이블 관계 확인

배포가 완료되면 애플리케이션에서 정상적으로 데이터를 조회할 수 있습니다! 🎉
