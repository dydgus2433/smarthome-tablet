import { useState, useEffect } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import {
  tvTurnOff, tvWakeOnLan, tvSelectSource,
  tvVolumeUp, tvVolumeDown, tvMute,
  tvChannelUp, tvChannelDown, tvPlayPause,
} from '../api/homeassistant'
import type { Device } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

export function TVIRControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [isOn, setIsOn] = useState(device.isOn ?? false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setIsOn(device.isOn ?? false)
  }, [device.isOn])

  const eid = device.entity_id!

  const turnOn = () => call(async () => { await tvWakeOnLan(); setIsOn(true) })
  const turnOff = () => call(async () => { await tvTurnOff(eid); setIsOn(false) })
  const openApp = (source: string) => call(() => tvSelectSource(eid, source))

  const btnBase = 'flex-1 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95 disabled:opacity-40'
  const btnSec = 'flex-1 py-2 rounded-xl text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all active:scale-95 disabled:opacity-40'

  return (
    <div className={`relative flex flex-col gap-3 rounded-2xl p-5 transition-colors duration-200
      ${isOn ? 'bg-indigo-500/20 border border-indigo-500/40' : 'bg-slate-800 border border-slate-700'}`}>

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">TV</p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
          <p className={`text-xs font-medium mt-0.5 ${isOn ? 'text-indigo-400' : 'text-slate-500'}`}>
            {isOn ? '켜짐' : '꺼짐'}
          </p>
        </div>
        <StatusRing status={status}>
          <button
            onClick={isOn ? turnOff : turnOn}
            disabled={status === 'loading'}
            className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center transition-all active:scale-95
              ${isOn ? 'bg-indigo-400 text-slate-900 shadow-lg shadow-indigo-500/30' : 'bg-slate-700 text-slate-400'}
              disabled:opacity-40`}
          >
            📺
          </button>
        </StatusRing>
      </div>

      {/* 주요 앱 */}
      <div className="flex gap-2">
        <button onClick={() => openApp('Netflix')} disabled={status === 'loading'}
          className={`${btnBase} bg-red-500/20 text-red-300 hover:bg-red-500/30`}>
          N 넷플릭스
        </button>
        <button onClick={() => openApp('Disney+')} disabled={status === 'loading'}
          className={`${btnBase} bg-blue-500/20 text-blue-300 hover:bg-blue-500/30`}>
          ✦ 디즈니+
        </button>
        <button onClick={() => openApp('YouTube')} disabled={status === 'loading'}
          className={`${btnBase} bg-rose-500/20 text-rose-300 hover:bg-rose-500/30`}>
          ▶ 유튜브
        </button>
      </div>

      {/* 재생/일시정지 */}
      <button onClick={() => call(() => tvPlayPause(eid))} disabled={status === 'loading'}
        className="w-full py-2.5 rounded-xl text-sm font-medium bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-all active:scale-95 disabled:opacity-40">
        ⏯ 재생 / 일시정지
      </button>

      {/* 볼륨 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 w-12">볼륨</span>
        <button onClick={() => call(() => tvMute(eid))} disabled={status === 'loading'}
          className={`${btnSec} max-w-[44px]`}>
          🔇
        </button>
        <button onClick={() => call(() => tvVolumeDown(eid))} disabled={status === 'loading'}
          className={btnSec}>
          ▼
        </button>
        <button onClick={() => call(() => tvVolumeUp(eid))} disabled={status === 'loading'}
          className={btnSec}>
          ▲
        </button>
      </div>

      {/* 채널 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 w-12">채널</span>
        <button onClick={() => call(() => tvChannelDown(eid))} disabled={status === 'loading'}
          className={btnSec}>
          ◀ 이전
        </button>
        <button onClick={() => call(() => tvChannelUp(eid))} disabled={status === 'loading'}
          className={btnSec}>
          다음 ▶
        </button>
      </div>

      {/* 더보기 토글 */}
      <button onClick={() => setExpanded(!expanded)}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors text-center py-1">
        {expanded ? '▲ 접기' : '▼ 더보기'}
      </button>

      {/* 확장 영역 */}
      {expanded && (
        <div className="flex flex-col gap-2 border-t border-slate-700 pt-3">
          <div className="flex gap-2">
            <button onClick={() => openApp('Live TV')} disabled={status === 'loading'}
              className={btnSec}>
              📡 Live TV
            </button>
            <button onClick={() => openApp('wavve')} disabled={status === 'loading'}
              className={btnSec}>
              웨이브
            </button>
            <button onClick={() => openApp('TVING')} disabled={status === 'loading'}
              className={btnSec}>
              티빙
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openApp('Coupang Play')} disabled={status === 'loading'}
              className={btnSec}>
              쿠팡플레이
            </button>
            <button onClick={() => openApp('Prime Video')} disabled={status === 'loading'}
              className={btnSec}>
              프라임
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
