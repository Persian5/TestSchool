import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { XpAnimation } from "../../components/XpAnimation"

interface QuizProps {
  prompt: string
  options: string[]
  correct: number
  points: number
  onComplete: (correct: boolean) => void
  onXpStart?: () => void
}

export function Quiz({ prompt, options, correct, points, onComplete, onXpStart }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showXp, setShowXp] = useState(false)

  const handleSelect = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    setShowXp(true)
  }

  const isCorrect = selected === correct

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">Quiz Time!</h2>
        <p className="text-muted-foreground">Select the correct answer</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 relative w-full">
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
          <p className="text-lg sm:text-xl mb-6 text-center">{prompt}</p>
          
          <div className="space-y-2 xs:space-y-3 sm:space-y-4">
            {options.map((option, index) => (
              <Button
                key={index}
                variant={selected === index ? (isCorrect ? "default" : "destructive") : "outline"}
                className={`w-full justify-start gap-2 text-sm xs:text-base sm:text-lg py-2 xs:py-3 ${
                  selected === index ? (isCorrect ? "bg-primary text-white" : "bg-red-500 text-white") : ""
                }`}
                onClick={() => handleSelect(index)}
                disabled={selected !== null}
              >
                <span className="flex-1 text-left">{option}</span>
                {selected === index && (
                  <span className="text-sm">
                    {isCorrect ? "✓" : "✗"}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 