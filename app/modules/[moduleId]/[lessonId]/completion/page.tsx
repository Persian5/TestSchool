"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Medal, Star, Sparkles, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CompletionPageProps {
  xp?: number;
  resetLesson?: () => void;
  handleViewSummary?: () => void;
}

export default function CompletionPage({ 
  xp = 0, 
  resetLesson,
  handleViewSummary
}: CompletionPageProps) {
  const { moduleId, lessonId } = useParams();
  const router = useRouter();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  
  // Waitlist form state
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedValue = localStorage.getItem('isSubscribed')
    setIsSubscribed(storedValue === 'true')
  }, [])
  
  // Default handlers if not provided via props
  const handleReset = () => {
    if (resetLesson) {
      resetLesson();
    } else {
      router.push(`/modules/${moduleId}/${lessonId}`);
    }
  };
  
  const navigateToSummary = () => {
    if (handleViewSummary) {
      handleViewSummary();
    } else {
      router.push(`/modules/${moduleId}/${lessonId}/summary`);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: "lesson-completion" }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to subscribe')
        }
        setIsSubscribed(true)
        localStorage.setItem('isSubscribed', 'true')
        setShowConfetti(true)
        setEmail("")

        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        // If not JSON, get the text and throw an error
        const text = await response.text()
        throw new Error('Server error: ' + text)
      }
    } catch (err) {
      console.error('Waitlist submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto text-center animate-fade-in w-full sm:w-auto py-8">
      {/* Medal Icon with Pulse */}
      <div className="relative mx-auto w-24 h-24 mb-6">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 blur-sm animate-pulse"></div>
        <div className="relative bg-amber-400 rounded-full p-4 flex justify-center items-center h-full">
          <Medal className="h-12 w-12 text-white" />
        </div>
      </div>
      
      {/* Celebration Heading */}
      <h2 className="text-4xl font-bold mb-2 text-primary">
        🥳 INCREDIBLE JOB!
      </h2>
      
      {/* Subheading */}
      <p className="text-xl text-muted-foreground mb-4">
        You helped Ali master his greetings!
      </p>
      
      {/* XP Badge */}
      <div className="bg-accent/10 rounded-lg p-4 mb-6 flex justify-center items-center gap-3">
        <Star className="h-6 w-6 text-yellow-500" />
        <span className="text-2xl font-bold">{xp} XP</span>
        <Sparkles className="h-5 w-5 text-yellow-500" />
      </div>
      
      {/* Encouraging Text */}
      <p className="text-muted-foreground mb-8">
        You're making incredible progress! Keep going to become fluent in Farsi!
      </p>
      
      {/* Action Buttons */}
      <div className="space-y-4">
        <Button 
          className="w-full text-lg py-6" 
          onClick={() => setShowWaitlistModal(true)}
        >
          Sign up for FREE Beta Access Waitlist
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={navigateToSummary}
        >
          View Summary <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          <div className="absolute inset-0 bg-primary/5" />
          <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 text-primary" size={48} />
        </motion.div>
      )}

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative">
            <button
              onClick={() => setShowWaitlistModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            
            {isSubscribed ? (
              <div className="text-center p-6">
                <h4 className="text-lg font-semibold mb-2">Thank you!</h4>
                <p>You'll be notified when we officially launch.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">Join the Waitlist</h3>
                <form
                  onSubmit={handleWaitlistSubmit}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="w-full border rounded px-3 py-2"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Joining...' : 'Submit'}
                  </button>
                  {error && (
                    <p className="text-red-500 mt-2 text-sm text-center" role="alert">
                      {error}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 