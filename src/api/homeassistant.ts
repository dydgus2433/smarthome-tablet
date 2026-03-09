// HA 직접 호출 대신 gateway 프록시를 통해 CORS 우회
const HA_URL = `${import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:3000'}/ha-proxy`
const HA_TOKEN = ''  // gateway가 토큰 처리

export interface HAState {
  entity_id: string
  state: string
  attributes: Record<string, unknown>
}

export async function getState(entity_id: string): Promise<HAState> {
  const res = await fetch(`${HA_URL}/api/states/${entity_id}`, {
    headers: { Authorization: `Bearer ${HA_TOKEN}` },
  })
  if (!res.ok) throw new Error(`HA 상태 조회 오류: ${res.status}`)
  return res.json()
}

export async function checkConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${HA_URL}/api/`, {
      headers: { Authorization: `Bearer ${HA_TOKEN}` },
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

async function callService(
  domain: string,
  service: string,
  data: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`${HA_URL}/api/services/${domain}/${service}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HA_TOKEN}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`HA 오류: ${res.status} ${res.statusText}`)
  }
}

// 조명
export function lightOn(entity_id: string, brightness_pct?: number): Promise<void> {
  const data: Record<string, unknown> = { entity_id }
  if (brightness_pct !== undefined) data.brightness_pct = brightness_pct
  return callService('light', 'turn_on', data)
}

export function lightSetColorTemp(entity_id: string, color_temp: number): Promise<void> {
  return callService('light', 'turn_on', { entity_id, color_temp })
}

export function lightOff(entity_id: string): Promise<void> {
  return callService('light', 'turn_off', { entity_id })
}

// 에어컨/난방
export function climateSetTemp(entity_id: string, temperature: number): Promise<void> {
  return callService('climate', 'set_temperature', { entity_id, temperature })
}

export function climateTurnOn(entity_id: string): Promise<void> {
  return callService('climate', 'turn_on', { entity_id })
}

export function climateTurnOff(entity_id: string): Promise<void> {
  return callService('climate', 'turn_off', { entity_id })
}

// 커튼/블라인드
export function coverOpen(entity_id: string): Promise<void> {
  return callService('cover', 'open_cover', { entity_id })
}

export function coverClose(entity_id: string): Promise<void> {
  return callService('cover', 'close_cover', { entity_id })
}

// 스위치/스마트 플러그
export function switchOn(entity_id: string): Promise<void> {
  return callService('switch', 'turn_on', { entity_id })
}

export function switchOff(entity_id: string): Promise<void> {
  return callService('switch', 'turn_off', { entity_id })
}

// 로봇 청소기
export function vacuumStart(entity_id: string): Promise<void> {
  return callService('vacuum', 'start', { entity_id })
}

export function vacuumPause(entity_id: string): Promise<void> {
  return callService('vacuum', 'pause', { entity_id })
}

export function vacuumReturnToBase(entity_id: string): Promise<void> {
  return callService('vacuum', 'return_to_base', { entity_id })
}

// TV (media_player)
export function tvTurnOn(entity_id: string): Promise<void> {
  return callService('media_player', 'turn_on', { entity_id })
}

export function tvTurnOff(entity_id: string): Promise<void> {
  return callService('media_player', 'turn_off', { entity_id })
}

export function tvSetVolume(entity_id: string, volume: number): Promise<void> {
  return callService('media_player', 'volume_set', { entity_id, volume_level: volume / 100 })
}
