# Context7 MCP 설정 가이드

Cursor에서 Context7 MCP 서버를 사용하기 위한 설정 가이드입니다.

## 🚀 설치된 Context7 MCP 서버

**`context7`** - `@upstash/context7-mcp` (최신 라이브러리 및 프레임워크 문서 제공)

## 📋 Context7 MCP란?

Context7 MCP는 최신 라이브러리와 프레임워크의 문서를 AI 도우미와 통합하여 개발 효율성을 높이는 도구입니다. 다음과 같은 기능을 제공합니다:

### 🎯 주요 기능

- **최신 문서 제공**: React, Next.js, TypeScript, Tailwind CSS 등 최신 라이브러리 문서
- **실시간 업데이트**: 최신 버전의 API 문서와 가이드 제공
- **컨텍스트 인식**: 현재 프로젝트에 맞는 관련 문서 자동 추천
- **코드 예제**: 실제 사용 가능한 코드 예제와 베스트 프랙티스 제공

## 🔧 설정 방법

### 1. 자동 설치 (권장)

Context7 MCP는 이미 `.cursor/mcp.json` 파일에 설정되어 있습니다:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ],
      "env": {}
    }
  }
}
```

### 2. 수동 설치 (필요시)

만약 수동으로 설치해야 한다면:

```bash
# 전역 설치
npm install -g @upstash/context7-mcp

