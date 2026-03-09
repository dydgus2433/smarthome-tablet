import { useState, useCallback } from 'react'
import type { CommandStatus } from '../types'

interface UseDirectControlReturn {
  status: CommandStatus
  call: (fn: () => Promise<void>) => Promise<void>
}

export function useDirectControl(): UseDirectControlReturn {
  const [status, setStatus] = useState<CommandStatus>('idle')

  const call = useCallback(async (fn: () => Promise<void>) => {
    setStatus('loading')
    try {
      await fn()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [])

  return { status, call }
}
