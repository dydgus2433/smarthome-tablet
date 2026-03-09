# smarthome-tablet-ui - 프로젝트 컨텍스트

Claude Code가 이 파일을 읽고 프로젝트 전체 맥락을 파악할 수 있도록 정리한 문서.

---

## 🎯 프로젝트 목표

`smarthome-ai-gateway` (백엔드 API 서버)와 연동하는 **태블릿 전용 스마트홈 컨트롤 웹앱**.
아내가 태블릿에서 편하게 사용할 수 있도록 PWA로 제공.

---

## 🛠️ 기술 스택

| 항목 | 선택 |
|------|------|
| UI 프레임워크 | React 18 + TypeScript |
| 빌드 도구 | Vite 5 |
| 스타일 | Tailwind CSS 3 |
| PWA | vite-plugin-pwa (workbox) |

---

## 📁 파일 구조

```
smarthome-local-tablet/
├── src/
│   ├── components/
│   │   ├── RoomTab.tsx        # 방 탭 전환 + 기기 그리드
│   │   ├── DeviceCard.tsx     # 기기 타입별 컴포넌트 라우팅
│   │   ├── LightControl.tsx   # 조명 (켜기/끄기 + 밝기 슬라이더)
│   │   ├── ClimateControl.tsx # 에어컨/난방 (켜기/끄기 + 온도 +/-)
│   │   ├── CurtainControl.tsx # 커튼/블라인드 (열기/닫기)
│   │   └── StatusRing.tsx     # 버튼 상태 피드백 (idle/loading/success/error)
│   ├── api/
│   │   └── gateway.ts         # POST /chat 호출
│   ├── hooks/
│   │   └── useDeviceControl.ts # 명령 전송 + 상태(idle→loading→success/error) 관리
│   ├── types/
│   │   └── index.ts           # 공통 타입 (Device, Room, CommandStatus 등)
│   ├── App.tsx                # 방 목록 정의 + 탭 전환
│   ├── main.tsx
│   └── index.css              # Tailwind 진입점
├── CLAUDE.md
├── README.md
├── .env.example
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 📡 Gateway API 연동

| 항목 | 값 |
|------|----|
| 엔드포인트 | `POST ${VITE_GATEWAY_URL}/chat` |
| session_id | `"tablet_ui"` (고정) |
| 메시지 형식 | 자연어 (예: `"거실 조명 꺼줘"`) |

```json
// 요청
{ "message": "거실 조명 꺼줘", "session_id": "tablet_ui" }

// 응답
{ "reply": "거실 조명을 껐습니다.", "action_taken": { ... } }
```

Gateway 주소는 `.env` 파일의 `VITE_GATEWAY_URL`로 관리.

---

## 🏠 제어 기기

| 타입 | 컴포넌트 | 기능 |
|------|----------|------|
| `light` | LightControl | 켜기/끄기, 밝기 슬라이더 (10~100%) |
| `climate` | ClimateControl | 켜기/끄기, 온도 +1/−1 (16~30°C) |
| `curtain` | CurtainControl | 열기/닫기 |

---

## 🖼️ UI/UX 원칙

- **텍스트 입력 없음**: 모든 제어는 버튼/슬라이더만으로 가능
- **즉각적인 시각 피드백**: StatusRing으로 로딩(노랑)/성공(초록)/실패(빨강) 표시
- **태블릿 가로모드 최적화**: `grid-cols-device` (auto-fill, min 220px)
- **다크 테마**: slate-900 베이스, 기기 타입별 강조색 (조명=amber, 에어컨=blue, 커튼=emerald)
- **방별 탭**: 거실 / 침실 / 기타

---

## ➕ 기기/방 추가 방법

`src/App.tsx`의 `ROOMS` 배열에 추가:

```typescript
{
  id: 'new-room',
  name: '새 방',
  devices: [
    { id: 'device-id', name: '기기명', type: 'light', isOn: false, brightness: 80 },
  ],
}
```

---

## 💬 소통 방식

- **한국어로 소통**
- 코드 수정 시 변경 이유 간단히 설명 후 진행
