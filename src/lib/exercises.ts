import { allLevels } from '../data/course/index'
import type { Lesson, Slide, TheorySlide } from '../data/course/types'

export type Exercise =
  | { kind: 'choice'; prompt: string; picture?: string; context?: string; options: { text: string; correct: boolean; explanation: string }[] }
  | { kind: 'blank'; before: string; after: string; answers: string[]; hint?: string; context?: string }
  | { kind: 'match'; prompt: string; pairs: { left: string; right: string }[] }
  | { kind: 'build'; prompt: string; answer: string; words: string[] }
  | { kind: 'listen'; text: string; options: { emoji: string; text: string; correct: boolean }[] }

export interface CheckResult {
  correct: boolean
  answer?: string
  explanation?: string
}

export interface Skill {
  id: string
  unit: number
  lessonId: string
  index: number
  title: string
  emoji: string
}

export interface Unit {
  level: number
  optional: boolean
  label: string
  title: string
  emoji: string
  description: string
  skills: Skill[]
}

export const skillId = (unit: number, lessonId: string) => `${unit}:${lessonId}`

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function normalize(s: string) {
  return s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim()
}

function fromSlide(slide: Slide): Exercise[] {
  if (slide.type === 'multiple_choice') {
    return [{ kind: 'choice', prompt: slide.question, picture: slide.picture, context: slide.context, options: slide.options }]
  }
  if (slide.type === 'fill_blank') {
    return [{ kind: 'blank', before: slide.before, after: slide.after, answers: slide.answers, hint: slide.hint, context: slide.context }]
  }
  if (slide.type === 'build') {
    return [{ kind: 'build', prompt: slide.prompt, answer: slide.answer, words: slide.words }]
  }
  if (slide.type === 'listen') {
    return [{ kind: 'listen', text: slide.text, options: slide.options }]
  }
  if (slide.type === 'match') {
    const out: Exercise[] = [{ kind: 'match', prompt: slide.instruction, pairs: slide.pairs }]
    for (const p of slide.pairs) {
      if (p.left.trim().split(/\s+/).length >= 3 && p.right.trim().split(/\s+/).length >= 2) {
        const clean = p.left.replace(/[.!?]+$/, '')
        out.push({ kind: 'build', prompt: p.right, answer: clean, words: clean.split(/\s+/) })
      }
    }
    return out
  }
  return []
}

export function buildLessonExercises(lesson: Lesson, max = 10): Exercise[] {
  const all = lesson.slides.flatMap(fromSlide)
  const builds = all.filter(e => e.kind === 'build').slice(0, 2)
  const base = all.filter(e => e.kind === 'choice' || e.kind === 'blank' || e.kind === 'listen')
  const matches = all.filter(e => e.kind === 'match').slice(0, 1)
  const quota = Math.max(max - builds.length - matches.length, 1)
  const main = base.slice(0, quota)
  const extras = [...matches, ...builds]
  const merged: Exercise[] = []
  while (main.length || extras.length) {
    if (main.length) merged.push(main.shift()!)
    if (main.length) merged.push(main.shift()!)
    if (extras.length) merged.push(extras.shift()!)
  }
  return merged.slice(0, max)
}

export function getUnits(): Unit[] {
  return allLevels.map(l => ({
    level: l.level,
    optional: !!l.optional,
    description: l.description,
    label: l.level >= 100 ? String.fromCharCode(64 + l.level - 100) : String(l.level).padStart(2, '0'),
    title: l.title,
    emoji: l.emoji,
    skills: l.lessons.map((ls, i) => ({
      id: skillId(l.level, ls.id),
      unit: l.level,
      lessonId: ls.id,
      index: i,
      title: ls.title,
      emoji: ls.emoji,
    })),
  }))
}

export function findLesson(unit: number, lessonId: string): Lesson | undefined {
  return allLevels.find(l => l.level === unit)?.lessons.find(l => l.id === lessonId)
}

export function getTheorySlides(lesson: Lesson, max = 4): TheorySlide[] {
  return lesson.slides.filter((s): s is TheorySlide => s.type === 'theory').slice(0, max)
}

export function getHint(ex: Exercise): string | null {
  if (ex.kind === 'choice') {
    const right = ex.options.find(o => o.correct)
    return right ? `A resposta começa com “${right.text.slice(0, 1)}”.` : null
  }
  if (ex.kind === 'blank') return ex.hint ?? `A resposta começa com “${ex.answers[0].slice(0, 1)}”.`
  if (ex.kind === 'build') return `A frase começa com “${ex.answer.split(' ')[0]}”.`
  if (ex.kind === 'listen') return `A palavra é “${ex.text}”.`
  return null
}
