import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface FinalChallengeProps {
  onComplete: (correct: boolean) => void
}

export function FinalChallenge({ onComplete }: FinalChallengeProps) {
  const [items, setItems] = useState([
    { id: "salam", text: "Salam", order: null as number | null },
    { id: "khosh_amadid", text: "Khosh Amadid", order: null as number | null },
    { id: "chetori", text: "Chetori", order: null as number | null },
    { id: "khodahafez", text: "Khodahafez", order: null as number | null },
  ])
  
  const [slots, setSlots] = useState([
    { id: 1, itemId: null as string | null },
    { id: 2, itemId: null as string | null },
    { id: 3, itemId: null as string | null },
    { id: 4, itemId: null as string | null },
  ])
  
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const confettiCanvasRef = useRef<HTMLDivElement>(null)

  // Handle drag start for an item
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId)
    setIsDragging(true)
    setDraggedItem(itemId)
  }

  // Handle drop into a slot
  const handleDrop = (e: React.DragEvent, slotId: number) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData("text/plain")
    if (!itemId) return
    
    // Check if the slot already has an item - don't replace it
    const targetSlot = slots.find(s => s.id === slotId)
    if (targetSlot && targetSlot.itemId !== null) {
      return
    }
    
    // Check if the item is already in another slot
    const previousSlot = slots.find(slot => slot.itemId === itemId)
    
    // Update slots state
    setSlots(slots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, itemId }
      } else if (previousSlot && slot.id === previousSlot.id) {
        return { ...slot, itemId: null }
      } else {
        return slot
      }
    }))

    // Update items state with their order
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, order: slotId }
      } else if (previousSlot && item.order === slotId) {
        return { ...item, order: null }
      } else {
        return item
      }
    }))

    setIsDragging(false)
    setDraggedItem(null)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  // Check if all slots are filled
  const allSlotsFilled = slots.every(slot => slot.itemId !== null)
  
  // Validate order
  const checkOrder = () => {
    const correctOrder = [
      "salam",
      "khosh_amadid",
      "chetori",
      "khodahafez"
    ]
    
    const currentOrder = slots.map(slot => {
      const item = items.find(item => item.id === slot.itemId)
      return item ? item.id : null
    })
    
    const isOrderCorrect = currentOrder.every((id, index) => id === correctOrder[index])
    
    setShowFeedback(true)
    setIsCorrect(isOrderCorrect)
    
    if (isOrderCorrect) {
      setShowXp(true)
      
      // Trigger confetti
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        })
      }
      
      setTimeout(() => {
        onComplete(true)
      }, 3000)
    } else {
      // Shake effect for incorrect order provided by the animate-shake class
      setTimeout(() => {
        setShowFeedback(false)
      }, 2000)
    }
  }

  // Get an item by slotId
  const getItemForSlot = (slotId: number) => {
    const slot = slots.find(s => s.id === slotId)
    if (!slot || !slot.itemId) return null
    return items.find(item => item.id === slot.itemId)
  }
  
  // Remove item from a slot
  const removeFromSlot = (slotId: number) => {
    const slot = slots.find(s => s.id === slotId)
    if (!slot || !slot.itemId) return

    setSlots(slots.map(s => 
      s.id === slotId ? { ...s, itemId: null } : s
    ))
    
    setItems(items.map(item => 
      item.id === slot.itemId ? { ...item, order: null } : item
    ))
  }

  return (
    <div className="w-full">
      <div ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50"></div>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">Final Challenge</h2>
        <p className="text-muted-foreground mb-4">
          Ali meets a new friend in Tehran. Put their conversation in the correct order: 
          Ali says Hello, welcomes his friend, asks how they are, and finally says Goodbye.
        </p>
      </div>

      <Card className="mb-6 w-full">
        <CardContent className="pt-6">
          {/* Slots for ordering */}
          <div 
            className={`grid grid-cols-1 gap-4 mb-6 ${
              showFeedback && !isCorrect ? 'animate-shake' : ''
            }`}
          >
            {slots.map((slot) => {
              const item = getItemForSlot(slot.id)
              
              return (
                <div 
                  key={slot.id}
                  className={`
                    flex items-center p-3 sm:p-4 rounded-lg border-2 border-dashed transition-all 
                    ${item ? 'border-primary bg-primary/5' : 'border-gray-300'}
                    ${showFeedback && isCorrect ? 'border-green-500 bg-green-50' : ''}
                  `}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.id)}
                >
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-primary font-semibold text-sm sm:text-base">{slot.id}</span>
                  </div>
                  
                  {item ? (
                    <div className="flex justify-between items-center flex-1">
                      <span className="text-base sm:text-lg">{item.text}</span>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => removeFromSlot(slot.id)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-sm sm:text-base">Drop phrase here</div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Draggable items */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6">
            {items.filter(item => item.order === null).map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                className="
                  px-3 py-2 bg-accent text-white rounded-lg cursor-move
                  shadow-sm hover:shadow-md transition-all text-sm sm:text-base
                "
              >
                {item.text}
              </div>
            ))}
          </div>
          
          {/* Submit button */}
          <div className="text-center mt-4">
            <button
              className={`
                px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all w-full sm:w-auto
                ${allSlotsFilled 
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
              `}
              disabled={!allSlotsFilled}
              onClick={checkOrder}
            >
              Check My Answer
            </button>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`text-center p-4 rounded-lg ${
              isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect ? (
              <div>
                <div className="font-bold text-xl mb-2">
                  🎉 You're a natural—Ali made a great impression!
                </div>
                <div className="text-lg">
                  +20 XP!
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold">Almost there—let's try that order again!</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 