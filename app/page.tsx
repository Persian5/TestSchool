"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

export default function HomePage() {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const correctAnswer = "salaam"

  // Persian Phrases Section
  const phrases = [
    { persian: "Salam", english: "Hello", emoji: "👋" },
    { persian: "Merci", english: "Thank you", emoji: "🙏" },
    { persian: "Dooset daram", english: "I love you", emoji: "❤️" },
    { persian: "Chetori?", english: "How are you?", emoji: "🙂" },
    { persian: "Khoobam", english: "I'm good", emoji: "😌" },
    { persian: "Esme shoma chieh?", english: "What's your name?", emoji: "🧑‍💼" },
    { persian: "Khodafez", english: "Goodbye", emoji: "👋" },
  ]

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isPhraseFading, setIsPhraseFading] = useState(false)
  const [phraseProgressValue, setPhraseProgressValue] = useState(0)
  const phraseTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Mini-Game Section
  const [miniGameAnswer, setMiniGameAnswer] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showIncorrect, setShowIncorrect] = useState(false)

  // Animate progress bar on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(33)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Phrase carousel with progress bar
  useEffect(() => {
    // Reset progress when phrase changes
    setPhraseProgressValue(0)

    // Animate progress over 4 seconds
    const progressInterval = setInterval(() => {
      setPhraseProgressValue((prev) => {
        if (prev >= 100) return 100
        return prev + 1
      })
    }, 40) // 4000ms / 100 steps = 40ms per step

    // Move to next phrase after 4 seconds
    phraseTimerRef.current = setTimeout(() => {
      setIsPhraseFading(true)
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        setIsPhraseFading(false)
      }, 500)
    }, 4000)

    return () => {
      clearInterval(progressInterval)
      if (phraseTimerRef.current) clearTimeout(phraseTimerRef.current)
    }
  }, [currentPhraseIndex])

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleMiniGameAnswer = (selectedAnswer: string) => {
    setMiniGameAnswer(selectedAnswer)
    if (selectedAnswer === "Salam") {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      setShowIncorrect(true)
      // Reset quickly after showing incorrect message
      setTimeout(() => {
        setShowIncorrect(false)
        setMiniGameAnswer(null)
      }, 800)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-3 sm:px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-base sm:text-lg text-primary">
            <span className="hidden sm:inline">Iranopedia Farsi Academy</span>
            <span className="sm:hidden">Iranopedia Farsi Academy</span>
          </Link>
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-white" onClick={scrollToWaitlist}>
            Start Now
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Larger text and reduced margins */}
        <section className="bg-primary/10 py-8 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary mb-3">
              Learn Farsi. Reconnect with Your Roots.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-3">
              Bite-sized lessons, real culture, zero pressure.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mb-5">Connect with your heritage</p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full px-8 py-6 text-lg"
              onClick={() => document.getElementById("lesson-1")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Lesson 1
            </Button>
          </div>
        </section>

        {/* World Map Section - Simplified */}
        <section className="py-8 px-3 sm:px-4 bg-gradient-to-b from-blue-50 to-green-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Over 4,500+ learners have already started learning Persian through Iranopedia
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">Iranian culture is everywhere. You belong here.</p>
          </div>
        </section>

        {/* Feature Cards - Reduced margins */}
        <section className="py-8 px-3 sm:px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <span className="text-2xl sm:text-3xl">📚</span> Bite-sized Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base sm:text-lg">
                    Learn Farsi in 5-minute chunks that fit into your busy schedule.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <span className="text-2xl sm:text-3xl">🍚</span> Real Iranian Culture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base sm:text-lg">From tahdig to Nowruz, learn language in its cultural context.</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <span className="text-2xl sm:text-3xl">✍️</span> Finglish + Persian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base sm:text-lg">Start in Latin letters, move to Persian script when ready.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Persian Phrases Section - Reduced margins */}
        <section className="py-8 px-3 sm:px-4 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6">
              Learn Your First Persian Phrases
            </h2>

            <div className="flex justify-center">
              <div
                className={`transition-opacity duration-500 ${isPhraseFading ? "opacity-0" : "opacity-100"} bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-sm`}
              >
                <div className="text-5xl sm:text-6xl mb-4">{phrases[currentPhraseIndex].emoji}</div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                  {phrases[currentPhraseIndex].persian}
                </div>
                <div className="text-lg sm:text-xl text-gray-600 mb-4">{phrases[currentPhraseIndex].english}</div>

                {/* Progress bar instead of dots */}
                <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${phraseProgressValue}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gamified Features Section - Replacing Track Your Progress */}
        <section className="py-16 sm:py-20 px-3 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-green-50 my-8 sm:my-12 border-y border-primary/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-primary inline-flex items-center">
                <span className="mr-2">🎮</span> Gamified Learning Experience
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 mb-4">
                Our learners don't just study — they level up. Track your streaks, speak aloud with real-time feedback,
                and climb the leaderboard as you grow.
              </p>
              <p className="text-base text-gray-600">
                Join other learners already on the journey — and get early access when we launch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1: Leaderboard Mockup */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 card-hover">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">🏆</span> Leaderboard
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">PersianPro92</span>
                    <span className="text-gray-600">2,540 XP</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3">
                    <span className="font-medium">FarsiFanatic</span>
                    <span className="text-gray-600">2,210 XP</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">KoobidehKing</span>
                    <span className="text-gray-600">1,980 XP</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-600">You</span>
                    <span className="text-blue-600">1,450 XP</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Streak Popup Mockup */}
              <div className="bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 card-hover text-center">
                <h3 className="text-xl font-bold mb-3 flex justify-center items-center">
                  <span className="text-2xl mr-2">🔥</span> Well Done!
                </h3>
                <p className="text-gray-700 mb-4">You've completed today's lesson!</p>
                <div className="text-4xl font-bold text-orange-500 mb-4">5-Day Streak</div>
                <div className="py-3 px-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <p className="text-gray-700 font-medium">Keep it going tomorrow!</p>
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-white text-xl font-bold opacity-80">
                  +5
                </div>
              </div>

              {/* Card 3: Pronunciation Score Mockup */}
              <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 card-hover text-center">
                <h3 className="text-xl font-bold mb-4 flex justify-center items-center">
                  <span className="text-2xl mr-2">🎤</span> Pronunciation Score
                </h3>
                <div className="text-6xl mb-6 animate-pulse">🎙️</div>
                <div className="text-2xl font-bold mb-4">Your score: 82%</div>
                <button className="bg-primary/10 hover:bg-primary/20 text-primary font-medium py-3 px-6 rounded-full transition-all duration-300 hover:scale-105">
                  Try Again!
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Badge Preview - Reduced margins */}
        <section className="py-8 px-3 sm:px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary text-center">🎖️ Badge Preview</h2>
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                <CardHeader className="pb-3 bg-primary/5">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-3">
                    <span>👨‍👩‍👧‍👦</span> Mehmooni Ready
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-base text-muted-foreground">
                    You can now introduce yourself at Persian gatherings
                  </p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline" className="bg-accent/10 text-accent text-sm">
                    Beginner
                  </Badge>
                </CardFooter>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                <CardHeader className="pb-3 bg-primary/5">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-3">
                    <span>🍚</span> Tahdig Lover
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-base text-muted-foreground">You've learned Persian food vocab</p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline" className="bg-primary/10 text-primary text-sm">
                    Cultural
                  </Badge>
                </CardFooter>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3 bg-primary/5">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-3">
                    <span>🎉</span> Nowruz Novice
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-base text-muted-foreground">You unlocked your first cultural story</p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 text-sm">
                    Advanced
                  </Badge>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Lesson Block - Removed purple emoji */}
        <section id="lesson-1" className="py-8 px-3 sm:px-4 bg-accent/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-accent text-center">
              Lesson 1 – Say Hi Like a Persian
            </h2>

            <div className="space-y-5">
              <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-xl">
                <CardHeader className="pb-3 bg-primary/5">
                  <CardTitle className="text-lg sm:text-xl text-primary">Hello / Hi</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-6">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    <div className="text-base font-medium text-muted-foreground px-2 sm:px-3 py-2 bg-gray-100 rounded">
                      English
                    </div>
                    <div className="text-base font-medium text-muted-foreground px-2 sm:px-3 py-2 bg-gray-100 rounded">
                      Finglish
                    </div>
                    <div className="text-base font-medium text-muted-foreground px-2 sm:px-3 py-2 bg-gray-100 rounded">
                      Persian
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center">
                    <div className="text-base sm:text-lg px-2 sm:px-3 py-2">Hello</div>
                    <div className="text-base sm:text-lg px-2 sm:px-3 py-2">Salaam</div>
                    <div className="text-base sm:text-lg font-persian px-2 sm:px-3 py-2 font-bold text-primary">
                      سلام
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-xl">
                <CardHeader className="pb-3 bg-primary/5">
                  <CardTitle className="text-lg sm:text-xl text-primary">How are you?</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-6">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    <div className="text-base font-medium text-muted-foreground px-2 sm:px-3 py-2 bg-gray-100 rounded">
                      English
                    </div>
                    <div className="text-base font-medium text-muted-foreground px-2 sm:px-3 py-2 bg-gray-100 rounded">
                      Finglish
                    </div>
                    <div className="text-base font-medium text-muted-foreground px-2 sm:px-3 py-2 bg-gray-100 rounded">
                      Persian
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center">
                    <div className="text-base sm:text-lg px-2 sm:px-3 py-2">How are you?</div>
                    <div className="text-base sm:text-lg px-2 sm:px-3 py-2">Chetori?</div>
                    <div className="text-base sm:text-lg font-persian px-2 sm:px-3 py-2 font-bold text-primary">
                      چطوری؟
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-accent/5 shadow-sm rounded-xl">
                <CardContent className="py-6 px-4 sm:px-6">
                  <div className="flex gap-4 items-start">
                    <span className="text-3xl">🌸</span>
                    <div>
                      <p className="font-medium text-lg mb-2">Grandma Tip:</p>
                      <p className="text-base">
                        In Iran, even strangers say salaam. It's polite <em>and</em> warm.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Mini-Game - Updated title and behavior */}
              <Card className="shadow-sm rounded-xl overflow-hidden relative">
                <CardHeader className="bg-primary/10 pb-4">
                  <CardTitle className="text-lg sm:text-xl text-primary text-center">Mini-Game</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-8">
                  <h3 className="text-lg sm:text-xl font-medium text-center mb-6">
                    How do you say "Hello" in Persian?
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {["Khoshgel", "Salam", "Merci", "Halet chetore"].map((option) => (
                      <Button
                        key={option}
                        variant={
                          miniGameAnswer === option ? (option === "Salam" ? "default" : "destructive") : "outline"
                        }
                        className={`py-6 text-lg ${miniGameAnswer === option && option === "Salam" ? "bg-green-600" : ""}`}
                        onClick={() => handleMiniGameAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {showConfetti && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="absolute top-0 left-1/4 text-4xl animate-bounce">🎉</div>
                      <div
                        className="absolute top-10 left-1/2 text-4xl animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      >
                        🎊
                      </div>
                      <div
                        className="absolute top-0 right-1/4 text-4xl animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      >
                        ✨
                      </div>
                    </div>
                  )}

                  {miniGameAnswer === "Salam" && (
                    <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                      <p className="font-medium">Nice! You just learned your first word — Salam 👋 means Hello!</p>
                    </div>
                  )}

                  {showIncorrect && (
                    <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg text-center">
                      <p className="font-medium">Incorrect. Try Again!</p>
                    </div>
                  )}

                  {miniGameAnswer === "Salam" && (
                    <div className="mt-6 flex justify-center">
                      <Button className="bg-primary hover:bg-primary/90 text-white" onClick={scrollToWaitlist}>
                        Next word →
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Coming Up Next Section */}
              <Card className="shadow-sm rounded-xl border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl text-primary flex items-center gap-3">
                    <span>🔮</span> Coming Up Next
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-2 shadow-sm flex items-center justify-center w-14 h-14 shrink-0">
                      <span className="text-2xl">🧮</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">Lesson 2: Numbers 1–10</h4>
                      <p className="text-base text-muted-foreground">Count like a Persian</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-2 shadow-sm flex items-center justify-center w-14 h-14 shrink-0">
                      <span className="text-2xl">👪</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">Lesson 3: Family Words</h4>
                      <p className="text-base text-muted-foreground">Learn to introduce your family</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-2 shadow-sm flex items-center justify-center w-14 h-14 shrink-0">
                      <span className="text-2xl">🎁</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">Bonus: Cultural Insights</h4>
                      <p className="text-base text-muted-foreground">Unlock special rewards as you progress</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="py-4">
                  <Button
                    variant="outline"
                    className="w-full justify-between group hover:bg-primary/10 py-6 text-lg"
                    onClick={scrollToWaitlist}
                  >
                    Join the Waitlist
                    <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Emotional Callout Section */}
        <section className="py-8 px-3 sm:px-4 bg-gradient-to-r from-primary/5 to-accent/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-6xl">☕</div>
            <div className="absolute top-20 right-20 text-6xl">❤️</div>
            <div className="absolute bottom-10 left-20 text-6xl">🌹</div>
            <div className="absolute bottom-20 right-10 text-6xl">👨‍👩‍👧‍👦</div>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Your Future Self Will Thank You</h2>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Whether it's to speak with your grandparents, pass it on to your kids, or finally understand those songs
                you grew up with — you're not too late. You're right on time.
              </p>

              <Button
                className="mt-6 bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-6 text-lg"
                onClick={scrollToWaitlist}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-10 px-3 sm:px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-medium mb-6 text-primary text-center">Join the Waitlist</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email"
                className="border-primary/20 focus:border-primary py-6 text-lg"
              />
              <Button className="bg-accent hover:bg-accent/90 text-white py-6 text-lg">Join</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with What is Iranopedia section */}
      <footer className="bg-gradient-to-b from-white to-green-50 pt-12 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* What is Iranopedia Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-10 text-center mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">What is Iranopedia?</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Iranopedia is your modern guide to Persian culture — from food and cities to art, history, and language.
              Built for Iranians and anyone curious to connect with Iran.
            </p>
            <a
              href="https://iranopedia.com"
              className="inline-flex items-center justify-center bg-primary/10 hover:bg-primary/15 text-primary px-6 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105"
            >
              Visit Iranopedia.com →
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 max-w-3xl mx-auto mb-8"></div>

          {/* Copyright and Links */}
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-6">
              © 2025 Iranopedia Farsi Academy — Made with ❤️ for anyone learning Farsi
            </p>

            {/* Nav Links */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                Start Learning
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                Learn Phrases
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                What Is Iranopedia?
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                Culture, Not Just Grammar
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                Privacy
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
