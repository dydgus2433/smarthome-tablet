import { useState } from 'react'
import { RoomTab } from './components/RoomTab'
import { SceneControl } from './components/SceneControl'
import { useHAStates } from './hooks/useHAStates'
import { useHAConnection } from './hooks/useHAConnection'
import type { Room } from './types'

const ROOMS: Room[] = [
  {
    id: 'living',
    name: '거실',
    devices: [
      {
        id: 'living-light-main',
        name: '메인 조명',
        type: 'light',
        isOn: false,
        brightness: 80,
        entity_id: 'light.living_room_main', // TODO: 실제 ID로 교체
      },
      {
        id: 'living-light-mood',
        name: '무드등',
        type: 'light',
        isOn: false,
        brightness: 40,
        colorTemp: 300,
        supportsBrightness: true,
        supportsColor: true,
        entity_id: 'light.living_room_mood', // TODO: 실제 ID로 교체
      },
      {
        id: 'living-ac',
        name: '에어컨',
        type: 'climate',
        isOn: false,
        targetTemperature: 24,
        entity_id: 'climate.living_room_ac', // TODO: 실제 ID로 교체
      },
      {
        id: 'living-curtain',
        name: '커튼',
        type: 'curtain',
        isOpen: false,
        entity_id: 'cover.living_room_curtain', // TODO: 실제 ID로 교체
      },
      {
        id: 'living-tv',
        name: 'LG TV',
        type: 'tv',
        isOn: false,
        volume: 20,
        entity_id: 'media_player.lg_tv', // TODO: 실제 ID로 교체
      },
      {
        id: 'living-plug',
        name: '스마트 플러그',
        type: 'switch',
        isOn: false,
        entity_id: 'switch.living_room_plug', // TODO: 실제 ID로 교체
      },
    ],
  },
  {
    id: 'bedroom',
    name: '침실',
    devices: [
      {
        id: 'bedroom-light',
        name: '조명',
        type: 'light',
        isOn: false,
        brightness: 60,
        entity_id: 'light.bedroom_main', // TODO: 실제 ID로 교체
      },
      {
        id: 'bedroom-heat',
        name: '난방',
        type: 'climate',
        isOn: false,
        targetTemperature: 22,
        entity_id: 'climate.bedroom_heat', // TODO: 실제 ID로 교체
      },
      {
        id: 'bedroom-blind',
        name: '블라인드',
        type: 'curtain',
        isOpen: false,
        entity_id: 'cover.bedroom_blind', // TODO: 실제 ID로 교체
      },
    ],
  },
  {
    id: 'etc',
    name: '기타',
    devices: [
      {
        id: 'kitchen-light',
        name: '주방 조명',
        type: 'light',
        isOn: false,
        brightness: 100,
        entity_id: 'light.kitchen', // TODO: 실제 ID로 교체
      },
      {
        id: 'bathroom-light',
        name: '욕실 조명',
        type: 'light',
        isOn: false,
        brightness: 100,
        entity_id: 'light.bathroom', // TODO: 실제 ID로 교체
      },
      {
        id: 'entrance-light',
        name: '현관 조명',
        type: 'light',
        isOn: false,
        brightness: 70,
        entity_id: 'light.entrance', // TODO: 실제 ID로 교체
      },
      {
        id: 'robot-vacuum',
        name: '로봇 청소기',
        type: 'vacuum',
        vacuumState: 'docked',
        entity_id: 'vacuum.robot', // TODO: 실제 ID로 교체
      },
    ],
  },
]

export default function App() {
  const [activeRoom, setActiveRoom] = useState('living')
  const { rooms, loading } = useHAStates(ROOMS)
  const connected = useHAConnection()

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">스마트홈</h1>
          <p className="text-xs text-slate-400 mt-0.5">홈 컨트롤 패널</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {connected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-slate-400">연결됨</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <span className="text-red-400">연결 끊김</span>
            </>
          )}
        </div>
      </header>

      {/* 방 탭 + 기기 그리드 */}
      <main className="flex-1 p-6 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 z-10 rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">기기 상태 불러오는 중...</p>
            </div>
          </div>
        )}
        <RoomTab
          rooms={rooms}
          activeRoom={activeRoom}
          onRoomChange={setActiveRoom}
        />
      </main>

      {/* 씬 버튼 — 하단 고정 */}
      <SceneControl />
    </div>
  )
}
