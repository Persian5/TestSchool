import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { XpAnimation } from "../../components/XpAnimation"

interface InputExerciseProps {
  question: string
  answer: string
  points: number
  onComplete: (correct: boolean) => void
  onXpStart?: () => void
}

export function InputExercise({ question, answer, points, onComplete, onXpStart }: InputExerciseProps) {
  const [input, setInput] = useState("")
  const [showXp, setShowXp] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    const correct = input.toLowerCase().trim() === answer.toLowerCase().trim()
    setIsCorrect(correct)
    setShowXp(true)
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">Type It Out</h2>
        <p className="text-sm xs:text-base text-muted-foreground">Type the correct answer</p>
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
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-center px-2">{question}</p>
          
          <div className="flex flex-col xs:flex-row gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 text-sm xs:text-base"
              disabled={showXp}
            />
            <Button 
              onClick={handleSubmit}
              disabled={!input.trim() || showXp}
              className="text-sm xs:text-base"
            >
              Submit
            </Button>
          </div>
          
          {showXp && (
            <div className={`mt-3 sm:mt-4 text-center text-sm xs:text-base ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? "Correct! 🎉" : "Try again! 💪"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 