-- 1. 현재 사용자 ID 확인
SELECT id, email, role 
FROM auth.users 
WHERE email = 'sprince1004@naver.com';

-- 2. 관리자 테이블 확인
SELECT * FROM admins 
WHERE email = 'sprince1004@naver.com';

-- 3. 관리자 정보 업데이트 또는 추가
INSERT INTO admins (user_id, email, role, is_active)
SELECT 
  id as user_id,
  email,
  'super_admin' as role,
  true as is_active
FROM auth.users 
WHERE email = 'sprince1004@naver.com'
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'super_admin',
  is_active = true,
  updated_at = NOW()
RETURNING *;

-- 4. RLS 정책 확인 및 업데이트
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for admins" ON admins;
CREATE POLICY "Allow public read for admins" ON admins
  FOR SELECT
  USING (true);  -- 모든 사용자가 admins 테이블을 읽을 수 있도록 설정

-- 5. 최종 확인
SELECT * FROM admins;

