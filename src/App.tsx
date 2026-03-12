import { useState } from 'react'
import { RoomTab } from './components/RoomTab'
import { SceneControl } from './components/SceneControl'
import { useHAStates } from './hooks/useHAStates'
import { useHAConnection } from './hooks/useHAConnection'
import { ButtonGuide } from './components/ButtonGuide'
import type { Room } from './types'

const ROOMS: Room[] = [
  {
    id: 'living',
    name: '거실',
    devices: [
      {
        id: 'living-light-main',
        name: '거실등',
        type: 'light',
        isOn: false,
        entity_id: 'switch.geosil_light_left',
      },
      {
        id: 'living-light-sigtak',
        name: '식탁등',
        type: 'light',
        isOn: false,
        entity_id: 'switch.siktak_light',
      },
      {
        id: 'living-light-veranda',
        name: '베란다등',
        type: 'light',
        isOn: false,
        entity_id: 'switch.geosil_light_right',
      },
      {
        id: 'living-light-kitchen',
        name: '주방등',
        type: 'light',
        isOn: false,
        entity_id: 'switch.geosil_light_center',
      },
      {
        id: 'living-tv',
        name: '거실 TV',
        type: 'tv_ir',
        isOn: false,
        entity_id: 'media_player.lg_webos_tv_oled65a1sna',
      },
      {
        id: 'living-curtain',
        name: '거실 커튼',
        type: 'curtain',
        isOpen: false,
        entity_id: 'cover.geisul_curtain',
      },
      {
        id: 'living-ac',
        name: '에어컨',
        type: 'ac_ir',
        isOn: false,
      },
    ],
  },
  {
    id: 'bedroom',
    name: '침실',
    devices: [
      {
        id: 'bedroom-light',
        name: '안방등',
        type: 'light',
        isOn: false,
        entity_id: 'switch.anbang_light',
      },
      {
        id: 'bedroom-curtain',
        name: '안방 커튼',
        type: 'curtain',
        isOpen: false,
        entity_id: 'cover.anbang_curtain',
      },
    ],
  },
  {
    id: 'bathroom',
    name: '화장실',
    devices: [
      {
        id: 'bathroom-light',
        name: '화장실등',
        type: 'light',
        isOn: false,
        entity_id: 'switch.toliet_fan_light_left',
      },
      {
        id: 'bathroom-fan',
        name: '환풍기',
        type: 'light',
        isOn: false,
        entity_id: 'switch.toliet_fan_light_right',
      },
    ],
  },
  {
    id: 'etc',
    name: '기타',
    devices: [
      {
        id: 'robot-vacuum',
        name: '로봇 청소기',
        type: 'vacuum',
        vacuumState: 'docked',
        entity_id: 'select.ace_arc_312_mode',
      },
      {
        id: 'vacuum-dnd',
        name: '방해 금지',
        type: 'switch',
        isOn: false,
        entity_id: 'switch.ace_arc_312_do_not_disturb',
      },
    ],
  },
]

export default function App() {
  const [activeRoom, setActiveRoom] = useState('living')
  const { rooms, loading, refresh } = useHAStates(ROOMS)
  const connected = useHAConnection()

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">스마트홈</h1>
          <p className="text-xs text-slate-400 mt-0.5">홈 컨트롤 패널</p>
        </div>
        <div className="flex items-center gap-3">
          <ButtonGuide />
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
        </div>
      </header>

      {/* 방 탭 + 기기 그리드 */}
      <main className="flex-1 p-6 overflow-hidden relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">기기 상태 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <RoomTab
            rooms={rooms}
            activeRoom={activeRoom}
            onRoomChange={setActiveRoom}
          />
        )}
      </main>

      {/* 씬 버튼 — 하단 고정 */}
      <SceneControl onSceneDone={refresh} />
    </div>
  )
}
