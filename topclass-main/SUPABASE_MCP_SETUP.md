# Supabase MCP 설정 가이드

Cursor에서 Supabase MCP 서버를 사용하기 위한 설정 가이드입니다.

## 🚀 설치된 Supabase MCP 서버들

1. **`supabase-official`** - `@supabase/mcp-server-supabase` (공식 Supabase MCP 서버)
2. **`supabase-crud`** - `supabase-mcp` (CRUD 작업 전용 MCP 서버)

## 📋 설정 방법

### 1. Supabase 프로젝트 준비

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트 생성
2. 프로젝트 설정에서 다음 정보 확인:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon Key**: 공개 API 키
   - **Service Role Key**: 서비스 역할 키 (주의: 강력한 권한)

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase 설정
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js 환경 (필요시)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. MCP 서버 설정 (고급)

더 세밀한 제어를 원한다면 `.cursor/mcp.json`에서 환경 변수를 추가할 수 있습니다:

```json
{
  "mcpServers": {
    "supabase-official": {
      "command": "npx",
      "args": [
        "@supabase/mcp-server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://your-project-ref.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your_service_role_key"
      }
    }
  }
}
```

## 🎯 사용 가능한 기능들

### 데이터베이스 작업
- "users라는 테이블을 만들어주세요"
- "posts 테이블에 title, content, author_id 컬럼을 추가해주세요"
- "users 테이블의 구조를 보여주세요"

### 데이터 조작
- "users 테이블에 새 사용자를 추가해주세요"
- "id가 1인 사용자의 정보를 가져와주세요"
- "모든 게시물을 조회해주세요"
- "사용자 이름이 'john'인 데이터를 업데이트해주세요"

### 인증 관리
- "새로운 사용자를 등록해주세요"
- "사용자 세션을 확인해주세요"
- "비밀번호를 재설정해주세요"

### 실시간 기능
- "posts 테이블의 실시간 구독을 설정해주세요"
- "새 댓글이 추가될 때 알림을 받고 싶어요"

### 스토리지 작업
- "파일을 업로드해주세요"
- "이미지 버킷을 만들어주세요"
- "파일 목록을 조회해주세요"

## ⚠️ 보안 주의사항

### Service Role Key 사용 시 주의점
- **모든 RLS(Row Level Security) 정책을 우회**합니다
- **프로덕션 환경에서는 매우 신중하게 사용**해야 합니다
- 가능하면 **Anon Key를 사용**하고 적절한 RLS 정책을 설정하세요

### 권장 보안 설정
1. **개발 환경에서만** Service Role Key 사용
2. **프로덕션에서는** 읽기 전용 복제본 사용 고려
3. **최소 권한 원칙** 적용
4. **API 키를 코드에 하드코딩하지 말 것**

## 🔧 문제 해결

### MCP 서버가 인식되지 않는 경우
1. Cursor 완전 재시작
2. `.cursor/mcp.json` 파일 위치 확인
3. 환경 변수 설정 확인

### 연결 오류가 발생하는 경우
1. Supabase 프로젝트 URL 확인
2. API 키 유효성 확인
3. 네트워크 연결 확인
4. Supabase 프로젝트 상태 확인

### 권한 오류가 발생하는 경우
1. RLS 정책 확인
2. API 키 권한 확인
3. 테이블/함수 권한 설정 확인

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase MCP 서버 GitHub](https://github.com/supabase/mcp-server-supabase)
- [Model Context Protocol 문서](https://modelcontextprotocol.io/)

## 🎉 사용 예제

### 1. 기본 테이블 생성
```
사용자: "블로그 앱을 위한 posts 테이블을 만들어주세요. id, title, content, author_id, created_at 컬럼이 필요해요."
```

### 2. 데이터 조회
```
사용자: "최근 10개의 게시물을 가져와주세요."
```

### 3. 실시간 기능 설정
```
사용자: "새로운 댓글이 추가될 때마다 알림을 받고 싶어요."
```

이제 Cursor에서 자연어로 Supabase 데이터베이스를 관리할 수 있습니다! 🚀


