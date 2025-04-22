"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { ChevronLeft, Star, ArrowRight, CheckCircle2, XCircle, Medal, Sparkles } from "lucide-react"
import { Progress } from "../../../../components/ui/progress"
import { WelcomeIntro } from "./components/WelcomeIntro"
import { Flashcard } from "../../../components/games/Flashcard"
import { Quiz } from "./components/Quiz"
import { InputExercise } from "./components/InputExercise"
import { DragDropGame } from "../../../components/games/DragDropGame"
import { FinalChallenge } from "./components/FinalChallenge"
import "./styles.css"

const cards = [
  {
    id: "salam",
    front: "👋 Hello",
    back: "Salam",
  },
  {
    id: "chetori",
    front: "🤔 How are you?",
    back: "Chetori",
  },
  {
    id: "khosh_ahmadid",
    front: "🤗 Welcome",
    back: "Khosh Ahmadid",
  },
  {
    id: "khodafez",
    front: "🚪 Goodbye",
    back: "Khodafez",
  }
]

// Define the possible views in the lesson
type LessonViewType = 'welcome' | 'flashcard' | 'quiz' | 'input' | 'dragdrop' | 'final' | 'completion' | 'summary'

// Define the structure for storing previous states
interface LessonState {
  xp: number
  progress: number
  currentCardIndex: number
  currentView: LessonViewType
  isFlipped: boolean
  showContinue: boolean
}

