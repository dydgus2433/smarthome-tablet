import { useState } from 'react'
import { useDirectControl } from '../hooks/useDirectControl'
import { scriptRun, tvSelectSource } from '../api/homeassistant'

interface Props {
  onSceneDone?: () => void
}

type MovieApp = 'disney' | 'netflix'

const MOVIE_APP_KEY = 'smarthome_movie_app'

const btnClass = (status: string) =>
  `flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium
   transition-all active:scale-95 disabled:opacity-50
   ${status === 'success'
     ? 'bg-green-500/20 border border-green-500/40 text-green-300'
     : status === 'error'
       ? 'bg-red-500/20 border border-red-500/40 text-red-300'
       : status === 'loading'
         ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300'
         : 'bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600'
   }`

function SceneButton({
  icon, label, scriptId, onDone,
}: {
  icon: string
  label: string
  scriptId: string
  onDone?: () => void
}) {
  const { status, call } = useDirectControl()
  const run = async () => {
    await call(() => scriptRun(scriptId))
    onDone?.()
  }
  return (
    <button onClick={run} disabled={status === 'loading'} className={btnClass(status)}>
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function MovieModeButton({ onDone }: { onDone?: () => void }) {
  const { status, call } = useDirectControl()
  const [app, setApp] = useState<MovieApp>(
    () => (localStorage.getItem(MOVIE_APP_KEY) as MovieApp) ?? 'disney'
  )
  const [showPicker, setShowPicker] = useState(false)

  const TV_EID = 'media_player.lg_webos_tv_oled65a1sna'

  const run = async () => {
    await call(async () => {
      await scriptRun('movie_mode')
      await new Promise(r => setTimeout(r, 11000))
      await tvSelectSource(TV_EID, app === 'netflix' ? 'Netflix' : 'Disney+')
    })
    onDone?.()
  }

  const selectApp = (selected: MovieApp) => {
    setApp(selected)
    localStorage.setItem(MOVIE_APP_KEY, selected)
    setShowPicker(false)
  }

  return (
    <div className="relative flex flex-col items-center gap-1">
      <button onClick={run} disabled={status === 'loading'} className={btnClass(status)}>
        <span className="text-xl">🎬</span>
        <span>영화 모드</span>
      </button>
      {/* 앱 선택 토글 */}
      <button
        onClick={() => setShowPicker(p => !p)}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        {app === 'disney' ? '✦ 디즈니+' : 'N 넷플릭스'} ▾
      </button>
      {showPicker && (
        <div className="absolute bottom-full mb-1 left-0 bg-slate-800 border border-slate-600 rounded-xl overflow-hidden shadow-xl z-10 min-w-[120px]">
          <button
            onClick={() => selectApp('disney')}
            className={`w-full px-4 py-2.5 text-sm text-left transition-colors
              ${app === 'disney' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            ✦ 디즈니+
          </button>
          <button
            onClick={() => selectApp('netflix')}
            className={`w-full px-4 py-2.5 text-sm text-left transition-colors
              ${app === 'netflix' ? 'bg-red-500/20 text-red-300' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            N 넷플릭스
          </button>
        </div>
      )}
    </div>
  )
}

function ToggleLightsButton({ onDone }: { onDone?: () => void }) {
  const { status, call } = useDirectControl()
  const [allOn, setAllOn] = useState(false)

  const run = async () => {
    const script = allOn ? 'all_lights_off' : 'all_lights_on'
    await call(() => scriptRun(script))
    setAllOn(prev => !prev)
    onDone?.()
  }

  return (
    <button onClick={run} disabled={status === 'loading'} className={btnClass(status)}>
      <span className="text-xl">{allOn ? '🌑' : '☀️'}</span>
      <span>{allOn ? '전체 끄기' : '전체 켜기'}</span>
    </button>
  )
}

export function SceneControl({ onSceneDone }: Props) {
  return (
    <div className="border-t border-slate-800 px-6 py-4 bg-slate-900">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">씬</p>
      <div className="flex gap-3 overflow-x-auto pb-1 items-start">
        <SceneButton icon="🏠" label="귀가" scriptId="welcome_home" onDone={onSceneDone} />
        <SceneButton icon="🌙" label="잘 자" scriptId="good_night_mode" onDone={onSceneDone} />
        <SceneButton icon="🚪" label="외출 모드" scriptId="away_mode" onDone={onSceneDone} />
        <MovieModeButton onDone={onSceneDone} />
        <ToggleLightsButton onDone={onSceneDone} />
      </div>
    </div>
  )
}
