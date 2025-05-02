import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeIntroProps {
  onStart: () => void;
  title?: string;
  description?: string;
  objectives?: string[];
}

export function WelcomeIntro({ 
  onStart,
  title = "Basic Persian Greetings",
  description = "Let's learn the essentials of greeting someone in Persian",
  objectives = [
    "Say hello and greet someone",
    "Ask how someone is doing",
    "Welcome someone",
    "Say goodbye properly"
  ]
}: WelcomeIntroProps) {
  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-primary">{title}</h1>
      <p className="text-lg mb-3 text-muted-foreground">{description}</p>
      
      {/* Combined Mission Card */}
      <div className="bg-gradient-to-br from-secondary/10 to-primary/5 rounded-xl p-5 mb-4 shadow-sm">
        {/* Ali's Mission */}
        <div className="mb-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-background rounded-full w-14 h-14 flex items-center justify-center">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <h3 className="font-bold text-xl">Let's Help Ali!</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Ali just landed in Tehran and wants to greet people the right way. You'll meet him again at the end of this lesson — let's make sure you're ready to help him when the time comes.
          </p>
        </div>
        
        {/* Objectives with emojis */}
        <div className="bg-white/60 rounded-lg p-4">
          <p className="text-md font-medium mb-2 text-center">Your mission is to get Ali ready. Help him:</p>
          <ul className="space-y-1 flex flex-col items-center">
            <li className="flex items-center gap-2">
              <span className="text-green-500">👋</span>
              <span>Say "hello" like a local</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">🤔</span>
              <span>Ask "how are you?"</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">🙏</span>
              <span>Welcome people properly</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">👋</span>
              <span>Say goodbye the right way</span>
            </li>
          </ul>
        </div>
      </div>
      
      <Button
        onClick={onStart}
        className="w-full py-5 text-lg"
      >
        Let's Start! <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
} 
