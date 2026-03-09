import { useState } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { tvTurnOn, tvTurnOff, tvSetVolume } from '../api/homeassistant'
import type { Device } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

export function TVControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [isOn, setIsOn] = useState(device.isOn ?? false)
  const [volume, setVolume] = useState(device.volume ?? 20)
  const eid = device.entity_id

  const toggle = async () => {
    if (!eid) return
    const next = !isOn
    setIsOn(next)
    await call(() => next ? tvTurnOn(eid) : tvTurnOff(eid))
  }

  const adjustVolume = async (delta: number) => {
    if (!eid) return
    const next = Math.min(100, Math.max(0, volume + delta))
    setVolume(next)
    await call(() => tvSetVolume(eid, next))
  }

  return (
    <div className={`relative flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
      ${isOn ? 'bg-indigo-500/20 border border-indigo-500/40' : 'bg-slate-800 border border-slate-700'}`}>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">TV</p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
        </div>
        <StatusRing status={status}>
          <button
            onClick={toggle}
            disabled={!eid || status === 'loading'}
            className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center transition-all active:scale-95
              ${isOn
                ? 'bg-indigo-400 text-slate-900 shadow-lg shadow-indigo-500/30'
                : 'bg-slate-700 text-slate-400'}
              disabled:opacity-40`}
          >
            📺
          </button>
        </StatusRing>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => adjustVolume(-5)}
          disabled={!eid || !isOn || status === 'loading' || volume <= 0}
          className="flex-1 py-3 rounded-xl bg-slate-700 text-white text-xl font-bold
            disabled:opacity-30 active:scale-95 transition-all"
        >
          −
        </button>
        <div className="text-center min-w-[64px]">
          <span className={`text-2xl font-bold ${isOn ? 'text-indigo-300' : 'text-slate-500'}`}>
            {volume}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">볼륨</p>
        </div>
        <button
          onClick={() => adjustVolume(+5)}
          disabled={!eid || !isOn || status === 'loading' || volume >= 100}
          className="flex-1 py-3 rounded-xl bg-slate-700 text-white text-xl font-bold
            disabled:opacity-30 active:scale-95 transition-all"
        >
          +
        </button>
      </div>

      <p className={`text-xs text-center font-medium ${isOn ? 'text-indigo-400' : 'text-slate-500'}`}>
        {!eid ? '미설정' : isOn ? `켜짐 · 볼륨 ${volume}` : '꺼짐'}
      </p>
    </div>
  )
}
