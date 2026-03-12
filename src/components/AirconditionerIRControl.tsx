import { useState } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { scriptRun } from '../api/homeassistant'
import type { Device } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

export function AirconditionerIRControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [isOn, setIsOn] = useState(device.isOn ?? false)
  const [expanded, setExpanded] = useState(false)

  const run = async (script: string, onSuccess?: () => void) => {
    await call(() => scriptRun(script))
    onSuccess?.()
  }

  const btnBase =
    'py-2 px-3 rounded-xl text-xs font-medium transition-all active:scale-95 disabled:opacity-40'
  const btnPrimary = `${btnBase} bg-blue-500/20 text-blue-300 hover:bg-blue-500/30`
  const btnSecondary = `${btnBase} bg-slate-700 text-slate-300 hover:bg-slate-600`
  const btnActive = `${btnBase} bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30`

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-2xl p-5 transition-colors duration-200
        ${isOn ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-slate-800 border border-slate-700'}`}
    >
      {/* 헤더: 이름 + 전원 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">에어컨</p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
          <p className={`text-xs font-medium mt-0.5 ${isOn ? 'text-blue-400' : 'text-slate-500'}`}>
            {isOn ? '켜짐' : '꺼짐'}
          </p>
        </div>
        <StatusRing status={status}>
          <button
            onClick={() => run(isOn ? 'airconditioner_off' : 'airconditioner_on', () => setIsOn(!isOn))}
            disabled={status === 'loading'}
            className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center transition-all active:scale-95
              ${isOn
                ? 'bg-blue-400 text-slate-900 shadow-lg shadow-blue-500/30'
                : 'bg-slate-700 text-slate-400'}
              disabled:opacity-40`}
          >
            ❄️
          </button>
        </StatusRing>
      </div>

      {/* 온도 조절 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 w-12">온도</span>
        <button
          onClick={() => run('airconditioner_temp_down')}
          disabled={status === 'loading'}
          className={`${btnSecondary} flex-1`}
        >
          ▼ 내리기
        </button>
        <button
          onClick={() => run('airconditioner_temp_up')}
          disabled={status === 'loading'}
          className={`${btnPrimary} flex-1`}
        >
          ▲ 올리기
        </button>
      </div>

      {/* 주요 모드 */}
      <div className="flex gap-2">
        <button
          onClick={() => run('airconditioner_cool')}
          disabled={status === 'loading'}
          className={`${btnPrimary} flex-1`}
        >
          🌬 냉방
        </button>
        <button
          onClick={() => run('airconditioner_dry')}
          disabled={status === 'loading'}
          className={`${btnActive} flex-1`}
        >
          💧 제습
        </button>
        <button
          onClick={() => run('airconditioner_turbo')}
          disabled={status === 'loading'}
          className={`${btnSecondary} flex-1`}
        >
          ⚡ 터보
        </button>
      </div>

      {/* 더보기 토글 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors text-center py-1"
      >
        {expanded ? '▲ 접기' : '▼ 더보기'}
      </button>

      {/* 확장 영역 */}
      {expanded && (
        <div className="flex flex-col gap-2 border-t border-slate-700 pt-3">
          <div className="flex gap-2">
            <button
              onClick={() => run('airconditioner_fan')}
              disabled={status === 'loading'}
              className={`${btnSecondary} flex-1`}
            >
              🍃 송풍
            </button>
            <button
              onClick={() => run('airconditioner_fan_speed')}
              disabled={status === 'loading'}
              className={`${btnSecondary} flex-1`}
            >
              🌀 풍량
            </button>
            <button
              onClick={() => run('airconditioner_save')}
              disabled={status === 'loading'}
              className={`${btnSecondary} flex-1`}
            >
              🌿 절전
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => run('airconditioner_swing_vertical')}
              disabled={status === 'loading'}
              className={`${btnSecondary} flex-1`}
            >
              ↕ 상하바람
            </button>
            <button
              onClick={() => run('airconditioner_swing_horizontal')}
              disabled={status === 'loading'}
              className={`${btnSecondary} flex-1`}
            >
              ↔ 좌우바람
            </button>
          </div>
          <button
            onClick={() => run('airconditioner_timer')}
            disabled={status === 'loading'}
            className={`${btnSecondary} w-full`}
          >
            ⏱ 간편예약
          </button>
        </div>
      )}
    </div>
  )
}
