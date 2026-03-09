export type DeviceType = 'light' | 'climate' | 'curtain' | 'switch' | 'vacuum' | 'tv'

export type VacuumState = 'cleaning' | 'docked' | 'idle' | 'paused' | 'returning' | 'error'

export type CommandStatus = 'idle' | 'loading' | 'success' | 'error'

export interface Room {
  id: string
  name: string
  devices: Device[]
}

export interface Device {
  id: string
  name: string
  type: DeviceType
  /** HA 엔티티 ID (예: light.living_room_main). 없으면 직접 제어 비활성화 */
  entity_id?: string
  /** 조명: 켜짐 여부 */
  isOn?: boolean
  /** 조명: 밝기 0~100 (스마트전구만) */
  brightness?: number
  /** 조명: 색온도 mireds 153(차가운)~500(따뜻한) (스마트전구만) */
  colorTemp?: number
  /** 조명: 밝기 조절 지원 여부 */
  supportsBrightness?: boolean
  /** 조명: 색온도 조절 지원 여부 */
  supportsColor?: boolean
  /** 에어컨/난방: 현재 온도 */
  temperature?: number
  /** 에어컨/난방: 설정 온도 */
  targetTemperature?: number
  /** 커튼: 열림 여부 */
  isOpen?: boolean
  /** TV: 볼륨 0~100 */
  volume?: number
  /** 청소기: 현재 상태 */
  vacuumState?: VacuumState
}

export interface GatewayRequest {
  message: string
  session_id: string
}

export interface GatewayResponse {
  reply: string
  action_taken?: {
    domain: string
    service: string
    entity_id: string
  }
  model_used?: string
  latency_ms?: number
  request_type?: string
}

export interface DeviceCommand {
  deviceId: string
  action: string
  value?: number | boolean
}
