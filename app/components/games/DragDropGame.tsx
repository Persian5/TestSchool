import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { XpAnimation } from "../XpAnimation"
import { motion, AnimatePresence } from "framer-motion"

interface DragDropGameProps {
  words: { id: string; text: string; slotId: string }[]  // two draggable words
  slots:  { id: string; text: string }[]                // four drop targets
  points: number
  onXpStart?: () => void
  onComplete: (allCorrect: boolean) => void
}

export function DragDropGame({ 
  words,
  slots,
  points,
  onXpStart,
  onComplete,
}: DragDropGameProps) {
  const [matches, setMatches] = useState<Record<string,string>>({})  // slotId→wordId
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null)
  const [showXp, setShowXp] = useState(false)
  const [showFeedback, setShowFeedback] = useState<{ slotId:string; correct:boolean } | null>(null)

  // Reset feedback after 1.5s for incorrect attempts
  useEffect(() => {
    if (showFeedback && !showFeedback.correct) {
      const timer = setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  // Show XP and advance when all words are matched
  useEffect(() => {
    if (Object.keys(matches).length === words.length) {
      // Show XP animation
      setShowXp(true);
      
      // After animation completes, add points and advance
      const timer = setTimeout(() => {
        if (onXpStart) onXpStart();
        onComplete(true);
        setShowXp(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [matches, words.length, onXpStart, onComplete]);

  // Handle word selection
  const handleWordClick = (wordId: string) => {
    // If this word is already matched, do nothing
    if (Object.values(matches).includes(wordId)) return;
    
    setSelectedWordId(wordId);
  };

  // Handle slot selection
  const handleSlotClick = (slotId: string) => {
    // If no word selected, do nothing
    if (!selectedWordId) return;
    
    // Find the word object for the selected ID
    const selectedWord = words.find(w => w.id === selectedWordId);
    if (!selectedWord) return;
    
    // Check if this is the correct slot for the selected word
    const correct = selectedWord.slotId === slotId;
    
    if (correct) {
      // Add to matches
      setMatches(prev => ({ ...prev, [slotId]: selectedWordId }));
      // Clear selection
      setSelectedWordId(null);
    } else {
      // Show error feedback
      setShowFeedback({ slotId, correct: false });
    }
  };

  // Check if a word is matched with any slot
  const isWordMatched = (wordId: string) => {
    return Object.values(matches).includes(wordId);
  };

  // Check if a slot has a matched word
  const isSlotMatched = (slotId: string) => {
    return slotId in matches;
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">Match the Words</h2>
        <p className="text-sm xs:text-base text-muted-foreground">
          Click a Persian word, then click its English meaning to match.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 relative w-full touch-manipulation">
        <XpAnimation 
          amount={points} 
          show={showXp}
        />
        
        <div className="w-full max-w-[600px] mx-auto">
          {/* Section header for Persian words */}
          <h3 className="text-lg font-semibold mb-2 text-primary">Persian Words</h3>
          
          {/* Persian words - side by side */}
          <div className="flex flex-row justify-center gap-4 mb-6">
            {words.map(w => {
              const isMatched = isWordMatched(w.id);
              return (
                <div key={w.id} className="flex-1 max-w-[200px]">
                  <div
                    className={`p-4 rounded-lg border-2 select-none touch-action-none ${
                      isMatched
                        ? "border-green-500 bg-green-100" // Matched state - green border with light green fill
                        : selectedWordId === w.id 
                          ? "border-primary bg-green-100" // Selected state - light green fill
                          : "border-primary/20 bg-primary/5" // Default state - very light primary bg
                    } shadow-sm ${isMatched ? "cursor-default" : "cursor-pointer"} h-full flex items-center justify-center`}
                    onClick={() => {
                      if (!isMatched) handleWordClick(w.id);
                    }}
                  >
                    <span className="text-lg font-semibold text-center">{w.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section header for English meanings */}
          <h3 className="text-lg font-semibold mb-2 text-primary">English Meanings</h3>
          
          {/* English word bank - below */}
          <div className="grid grid-cols-2 gap-4">
            {slots.map(slot => {
              const matchedWordId = matches[slot.id];
              const matchedWord = matchedWordId ? words.find(w => w.id === matchedWordId) : null;
              const isCorrect = matchedWord ? matchedWord.slotId === slot.id : false;
              const isMatched = isSlotMatched(slot.id);
              
              return (
                <motion.div
                  key={slot.id}
                  onClick={() => {
                    if (!isMatched) handleSlotClick(slot.id);
                  }}
                  className={`p-3 rounded-lg border-2 transition-colors select-none touch-action-none ${
                    isMatched && isCorrect
                      ? 'border-green-500 bg-green-100' // Matched state - green border with light green fill
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50' // Default with light gray bg
                  } ${!isMatched ? 'cursor-pointer' : 'cursor-default'}`}
                  animate={
                    showFeedback?.slotId === slot.id && !showFeedback.correct
                      ? { x: [0, -10, 10, -10, 10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-center text-base sm:text-lg">{slot.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Feedback text */}
          <AnimatePresence>
            {showFeedback && !showFeedback.correct && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-500 mt-4 text-sm sm:text-base"
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