import { useDeviceControl } from '../hooks/useDeviceControl'

interface Scene {
  id: string
  label: string
  icon: string
  message: string
}

const SCENES: Scene[] = [
  {
    id: 'good-night',
    label: '잘 자',
    icon: '🌙',
    message: '전체 조명 끄고 커튼 닫고 난방 22도로 설정해줘',
  },
  {
    id: 'away',
    label: '외출 모드',
    icon: '🚪',
    message: '모든 조명 끄고 에어컨 끄고 커튼 닫아줘',
  },
  {
    id: 'movie',
    label: '영화 모드',
    icon: '🎬',
    message: '거실 조명 20%로 줄이고 무드등 켜줘',
  },
  {
    id: 'all-on',
    label: '전체 켜기',
    icon: '☀️',
    message: '모든 조명 켜줘',
  },
]

function SceneButton({ scene }: { scene: Scene }) {
  const { status, run } = useDeviceControl()

  return (
    <button
      onClick={() => run(scene.message)}
      disabled={status === 'loading'}
      className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium
        transition-all active:scale-95 disabled:opacity-50
        ${status === 'success'
          ? 'bg-green-500/20 border border-green-500/40 text-green-300'
          : status === 'error'
            ? 'bg-red-500/20 border border-red-500/40 text-red-300'
            : status === 'loading'
              ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300'
              : 'bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600'
        }`}
    >
      <span className="text-xl">{scene.icon}</span>
      <span>{scene.label}</span>
    </button>
  )
}

export function SceneControl() {
  return (
    <div className="border-t border-slate-800 px-6 py-4 bg-slate-900">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">씬</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {SCENES.map(scene => (
          <SceneButton key={scene.id} scene={scene} />
        ))}
      </div>
    </div>
  )
}
