import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { XpAnimation } from "./XpAnimation"

interface QuizProps {
  onComplete: (correct: boolean) => void
}

export function Quiz({ onComplete }: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const options = [
    { text: "Salam", correct: true },
    { text: "Khodahafez", correct: false },
    { text: "Shab Bekheir", correct: false },
    { text: "Chetori", correct: false },
  ]

  const handleSelect = (index: number) => {
    setSelectedOption(index)
    setShowFeedback(true)
    setIsDisabled(true)
    
    if (options[index].correct) {
      setShowXp(true)  // trigger XP animation
    } else {
      setTimeout(() => {
        setShowFeedback(false)
        setSelectedOption(null)
        setIsDisabled(false)
      }, 700)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto py-2">
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">Quick Quiz</h2>
        <p className="text-muted-foreground">Test what you've learned!</p>
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
        
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          Ali smiles and says "Hello". What's the right Persian word?
        </h3>

        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                x: showFeedback && selectedOption === index && !option.correct ? [0, -10, 10, -10, 10, 0] : 0,
                borderColor: showFeedback && selectedOption === index
                  ? option.correct ? "rgb(34 197 94)" : "rgb(239 68 68)"
                  : "rgb(229 231 235)",
              }}
              transition={{
                x: { duration: 0.5 },
                borderColor: { duration: 0.3 },
              }}
            >
              <Button
                variant={selectedOption === index ? "default" : "outline"}
                className={`w-full justify-start gap-2 text-base sm:text-lg py-3 ${
                  showFeedback && selectedOption === index
                    ? option.correct
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                    : ""
                }`}
                onClick={() => handleSelect(index)}
                disabled={isDisabled}
              >
                <AnimatePresence>
                  {showFeedback && selectedOption === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {option.correct ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {option.text}
              </Button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && selectedOption !== null && !options[selectedOption].correct && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-red-500 mt-3"
            >
              Try again!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 