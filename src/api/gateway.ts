import type { GatewayRequest, GatewayResponse } from '../types'

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:3000'

export async function sendCommand(message: string): Promise<GatewayResponse> {
  const body: GatewayRequest = {
    message,
    session_id: 'tablet_ui',
  }

  const res = await fetch(`${GATEWAY_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Gateway 오류: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<GatewayResponse>
}
