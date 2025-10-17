# Supabase 인증 문제 해결 가이드

## 🔍 확인 사항

### 1. Supabase Dashboard에서 확인

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 로그인
   - `nano` 프로젝트 선택

2. **Authentication 설정 확인**
   - 왼쪽 메뉴에서 **Authentication** 클릭
   - **Providers** 탭 확인
   - **Email** 이 활성화되어 있는지 확인

3. **Email 설정 확인**
   - Authentication → Settings
   - **Email Auth** 섹션에서:
     - ✅ Enable Email Signup (활성화)
     - ✅ Enable Email Login (활성화)
     - ❌ Confirm Email (비활성화 - 개발 중에는 끄기)
     - ❌ Secure Email Change (비활성화 - 개발 중에는 끄기)

4. **사용자 목록 확인**
   - Authentication → Users
   - 회원가입한 사용자가 목록에 있는지 확인
   - 사용자의 상태가 `Confirmed`인지 확인

### 2. 일반적인 문제와 해결 방법

#### 문제 1: 이메일 확인이 필요한 경우
**증상**: 회원가입은 되지만 로그인이 안 됨
**해결**:
1. Authentication → Settings
2. "Confirm Email" 비활성화
3. 또는 이미 가입한 사용자의 경우:
   - Users 탭에서 해당 사용자 찾기
   - Actions → Confirm User 클릭

#### 문제 2: 비밀번호 정책 문제
**증상**: 회원가입 시 비밀번호가 거부됨
**해결**:
1. Authentication → Settings
2. Password Requirements 확인
3. 최소 6자 이상으로 설정

#### 문제 3: Rate Limiting
**증상**: 여러 번 시도 후 로그인 차단
**해결**:
1. Authentication → Settings
2. Rate Limits 섹션 확인
3. 개발 중에는 제한 완화

### 3. 테스트 방법

#### 브라우저 콘솔에서 직접 테스트
```javascript
// F12로 개발자 도구 열고 Console 탭에서 실행

// 1. 회원가입 테스트
const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'test123456'
})
console.log('SignUp:', signUpData, signUpError)

// 2. 로그인 테스트
const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'test123456'
})
console.log('SignIn:', signInData, signInError)

// 3. 현재 세션 확인
const { data: { session } } = await supabase.auth.getSession()
console.log('Current Session:', session)
```

### 4. SQL로 직접 사용자 확인
Supabase SQL Editor에서:
```sql
-- auth.users 테이블 확인 (시스템 테이블)
SELECT id, email, created_at, confirmed_at, last_sign_in_at 
FROM auth.users 
ORDER BY created_at DESC;
```

### 5. 임시 해결 방법

만약 급하게 테스트가 필요하다면:

1. **Supabase Dashboard → Authentication → Users**
2. **Invite User** 버튼 클릭
3. 이메일 입력 후 초대
4. 이메일로 받은 링크로 비밀번호 설정
5. 해당 계정으로 로그인

### 6. 환경변수 재확인

`.env.local` 파일:
```env
NEXT_PUBLIC_SUPABASE_URL=https://mpejkujtaiqgmbazobjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

URL과 Key가 정확한지 확인하세요.

## 🔧 추가 디버깅

### 네트워크 탭 확인
1. F12 → Network 탭
2. 로그인 시도
3. `auth` 요청 찾기
4. Response 확인

### 에러 메시지 확인
- "Invalid login credentials" → 이메일/비밀번호 틀림
- "Email not confirmed" → 이메일 확인 필요
- "User not found" → 회원가입 안 됨
- "Invalid API key" → 환경변수 문제

## 💡 권장 설정 (개발 환경)

1. Email Confirmation: **OFF**
2. Secure Email Change: **OFF**  
3. Minimum Password Length: **6**
4. Rate Limits: **완화**

이 설정들을 확인하고 문제가 계속되면 에러 메시지를 알려주세요!

