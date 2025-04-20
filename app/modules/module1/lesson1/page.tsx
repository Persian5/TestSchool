"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Star, ArrowRight, CheckCircle2, XCircle, Medal, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { WelcomeIntro } from "./components/WelcomeIntro"
import { Flashcard } from "./components/Flashcard"
import { Quiz } from "./components/Quiz"
import { InputExercise } from "./components/InputExercise"
import { DragDropGame } from "./components/DragDropGame"
import { FinalChallenge } from "./components/FinalChallenge"
import "./styles.css"

const cards = [
  {
    id: "salam",
    front: "👋 Hello",
    back: "Salam",
  },
  {
    id: "khosh_amadid",
    front: "Welcome",
    back: "Khosh Amadid",
  },
  {
    id: "khodafez",
    front: "🚪 Goodbye",
    back: "Khodafez",
  }
]

export default function Lesson1Page() {
  const [flipped, setFlipped] = useState(false)
  const [xp, setXp] = useState(0)
  const [showNext, setShowNext] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [hasEarnedXp, setHasEarnedXp] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [showDragDrop, setShowDragDrop] = useState(false)
  const [showFinalChallenge, setShowFinalChallenge] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [previousStates, setPreviousStates] = useState<{
    xp: number
    progress: number
    currentCardIndex: number
    hasEarnedXp: boolean
  }[]>([])

  const handleStart = () => {
    setHasStarted(true)
  }

  const handleFlip = () => {
    setFlipped(!flipped)
    setShowNext(true)
  }

  const handleNext = () => {
    if (!hasEarnedXp) {
      setXp(prev => prev + 2)
      setHasEarnedXp(true)
    }
    
    // Save current state before moving forward
    setPreviousStates(prev => [...prev, {
      xp,
      progress,
      currentCardIndex,
      hasEarnedXp
    }])
    
    if (currentCardIndex === 0) {
      setShowQuiz(true)
      setProgress(20)
    } else if (currentCardIndex === 1) {
      setShowInput(true)
      setProgress(40)
    } else if (currentCardIndex === 2) {
      setShowDragDrop(true)
      setProgress(60)
    }
  }

  const handleBack = () => {
    if (previousStates.length > 0) {
      const previousState = previousStates[previousStates.length - 1]
      setXp(previousState.xp)
      setProgress(previousState.progress)
      setCurrentCardIndex(previousState.currentCardIndex)
      setHasEarnedXp(previousState.hasEarnedXp)
      setPreviousStates(prev => prev.slice(0, -1))
      
      // Reset specific states based on current view
      setShowQuiz(false)
      setShowInput(false)
      setShowDragDrop(false)
      setShowFinalChallenge(false)
      setShowCompletion(false)
      setShowSummary(false)
      setFlipped(false)
      setShowNext(false)
    }
  }

  const handleQuizComplete = (correct: boolean) => {
    if (correct) {
      setXp(prev => prev + 5)
      setTimeout(() => {
        setShowQuiz(false)
        setCurrentCardIndex(1)
        setProgress(25)
      }, 1500)
    }
  }

  const handleInputComplete = (correct: boolean) => {
    if (correct) {
      setXp(prev => prev + 5)
      setTimeout(() => {
        setShowInput(false)
        setCurrentCardIndex(2)
        setProgress(50)
      }, 1500)
    }
  }

  const handleDragDropComplete = (correct: boolean) => {
    if (correct) {
      setXp(prev => prev + 3)
      setTimeout(() => {
        setShowDragDrop(false)
        setShowFinalChallenge(true)
        setProgress(80)
      }, 1500)
    }
  }
  
  const handleFinalChallengeComplete = (correct: boolean) => {
    if (correct) {
      setXp(prev => prev + 20)
      // Show completion screen after confetti animation ends (3s)
      setTimeout(() => {
        setShowFinalChallenge(false)
        setShowCompletion(true)
        setProgress(100)
      }, 3000)
    }
  }

  const handleViewSummary = () => {
    setShowCompletion(false)
    setShowSummary(true)
  }

  const resetLesson = () => {
    setFlipped(false)
    setXp(0)
    setShowNext(false)
    setCurrentCardIndex(0)
    setProgress(0)
    setHasEarnedXp(false)
    setShowCompletion(false)
    setShowSummary(false)
    setShowQuiz(false)
    setShowInput(false)
    setShowDragDrop(false)
    setShowFinalChallenge(false)
    setHasStarted(false)
    setPreviousStates([])
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-3 sm:px-4">
          <Link href="/modules/module1" className="flex items-center gap-2 font-bold text-base sm:text-lg text-primary">
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Module 1</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {hasStarted && (
        <div className="w-full bg-primary/10">
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <main className="flex-1 flex flex-col px-4 pt-0 pb-4 w-full">
        <div className="w-full max-w-4xl mx-auto flex-1">
          {!hasStarted ? (
            <WelcomeIntro onStart={handleStart} />
          ) : showQuiz ? (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4 w-full">
                <Button variant="ghost" onClick={handleBack} className="text-sm flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Go Back
                </Button>
              </div>
              <Quiz onComplete={handleQuizComplete} />
            </div>
          ) : showInput ? (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4 w-full">
                <Button variant="ghost" onClick={handleBack} className="text-sm flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Go Back
                </Button>
              </div>
              <InputExercise onComplete={handleInputComplete} />
            </div>
          ) : showDragDrop ? (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4 w-full">
                <Button variant="ghost" onClick={handleBack} className="text-sm flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Go Back
                </Button>
              </div>
              <DragDropGame onComplete={handleDragDropComplete} />
            </div>
          ) : showFinalChallenge ? (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4 w-full">
                <Button variant="ghost" onClick={handleBack} className="text-sm flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Go Back
                </Button>
              </div>
              <FinalChallenge onComplete={handleFinalChallengeComplete} />
            </div>
          ) : showCompletion ? (
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
                <p className="text-xl text-muted-foreground mb-4">
                  You helped Ali master his greetings!
                </p>
                
                <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 p-6 rounded-xl mb-6">
                  <h3 className="text-xl font-bold mb-2">Greetings Master 🥇</h3>
                  <p className="text-muted-foreground">
                    You can now greet someone in Persian! Incredible achievement!
                  </p>
                </div>
                
                <div className="bg-accent/10 rounded-lg p-4 mb-6 flex justify-center items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold">{xp} XP</span>
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                
                <p className="text-muted-foreground mb-8">
                  You're making incredible progress! Keep going to become fluent in Farsi!
                </p>
                
                <div className="space-y-4">
                  <Button className="w-full text-lg py-6" onClick={handleViewSummary}>
                    View Summary <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="w-full" onClick={resetLesson}>
                    Practice Again
                  </Button>
                </div>
              </div>
            </div>
          ) : showSummary ? (
            <div className="max-w-lg mx-auto animate-fade-in w-full">
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setShowSummary(false)} className="text-sm flex items-center">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Go Back
                    </Button>
                    <CardTitle className="text-center text-2xl">Today's Achievements!</CardTitle>
                    <div className="w-24"></div> {/* Spacer for alignment */}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1 text-green-500">✅</div>
                      <div>
                        <p className="font-semibold">Learned 4 essential Persian words</p>
                        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <li className="bg-primary/5 p-2 rounded">
                            <span className="font-medium">Salam</span>
                            <span className="block text-sm text-muted-foreground">Hello</span>
                          </li>
                          <li className="bg-primary/5 p-2 rounded">
                            <span className="font-medium">Khodahafez</span>
                            <span className="block text-sm text-muted-foreground">Goodbye</span>
                          </li>
                          <li className="bg-primary/5 p-2 rounded">
                            <span className="font-medium">Chetori</span>
                            <span className="block text-sm text-muted-foreground">How are you</span>
                          </li>
                          <li className="bg-primary/5 p-2 rounded">
                            <span className="font-medium">Khosh Amadid</span>
                            <span className="block text-sm text-muted-foreground">Welcome</span>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1 text-green-500">✅</div>
                      <div>
                        <p className="font-semibold">Completed interactive challenges</p>
                        <p className="text-sm text-muted-foreground">
                          You tackled flashcards, quizzes, and conversation ordering!
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1 text-green-500">✅</div>
                      <div>
                        <p className="font-semibold">Helped Ali navigate his day</p>
                        <p className="text-sm text-muted-foreground">
                          Your Persian skills helped Ali make a great first impression!
                        </p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="text-center py-3">
                    <p className="text-lg font-medium">
                      Your Persian journey has begun—you're amazing! 🚀
                    </p>
                  </div>
                  
                  <div className="bg-accent/10 p-4 rounded-lg space-y-3">
                    <p className="font-semibold text-lg">
                      🔥 Next: More Greetings, Basic Politeness, and Essential Responses! 
                    </p>
                    <p className="text-muted-foreground text-sm">Coming Soon</p>
                    <Button className="w-full mt-2">
                      Join the Waitlist for Free Early Access
                    </Button>
                  </div>
                  
                  <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
                    <Button variant="outline" onClick={resetLesson} className="w-full sm:w-auto">
                      Practice Again
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link href="/modules/module1">
                        Back to Module 1
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4 w-full">
                <Button variant="ghost" onClick={handleBack} className="text-sm flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Go Back
                </Button>
              </div>
              <Flashcard
                front={cards[currentCardIndex].front}
                back={cards[currentCardIndex].back}
                onContinue={handleNext}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 