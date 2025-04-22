import { useState } from "react"
import { Button } from "@/components/ui/button"
import { XpAnimation } from "../../components/XpAnimation"
import { motion, Reorder } from "framer-motion"

interface DragDropGameProps {
  items: string[]
  points: number
  onComplete: (correct: boolean) => void
  onXpStart?: () => void
}

export function DragDropGame({ items, points, onComplete, onXpStart }: DragDropGameProps) {
  const [shuffledItems, setShuffledItems] = useState([...items].sort(() => Math.random() - 0.5))
  const [showXp, setShowXp] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleCheck = () => {
    const correct = JSON.stringify(shuffledItems) === JSON.stringify(items)
    setIsCorrect(correct)
    setShowXp(true)
  }

  const handleItemClick = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index)
    } else {
      // Swap items
      const newItems = [...shuffledItems]
      const temp = newItems[selectedIndex]
      newItems[selectedIndex] = newItems[index]
      newItems[index] = temp
      setShuffledItems(newItems)
      setSelectedIndex(null)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">Arrange the Words</h2>
        <p className="text-sm xs:text-base text-muted-foreground">
          {selectedIndex === null 
            ? "Click or drag to arrange the words in the correct order" 
            : "Now click another word to swap positions"}
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
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            <Reorder.Group
              values={shuffledItems}
              onReorder={setShuffledItems}
              className="space-y-2"
              style={{ touchAction: 'manipulation' }}
            >
              {shuffledItems.map((item, index) => (
                <Reorder.Item
                  key={item}
                  value={item}
                  onClick={() => handleItemClick(index)}
                  dragListener={true}
                  whileDrag={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-primary/5 hover:bg-primary/10 rounded-lg
                            p-2 xs:p-3 min-h-[50px] xs:min-h-[60px] sm:min-h-[72px]
                            cursor-grab active:cursor-grabbing transition-all
                            ${selectedIndex === index ? "bg-primary/20 ring-2 ring-primary" : ""}
                           `}
                  style={{ touchAction: 'none' }}
                >
                  <motion.div
                    layout
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm xs:text-base sm:text-lg">{item}</span>
                      {selectedIndex === index && (
                        <span className="text-xs xs:text-sm text-primary">Selected</span>
                      )}
                    </div>
                    <span className="text-primary/50 text-xs xs:text-sm">⋮⋮</span>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <Button 
              onClick={handleCheck}
              disabled={showXp || selectedIndex !== null}
              className="text-sm xs:text-base"
            >
              Check Order
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