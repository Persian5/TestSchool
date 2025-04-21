import { useState } from 'react'
import { Flashcard } from '@/components/games/Flashcard'
import { Quiz } from '@/components/games/Quiz'
import { InputExercise } from '@/components/games/InputExercise'
import { DragDropGame } from '@/components/games/DragDropGame'
import { FinalChallenge } from '@/components/games/FinalChallenge'

export type LessonStep =
  | { type: 'flashcard'; points: number; data: { front: string; back: string } }
  | { type: 'quiz'; points: number; data: { prompt: string; options: string[]; correct: number } }
  | { type: 'input'; points: number; data: { question: string; answer: string } }
  | { type: 'dragdrop'; points: number; data: { items: string[] } }
  | { type: 'final'; points: number; data: { sentence: string[] } }

interface RunnerProps {
  steps: LessonStep[]
}

export function LessonRunner({ steps }: RunnerProps) {
  const [idx, setIdx] = useState(0)
  const [xp, setXp] = useState(0)

  const step = steps[idx]

  const next = () => setIdx(i => i + 1)

  const common = { onComplete: next, points: step.points }

  // Increment XP when each game mounts (single source of truth)
  const onXpStart = () => setXp(prev => prev + step.points)

  switch (step.type) {
    case 'flashcard':
      return <Flashcard {...common} {...step.data} onXpStart={onXpStart} />
    case 'quiz':
      return <Quiz {...common} {...step.data} onXpStart={onXpStart} />
    case 'input':
      return <InputExercise {...common} {...step.data} onXpStart={onXpStart} />
    case 'dragdrop':
      return <DragDropGame {...common} {...step.data} onXpStart={onXpStart} />
    case 'final':
      return <FinalChallenge {...common} {...step.data} onXpStart={onXpStart} />
    default:
      return null
  }
} 