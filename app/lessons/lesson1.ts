import { LessonStep } from '@/app/components/LessonRunner'

export const lesson1: LessonStep[] = [
  { type: 'welcome', points: 0, data: {} },
  
  { type: 'flashcard', points: 2, data: { front: '👋 Hello', back: 'Salam' } },
  { type: 'flashcard', points: 2, data: { front: '🤔 How are you?', back: 'Chetori' } },
  { type: 'flashcard', points: 2, data: { front: '🤗 Welcome', back: 'Khosh Ahmadid' } },
  { type: 'flashcard', points: 2, data: { front: '🚪 Goodbye', back: 'Khodahafez' } },

  { type: 'quiz', points: 5, data: {
    prompt: "Ali smiles and says 'Hello'. What's the right Persian word?",
    options: ['Salam', 'Khodahafez', 'Shab Bekheir', 'Chetori'],
    correct: 0
  }},

  { type: 'input', points: 5, data: {
    question: 'Type "How are you?" in Persian (Finglish)',
    answer: 'Chetori'
  }},

  { type: 'dragdrop', points: 3, data: {
    items: ['Salam', 'Chetori', 'Khosh Ahmadid', 'Khodahafez']
  }},

  { type: 'final', points: 20, data: {
    sentence: ['Salam', 'Khosh Ahmadid', 'Chetori', 'Khodahafez']
  }},
] 