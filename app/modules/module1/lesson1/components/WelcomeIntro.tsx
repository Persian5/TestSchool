import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface WelcomeIntroProps {
  onStart: () => void
}

export function WelcomeIntro({ onStart }: WelcomeIntroProps) {
  return (
    <div className="w-full py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">Welcome to Your First Lesson</h2>
        <p className="text-muted-foreground">Begin your Persian learning journey</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full">
        <div className="space-y-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary animate-fade-in">
            ✈️ Ali just stepped off the plane in Tehran!
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground animate-fade-in-delayed">
            It's his first day in Iran—he's excited, but a bit nervous. A friendly local approaches...
          </p>
          <Button
            size="lg"
            className="mt-4 px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            onClick={onStart}
          >
            Let's Help Ali! <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
} 