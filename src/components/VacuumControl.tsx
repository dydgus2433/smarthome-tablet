import { useState, useEffect } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { vacuumStart, vacuumReturnToBase } from '../api/homeassistant'
import type { Device, VacuumState } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

const STATE_LABEL: Record<VacuumState, string> = {
  cleaning: '청소 중',
  returning: '귀환 중',
  docked: '충전 중',
  paused: '일시정지',
  idle: '대기',
  error: '오류',
}

const STATE_COLOR: Record<VacuumState, string> = {
  cleaning: 'text-teal-400',
  returning: 'text-amber-400',
  docked: 'text-green-400',
  paused: 'text-yellow-400',
  idle: 'text-slate-400',
  error: 'text-red-400',
}

export function VacuumControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [vacuumState, setVacuumState] = useState<VacuumState>(device.vacuumState ?? 'docked')
  const eid = device.entity_id

  useEffect(() => { if (device.vacuumState) setVacuumState(device.vacuumState) }, [device.vacuumState])

  const start = async () => {
    if (!eid) return
    setVacuumState('cleaning')
    await call(() => vacuumStart(eid))
  }

  const returnToBase = async () => {
    if (!eid) return
    setVacuumState('returning')
    await call(() => vacuumReturnToBase(eid))
  }

  const isCleaning = vacuumState === 'cleaning'
  const isDocked = vacuumState === 'docked'

  return (
    <div className={`relative flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
      ${isCleaning ? 'bg-teal-500/20 border border-teal-500/40' : 'bg-slate-800 border border-slate-700'}`}>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">로봇 청소기</p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
        </div>
        <StatusRing status={status}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl
            ${isCleaning ? 'bg-teal-500/30 animate-spin-slow' : 'bg-slate-700'}`}>
            🤖
          </div>
        </StatusRing>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={start}
          disabled={!eid || isCleaning || status === 'loading'}
          className="py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm
            disabled:opacity-30 active:scale-95 transition-all"
        >
          청소 시작
        </button>
        <button
          onClick={returnToBase}
          disabled={!eid || isDocked || status === 'loading'}
          className="py-3 rounded-xl bg-slate-600 text-white font-semibold text-sm
            disabled:opacity-30 active:scale-95 transition-all"
        >
          귀환
        </button>
      </div>

      <p className={`text-xs text-center font-medium ${STATE_COLOR[vacuumState]}`}>
        {!eid ? '미설정' : STATE_LABEL[vacuumState]}
      </p>
    </div>
  )
}
