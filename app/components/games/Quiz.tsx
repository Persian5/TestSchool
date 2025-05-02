import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { XpAnimation } from "./XpAnimation"
import { playSuccessSound } from "./Flashcard"

type QuizOption = {
  text: string;
  correct: boolean;
};

export interface QuizProps {
  prompt: string;
  options: string[] | QuizOption[];
  correct: number;
  points?: number;
  onComplete: (correct: boolean) => void;
  onXpStart?: () => void;
}

export function Quiz({ 
  prompt = "Ali smiles and says 'Hello'. What's the right Persian word?",
  options = [
    { text: "Salam", correct: true },
    { text: "Khodafez", correct: false },
    { text: "Shab Bekheir", correct: false },
    { text: "Chetori", correct: false },
  ],
  correct = 0,
  points = 2,
  onComplete,
  onXpStart
}: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  // Convert string[] to QuizOption[] if needed
  const formattedOptions: QuizOption[] = Array.isArray(options) && typeof options[0] === 'string'
    ? (options as string[]).map((opt, i) => ({ text: opt, correct: i === correct }))
    : options as QuizOption[];

  const handleSelect = (index: number) => {
    setSelectedOption(index)
    setShowFeedback(true)
    setIsDisabled(true)
    
    if (formattedOptions[index].correct) {
      // Play success sound when the correct answer is selected
      playSuccessSound();
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
    <div className="flex flex-col items-center w-full flex-1 px-2 sm:px-4 md:px-6 min-h-0">
      <div className="text-center mb-2 sm:mb-3">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">Quick Quiz</h2>
        <p className="text-muted-foreground">Test what you've learned!</p>
      </div>

      <div className="relative w-full max-w-md sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[70vw] flex-grow flex flex-col justify-between p-3 sm:p-4 overflow-visible min-h-0">
        <XpAnimation 
          amount={points} 
          show={showXp}
          onStart={onXpStart}
          onComplete={() => {
            setShowXp(false)  // reset for next use
            onComplete(true)
          }}
        />
        
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">
          {prompt}
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-grow">
          {formattedOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: showFeedback && selectedOption === index && option.correct ? [1, 1.05, 1] : 1,
                x: showFeedback && selectedOption === index && !option.correct ? [0, -10, 10, -10, 10, 0] : 0,
                boxShadow: showFeedback && selectedOption === index && option.correct ? 
                  "0 0 0 3px rgba(34, 197, 94, 0.2)" : "none",
              }}
              transition={{
                x: { duration: 0.5 },
                scale: { duration: 0.4, repeat: 0 },
                boxShadow: { duration: 0.3 },
              }}
              className="relative rounded-lg overflow-hidden h-full"
            >
              <button
                className={`w-full h-full rounded-lg flex items-center justify-center transition-all text-lg font-semibold
                  ${selectedOption === index ? 
                    (showFeedback ? 
                      (option.correct ? "bg-green-100 text-green-700 ring-4 ring-green-100/50" : "bg-red-500 text-white") 
                    : "bg-primary/20 text-primary") 
                  : "bg-white border-2 border-primary/20 text-gray-800 hover:bg-primary/10 hover:scale-[1.03]"}
                  active:scale-95 shadow-sm hover:shadow-md`}
                onClick={() => !isDisabled && handleSelect(index)}
                disabled={isDisabled}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-3 py-2 text-center text-base sm:text-lg lg:text-xl">{option.text}</span>
                </div>
                
                <AnimatePresence>
                  {showFeedback && selectedOption === index && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2"
                    >
                      {option.correct ? (
                        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                      ) : (
                        <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && selectedOption !== null && !formattedOptions[selectedOption].correct && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-red-500 mt-2"
            >
              Try again!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 