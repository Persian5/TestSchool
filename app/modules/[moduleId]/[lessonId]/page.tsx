"use client"

import Link from "next/link"
import { ChevronLeft, Star } from "lucide-react"
import { useParams } from "next/navigation"
import { getLessonSteps, getLesson, getModule } from "@/lib/config/curriculum"
import { LessonRunner } from "@/app/components/LessonRunner"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import "./styles.css"
import { useState } from "react"

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const [xp, setXp] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentView, setCurrentView] = useState('welcome');
  const [previousStates, setPreviousStates] = useState<any[]>([]);
  
  // Get data from config
  const lesson = getLesson(moduleId as string, lessonId as string);
  const module = getModule(moduleId as string);
  
  // If lesson or module isn't found, handle gracefully
  if (!lesson || !module) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  // Handle going back to the previous step
  const handleBack = () => {
    if (previousStates.length > 0) {
      const previousState = previousStates.pop()!;
      setProgress(previousState.progress);
      // Tell LessonRunner to go back to the previous step
      const lessonRunnerState = document.getElementById('lesson-runner-state');
      if (lessonRunnerState) {
        lessonRunnerState.dispatchEvent(new CustomEvent('go-back', { 
          detail: { stepIndex: previousState.currentStep } 
        }));
      }
      setPreviousStates([...previousStates]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-3 sm:px-4">
          <Link href={`/modules/${moduleId}`} className="flex items-center gap-2 font-bold text-base sm:text-lg text-primary">
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Modules</span>
            <span className="sm:hidden">Modules</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {currentView !== 'welcome' && (
        <div className="w-full bg-primary/10">
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <main className="flex-1 flex flex-col px-4 pt-4 pb-4 w-full">
        {/* Main content area top-aligned */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-start justify-start pt-4">
          {/* Always drive from config */}
          <LessonRunner 
            steps={getLessonSteps(moduleId as string, lessonId as string)} 
            xp={xp}
            onXpChange={setXp}
            progress={progress}
            onProgressChange={setProgress}
            currentView={currentView}
            onViewChange={setCurrentView}
            onSaveState={(state) => setPreviousStates(prev => [...prev, state])}
          />
        </div>
        
        {/* Back Button container - Below content */} 
        {currentView !== 'welcome' && currentView !== 'completion' && previousStates.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-4 flex justify-start">
            <Button variant="ghost" onClick={handleBack} className="text-sm flex items-center self-start">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Go Back
            </Button>
          </div>
        )}
      </main>
    </div>
  );
} 