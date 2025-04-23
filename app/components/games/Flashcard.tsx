import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { XpAnimation } from "../../components/XpAnimation"

interface FlashcardProps {
  front: string
  back: string
  points?: number
  onContinue: () => void
  onXpStart?: () => void
  isFlipped?: boolean
  onFlip?: () => void
  showContinueButton?: boolean
}

export function Flashcard({
  front,
  back,
  points = 2,
  onContinue,
  onXpStart,
  isFlipped: extFlipped,
  onFlip: extFlip,
  showContinueButton,
}: FlashcardProps) {
  const [localFlip, setLocalFlip] = useState(false)
  const [localShowNext, setLocalShowNext] = useState(false)
  const [showXp, setShowXp] = useState(false)

  const isFlipped = extFlipped ?? localFlip
  const showNext  = showContinueButton ?? localShowNext

  // Handle XP animation completion and continue
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showXp) {
      // Call onXpStart immediately when animation shows
      if (onXpStart) onXpStart();
      
      // Allow animation to play fully before continuing
      timer = setTimeout(() => {
        setShowXp(false)
        onContinue()
      }, 800);
    }
    
    return () => clearTimeout(timer);
  }, [showXp, onContinue, onXpStart]);

  const handleFlip = () => {
    if (extFlip) {
      extFlip()
    } else {
      setLocalFlip(!localFlip)
      if (!localFlip) setLocalShowNext(true)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">
          Basic Greetings
        </h2>
        <p className="text-sm xs:text-base text-muted-foreground">
          Click the card to see the Finglish translation
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 relative w-full">
        <XpAnimation
          amount={points}
          show={showXp}
        />

        <div className="w-full max-w-[600px] mx-auto">
          <div
            className="relative w-full aspect-[4/3] xs:aspect-[3/2] sm:aspect-[5/3] cursor-pointer touch-manipulation"
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleFlip()
            }}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 bg-white rounded-xl shadow-sm p-3 sm:p-6 flex flex-col items-center justify-center border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 ${
                isFlipped ? "opacity-0 z-0" : "opacity-100 z-10"
              }`}
            >
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center px-2">
                {front}
              </h2>
              <p className="text-xs xs:text-sm text-muted-foreground mt-1 sm:mt-2">Click to flip</p>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 bg-white rounded-xl shadow-sm p-3 sm:p-6 flex flex-col items-center justify-center border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 ${
                isFlipped ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center px-2">
                {back}
              </h2>
              <p className="text-xs xs:text-sm text-muted-foreground mt-1 sm:mt-2">Click to flip back</p>
            </div>
          </div>
        </div>

        {showNext && (
          <div className="mt-4 sm:mt-6 text-center">
            <Button
              className="gap-2 w-full sm:w-auto text-sm xs:text-base"
              onClick={() => {
                setShowXp(true)
              }}
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