"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ModulesPage() {
  const [mounted, setMounted] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check if user is subscribed
    const subscribed = localStorage.getItem('isSubscribed') === 'true'
    setIsSubscribed(subscribed)
    
    // If not subscribed, redirect to home page
    if (!subscribed) {
      router.push('/')
    }
  }, [router])

  const modules = [
    {
      id: 1,
      title: "Module 1: Greetings",
      description: "Learn basic Farsi greetings and introductions",
      href: "/modules/module1",
      available: true
    },
    {
      id: 2,
      title: "Module 2: Numbers",
      description: "Master counting in Farsi from 1 to 100",
      href: "/modules/module2",
      available: true
    },
    {
      id: 3,
      title: "Module 3: Family",
      description: "Learn family-related vocabulary and phrases",
      href: "#",
      available: false
    },
    {
      id: 4,
      title: "Module 4: Food",
      description: "Explore Farsi food vocabulary and ordering phrases",
      href: "#",
      available: false
    },
    {
      id: 5,
      title: "Module 5: Travel",
      description: "Essential phrases for traveling in Iran",
      href: "#",
      available: false
    },
    {
      id: 6,
      title: "Module 6: Culture",
      description: "Understanding Iranian customs and traditions",
      href: "#",
      available: false
    }
  ]

  if (!mounted) {
    return null
  }

  if (!isSubscribed) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-3 sm:px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-base sm:text-lg text-primary">
            <span className="hidden sm:inline">Iranopedia Farsi Academy</span>
            <span className="sm:hidden">Iranopedia Farsi Academy</span>
          </Link>
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
            My Progress
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary mb-4">
              Choose Your Module
            </h1>
            <p className="text-xl text-muted-foreground">
              Start your Farsi learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card 
                key={module.id} 
                className={`transition-all duration-300 hover:shadow-lg ${
                  !module.available ? 'opacity-75' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl text-center">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  {module.available ? (
                    <Link href={module.href}>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                        Start Module
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                      disabled
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 Iranopedia Farsi Academy. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 