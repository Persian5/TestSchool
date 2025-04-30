import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { XpAnimation } from "@/app/components/games/XpAnimation"

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

// Helper function to convert card text to audio filename
function getAudioFilename(text: string): string {
  // Remove emoji and trim whitespace
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .trim()
    .toLowerCase();
  
  // Map specific texts to their audio filenames
  const audioMap: Record<string, string> = {
    "hello": "hello.mp3",
    "salam": "salam.mp3",
    "how are you?": "howareyou.mp3",
    "chetori": "chetori.mp3",
    "goodbye": "goodbye.mp3",
    "khodahafez": "khodafez.mp3",
    "welcome": "welcome.mp3",
    "khosh ahmadid": "khoshamadid.mp3"
  };
  
  return audioMap[cleanText] || "";
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
  const [lastFlipState, setLastFlipState] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const componentMountedRef = useRef(false)

  const isFlipped = extFlipped ?? localFlip
  const showNext  = showContinueButton ?? localShowNext

  // Auto-play English audio when component mounts
  useEffect(() => {
    // Only play on initial mount, not on re-renders
    if (!componentMountedRef.current) {
      componentMountedRef.current = true;
      
      const audioFile = getAudioFilename(front);
      
      if (audioFile) {
        const audio = new Audio(`/audio/${audioFile}`);
        audioRef.current = audio;
        
        // Play the audio and handle any errors
        audio.play().catch(error => {
          console.error("Error playing initial audio:", error);
        });
      }
    }
  }, [front]);

  // Play audio when flip state changes
  useEffect(() => {
    // Only play audio if the flip state has actually changed
    if (isFlipped !== lastFlipState) {
      const audioFile = isFlipped 
        ? getAudioFilename(back) 
        : getAudioFilename(front);
      
      if (audioFile) {
        // Create a new audio instance each time to ensure it plays
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const audio = new Audio(`/audio/${audioFile}`);
        audioRef.current = audio;
        
        // Play the audio and handle any errors
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      
      // Update last flip state
      setLastFlipState(isFlipped);
    }
  }, [isFlipped, front, back, lastFlipState]);

  const handleXpComplete = () => {
    // Reset local state
    setLocalFlip(false);
    setLocalShowNext(false);
    setShowXp(false);
    // Call continue handler
    onContinue();
  }

  const handleFlip = () => {
    if (extFlip) {
      extFlip()
    } else {
      setLocalFlip(!localFlip)
      if (!localFlip) setLocalShowNext(true)
    }
  }

  function handleContinueClick() {
    // Don't award XP here - it will be handled by XpAnimation
    // Trigger XP animation
    setShowXp(true);
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">
          NEW WORD
        </h2>
        <p className="text-sm xs:text-base text-muted-foreground">
          Click the card to see the Finglish translation
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 relative w-full">
        <XpAnimation
          amount={points}
          show={showXp}
          onStart={onXpStart}
          onComplete={handleXpComplete}
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
              onClick={handleContinueClick}
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