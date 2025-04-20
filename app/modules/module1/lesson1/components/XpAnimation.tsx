import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"

interface XpAnimationProps {
  amount: number
  show: boolean
}

export function XpAnimation({ amount, show }: XpAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-yellow-500/20 px-3 py-2 rounded-full"
        >
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-500">+{amount} XP</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 