import { useState } from 'react'
import { Flashcard } from '@/app/components/games/Flashcard'
import { Quiz } from '@/app/components/games/Quiz'
import { InputExercise } from '@/app/components/games/InputExercise'
import { DragDropGame } from '@/app/components/games/DragDropGame'
import { FinalChallenge } from '@/app/components/games/FinalChallenge'
import { WelcomeIntro } from '@/app/components/games/WelcomeIntro'
import { LessonStep, WelcomeStep, FlashcardStep, QuizStep, InputStep, DragDropStep, FinalStep } from '@/lib/types'

interface LessonRunnerProps {
  steps: LessonStep[];
  xp: number;
  onXpChange: (xp: number) => void;
}

export function LessonRunner({ steps, xp, onXpChange }: LessonRunnerProps) {
  const [idx, setIdx] = useState(0)
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
  const handleXpStart = () => onXpChange(xp + step.points)
  
  // Generic handler for all components except Flashcard
  const handleItemComplete = () => {
    // Don't award XP here - it's already handled in each component via onXpStart
    // Just advance to next step
    next();
  }

  // Flashcard specific handlers
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowContinue(true);
    }
  }

  const handleFlashcardContinue = () => {
    // Don't award XP here - it's already handled in the Flashcard component via onXpStart
    // Just advance to the next step
    next();
    // Reset flashcard state for next time we see a flashcard
    setIsFlipped(false);
    setShowContinue(false);
  }

  switch (step.type) {
    case 'welcome':
      const welcomeStep = step as WelcomeStep;
      return <WelcomeIntro 
        title={welcomeStep.title} 
        description={welcomeStep.description} 
        onStart={next} 
      />;
      
    case 'flashcard':
      const flashcardStep = step as FlashcardStep;
      return (
        <Flashcard
          front={flashcardStep.data.front}
          back={flashcardStep.data.back}
          points={flashcardStep.points}
          onContinue={handleFlashcardContinue}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          showContinueButton={showContinue}
          onXpStart={handleXpStart}
        />
      );
      
    case 'quiz':
      const quizStep = step as QuizStep;
      return (
        <Quiz
          prompt={quizStep.data.prompt}
          options={quizStep.data.options}
          correct={quizStep.data.correct}
          points={quizStep.points}
          onComplete={handleItemComplete}
          onXpStart={handleXpStart}
        />
      );
      
    case 'input':
      const inputStep = step as InputStep;
      return (
        <InputExercise
          question={inputStep.data.question}
          answer={inputStep.data.answer}
          points={inputStep.points}
          onComplete={handleItemComplete}
          onXpStart={handleXpStart}
        />
      );
      
    case 'dragdrop':
      const dragDropStep = step as DragDropStep;
      return (
        <DragDropGame
          words={dragDropStep.data.words}
          slots={dragDropStep.data.slots}
          points={dragDropStep.points}
          onComplete={handleItemComplete}
          onXpStart={handleXpStart}
        />
      );
      
    case 'final':
      const finalStep = step as FinalStep;
      return (
        <FinalChallenge
          targetWords={finalStep.data.targetWords}
          points={finalStep.points}
          onComplete={handleItemComplete}
          onXpStart={handleXpStart}
        />
      );
      
    default:
      return null;
  }
} 