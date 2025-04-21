import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { XpAnimation } from "./XpAnimation"

interface FlashcardProps {
  front: string
  back: string
  onContinue: () => void
}

export function Flashcard({ front, back, onContinue }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const [showXp, setShowXp] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setShowContinue(true)
    }
  }

  const handleContinue = () => {
    setShowXp(true)
    setTimeout(() => {
      setShowXp(false)
      onContinue()
    }, 800)
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">Basic Greetings</h2>
        <p className="text-muted-foreground">Click the card to see the Finglish translation</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 relative w-full">
        <XpAnimation amount={2} show={showXp} />
        
        <div className="w-full max-w-[600px] mx-auto">
          <div 
            className="relative w-full aspect-[4/3] sm:aspect-[5/3] cursor-pointer"
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleFlip()
              }
            }}
          >
            {/* Front of card */}
            <div 
              className={`absolute inset-0 bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center justify-center border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 ${
                isFlipped ? 'opacity-0 z-0' : 'opacity-100 z-10'
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center">{front}</h2>
              <p className="text-muted-foreground mt-2">Click to flip</p>
            </div>

            {/* Back of card */}
            <div 
              className={`absolute inset-0 bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center justify-center border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 ${
                isFlipped ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center">{back}</h2>
              <p className="text-muted-foreground mt-2">Click to flip back</p>
            </div>
          </div>
        </div>

        {/* Continue button */}
        {showContinue && (
          <div className="mt-6 text-center">
            <Button 
              className="gap-2 w-full sm:w-auto" 
              onClick={handleContinue}
              disabled={showXp}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 