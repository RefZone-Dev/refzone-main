'use client'

import { useState, useCallback } from 'react'
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react'

interface Scenario {
  question: string
  options: string[]
  correctIndex: number
  lawRef: string
  explanation: string
}

const scenarios: Scenario[] = [
  {
    question:
      'A defender deliberately handles the ball on the goal line to prevent a goal. What is the decision?',
    options: [
      'Penalty kick + yellow card',
      'Penalty kick + red card',
      'Direct free kick + red card',
      'Indirect free kick',
    ],
    correctIndex: 1,
    lawRef: 'Law 12',
    explanation:
      'Denying an obvious goal-scoring opportunity by deliberately handling the ball is sanctioned with a penalty kick (if inside the penalty area) and a red card for the offending player.',
  },
  {
    question:
      'During a corner kick, the ball hits the corner flag and rebounds into play. What is the decision?',
    options: ['Retake corner', 'Play continues', 'Goal kick', 'Drop ball'],
    correctIndex: 1,
    lawRef: 'Law 9',
    explanation:
      'The corner flag is part of the field of play. If the ball strikes it and remains within the field, play continues without interruption.',
  },
  {
    question:
      'A substitute enters the field without permission and touches the ball. What action should the referee take?',
    options: [
      'Drop ball',
      'Indirect free kick + caution',
      'Direct free kick + caution',
      'No action',
    ],
    correctIndex: 1,
    lawRef: 'Law 3',
    explanation:
      'A substitute who enters the field without the referee\'s permission should be cautioned. Play restarts with an indirect free kick from where the ball was when play was stopped.',
  },
]

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export function ScenarioDemo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const scenario = scenarios[currentIndex]
  const answered = selectedOption !== null
  const isCorrect = selectedOption === scenario.correctIndex

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return
      setSelectedOption(optionIndex)
    },
    [answered],
  )

  const handleNext = useCallback(() => {
    const newResults = [...results, isCorrect]
    setResults(newResults)
    if (currentIndex + 1 >= scenarios.length) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
    }
  }, [currentIndex, isCorrect, results])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setResults([])
    setFinished(false)
  }, [])

  if (finished) {
    const correct = results.filter(Boolean).length
    return (
      <div className="glass-card p-8">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-white/20">Results</p>
          <p className="mb-1 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent">
            {correct}/{scenarios.length}
          </p>
          <p className="mb-6 text-sm text-white/45">
            {correct === scenarios.length
              ? 'Perfect score — great referee knowledge!'
              : correct >= 2
                ? 'Nice work! Keep practising to sharpen your knowledge.'
                : 'Keep going — consistent practice makes the difference.'}
          </p>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-8">
      {/* Progress */}
      <div className="mb-5 flex items-center gap-2">
        {scenarios.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < currentIndex
                ? 'bg-purple-500'
                : i === currentIndex
                  ? 'bg-purple-500/50'
                  : 'bg-white/10'
            }`}
          />
        ))}
        <span className="ml-2 text-xs text-white/45">
          {currentIndex + 1}/{scenarios.length}
        </span>
      </div>

      {/* Question */}
      <p className="mb-6 text-lg font-semibold leading-relaxed text-white">
        {scenario.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {scenario.options.map((text, i) => {
          const isThisCorrect = i === scenario.correctIndex
          const isSelected = i === selectedOption

          let stateClasses = 'border-white/10 hover:bg-white/[0.05]'
          if (answered && isThisCorrect) {
            stateClasses = 'border-emerald-500/30 bg-emerald-500/10'
          } else if (answered && isSelected && !isThisCorrect) {
            stateClasses = 'border-red-500/30 bg-red-500/10'
          } else if (answered) {
            stateClasses = 'border-white/10 opacity-40'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all duration-300 ${stateClasses} ${
                !answered ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300 ${
                  answered && isThisCorrect
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : answered && isSelected
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-white/10 text-white/45'
                }`}
              >
                {answered && isThisCorrect ? (
                  <Check className="h-3.5 w-3.5" />
                ) : answered && isSelected ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  OPTION_LETTERS[i]
                )}
              </span>
              <span className={answered && isThisCorrect ? 'font-medium text-emerald-400' : 'text-white/45'}>
                {text}
              </span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div
          className="mt-5 rounded-xl bg-white/[0.05] border border-white/10 p-4 text-sm text-white/45"
          style={{ animation: 'fadeSlideIn 0.35s ease-out' }}
        >
          <p className="mb-1 font-semibold text-white">
            {isCorrect ? '✓ Correct' : '✗ Incorrect'} — {scenario.lawRef}
          </p>
          <p>{scenario.explanation}</p>
        </div>
      )}

      {/* Next */}
      {answered && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            style={{ animation: 'fadeSlideIn 0.35s ease-out 0.15s both' }}
          >
            {currentIndex + 1 >= scenarios.length ? 'See results' : 'Next scenario'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
