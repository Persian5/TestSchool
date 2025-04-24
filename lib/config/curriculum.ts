import { Module, LessonStep } from "../types";

// Define all modules, lessons, and their content
export const curriculumData: Module[] = [
  {
    id: "module1",
    title: "Module 1: Greetings",
    description: "Learn basic Farsi greetings and introductions",
    emoji: "👋",
    lessonCount: 4,
    estimatedTime: "20 minutes",
    available: true,
    lessons: [
      {
        id: "lesson1",
        title: "Basic Persian Greetings",
        description: "Learn essential greetings and how to say hello in different contexts",
        emoji: "👋",
        progress: 0,
        locked: false,
        steps: [
          {
            type: "welcome",
            title: "Basic Greetings",
            description: "Learn common Persian greetings used in everyday conversations.",
            points: 0
          },
          {
            type: "flashcard",
            points: 2,
            data: {
              front: "👋 Hello",
              back: "Salam"
            }
          },
          {
            type: "quiz",
            points: 2,
            data: {
              prompt: "What does 'Salam' mean?",
              options: ["Hello", "Goodbye", "Thank you", "You're welcome"],
              correct: 0
            }
          },
          {
            type: "flashcard",
            points: 2,
            data: {
              front: "🤔 How are you?",
              back: "Chetori"
            }
          },
          {
            type: "input",
            points: 2,
            data: {
              question: "How do you say 'How are you?' in Persian?",
              answer: "Chetori"
            }
          },
          {
            type: "flashcard",
            points: 2,
            data: {
              front: "🤗 Welcome",
              back: "Khosh Ahmadid"
            }
          },
          {
            type: "dragdrop",
            points: 2,
            data: {
              words: [
                { id: "word1", text: "Salam", slotId: "slot1" },
                { id: "word2", text: "Chetori", slotId: "slot2" }
              ],
              slots: [
                { id: "slot1", text: "Hello" },
                { id: "slot2", text: "How are you?" },
                { id: "slot3", text: "Welcome" },
                { id: "slot4", text: "Goodbye" }
              ]
            }
          },
          {
            type: "flashcard",
            points: 2,
            data: {
              front: "🚪 Goodbye",
              back: "Khodahafez"
            }
          },
          {
            type: "final",
            points: 2,
            data: {
              words: [
                { id: "salam", text: "Salam", translation: "Hello" },
                { id: "chetori", text: "Chetori", translation: "How are you?" },
                { id: "khosh_ahmadid", text: "Khosh Ahmadid", translation: "Welcome" },
                { id: "khodahafez", text: "Khodahafez", translation: "Goodbye" }
              ],
              targetWords: ["salam", "khosh_ahmadid", "chetori", "khodahafez"]
            }
          }
        ]
      },
      {
        id: "lesson2",
        title: "Basic Politeness and Essential Responses",
        description: "Master polite responses and common conversational phrases",
        emoji: "🙏",
        progress: 0,
        locked: true,
        steps: []
      },
      {
        id: "lesson3",
        title: "Introducing Yourself and Asking Questions",
        description: "Learn how to introduce yourself and ask basic questions",
        emoji: "🧑‍💼",
        progress: 0,
        locked: true,
        steps: []
      },
      {
        id: "lesson4",
        title: "Basic Greetings Continued",
        description: "Expand your greeting vocabulary with more formal and informal options",
        emoji: "💬",
        progress: 0,
        locked: true,
        steps: []
      }
    ]
  },
  {
    id: "module2",
    title: "Module 2: Numbers",
    description: "Master counting in Farsi from 1 to 100",
    emoji: "🔢",
    lessonCount: 4,
    estimatedTime: "30 minutes",
    available: false,
    lessons: []
  },
  {
    id: "module3",
    title: "Module 3: Family",
    description: "Learn family-related vocabulary and phrases",
    emoji: "👪",
    lessonCount: 3,
    estimatedTime: "25 minutes",
    available: false,
    lessons: []
  },
  {
    id: "module4",
    title: "Module 4: Food",
    description: "Explore Farsi food vocabulary and ordering phrases",
    emoji: "🍽️",
    lessonCount: 5,
    estimatedTime: "40 minutes",
    available: false,
    lessons: []
  },
  {
    id: "module5",
    title: "Module 5: Travel",
    description: "Essential phrases for traveling in Iran",
    emoji: "✈️",
    lessonCount: 3,
    estimatedTime: "30 minutes",
    available: false,
    lessons: []
  },
  {
    id: "module6",
    title: "Module 6: Culture",
    description: "Understanding Iranian customs and traditions",
    emoji: "🏺",
    lessonCount: 3,
    estimatedTime: "30 minutes",
    available: false,
    lessons: []
  }
];

// Helper functions to access curriculum data
export function getModules(): Module[] {
  return curriculumData;
}

export function getModule(moduleId: string): Module | undefined {
  return curriculumData.find(m => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string) {
  const module = getModule(moduleId);
  if (!module) return undefined;
  return module.lessons.find(l => l.id === lessonId);
}

export function getLessonSteps(moduleId: string, lessonId: string): LessonStep[] {
  const lesson = getLesson(moduleId, lessonId);
  return lesson?.steps || [];
}

// Get flashcard data for a specific lesson
export function getFlashcards(moduleId: string, lessonId: string) {
  const steps = getLessonSteps(moduleId, lessonId);
  return steps
    .filter(step => step.type === 'flashcard')
    .map(step => (step.type === 'flashcard' ? step.data : null))
    .filter(Boolean);
} 