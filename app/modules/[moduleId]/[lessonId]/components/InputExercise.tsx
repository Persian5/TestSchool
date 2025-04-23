import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { XpAnimation } from "./XpAnimation"

interface InputExerciseProps {
  question: string;
  answer: string;
  points?: number;
  onComplete: (correct: boolean) => void;
}

export const InputExercise = ({ 
  question,
  answer,
  points = 2,
  onComplete 
}: InputExerciseProps) => {
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showXp, setShowXp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const checkAnswer = () => {
    const normalizedUserInput = userInput.trim().toLowerCase()
    const normalizedAnswer = answer.trim().toLowerCase()
    
    // Check if the answer is correct
    const correct = normalizedUserInput === normalizedAnswer
    setIsCorrect(correct)
    setAttempts(prev => prev + 1)
    
    if (correct) {
      // Show XP animation
      setShowXp(true)
      
      // Add confetti effect
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          })
        })
      }
      
      // Proceed after a short delay to show the success feedback
      setTimeout(() => {
        onComplete(true)
      }, 1500)
    } else {
      // Focus the input for another attempt
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer()
    }
  }

  return (
    <div className="w-full py-2">
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">
          Translation Exercise
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-2">
          Translate the following Persian phrase to English
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-4">
          <XpAnimation amount={points} show={showXp} />
          
          <div className="text-center mb-4">
            <div className="text-lg sm:text-xl font-medium p-3 bg-primary/10 rounded-lg">
              {question}
            </div>
          </div>

          <div className="space-y-4">
            <Input
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your translation here..."
              className={`text-base p-3 h-auto ${
                isCorrect === true 
                  ? "border-green-500 focus-visible:ring-green-500" 
                  : isCorrect === false 
                    ? "border-red-500 focus-visible:ring-red-500" 
                    : ""
              }`}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={isCorrect === true}
            />

            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`p-3 rounded-lg flex items-center ${
                    isCorrect ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="text-green-600 mr-2" size={20} />
                      <span className="text-green-800">
                        Perfect! That's correct.
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-600 mr-2" size={20} />
                      <span className="text-red-800">
                        {attempts >= 2
                          ? `The correct answer is: "${answer}"`
                          : "That's not quite right. Try again!"}
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              className="w-full py-2 text-base"
              onClick={checkAnswer}
              disabled={userInput.trim() === "" || isCorrect === true}
            >
              {isCorrect === null ? "Check Answer" : isCorrect ? "Correct!" : "Try Again"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 