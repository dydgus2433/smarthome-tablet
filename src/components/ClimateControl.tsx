import { useState } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { climateTurnOn, climateTurnOff, climateSetTemp } from '../api/homeassistant'
import type { Device } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

export function ClimateControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [isOn, setIsOn] = useState(device.isOn ?? false)
  const [temp, setTemp] = useState(device.targetTemperature ?? 24)
  const eid = device.entity_id

  const toggle = async () => {
    if (!eid) return
    const next = !isOn
    setIsOn(next)
    await call(() => next ? climateTurnOn(eid) : climateTurnOff(eid))
  }

  const adjust = async (delta: number) => {
    if (!eid) return
    const next = Math.min(30, Math.max(16, temp + delta))
    setTemp(next)
    await call(() => climateSetTemp(eid, next))
  }

  return (
    <div className={`relative flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
      ${isOn ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-slate-800 border border-slate-700'}`}>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">에어컨/난방</p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
        </div>
        <StatusRing status={status}>
          <button
            onClick={toggle}
            disabled={!eid || status === 'loading'}
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

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => adjust(-1)}
          disabled={!eid || !isOn || status === 'loading' || temp <= 16}
          className="flex-1 py-3 rounded-xl bg-slate-700 text-white text-2xl font-bold
            disabled:opacity-30 active:scale-95 transition-all"
        >
          −
        </button>
        <div className="text-center min-w-[64px]">
          <span className={`text-3xl font-bold ${isOn ? 'text-blue-300' : 'text-slate-500'}`}>
            {temp}°
          </span>
        </div>
        <button
          onClick={() => adjust(+1)}
          disabled={!eid || !isOn || status === 'loading' || temp >= 30}
          className="flex-1 py-3 rounded-xl bg-slate-700 text-white text-2xl font-bold
            disabled:opacity-30 active:scale-95 transition-all"
        >
          +
        </button>
      </div>

      <p className={`text-xs text-center font-medium ${isOn ? 'text-blue-400' : 'text-slate-500'}`}>
        {!eid ? '미설정' : isOn ? `켜짐 · 설정 ${temp}°C` : '꺼짐'}
      </p>
    </div>
  )
}
