import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XpAnimation } from "./XpAnimation"

interface DragDropGameProps {
  onComplete: (correct: boolean) => void
}

export function DragDropGame({ onComplete }: DragDropGameProps) {
  const [draggedWord, setDraggedWord] = useState<string | null>(null)
  const [matches, setMatches] = useState<{ [key: string]: string }>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [incorrectOption, setIncorrectOption] = useState<string | null>(null)

  const options = [
    { id: "welcome", text: "Welcome" },
    { id: "goodbye", text: "Goodbye" },
    { id: "goodnight", text: "Good Night" }
  ]

  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData("text/plain", word)
    setDraggedWord(word)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, optionId: string) => {
    e.preventDefault()
    if (matches[optionId]) {
      return
    }
    
    const droppedWord = e.dataTransfer.getData("text/plain")
    const isCorrectMatch = droppedWord === "Khosh Ahmadid" && optionId === "welcome"
    
    setMatches(prev => ({ ...prev, [optionId]: droppedWord }))
    setShowFeedback(true)
    setIsCorrect(isCorrectMatch)
    setIncorrectOption(isCorrectMatch ? null : optionId)

    if (isCorrectMatch) {
      setShowXp(true)  // trigger XP animation
    } else {
      setTimeout(() => {
        setShowFeedback(false)
        setMatches(prev => {
          const newMatches = { ...prev }
          delete newMatches[optionId]
          return newMatches
        })
        setIncorrectOption(null)
      }, 700)
    }
    setDraggedWord(null)
  }

  return (
    <div className="w-full max-w-md mx-auto py-2">
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">Match the Words</h2>
        <p className="text-muted-foreground">Drag the Finglish word to its English meaning</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 relative">
        <XpAnimation 
          amount={3} 
          show={showXp}
          onComplete={() => {
            // Removed storage-based XP update; using setXp in parent
            onComplete(true)  // advance parent immediately
            setShowXp(false)  // reset for next use
          }}
        />
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 flex justify-center">
              <div 
                className="p-3 sm:p-4 border-2 border-solid rounded-lg text-center cursor-move bg-white shadow-sm w-3/4 sm:w-full"
                draggable
                onDragStart={(e) => handleDragStart(e, "Khosh Ahmadid")}
              >
                <p className="text-lg sm:text-xl font-semibold">Khosh Ahmadid</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {options.map(option => (
                <motion.div
                  key={option.id}
                  className={`p-3 border-2 border-dashed rounded-lg ${
                    matches[option.id]
                      ? isCorrect && option.id === "welcome"
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, option.id)}
                  animate={showFeedback && !isCorrect && incorrectOption === option.id ? {
                    x: [0, -10, 10, -10, 10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-center text-base sm:text-lg">{option.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

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