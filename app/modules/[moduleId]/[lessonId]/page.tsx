"use client"

import Link from "next/link"
import { ChevronLeft, Star } from "lucide-react"
import { useParams } from "next/navigation"
import { getLessonSteps, getLesson, getModule } from "@/lib/config/curriculum"
import { LessonRunner } from "@/app/components/LessonRunner"
import "./styles.css"

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  
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
              <span className="text-sm font-medium">XP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 pt-4 pb-4 w-full">
        {/* Main content area top-aligned */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-start justify-start pt-4">
          {/* Always drive from config */}
          <LessonRunner steps={getLessonSteps(moduleId as string, lessonId as string)} />
        </div>
      </main>
    </div>
  );
} 