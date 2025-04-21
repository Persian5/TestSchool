import { motion, AnimatePresence } from "framer-motion"

interface XpAnimationProps {
  amount: number
  show: boolean
  onStart?: () => void     // Called at animation start
  onComplete?: () => void  // Called at animation end
}

export function XpAnimation({ amount, show, onStart, onComplete }: XpAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0 }}
          transition={{ duration: 0.8 }}   // XP animation slightly slower
          onAnimationStart={onStart}        // XP fires now
          onAnimationComplete={onComplete}  // next-item fires here
          className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold shadow-lg z-50"
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  )
} 