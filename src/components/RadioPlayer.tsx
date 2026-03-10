import { useState, useRef, useEffect } from 'react'

const STATIONS = [
  { id: 'kbs1radio', name: 'KBS 1라디오', desc: '조정식입니다', channelCode: 21 },
  { id: 'kbs2fm', name: 'KBS 2FM', desc: '효정의 볼륨을 높여요', channelCode: 25 },
]

async function fetchStreamUrl(channelCode: number): Promise<string> {
  const res = await fetch(
    `https://cfpwwwapi.kbs.co.kr/api/v1/landing/live/channel_code/${channelCode}`
  )
  const data = await res.json()
  const item = data.channel_item?.find((i: { bitrate: string }) => i.bitrate === '128Kbps')
    ?? data.channel_item?.[0]
  return item?.service_url ?? ''
}

export function RadioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleEnded = () => setPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  async function play(station: typeof STATIONS[0]) {
    if (activeId === station.id && playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }
    setLoading(true)
    try {
      const url = await fetchStreamUrl(station.channelCode)
      if (audioRef.current && url) {
        audioRef.current.src = url
        await audioRef.current.play()
        setActiveId(station.id)
        setPlaying(true)
      }
    } finally {
      setLoading(false)
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
              disabled={loading}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-sm font-medium shrink-0
                transition-all active:scale-95 disabled:opacity-50
                ${isActive
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600'
                }`}
            >
              <span className="text-xl">{loading && activeId !== station.id ? '⏳' : isActive ? '🔊' : '📻'}</span>
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
