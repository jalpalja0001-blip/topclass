-- ⚠️ 개발용: RLS 임시 비활성화 (프로덕션에서는 사용 금지)

-- Storage RLS 비활성화
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- courses 테이블 RLS 비활성화 (필요시)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- 확인
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('objects', 'courses');
