-- 관리자 테이블 생성
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin', -- admin, super_admin 등
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);

-- 샘플 관리자 추가 (이메일을 실제 관리자 이메일로 변경하세요)
-- INSERT INTO admins (user_id, email, role, is_active) VALUES
--   ('YOUR_USER_ID', 'admin@example.com', 'super_admin', true);

-- 관리자 확인 함수
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins 
    WHERE email = user_email AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

