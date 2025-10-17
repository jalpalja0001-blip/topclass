# MCP Playwright Server

Cursor IDE에서 사용할 수 있는 Playwright MCP(Model Context Protocol) 서버입니다.

## 기능

이 MCP 서버는 다음과 같은 Playwright 기능들을 제공합니다:

### 브라우저 제어
- `launch_browser`: 브라우저 시작 (Chromium, Firefox, WebKit 지원)
- `navigate_to`: 지정된 URL로 이동
- `close_browser`: 브라우저 닫기

### 페이지 상호작용
- `click_element`: 요소 클릭
- `fill_input`: 입력 필드에 텍스트 입력
- `get_text`: 요소의 텍스트 가져오기
- `wait_for_element`: 요소가 나타날 때까지 대기

### 스크린샷 및 테스트
- `take_screenshot`: 페이지 스크린샷 촬영
- `run_test`: Playwright 테스트 실행

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
프로젝트 루트의 `.cursor-settings/mcp.json` 파일이 자동으로 생성되어 있습니다.

### 4. Cursor 재시작
Cursor IDE를 재시작하여 MCP 설정을 적용합니다.

## 사용법

Cursor에서 MCP 서버가 활성화되면, 다음과 같이 사용할 수 있습니다:

### 기본 브라우저 자동화
```
브라우저를 시작하고 Google로 이동해주세요.
```

### 테스트 실행
```
현재 프로젝트의 Playwright 테스트를 실행해주세요.
```

### 웹 스크래핑
```
네이버 메인 페이지로 이동해서 검색창에 "playwright"를 입력하고 스크린샷을 찍어주세요.
```

## 지원되는 브라우저

- Chromium (기본값)
- Firefox
- WebKit (Safari)

## 예제

### 브라우저 시작 및 페이지 이동
1. `launch_browser` - 브라우저 시작
2. `navigate_to` - 원하는 URL로 이동
3. `take_screenshot` - 스크린샷 촬영

### 폼 작성 자동화
1. `launch_browser` - 브라우저 시작
2. `navigate_to` - 폼이 있는 페이지로 이동
3. `fill_input` - 입력 필드에 값 입력
4. `click_element` - 제출 버튼 클릭

### 테스트 자동화
1. `run_test` - 기존 Playwright 테스트 실행
2. 테스트 결과 확인

## 문제 해결

### MCP 서버가 인식되지 않는 경우
1. Cursor IDE를 완전히 재시작
2. `.cursor-settings/mcp.json` 파일이 올바른 위치에 있는지 확인
3. MCP 서버가 빌드되었는지 확인 (`npm run build`)

### 브라우저 실행 오류
1. Playwright 브라우저가 설치되었는지 확인: `npx playwright install`
2. 시스템 권한 확인

## 라이센스

ISC


