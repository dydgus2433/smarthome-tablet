import { useState, useEffect } from 'react'
import { checkConnection } from '../api/homeassistant'

const INTERVAL_MS = 30_000

export function useHAConnection(): boolean {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    async function check() {
      const ok = await checkConnection()
      setConnected(ok)
      timer = setTimeout(check, INTERVAL_MS)
    }

    check()
    return () => clearTimeout(timer)
  }, [])

  return connected
}
