import { useState } from 'react'
import { Flashcard } from '@/app/components/games/Flashcard'
import { Quiz } from '@/app/components/games/Quiz'
import { InputExercise } from '@/app/components/games/InputExercise'
import { DragDropGame } from '@/app/components/games/DragDropGame'
import { FinalChallenge } from '@/app/components/games/FinalChallenge'
import { WelcomeIntro } from '@/app/components/games/WelcomeIntro'

export type LessonStep =
  | { type: 'welcome'; points: number; data: {} }
  | { type: 'flashcard'; points: number; data: { front: string; back: string } }
  | { type: 'quiz'; points: number; data: { prompt: string; options: string[]; correct: number } }
  | { type: 'input'; points: number; data: { question: string; answer: string } }
  | { type: 'dragdrop'; points: number; data: { items: string[] } }
  | { type: 'final'; points: number; data: { sentence: string[] } }

interface LessonRunnerProps {
  steps: LessonStep[];
  // eventually we will replace this with moduleId, but for now keep steps
}

export function LessonRunner({ steps }: LessonRunnerProps) {
  const [idx, setIdx] = useState(0)
  const [xp, setXp] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false) // For flashcard
  const [showContinue, setShowContinue] = useState(false) // For flashcard

  // If we've gone through all steps, show completion
  if (idx >= steps.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Lesson Complete!</h2>
        <p>You earned {xp} XP</p>
      </div>
    );
  }

  const step = steps[idx]

  const next = () => setIdx(i => i + 1)

  // Increment XP when each game completes
  const handleXpStart = () => setXp(prev => prev + step.points)

  // Flashcard specific handlers
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowContinue(true);
    }
  }

  const handleFlashcardContinue = () => {
    // First, we'll award XP
    handleXpStart();
    // Then advance to the next step
    next();
    // Reset flashcard state for next time we see a flashcard
    setIsFlipped(false);
    setShowContinue(false);
  }

  switch (step.type) {
    case 'welcome':
      return <WelcomeIntro onStart={next} />;
      
    case 'flashcard':
      return (
        <Flashcard
          front={step.data.front}
          back={step.data.back}
          points={step.points}
          onContinue={handleFlashcardContinue}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          showContinueButton={showContinue}
          onXpStart={handleXpStart}
        />
      );
      
    case 'quiz':
      return (
        <Quiz
          prompt={step.data.prompt}
          options={step.data.options}
          correct={step.data.correct}
          points={step.points}
          onComplete={next}
        />
      );
      
    case 'input':
      return (
        <InputExercise
          question={step.data.question}
          answer={step.data.answer}
          points={step.points}
          onComplete={next}
        />
      );
      
    case 'dragdrop':
      // Transform items into the format DragDropGame expects
      const words = step.data.items.slice(0, 2).map((text, idx) => ({ 
        id: `word${idx+1}`, text, slotId: `slot${idx+1}` 
      }));
      
      const slots = [
        { id: "slot1", text: "Hello" },
        { id: "slot2", text: "How are you?" },
        { id: "slot3", text: "Welcome" },
        { id: "slot4", text: "Goodbye" }
      ];
      
      return (
        <DragDropGame
          words={words}
          slots={slots}
          points={step.points}
          onComplete={next}
        />
      );
      
    case 'final':
      return (
        <FinalChallenge
          targetWords={step.data.sentence}
          points={step.points}
          onComplete={next}
        />
      );
      
    default:
      return null;
  }
} 