-- 관리자 테이블 생성 (없는 경우)
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 활성화
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 관리자 테이블은 관리자만 조회 가능
CREATE POLICY "Only admins can view admin table" ON admins
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM admins WHERE is_active = true)
  );

-- sprince1004@naver.com 계정을 관리자로 등록
INSERT INTO admins (user_id, email, role, is_active)
SELECT 
  id as user_id,
  email,
  'super_admin' as role,
  true as is_active
FROM auth.users 
WHERE email = 'sprince1004@naver.com'
ON CONFLICT (email) DO UPDATE 
SET role = 'super_admin',
    is_active = true,
    updated_at = NOW();