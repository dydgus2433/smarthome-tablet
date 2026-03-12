import type { Device } from '../types'
import { LightControl } from './LightControl'
import { ClimateControl } from './ClimateControl'
import { CurtainControl } from './CurtainControl'
import { SwitchControl } from './SwitchControl'
import { VacuumControl } from './VacuumControl'
import { TVControl } from './TVControl'
import { AirconditionerIRControl } from './AirconditionerIRControl'
import { TVIRControl } from './TVIRControl'

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
  if (device.type === 'ac_ir') return <AirconditionerIRControl device={device} />
  if (device.type === 'tv_ir') return <TVIRControl device={device} />
  return null
}
