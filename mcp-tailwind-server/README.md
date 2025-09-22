# MCP Tailwind CSS Server

Cursor IDE에서 사용할 수 있는 Tailwind CSS MCP(Model Context Protocol) 서버입니다.

## 기능

이 MCP 서버는 다음과 같은 Tailwind CSS 관련 기능들을 제공합니다:

### 🎨 클래스 검색 및 참조
- `search_tailwind_classes`: 카테고리별 Tailwind 클래스 검색
- `explain_tailwind_class`: 특정 클래스의 의미와 사용법 설명
- `get_color_palette`: Tailwind CSS 색상 팔레트 정보

### 🧩 컴포넌트 생성
- `get_component_example`: 미리 만들어진 컴포넌트 예제 제공
- `generate_tailwind_component`: 설명에 따른 맞춤형 컴포넌트 생성

### 📱 반응형 도구
- `get_responsive_classes`: 반응형 클래스 정보 제공

## 지원하는 카테고리

- **Layout**: display, position, visibility 등
- **Flexbox & Grid**: flex, grid 관련 클래스들
- **Spacing**: padding, margin, space 관련
- **Sizing**: width, height 관련
- **Typography**: 폰트, 텍스트 관련
- **Backgrounds**: 배경색, 배경 이미지 등
- **Borders**: 테두리, 모서리 관련
- **Effects**: 그림자, 투명도 등
- **Filters**: blur, brightness 등
- **Tables**: 테이블 관련 스타일
- **Transitions & Animation**: 애니메이션 효과
- **Transforms**: 변형 효과
- **Interactivity**: 커서, 사용자 상호작용

## 컴포넌트 예제

다음 컴포넌트들의 예제를 제공합니다:

- **Button**: 다양한 스타일의 버튼
- **Card**: 카드 레이아웃
- **Navbar**: 네비게이션 바
- **Form**: 폼 요소들
- **Grid**: 그리드 레이아웃
- **Modal**: 모달 창

## 설치 및 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 빌드
```bash
npm run build
```

### 3. Cursor 설정
프로젝트 루트의 `.cursor/mcp.json` 파일에 자동으로 설정되어 있습니다.

### 4. Cursor 재시작
Cursor IDE를 재시작하여 MCP 설정을 적용합니다.

## 사용법

Cursor에서 MCP 서버가 활성화되면, 다음과 같이 사용할 수 있습니다:

### 클래스 검색
```
"flex 관련 Tailwind 클래스들을 보여주세요"
"spacing 카테고리의 클래스들을 알려주세요"
```

### 클래스 설명
```
"bg-blue-500 클래스가 무엇인지 설명해주세요"
"hover:bg-red-600의 의미를 알려주세요"
```

### 컴포넌트 생성
```
"파란색 버튼 컴포넌트를 만들어주세요"
"카드 레이아웃 예제를 보여주세요"
"반응형 그리드를 만들어주세요"
```

### 색상 팔레트
```
"blue 색상 팔레트를 보여주세요"
"모든 Tailwind 색상을 알려주세요"
```

### 반응형 클래스
```
"text-lg의 반응형 버전들을 알려주세요"
"p-4 클래스의 반응형 사용법을 보여주세요"
```

## 예제

### 기본 사용
```
사용자: "버튼 컴포넌트 예제를 보여주세요"
MCP: 다양한 스타일의 버튼 HTML 코드 제공

사용자: "flex 관련 클래스들을 알려주세요"
MCP: flexbox 카테고리의 모든 클래스들 나열

사용자: "빨간색 카드를 만들어주세요"
MCP: 빨간색 테마의 카드 컴포넌트 HTML 생성
```

## 문제 해결

### MCP 서버가 인식되지 않는 경우
1. Cursor IDE를 완전히 재시작
2. `.cursor/mcp.json` 파일이 올바른 위치에 있는지 확인
3. MCP 서버가 빌드되었는지 확인 (`npm run build`)

### 클래스 정보가 부정확한 경우
- 이 서버는 Tailwind CSS v3.x 기준으로 작성되었습니다
- 최신 버전과 차이가 있을 수 있으니 공식 문서도 함께 참조하세요

## 라이센스

ISC


