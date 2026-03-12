import { useState } from 'react'

const BUTTONS = [
  {
    label: '버튼 1',
    color: 'text-blue-400',
    actions: [
      { type: '단클릭', desc: '❄️ 에어컨 토글' },
      { type: '더블클릭', desc: '🍽 식사 모드' },
      { type: '롱프레스', desc: '🌅 기상 모드' },
    ],
  },
  {
    label: '버튼 2',
    color: 'text-emerald-400',
    actions: [
      { type: '단클릭', desc: '🛏 안방커튼 토글' },
      { type: '더블클릭', desc: '🪟 거실커튼 토글' },
      { type: '롱프레스', desc: '🌙 잘자 모드' },
    ],
  },
  {
    label: '버튼 3',
    color: 'text-amber-400',
    actions: [
      { type: '단클릭', desc: '💡 전체 조명 토글' },
      { type: '더블클릭', desc: '🚪 외출 모드' },
      { type: '롱프레스', desc: '🎬 영화 모드' },
    ],
  },
]

export function ButtonGuide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white text-sm font-bold transition-colors"
      >
        ?
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-slate-700 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">리모컨 버튼 가이드</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {BUTTONS.map(btn => (
                <div key={btn.label} className="bg-slate-700/50 rounded-xl p-4">
                  <p className={`text-sm font-semibold mb-3 ${btn.color}`}>{btn.label}</p>
                  <div className="flex flex-col gap-2">
                    {btn.actions.map(a => (
                      <div key={a.type} className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 w-20">{a.type}</span>
                        <span className="text-sm text-slate-200">{a.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
