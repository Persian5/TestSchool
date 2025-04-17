"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LearnerLocation {
  flag: string
  city: string
  learners: number
  top: string
  left: string
}

export function WorldMap() {
  const learnerLocations: LearnerLocation[] = [
    { flag: "🇨🇦", city: "Toronto", learners: 483, top: "30%", left: "22%" },
    { flag: "🇺🇸", city: "Los Angeles", learners: 1214, top: "42%", left: "16%" },
    { flag: "🇬🇧", city: "London", learners: 527, top: "28%", left: "48%" },
    { flag: "🇩🇪", city: "Berlin", learners: 342, top: "30%", left: "52%" },
    { flag: "🇸🇪", city: "Stockholm", learners: 189, top: "26%", left: "53%" },
    { flag: "🇦🇺", city: "Sydney", learners: 276, top: "72%", left: "83%" },
  ]

  return (
    <div className="relative w-full max-w-6xl aspect-[2/1] mx-auto">
      {/* ✅ Background World Map */}
      <img
        src="/worldmap.png"
        alt="World Map"
        className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none"
      />

      {/* ✅ Flags */}
      <TooltipProvider>
        {learnerLocations.map((location, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button
                className="absolute text-3xl sm:text-4xl hover:scale-125 transition-transform animate-pulse hover:animate-none focus:outline-none"
                style={{ top: location.top, left: location.left }}
                aria-label={`Learners in ${location.city}`}
              >
                {location.flag}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg p-3 rounded-xl text-sm"
            >
              <p className="font-medium text-gray-800">
                {location.city} – {location.learners.toLocaleString()} learners
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