# 또는 프로젝트별 설치
npm install @upstash/context7-mcp
```

## 🎯 사용 가능한 기능들

### 📚 라이브러리 문서 조회
- "React 18의 새로운 기능에 대해 알려주세요"
- "Next.js 14의 App Router 사용법을 보여주세요"
- "TypeScript 5.0의 새로운 타입 기능을 설명해주세요"
- "Tailwind CSS 3.4의 새로운 유틸리티 클래스를 알려주세요"

### 🔧 프레임워크 가이드
- "Vue 3 Composition API 사용법을 보여주세요"
- "Svelte 5의 새로운 기능을 설명해주세요"
- "Angular 17의 새로운 기능을 알려주세요"
- "Express.js 최신 버전의 미들웨어 사용법을 보여주세요"

### 📦 패키지 관리
- "npm 10의 새로운 기능을 알려주세요"
- "pnpm의 장점과 사용법을 설명해주세요"
- "yarn 4의 새로운 기능을 보여주세요"

### 🎨 UI 라이브러리
- "Material-UI v5의 새로운 컴포넌트를 알려주세요"
- "Ant Design 5.0의 새로운 기능을 설명해주세요"
- "Chakra UI v3의 새로운 기능을 보여주세요"
- "Mantine v7의 새로운 컴포넌트를 알려주세요"

### 🧪 테스팅 도구
- "Jest 29의 새로운 기능을 알려주세요"
- "Vitest의 장점과 사용법을 설명해주세요"
- "Playwright의 최신 기능을 보여주세요"
- "Cypress 13의 새로운 기능을 알려주세요"

### 🚀 배포 및 인프라
- "Vercel의 새로운 기능을 알려주세요"
- "Netlify의 최신 기능을 설명해주세요"
- "Docker의 새로운 기능을 보여주세요"
- "Kubernetes의 최신 기능을 알려주세요"

## 🎉 사용 예제

### 1. React 개발
```
사용자: "React 18의 새로운 Concurrent Features에 대해 알려주세요"
```

### 2. Next.js 프로젝트
```
사용자: "Next.js 14 App Router에서 서버 컴포넌트를 사용하는 방법을 보여주세요"
```

### 3. TypeScript 설정
```
사용자: "TypeScript 5.0의 새로운 satisfies 연산자 사용법을 알려주세요"
```

### 4. 스타일링
```
사용자: "Tailwind CSS 3.4의 새로운 컨테이너 쿼리 기능을 설명해주세요"
```

### 5. 상태 관리
```
사용자: "Zustand의 최신 기능과 Redux Toolkit과의 차이점을 알려주세요"
```

## 🔧 문제 해결

### MCP 서버가 인식되지 않는 경우
1. **Cursor 완전 재시작**: Cursor를 완전히 종료하고 다시 시작
2. **설정 파일 확인**: `.cursor/mcp.json` 파일 위치와 내용 확인
3. **네트워크 연결**: 인터넷 연결 상태 확인

### Context7 서버 연결 오류
1. **Node.js 버전 확인**: Node.js 18 이상 필요
2. **npm 캐시 정리**: `npm cache clean --force`
3. **패키지 재설치**: `npx -y @upstash/context7-mcp`

### 문서 로딩 실패
1. **네트워크 상태 확인**: 안정적인 인터넷 연결 필요
2. **방화벽 설정**: 방화벽이 npm 패키지 다운로드를 차단하지 않는지 확인
3. **프록시 설정**: 회사 네트워크의 경우 프록시 설정 확인

## 📚 지원하는 라이브러리 및 프레임워크

### 🎨 프론트엔드
- **React** (18.x)
- **Vue** (3.x)
- **Angular** (17.x)
- **Svelte** (5.x)
- **Next.js** (14.x)
- **Nuxt** (3.x)
- **SvelteKit** (2.x)

### 🎨 스타일링
- **Tailwind CSS** (3.x)
- **Material-UI** (5.x)
- **Ant Design** (5.x)
- **Chakra UI** (3.x)
- **Mantine** (7.x)
- **Styled Components** (6.x)

### 🧪 테스팅
- **Jest** (29.x)
- **Vitest** (1.x)
- **Playwright** (1.x)
- **Cypress** (13.x)
- **Testing Library** (14.x)

### 🚀 빌드 도구
- **Vite** (5.x)
- **Webpack** (5.x)
- **Rollup** (4.x)
- **esbuild** (0.x)
- **SWC** (1.x)

### 📦 패키지 관리
- **npm** (10.x)
- **yarn** (4.x)
- **pnpm** (8.x)

### 🗄️ 데이터베이스
- **Prisma** (5.x)
- **Mongoose** (8.x)
- **TypeORM** (0.x)
- **Sequelize** (6.x)

## ⚡ 성능 최적화

### 빠른 응답을 위한 팁
1. **구체적인 질문**: "React hooks" 대신 "React 18의 useId hook 사용법"
2. **버전 명시**: "Next.js" 대신 "Next.js 14"
3. **컨텍스트 제공**: 현재 프로젝트의 기술 스택 언급

### 효율적인 사용법
1. **단계별 질문**: 복잡한 주제는 여러 단계로 나누어 질문
2. **예제 요청**: 이론과 함께 실제 코드 예제 요청
3. **비교 질문**: 여러 옵션을 비교하여 최적의 선택 도움

## 🔄 업데이트 및 유지보수

### 자동 업데이트
Context7 MCP는 자동으로 최신 문서를 가져오므로 별도의 업데이트가 필요하지 않습니다.

### 수동 업데이트 (필요시)
```bash
# 패키지 업데이트
npm update @upstash/context7-mcp

# 또는 최신 버전 강제 설치
npx -y @upstash/context7-mcp@latest
```

## 📚 추가 리소스

- [Context7 MCP GitHub](https://github.com/upstash/context7-mcp)
- [Model Context Protocol 문서](https://modelcontextprotocol.io/)
- [Upstash 공식 문서](https://upstash.com/docs)

## 🎉 활용 시나리오

### 1. 새로운 프로젝트 시작
```
사용자: "Next.js 14와 TypeScript로 새로운 프로젝트를 시작하려고 해요. 최신 베스트 프랙티스를 알려주세요."
```

### 2. 기존 프로젝트 업그레이드
```
사용자: "React 17에서 React 18로 업그레이드하는 방법과 주의사항을 알려주세요."
```

### 3. 성능 최적화
```
사용자: "Next.js 14에서 번들 크기를 줄이는 최신 방법들을 알려주세요."
```

### 4. 새로운 기술 학습
```
사용자: "Svelte 5의 새로운 기능과 React와의 차이점을 알려주세요."
```

이제 Cursor에서 자연어로 최신 라이브러리와 프레임워크의 문서를 조회할 수 있습니다! 🚀📚

