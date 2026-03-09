import { useState } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { switchOn, switchOff } from '../api/homeassistant'
import type { Device } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

export function SwitchControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [isOn, setIsOn] = useState(device.isOn ?? false)
  const eid = device.entity_id

  const toggle = async () => {
    if (!eid) return
    const next = !isOn
    setIsOn(next)
    await call(() => next ? switchOn(eid) : switchOff(eid))
  }

  return (
    <div className={`relative flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
      ${isOn ? 'bg-violet-500/20 border border-violet-500/40' : 'bg-slate-800 border border-slate-700'}`}>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">스위치</p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
        </div>
        <StatusRing status={status}>
          <button
            onClick={toggle}
            disabled={!eid || status === 'loading'}
            className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center transition-all active:scale-95
              ${isOn
                ? 'bg-violet-400 text-slate-900 shadow-lg shadow-violet-500/30'
                : 'bg-slate-700 text-slate-400'}
              disabled:opacity-40`}
          >
            🔌
          </button>
        </StatusRing>
      </div>

      <p className={`text-xs text-center font-medium ${isOn ? 'text-violet-400' : 'text-slate-500'}`}>
        {!eid ? '미설정' : isOn ? '켜짐' : '꺼짐'}
      </p>
    </div>
  )
}
