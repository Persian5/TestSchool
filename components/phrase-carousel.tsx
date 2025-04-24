"use client"

import { useState, useEffect } from "react"

interface Phrase {
  persian: string
  english: string
  emoji: string
}

export function PhraseCarousel() {
  const phrases: Phrase[] = [
    { persian: "Salam", english: "Hello", emoji: "👋" },
    { persian: "Merci", english: "Thank you", emoji: "🙏" },
    { persian: "Dooset daram", english: "I love you", emoji: "❤️" },
    { persian: "Chetori?", english: "How are you?", emoji: "🙂" },
    { persian: "Khoobam", english: "I'm good", emoji: "😌" },
    { persian: "Esme shoma chieh?", english: "What's your name?", emoji: "🧑‍💼" },
    { persian: "Khodahafez", english: "Goodbye", emoji: "👋" },
  ]

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isPhraseFading, setIsPhraseFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPhraseFading(true)
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        setIsPhraseFading(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-8">Learn Your First Persian Phrases</h2>

      <div className="flex justify-center">
        <div
          className={`transition-opacity duration-500 ${isPhraseFading ? "opacity-0" : "opacity-100"} bg-primary/5 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-sm`}
        >
          <div className="text-5xl sm:text-6xl mb-4">{phrases[currentPhraseIndex].emoji}</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{phrases[currentPhraseIndex].persian}</div>
          <div className="text-lg sm:text-xl text-gray-600">{phrases[currentPhraseIndex].english}</div>
        </div>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {phrases.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentPhraseIndex ? "bg-primary" : "bg-gray-300"}`}
          ></div>
        ))}
      </div>
    </div>
  )
}
