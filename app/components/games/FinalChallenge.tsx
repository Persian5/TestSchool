import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { XpAnimation } from "../../components/XpAnimation"
import { motion } from "framer-motion"

interface FinalChallengeProps {
  sentence: string[]
  points: number
  onComplete: (correct: boolean) => void
  onXpStart?: () => void
}

export function FinalChallenge({ sentence, points, onComplete, onXpStart }: FinalChallengeProps) {
  const [inputs, setInputs] = useState<string[]>(Array(sentence.length).fill(""))
  const [showXp, setShowXp] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    newInputs[index] = value
    setInputs(newInputs)
    setShowOptions(false)
    setSelectedIndex(null)
  }

  const handleInputClick = (index: number) => {
    if (showOptions) {
      setShowOptions(false)
      setSelectedIndex(null)
      return
    }
    
    setSelectedIndex(index)
    // Generate options based on the sentence
    const possibleOptions = sentence.filter(word => !inputs.includes(word))
    setOptions(possibleOptions)
    setShowOptions(true)
  }

  const handleOptionSelect = (option: string) => {
    if (selectedIndex !== null) {
      handleInputChange(selectedIndex, option)
    }
  }

  const handleCheck = () => {
    const correct = inputs.every((input, index) => 
      input.toLowerCase().trim() === sentence[index].toLowerCase().trim()
    )
    setIsCorrect(correct)
    setShowXp(true)
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">Final Challenge</h2>
        <p className="text-sm xs:text-base text-muted-foreground">
          {showOptions 
            ? "Click a word to select it" 
            : "Type or click to complete the sentence"}
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 relative w-full">
        <XpAnimation 
          amount={points} 
          show={showXp} 
          onStart={onXpStart}
          onComplete={() => {
            setShowXp(false)
            onComplete(isCorrect)
          }}
        />
        
        <div className="w-full max-w-[600px] mx-auto">
          <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6">
            {sentence.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-1 xs:gap-2"
              >
                <div className="relative">
                  <Input
                    value={inputs[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onClick={() => handleInputClick(index)}
                    placeholder="Type..."
                    className={`w-20 xs:w-24 text-center text-sm xs:text-base ${
                      selectedIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                    disabled={showXp}
                  />
                  {showOptions && selectedIndex === index && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-primary/20">
                      {options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {index < sentence.length - 1 && <span className="text-primary/50 text-xs xs:text-sm">→</span>}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <Button 
              onClick={handleCheck}
              disabled={inputs.some(input => !input.trim()) || showXp || showOptions}
              className="text-sm xs:text-base"
            >
              Check Answer
            </Button>
          </div>

          {showXp && (
            <div className={`mt-3 sm:mt-4 text-center text-sm xs:text-base ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? "Perfect! 🎉" : "Try again! 💪"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 