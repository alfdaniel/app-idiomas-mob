export type SlideType = 'theory' | 'multiple_choice' | 'fill_blank' | 'match' | 'completion' | 'listen' | 'build'

export interface TableBlock {
  kind: 'table'
  headers: string[]
  rows: string[][]
  highlightCol?: number
}

export interface TextBlock {
  kind: 'text'
  content: string
}

export interface ExamplesBlock {
  kind: 'examples'
  groups: { label: string; emoji: string; items: string[] }[]
}

export interface AlertBlock {
  kind: 'alert'
  content: string
}

export interface TipBlock {
  kind: 'tip'
  content: string
}

export type TheoryBlock = TableBlock | TextBlock | ExamplesBlock | AlertBlock | TipBlock

export interface TheorySlide {
  type: 'theory'
  title: string
  emoji: string
  blocks: TheoryBlock[]
}

export interface MCOption {
  text: string
  correct: boolean
  explanation: string
}

export interface MultipleChoiceSlide {
  type: 'multiple_choice'
  question: string
  picture?: string
  context?: string
  options: MCOption[]
}

export interface FillBlankSlide {
  type: 'fill_blank'
  before: string
  after: string
  answers: string[]
  hint?: string
  context?: string
}

export interface MatchPair {
  left: string
  right: string
}

export interface MatchSlide {
  type: 'match'
  instruction: string
  pairs: MatchPair[]
}

export interface CompletionSlide {
  type: 'completion'
  emoji: string
  title: string
  message: string
}

export interface ListenSlide {
  type: 'listen'
  text: string
  options: { emoji: string; text: string; correct: boolean }[]
}

export interface BuildSlide {
  type: 'build'
  prompt: string
  answer: string
  words: string[]
}

export type Slide = TheorySlide | MultipleChoiceSlide | FillBlankSlide | MatchSlide | CompletionSlide | ListenSlide | BuildSlide

export interface Lesson {
  id: string
  title: string
  emoji: string
  duration: string
  color: string
  slides: Slide[]
}

export interface CourseLevel {
  level: number
  optional?: boolean
  title: string
  description: string
  emoji: string
  gradient: string
  lessons: Lesson[]
}

export interface LessonProgress {
  completedAt: string
  score: number
  total: number
}

export type LevelProgress = Record<string, LessonProgress>
export type CourseProgress = Record<string, LevelProgress>
