import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { XpAnimation } from "./XpAnimation"

interface InputExerciseProps {
  onComplete: (correct: boolean) => void
}

export function InputExercise({ onComplete }: InputExerciseProps) {
  const [input, setInput] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (showFeedback && !isCorrect) {
      setShowFeedback(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isAnswerCorrect = input.toLowerCase().trim() === "chetori"
    setIsCorrect(isAnswerCorrect)
    setShowFeedback(true)

    if (isAnswerCorrect) {
      setShowXp(true)  // trigger XP animation
    }
  }

  return (
    <div className="w-full max-w-md mx-auto py-2">
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">Practice</h2>
        <p className="text-muted-foreground">Type the correct word in Finglish</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 relative">
        <XpAnimation 
          amount={5} 
          show={showXp}
          onComplete={() => {
            // Removed storage-based XP update; using setXp in parent
            onComplete(true)  // advance parent immediately
            setShowXp(false)  // reset for next use
          }}
        />
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg sm:text-xl">
              Ali says: Salam, <span className="font-semibold">___?</span> (How Are You)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your answer..."
                className={`pr-10 text-base sm:text-lg ${
                  showFeedback
                    ? isCorrect
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                disabled={showFeedback && isCorrect}
              />
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              className="w-full text-base sm:text-lg py-3"
              disabled={showFeedback && isCorrect}
            >
              Check Answer
            </Button>
          </form>

          <AnimatePresence>
            {showFeedback && !isCorrect && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-500 mt-3 text-sm"
              >
                Almost! Try again.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 