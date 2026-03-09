# smarthome-tablet-ui

태블릿 전용 스마트홈 컨트롤 PWA. `smarthome-ai-gateway`와 연동하여 자연어 명령으로 기기를 제어합니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 데스크탑 IP 입력:

```env
VITE_GATEWAY_URL=http://192.168.0.100:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드 (배포용)

```bash
npm run build
npm run preview
```

## 구조

| 디렉토리/파일 | 설명 |
|--------------|------|
| `src/components/` | UI 컴포넌트 (방 탭, 기기 카드) |
| `src/api/gateway.ts` | Gateway API 호출 |
| `src/hooks/useDeviceControl.ts` | 기기 제어 상태 관리 |
| `src/types/index.ts` | 공통 타입 |
| `src/App.tsx` | 방 목록 정의 (기기 추가 여기서) |

## 기기 추가

`src/App.tsx`의 `ROOMS` 배열에 기기를 추가합니다.

```typescript
{ id: 'my-light', name: '내 조명', type: 'light', isOn: false, brightness: 80 }
```

## PWA 설치

브라우저에서 접속 후 "홈 화면에 추가"로 앱처럼 사용 가능합니다.
태블릿 가로모드에 최적화되어 있습니다.

## 관련 프로젝트

- [smarthome-ai-gateway](../smarthome-ai-gateway) — 백엔드 API 서버
