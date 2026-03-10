import { useState, useRef } from 'react'

const STATIONS = [
  {
    id: 'kbs1',
    name: 'KBS 1라디오',
    desc: '조정식입니다',
    url: 'http://ais-streaming.kbs.co.kr/radio/kbs1radio/kbs1radio.stream/playlist.m3u8',
  },
  {
    id: 'kbs2fm',
    name: 'KBS 2FM',
    desc: '효정의 볼륨을 높여요',
    url: 'http://ais-streaming.kbs.co.kr/radio/kbs2fm/kbs2fm.stream/playlist.m3u8',
  },
]

export function RadioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  function play(station: typeof STATIONS[0]) {
    if (activeId === station.id && playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }
    if (audioRef.current) {
      audioRef.current.src = station.url
      audioRef.current.play()
      setActiveId(station.id)
      setPlaying(true)
    }
  }

  function stop() {
    audioRef.current?.pause()
    setPlaying(false)
    setActiveId(null)
  }

  return (
    <div className="border-t border-slate-800 px-6 py-4 bg-slate-900">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider">라디오</p>
        {playing && (
          <button onClick={stop} className="text-xs text-slate-400 hover:text-white">
            정지
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {STATIONS.map(station => {
          const isActive = activeId === station.id && playing
          return (
            <button
              key={station.id}
              onClick={() => play(station)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-sm font-medium shrink-0
                transition-all active:scale-95
                ${isActive
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600'
                }`}
            >
              <span className="text-xl">{isActive ? '🔊' : '📻'}</span>
              <span>{station.name}</span>
              <span className="text-xs text-slate-400">{station.desc}</span>
            </button>
          )
        })}
      </div>
      <audio ref={audioRef} />
    </div>
  )
}
