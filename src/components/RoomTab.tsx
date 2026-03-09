import type { Room } from '../types'
import { DeviceCard } from './DeviceCard'

interface Props {
  rooms: Room[]
  activeRoom: string
  onRoomChange: (id: string) => void
}

export function RoomTab({ rooms, activeRoom, onRoomChange }: Props) {
  const current = rooms.find(r => r.id === activeRoom) ?? rooms[0]

  return (
    <div className="flex flex-col h-full gap-4">
      {/* 탭 헤더 */}
      <div className="flex gap-2 bg-slate-900/60 p-1.5 rounded-2xl">
        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => onRoomChange(room.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200
              ${room.id === activeRoom
                ? 'bg-slate-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'}`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* 기기 그리드 */}
      <div className="grid grid-cols-device gap-4 overflow-y-auto flex-1 pb-2 pr-1">
        {current.devices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  )
}
