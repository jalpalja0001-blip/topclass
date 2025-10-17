# Firebase MCP 설정 가이드

Cursor에서 Firebase MCP 서버를 사용하기 위한 설정 가이드입니다.

## 🚀 설치된 Firebase MCP 서버

1. **`firebase`** - `@gannonh/firebase-mcp` (Firebase 전체 서비스 지원)

## 🔥 지원하는 Firebase 서비스

### 🗄️ Firestore (NoSQL Database)
- 문서 생성, 읽기, 업데이트, 삭제
- 컬렉션 및 서브컬렉션 관리
- 쿼리 및 필터링
- 실시간 리스너

### 🔐 Authentication
- 사용자 등록 및 로그인
- 이메일/비밀번호 인증
- 소셜 로그인 (Google, Facebook 등)
- 사용자 관리

### 📁 Storage
- 파일 업로드 및 다운로드
- 이미지, 동영상, 문서 관리
- 파일 메타데이터 관리
- 보안 규칙

### ⚡ Realtime Database
- 실시간 데이터 동기화
- JSON 트리 구조
- 오프라인 지원

### 🔧 Cloud Functions
- 서버리스 함수 실행
- 트리거 기반 자동화
- HTTP 엔드포인트

## 📋 설정 방법

### 1. Firebase 프로젝트 준비

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 프로젝트 설정에서 웹 앱 추가
3. Firebase SDK 구성 정보 복사

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Firebase 설정
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (서버 사이드)
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Next.js 환경 (필요시)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 서비스 계정 키 설정 (선택사항)

고급 기능을 위해 서비스 계정 키가 필요할 수 있습니다:

1. Firebase Console → 프로젝트 설정 → 서비스 계정
2. 새 비공개 키 생성
3. JSON 파일 다운로드
4. 프로젝트에 `firebase-admin-key.json` 저장

### 4. MCP 서버 설정 (고급)

더 세밀한 제어를 원한다면 `.cursor/mcp.json`에서 환경 변수를 추가:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": [
        "@gannonh/firebase-mcp"
      ],
      "env": {
        "FIREBASE_PROJECT_ID": "your_project_id",
        "GOOGLE_APPLICATION_CREDENTIALS": "./firebase-admin-key.json"
      }
    }
  }
}
```

## 🎯 사용 가능한 기능들

### 🗄️ Firestore 작업
- "users 컬렉션을 만들어주세요"
- "posts 문서에 새 게시물을 추가해주세요"
- "사용자 ID가 'user123'인 문서를 조회해주세요"
- "title에 'firebase'가 포함된 게시물을 찾아주세요"
- "오래된 게시물들을 삭제해주세요"

### 🔐 인증 관리
- "새로운 사용자를 등록해주세요"
- "이메일과 비밀번호로 로그인해주세요"
- "사용자 프로필을 업데이트해주세요"
- "비밀번호 재설정 이메일을 보내주세요"
- "사용자 목록을 조회해주세요"

### 📁 스토리지 작업
- "이미지를 업로드해주세요"
- "profile-pictures 폴더를 만들어주세요"
- "파일 목록을 조회해주세요"
- "파일을 다운로드해주세요"
- "파일 권한을 설정해주세요"

### ⚡ 실시간 기능
- "messages 컬렉션의 실시간 리스너를 설정해주세요"
- "새 메시지가 추가될 때 알림을 받고 싶어요"
- "채팅방의 실시간 업데이트를 구독해주세요"

### 🔧 Cloud Functions
- "새 사용자가 가입할 때 환영 이메일을 보내는 함수를 만들어주세요"
- "이미지 업로드 시 썸네일을 생성하는 함수를 작성해주세요"
- "HTTP 트리거 함수를 배포해주세요"

## 📊 Firebase vs Supabase 비교

| 기능 | Firebase | Supabase |
|------|----------|----------|
| 데이터베이스 | Firestore (NoSQL) | PostgreSQL (SQL) |
| 인증 | Firebase Auth | Supabase Auth |
| 스토리지 | Firebase Storage | Supabase Storage |
| 실시간 | Firestore 실시간 | PostgreSQL 실시간 |
| 함수 | Cloud Functions | Edge Functions |
| 가격 | Google 기반 | 오픈소스 기반 |

## ⚠️ 보안 주의사항

### API 키 보안
- **클라이언트 사이드 API 키**는 공개되어도 상대적으로 안전
- **서비스 계정 키**는 절대 클라이언트에 노출하지 말 것
- 환경 변수를 통해 관리

### Firebase 보안 규칙
```javascript
// Firestore 보안 규칙 예제
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 문서만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 공개 게시물은 모든 사용자가 읽기 가능, 작성자만 수정 가능
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

### Storage 보안 규칙
```javascript
// Storage 보안 규칙 예제
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 사용자는 자신의 폴더에만 업로드 가능
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔧 문제 해결

### MCP 서버가 인식되지 않는 경우
1. Cursor 완전 재시작
2. `.cursor/mcp.json` 파일 위치 확인
3. 환경 변수 설정 확인

### Firebase 연결 오류
1. 프로젝트 ID 확인
2. API 키 유효성 확인
3. 네트워크 연결 확인
4. Firebase 프로젝트 상태 확인

### 권한 오류
1. Firebase 보안 규칙 확인
2. 사용자 인증 상태 확인
3. 서비스 계정 권한 확인

### 할당량 초과
1. Firebase Console에서 사용량 확인
2. 요금제 업그레이드 고려
3. 쿼리 최적화

## 📚 추가 리소스

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firebase MCP 서버 GitHub](https://github.com/gannonh/firebase-mcp)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase CLI 문서](https://firebase.google.com/docs/cli)

## 🎉 사용 예제

### 1. 블로그 앱 설정
```
사용자: "블로그 앱을 위한 Firestore 구조를 만들어주세요. users, posts, comments 컬렉션이 필요해요."
```

### 2. 사용자 인증
```
사용자: "이메일과 비밀번호로 새 사용자를 등록하고 환영 메시지를 보내주세요."
```

### 3. 파일 업로드
```
사용자: "프로필 이미지를 업로드하고 썸네일을 자동으로 생성해주세요."
```

### 4. 실시간 채팅
```
사용자: "실시간 채팅 기능을 만들어주세요. 새 메시지가 오면 즉시 업데이트되어야 해요."
```

### 5. 데이터 분석
```
사용자: "지난 주 가입한 사용자 수를 조회하고 차트로 보여주세요."
```

이제 Cursor에서 자연어로 Firebase의 모든 기능을 사용할 수 있습니다! 🔥🚀


