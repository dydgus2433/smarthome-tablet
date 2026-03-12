import { useState, useEffect } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { coverOpen, coverClose } from '../api/homeassistant'
import type { Device } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

export function CurtainControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [isOpen, setIsOpen] = useState(device.isOpen ?? false)
  const eid = device.entity_id

  useEffect(() => { setIsOpen(device.isOpen ?? false) }, [device.isOpen])

  const control = async (open: boolean) => {
    if (!eid) return
    setIsOpen(open)
    await call(() => open ? coverOpen(eid) : coverClose(eid))
  }

  return (
    <div className={`relative flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
      ${isOpen ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-800 border border-slate-700'}`}>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">커튼 / 블라인드</p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
        </div>
        <StatusRing status={status}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl
            ${isOpen ? 'bg-emerald-500/30' : 'bg-slate-700'}`}>
            🪟
          </div>
        </StatusRing>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => control(true)}
          disabled={!eid || isOpen || status === 'loading'}
          className="py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm
            disabled:opacity-30 active:scale-95 transition-all"
        >
          열기
        </button>
        <button
          onClick={() => control(false)}
          disabled={!eid || !isOpen || status === 'loading'}
          className="py-3 rounded-xl bg-slate-600 text-white font-semibold text-sm
            disabled:opacity-30 active:scale-95 transition-all"
        >
          닫기
        </button>
      </div>

      <p className={`text-xs text-center font-medium ${isOpen ? 'text-emerald-400' : 'text-slate-500'}`}>
        {!eid ? '미설정' : isOpen ? '열림' : '닫힘'}
      </p>
    </div>
  )
}
