import type { Device } from '../types'
import { LightControl } from './LightControl'
import { ClimateControl } from './ClimateControl'
import { CurtainControl } from './CurtainControl'
import { SwitchControl } from './SwitchControl'
import { VacuumControl } from './VacuumControl'
import { TVControl } from './TVControl'

interface Props {
  device: Device
}

export function DeviceCard({ device }: Props) {
  if (device.type === 'light') return <LightControl device={device} />
  if (device.type === 'climate') return <ClimateControl device={device} />
  if (device.type === 'curtain') return <CurtainControl device={device} />
  if (device.type === 'switch') return <SwitchControl device={device} />
  if (device.type === 'vacuum') return <VacuumControl device={device} />
  if (device.type === 'tv') return <TVControl device={device} />
  return null
}
