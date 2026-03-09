import { useState, useEffect } from 'react'
import { getState } from '../api/homeassistant'
import type { Room, Device } from '../types'

function applyHAState(device: Device, state: string, attributes: Record<string, unknown>): Device {
  if (device.type === 'light') {
    const isOn = state === 'on'
    const raw = attributes.brightness as number | undefined
    const brightness = raw !== undefined ? Math.round(raw / 2.55) : device.brightness
    const colorTemp = (attributes.color_temp as number | undefined) ?? device.colorTemp
    return { ...device, isOn, brightness, colorTemp }
  }
  if (device.type === 'climate') {
    const isOn = state !== 'off'
    const targetTemperature = (attributes.temperature as number | undefined) ?? device.targetTemperature
    const temperature = (attributes.current_temperature as number | undefined) ?? device.temperature
    return { ...device, isOn, targetTemperature, temperature }
  }
  if (device.type === 'curtain') {
    const isOpen = state === 'open'
    return { ...device, isOpen }
  }
  if (device.type === 'switch') {
    return { ...device, isOn: state === 'on' }
  }
  if (device.type === 'vacuum') {
    return { ...device, vacuumState: state as import('../types').VacuumState }
  }
  if (device.type === 'tv') {
    const isOn = state !== 'off' && state !== 'unavailable'
    const rawVolume = attributes.volume_level as number | undefined
    const volume = rawVolume !== undefined ? Math.round(rawVolume * 100) : device.volume
    return { ...device, isOn, volume }
  }
  return device
}

export function useHAStates(initialRooms: Room[]): { rooms: Room[]; loading: boolean } {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      const updated = await Promise.all(
        initialRooms.map(async (room) => {
          const devices = await Promise.all(
            room.devices.map(async (device) => {
              if (!device.entity_id) return device
              try {
                const ha = await getState(device.entity_id)
                return applyHAState(device, ha.state, ha.attributes)
              } catch {
                return device
              }
            }),
          )
          return { ...room, devices }
        }),
      )
      if (!cancelled) {
        setRooms(updated)
        setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { rooms, loading }
}