export default function Lesson1Page() {
  const [xp, setXp] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [currentView, setCurrentView] = useState<LessonViewType>('welcome')
  const [isFlipped, setIsFlipped] = useState(false) // State for flashcard flip
  const [showContinue, setShowContinue] = useState(false) // State for flashcard continue button
  const [previousStates, setPreviousStates] = useState<LessonState[]>([])

  // Function to save the current state before transitioning
  const saveState = () => {
    setPreviousStates(prev => [...prev, {
      xp,
      progress,
      currentCardIndex,
      currentView,
      isFlipped,
      showContinue
    }])
  }

  const handleStart = () => {
    saveState()
    setCurrentView('flashcard')
    setProgress(5) // Initial progress
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) { // If flipping to the back
      setShowContinue(true)
    }
  }

  // Logic to advance after clicking continue on a flashcard
  const handleNext = () => {
    saveState()
    setXp(prev => prev + 2) // Award XP for viewing flashcard
    
    let nextView: LessonViewType = 'flashcard'; // Default to next flashcard
    let nextProgress = progress + 15;
    let nextCardIndex = currentCardIndex + 1;

    if (currentCardIndex === 0) { // After Salam card
      nextView = 'quiz'
      nextProgress = 20;
    } else if (currentCardIndex === 1) { // After Chetori card
      nextView = 'input'
      nextProgress = 40;
    } else if (currentCardIndex === 2) { // After Khosh Ahmadid card
      nextView = 'dragdrop'
      nextProgress = 60;
    } else if (currentCardIndex === 3) { // After Khodafez card
      nextView = 'final'
      nextProgress = 80;
    }

    setCurrentView(nextView)
    setProgress(nextProgress)
    // We don't advance card index here, completion handlers do that
    
    // Reset flashcard state for the next view
    setIsFlipped(false)
    setShowContinue(false)
  }

  const handleBack = () => {
    if (previousStates.length > 0) {
      const previousState = previousStates.pop()! // Get and remove last state
      setXp(previousState.xp)
      setProgress(previousState.progress)
      setCurrentCardIndex(previousState.currentCardIndex)
      setCurrentView(previousState.currentView)
      setIsFlipped(previousState.isFlipped)
      setShowContinue(previousState.showContinue)
      setPreviousStates([...previousStates]) // Update state array
    }
  }

  // Logic after completing the Quiz (Salam)
  const handleQuizComplete = (correct: boolean) => {
    if (correct) {
      setXp(prev => prev + 5)  // XP state updated here
      saveState()
      // Removed setTimeout; advancing immediately on animation complete
      setCurrentCardIndex(1) // Move to Chetori card
      setCurrentView('flashcard')
      setProgress(25)
      setIsFlipped(false) // Ensure next card starts unflipped
      setShowContinue(false)
    }
  }

  // Logic after completing the Input Exercise (Chetori)
  const handleInputComplete = (correct: boolean) => {
    if (correct) {
      setXp(prev => prev + 5)  // XP state updated here
      saveState()
      // Removed setTimeout; advancing immediately on animation complete
      setCurrentCardIndex(2) // Move to Khosh Ahmadid card
      setCurrentView('flashcard')
      setProgress(50)
      setIsFlipped(false)
      setShowContinue(false)
    }
  }

  // Logic after completing the Drag Drop Game (Khosh Ahmadid)
  const handleDragDropComplete = (correct: boolean) => {
    if (correct) {
      saveState()
      setCurrentCardIndex(3)
      setCurrentView('flashcard')
      setProgress(75)
      setIsFlipped(false)
      setShowContinue(false)
    }
  }
  
  // Logic after completing the Final Challenge
  const handleFinalChallengeComplete = (correct: boolean) => {
    if (correct) {
      setXp(prev => prev + 20)  // XP state updated here
      saveState()
      // Removed setTimeout; advancing immediately on animation complete
      setCurrentView('completion')
      setProgress(100)
    }
  }

  const handleViewSummary = () => {
    saveState() // Save completion state before going to summary
    setCurrentView('summary')
  }

  const resetLesson = () => {
    setXp(0)
    setProgress(0)
    setCurrentCardIndex(0)
    setCurrentView('welcome')
    setIsFlipped(false)
    setShowContinue(false)
    setPreviousStates([])
  }

  // Determine the current view component based on state
  const RenderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeIntro onStart={handleStart} />
      case 'quiz':
        return <Quiz onComplete={handleQuizComplete} />
      case 'input':
        return <InputExercise onComplete={handleInputComplete} />
      case 'dragdrop':
        return (
          <DragDropGame
            words={[
              { id: 'salam',          text: 'Salam',         slotId: 'hello'   },
              { id: 'khosh_ahmadid',  text: 'Khosh Ahmadid', slotId: 'welcome' },
            ]}
            slots={[
              { id: 'hello',      text: 'Hello'      },
              { id: 'welcome',    text: 'Welcome'    },
              { id: 'goodbye',    text: 'Goodbye'    },
              { id: 'goodnight',  text: 'Good Night' },
            ]}
            points={2 /* or sum of both if you like */}
            onXpStart={() => setXp(prev => prev + 2)}
            onComplete={handleDragDropComplete}
          />
        )
      case 'final':
        return <FinalChallenge onComplete={handleFinalChallengeComplete} />
      case 'completion':
        return (
          <div className="max-w-md mx-auto text-center animate-fade-in w-full sm:w-auto">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 blur-sm animate-pulse"></div>
                  <div className="relative bg-amber-400 rounded-full p-4">
                    <Medal className="h-16 w-16 text-amber-900" />
                  </div>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-2 text-primary">🥳 INCREDIBLE JOB!</h2>
              <p className="text-xl text-muted-foreground mb-4">You helped Ali master his greetings!</p>
              <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold mb-2">Greetings Master 🥇</h3>
                <p className="text-muted-foreground">You can now greet someone in Persian! Incredible achievement!</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-4 mb-6 flex justify-center items-center gap-3">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-2xl font-bold">{xp} XP</span>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-muted-foreground mb-8">You're making incredible progress! Keep going to become fluent in Farsi!</p>
              <div className="space-y-4">
                <Button className="w-full text-lg py-6" onClick={handleViewSummary}>View Summary <ArrowRight className="ml-2 h-5 w-5" /></Button>
                <Button variant="outline" className="w-full" onClick={resetLesson}>Practice Again</Button>
              </div>
            </div>
          </div>
        )
      case 'summary':
        return (
          <div className="max-w-lg mx-auto animate-fade-in w-full">
            <Card className="w-full">
              {/* Back button handled globally now */}
              <CardHeader>
                <CardTitle className="text-center text-2xl">Today's Achievements!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 text-green-500">✅</div>
                    <div>
                      <p className="font-semibold">Learned {cards.length} essential Persian words</p>
                      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cards.map(card => (
                          <li key={card.id} className="bg-primary/5 p-2 rounded">
                            <span className="font-medium">{card.back}</span>
                            {/* Regex to remove emoji */}
                            <span className="block text-sm text-muted-foreground">{card.front.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 text-green-500">✅</div>
                    <div>
                      <p className="font-semibold">Completed interactive challenges</p>
                      <p className="text-sm text-muted-foreground">You tackled flashcards, quizzes, and conversation ordering!</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 text-green-500">✅</div>
                    <div>
                      <p className="font-semibold">Helped Ali navigate his day</p>
                      <p className="text-sm text-muted-foreground">Your Persian skills helped Ali make a great first impression!</p>
                    </div>
                  </li>
                </ul>
                <div className="text-center py-3"><p className="text-lg font-medium">Your Persian journey has begun—you're amazing! 🚀</p></div>
                <div className="bg-accent/10 p-4 rounded-lg space-y-3">
                  <p className="font-semibold text-lg">🔥 Next: More Greetings, Basic Politeness, and Essential Responses!</p>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                  <Button className="w-full mt-2">Join the Waitlist for Free Early Access</Button>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
                  <Button variant="outline" onClick={resetLesson} className="w-full sm:w-auto">Practice Again</Button>
                  <Button variant="outline" asChild className="w-full sm:w-auto"><Link href="/modules/module1">Back to Module 1</Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'flashcard':
      default:
        return (
          <Flashcard
            key={cards[currentCardIndex].id} // Add key for re-render on change
            front={cards[currentCardIndex].front}
            back={cards[currentCardIndex].back}
            points={2}
            onContinue={handleNext}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            showContinueButton={showContinue}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-3 sm:px-4">
          <Link href="/modules" className="flex items-center gap-2 font-bold text-base sm:text-lg text-primary">
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Modules</span>
            <span className="sm:hidden">Modules</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {currentView !== 'welcome' && (
        <div className="w-full bg-primary/10">
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <main className="flex-1 flex flex-col px-4 pt-4 pb-4 w-full">
        {/* Main content area top-aligned */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-start justify-start pt-4">
          <RenderCurrentView />
        </div>
        
        {/* Back Button container - Now below content */} 
        {currentView !== 'welcome' && currentView !== 'completion' && previousStates.length > 0 && (
           <div className="w-full max-w-4xl mx-auto mt-4 flex justify-start">
            <Button variant="ghost" onClick={handleBack} className="text-sm flex items-center self-start">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Go Back
            </Button>
          </div>
        )}
      </main>
    </div>
  )
} 