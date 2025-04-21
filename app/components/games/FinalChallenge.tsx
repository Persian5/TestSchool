import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { XpAnimation } from "@/components/XpAnimation"
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

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    newInputs[index] = value
    setInputs(newInputs)
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
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">Final Challenge</h2>
        <p className="text-muted-foreground">Complete the sentence</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 relative w-full">
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
          <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center items-center mb-6">
            {sentence.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <Input
                  value={inputs[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Type..."
                  className="w-24 text-center"
                  disabled={showXp}
                />
                {index < sentence.length - 1 && <span className="text-primary/50">→</span>}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button 
              onClick={handleCheck}
              disabled={inputs.some(input => !input.trim()) || showXp}
            >
              Check Answer
            </Button>
          </div>

          {showXp && (
            <div className={`mt-4 text-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? "Perfect! 🎉" : "Try again! 💪"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 