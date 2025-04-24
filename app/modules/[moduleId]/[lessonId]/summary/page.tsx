"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SummaryPageProps {
  learnedWords?: string[];
  xp?: number;
  resetLesson?: () => void;
}

export default function SummaryPage({
  learnedWords = ["Salam", "Chetori", "Khosh Ahmadid", "Khodahafez"],
  xp = 0,
  resetLesson
}: SummaryPageProps) {
  const { moduleId, lessonId } = useParams();
  
  // Waitlist form state
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
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
        body: JSON.stringify({ email, source: "lesson-summary" }),
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
    <div className="max-w-lg mx-auto animate-fade-in w-full py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Today's Achievements!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Word List */}
          <ul className="space-y-4">
            <li>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Learned {learnedWords.length} essential Persian words</p>
                  <ul className="grid grid-cols-2 gap-2 mt-2">
                    {learnedWords.map((word, index) => (
                      <li key={index} className="bg-primary/5 p-2 rounded">{word}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            
            {/* Challenges Completed */}
            <li>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Completed interactive challenges</p>
                  <p className="text-sm text-muted-foreground">
                    Using flashcards, quizzes, and matching exercises to reinforce learning
                  </p>
                </div>
              </div>
            </li>
            
            {/* Real-World Impact */}
            <li>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Helped Ali navigate his day</p>
                  <p className="text-sm text-muted-foreground">
                    Applied greetings and phrases in a realistic conversation
                  </p>
                </div>
              </div>
            </li>
          </ul>
          
          {/* Next Lesson Teaser */}
          <div className="bg-accent/10 p-4 rounded-lg space-y-3">
            <p className="font-semibold text-lg">
              🔥 Next: More Greetings, Basic Politeness, and Essential Responses!
            </p>
            <p className="text-muted-foreground text-sm">
              Coming Soon
            </p>
            <Button 
              className="w-full mt-2"
              onClick={() => setShowWaitlistModal(true)}
            >
              Join the Waitlist for Free Early Access
            </Button>
          </div>
          
          {/* Footer Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
            <Button 
              variant="outline"
              onClick={resetLesson}
              className="w-full sm:w-auto"
            >
              Practice Again
            </Button>
            
            <Button variant="outline" className="w-full sm:w-auto">
              <Link href={`/modules/${moduleId}`}>
                Back to Module 1
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

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