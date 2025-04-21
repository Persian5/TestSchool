import { useState } from "react"
import { Button } from "@/components/ui/button"
import { XpAnimation } from "@/components/XpAnimation"
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

  const handleCheck = () => {
    const correct = JSON.stringify(shuffledItems) === JSON.stringify(items)
    setIsCorrect(correct)
    setShowXp(true)
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">Arrange the Words</h2>
        <p className="text-muted-foreground">Drag to arrange the words in the correct order</p>
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
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            <Reorder.Group
              values={shuffledItems}
              onReorder={setShuffledItems}
              className="space-y-2"
            >
              {shuffledItems.map((item) => (
                <Reorder.Item
                  key={item}
                  value={item}
                  className="bg-primary/5 hover:bg-primary/10 rounded-lg p-3 cursor-move min-h-[60px] xs:min-h-[72px] sm:min-h-[80px]"
                >
                  <motion.div
                    layout
                    className="flex items-center justify-between"
                  >
                    <span className="text-lg">{item}</span>
                    <span className="text-primary/50">⋮⋮</span>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          <div className="mt-6 text-center">
            <Button 
              onClick={handleCheck}
              disabled={showXp}
            >
              Check Order
            </Button>
          </div>

          {showXp && (
            <div className={`mt-4 text-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? "Correct! 🎉" : "Try again! 💪"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 