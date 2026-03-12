import { useState, useEffect } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { lightOn, lightOff, lightSetColorTemp, switchOn, switchOff } from '../api/homeassistant'
import type { Device } from '../types'
import { StatusRing } from './StatusRing'

interface Props {
  device: Device
}

export function LightControl({ device }: Props) {
  const { status, call } = useDirectControl()
  const [isOn, setIsOn] = useState(device.isOn ?? false)
  const [brightness, setBrightness] = useState(device.brightness ?? 80)
  const [colorTemp, setColorTemp] = useState(device.colorTemp ?? 300)

  useEffect(() => { setIsOn(device.isOn ?? false) }, [device.isOn])
  useEffect(() => { if (device.brightness !== undefined) setBrightness(device.brightness) }, [device.brightness])
  useEffect(() => { if (device.colorTemp !== undefined) setColorTemp(device.colorTemp) }, [device.colorTemp])
  const eid = device.entity_id

  const isSwitch = eid?.startsWith('switch.')

  const toggle = async () => {
    if (!eid) return
    const next = !isOn
    setIsOn(next)
    if (isSwitch) {
      await call(() => next ? switchOn(eid) : switchOff(eid))
    } else {
      await call(() => next ? lightOn(eid, device.supportsBrightness ? brightness : undefined) : lightOff(eid))
    }
  }

  const changeBrightness = async (val: number) => {
    if (!eid) return
    setBrightness(val)
    await call(() => lightOn(eid, val))
  }

  const changeColorTemp = async (val: number) => {
    if (!eid) return
    setColorTemp(val)
    await call(() => lightSetColorTemp(eid, val))
  }

  const isSmartBulb = device.supportsBrightness || device.supportsColor

  return (
    <div className={`relative flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
      ${isOn ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-slate-800 border border-slate-700'}`}>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            {isSmartBulb ? '스마트 조명' : '조명'}
          </p>
          <p className="text-lg font-semibold text-white mt-0.5">{device.name}</p>
        </div>
        <StatusRing status={status}>
          <button
            onClick={toggle}
            disabled={!eid || status === 'loading'}
            className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center transition-all active:scale-95
              ${isOn
                ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/30'
                : 'bg-slate-700 text-slate-400'}
              disabled:opacity-40`}
          >
            💡
          </button>
        </StatusRing>
      </div>

      {isOn && device.supportsBrightness && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>밝기</span>
            <span className="text-amber-400 font-medium">{brightness}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={brightness}
            onChange={e => changeBrightness(Number(e.target.value))}
            disabled={!eid || status === 'loading'}
            className="w-full accent-amber-400 cursor-pointer disabled:opacity-40"
          />
        </div>
      )}

      {isOn && device.supportsColor && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>색온도</span>
            <span className="font-medium" style={{ color: colorTempToHex(colorTemp) }}>
              {miredsToKelvin(colorTemp)}K
            </span>
          </div>
          <div
            className="relative h-3 rounded-full"
            style={{ background: 'linear-gradient(to right, #ffd27f, #fff4e0, #e8f4ff)' }}
          >
            <input
              type="range"
              min={153}
              max={500}
              step={10}
              value={colorTemp}
              onChange={e => changeColorTemp(Number(e.target.value))}
              disabled={!eid || status === 'loading'}
              className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed h-3"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>차가운</span>
            <span>따뜻한</span>
          </div>
        </div>
      )}

      <p className={`text-xs text-center font-medium ${isOn ? 'text-amber-400' : 'text-slate-500'}`}>
        {!eid ? '미설정' : isOn ? '켜짐' : '꺼짐'}
      </p>
    </div>
  )
}

function miredsToKelvin(mireds: number): number {
  return Math.round(1_000_000 / mireds / 100) * 100
}

function colorTempToHex(mireds: number): string {
  // 153(차가운 6500K) → #e8f4ff, 500(따뜻한 2000K) → #ffd27f
  const t = (mireds - 153) / (500 - 153)
  const r = Math.round(232 + (255 - 232) * t)
  const g = Math.round(244 + (210 - 244) * t)
  const b = Math.round(255 + (127 - 255) * t)
  return `rgb(${r},${g},${b})`
}
