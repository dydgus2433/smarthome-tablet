import { useState, useCallback } from 'react'
import { sendCommand } from '../api/gateway'
import type { CommandStatus } from '../types'

interface UseDeviceControlReturn {
  status: CommandStatus
  reply: string
  run: (message: string) => Promise<void>
}

export function useDeviceControl(): UseDeviceControlReturn {
  const [status, setStatus] = useState<CommandStatus>('idle')
  const [reply, setReply] = useState('')

  const run = useCallback(async (message: string) => {
    setStatus('loading')
    setReply('')
    try {
      const res = await sendCommand(message)
      setReply(res.reply)
      setStatus('success')
    } catch (err) {
      setReply(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setStatus('error')
    } finally {
      // 2초 후 idle 복귀
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [])

  return { status, reply, run }
}
