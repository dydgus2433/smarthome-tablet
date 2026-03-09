import type { ReactNode } from 'react'
import type { CommandStatus } from '../types'

interface Props {
  status: CommandStatus
  children: ReactNode
}

const ringColor: Record<CommandStatus, string> = {
  idle: 'ring-transparent',
  loading: 'ring-yellow-400 animate-pulse',
  success: 'ring-green-400',
  error: 'ring-red-400',
}

export function StatusRing({ status, children }: Props) {
  return (
    <div className={`rounded-full ring-2 transition-all duration-300 ${ringColor[status]}`}>
      {children}
    </div>
  )
}
