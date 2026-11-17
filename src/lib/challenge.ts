import type { Lesson } from '../data/course/types'
import { shuffle } from './exercises'

export interface Round {
  prompt: string
  picture?: string
  speak?: string
  options: string[]
  correct: number
}

export interface ChallengeResult {
  correct: number
  total: number
  bestCombo: number
  shields: number
  calm: boolean
}

export interface Pair {
  en: string
  pt: string
  emoji?: string
}

export interface Statement {
  text: string
  truth: boolean
  fix: string
}

export interface ChatRound {
  npc: string
  speak?: string
  ask: string
  options: string[]
  correct: number
}

export type Mode = 'fly' | 'chat' | 'meteor' | 'memory' | 'scramble' | 'dictation' | 'tf' | 'boss'

export const MODES: Record<Mode, { icon: string; title: string; desc: string }> = {
  fly: { icon: '🚀', title: 'Voo relâmpago', desc: 'Toque na faixa do planeta certo.' },
  chat: { icon: '💬', title: 'Papo de etezinhos', desc: 'Converse, responda e traduza.' },
  meteor: { icon: '☄️', title: 'Chuva de meteoros', desc: 'Toque só nos meteoros certos.' },
  memory: { icon: '🧠', title: 'Memória estelar', desc: 'Ache os pares antes do tempo.' },
  scramble: { icon: '🔤', title: 'Letras embaralhadas', desc: 'Monte a palavra letra por letra.' },
  dictation: { icon: '🎧', title: 'Ditado espacial', desc: 'Ouça e monte a palavra.' },
  tf: { icon: '✅', title: 'Verdadeiro ou falso', desc: 'Deslize: certo ou errado?' },
  boss: { icon: '👾', title: 'Chefe da galáxia', desc: 'Acerte para atirar no chefe.' },
}

export interface GameData {
  rounds: Round[]
  pairs: Pair[]
  meteorPairs: Pair[]
  memoryPairs: Pair[]
  words: Pair[]
  statements: Statement[]
  chat: ChatRound[]
  modes: Mode[]
}

const BE = ['am', 'is', 'are', 'was', 'were']
const ART = ['a', 'an', 'the']
const NEG = ["isn't", "aren't", "wasn't", "weren't", 'am not']

function make(prompt: string, right: string, wrongs: string[], extra: Partial<Round> = {}): Round | null {
  const unique = [right, ...wrongs.filter((w, i, a) => w && w !== right && a.indexOf(w) === i)].slice(0, 3)
  if (unique.length < 3) return null
  const options = shuffle(unique)
  return { prompt, ...extra, options, correct: options.indexOf(right) }
}

const EXTRA: Record<string, [string, string, string[]][]> = {
  '1-1': [
    ['Como se diz “Eu” em inglês?', 'I', ['You', 'We']],
    ['Como se diz “Ela” em inglês?', 'She', ['He', 'It']],
    ['Como se diz “Nós” em inglês?', 'We', ['They', 'You']],
    ['Como se diz “Eles / Elas” em inglês?', 'They', ['We', 'He']],
    ['Como se diz “Isso” (um objeto) em inglês?', 'It', ['He', 'She']],
    ['Como se diz “Você” em inglês?', 'You', ['I', 'They']],
    ['Como se diz “Ele” em inglês?', 'He', ['She', 'It']],
  ],
  '1-4': [
    ['She ___ at home. (Ela não está em casa)', "isn't", ["aren't", 'am not']],
    ['I ___ tired. (Eu não estou cansado)', 'am not', ["isn't", "aren't"]],
    ['They ___ ready. (Eles não estão prontos)', "aren't", ["isn't", 'am not']],
    ['It ___ cold today. (Não está frio hoje)', "isn't", ["aren't", 'am not']],
    ['We ___ late. (Nós não estamos atrasados)', "aren't", ["isn't", 'am not']],
    ['He ___ a doctor. (Ele não é médico)', "isn't", ["aren't", 'am not']],
  ],
  '1-6': [
    ['I ___ happy yesterday. (Eu estava feliz ontem)', 'was', ['were', 'am']],
    ['They ___ at school. (Eles estavam na escola)', 'were', ['was', 'is']],
    ['She ___ tired last night. (Ela estava cansada)', 'was', ['were', 'are']],
    ['We ___ late yesterday. (Nós estávamos atrasados)', 'were', ['was', 'are']],
    ['It ___ hot last summer. (Estava quente)', 'was', ['were', 'is']],
    ['You ___ right! (Você estava certo)', 'were', ['was', 'is']],
  ],
  '2-2': [
    ['___ is my phone. (aqui, perto de mim)', 'This', ['That', 'These']],
    ['___ are my keys. (aqui, perto, plural)', 'These', ['Those', 'This']],
    ['___ car over there is red. (lá longe)', 'That', ['This', 'These']],
    ['___ stars in the sky are beautiful. (lá longe, plural)', 'Those', ['These', 'That']],
    ['___ book here is good. (aqui, perto)', 'This', ['Those', 'That']],
    ['___ shoes over there are cheap. (lá longe, plural)', 'Those', ['These', 'This']],
  ],
}

export function buildRounds(lesson: Lesson, max = 8): Round[] {
  const rounds: Round[] = []
  for (const [q, right, wrongs] of EXTRA[lesson.id] ?? []) {
    const r = make(q, right, wrongs)
    if (r) rounds.push(r)
  }
  const blanks = lesson.slides.flatMap(s => (s.type === 'fill_blank' ? [s.answers[0]] : []))

  for (const s of lesson.slides) {
    let r: Round | null = null
    if (s.type === 'multiple_choice') {
      const right = s.options.find(o => o.correct)
      if (right) r = make(s.question, right.text, s.options.filter(o => !o.correct).map(o => o.text), { picture: s.picture })
    } else if (s.type === 'listen') {
      const label = (o: { emoji: string; text: string }) => (o.text ? `${o.emoji} ${o.text}` : o.emoji)
      const right = s.options.find(o => o.correct)
      if (right) r = make('Ouça e escolha', label(right), s.options.filter(o => !o.correct).map(label), { speak: s.text })
    } else if (s.type === 'fill_blank') {
      const right = s.answers[0]
      const set = [BE, ART, NEG].find(g => g.includes(right.toLowerCase()))
      r = make(`${s.before} ___ ${s.after}`.replace(/\s+/g, ' ').trim(), right, [...blanks.filter(b => b !== right), ...(set ?? [])])
    } else if (s.type === 'match' && s.pairs.length >= 3) {
      for (const p of s.pairs) {
        const m = make(`Qual combina com “${p.right}”?`, p.left, s.pairs.filter(q => q !== p).map(q => q.left))
        if (m) rounds.push(m)
      }
    }
    if (r) rounds.push(r)
  }

  const seen = new Set<string>()
  return shuffle(
    rounds.filter(r => {
      const key = r.prompt + r.options.join('|')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }),
  ).slice(0, max)
}

export const MIN_ROUNDS = 4

export function pairsOf(lesson: Lesson): Pair[] {
  const out: Pair[] = []
  for (const s of lesson.slides) {
    if (s.type === 'theory') {
      for (const b of s.blocks) {
        if (b.kind !== 'table') continue
        if (b.headers[0] === 'Figura' && b.headers.length === 3) b.rows.forEach(r => out.push({ emoji: r[0], en: r[1], pt: r[2] }))
        else if (b.headers[0] === 'Número' && b.headers.length === 2) b.rows.forEach(r => out.push({ en: r[1], pt: r[0] }))
      }
    }
    if (s.type === 'match') s.pairs.forEach(p => out.push({ en: p.left, pt: p.right }))
  }
  const seen = new Set<string>()
  return out.filter(p => {
    const k = p.en.toLowerCase()
    if (!p.en || !p.pt || seen.has(k)) return false
    seen.add(k)
    return true
  })
}

const QA: [string, string][] = [
  ['hello', 'Hi! Nice to see you.'],
  ['good morning mom', 'Good morning, sweetie!'],
  ['good morning', 'Good morning! How are you?'],
  ['good night', 'Good night! Sleep well.'],
  ['thank you', "You're welcome!"],
  ['sorry', "It's okay, no problem."],
  ['how are you', 'I am fine, thank you.'],
  ['nice to meet you', 'Nice to meet you too.'],
  ['my name is', 'Nice to meet you!'],
  ['excuse me', 'Yes? How can I help you?'],
  ['how much is it', 'It is five dollars.'],
  ['what time is it', 'It is three o’clock.'],
  ['what day is it', 'Today is Monday.'],
  ['do you take cash', 'Yes, we do.'],
  ['can i have the receipt', 'Sure, here you are.'],
  ['keep the change', 'Thank you very much!'],
  ['i am hungry', "Let's eat something!"],
  ['i am tired', 'You should rest.'],
  ['i am happy', 'That is great!'],
  ['i want water', 'Here is your water.'],
  ['i want coffee', 'One coffee, coming up!'],
  ['i like pizza', 'Me too! Pizza is great.'],
  ['i like music', 'What kind of music?'],
  ['i am late', 'Hurry up!'],
]

const isQuestion = (s: string) => /^(how|what|where|when|who|do|does|can|is|are)\b/i.test(s.trim())
const clean = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, '').trim()

function chatOf(pairs: Pair[], rounds: Round[]): ChatRound[] {
  const out: ChatRound[] = []
  const usable = pairs.filter(p => p.en.length <= 40 && p.pt.length <= 40)
  const answers = QA.map(q => q[1])
  usable.forEach((p, i) => {
    const qa = QA.find(([k]) => clean(p.en).startsWith(k))
    const others = usable.filter(o => o !== p)
    if (qa && i % 3 !== 2) {
      const line = isQuestion(p.en) ? `${p.en}?` : `${p.en}!`
      const opts = shuffle([qa[1], ...shuffle(answers.filter(a => a !== qa[1])).slice(0, 2)])
      out.push({ npc: line, speak: line, ask: 'Responda a ele', options: opts, correct: opts.indexOf(qa[1]) })
    } else if (others.length >= 2 && i % 2 === 0) {
      const opts = shuffle([p.pt, ...shuffle(others).slice(0, 2).map(o => o.pt)])
      out.push({ npc: p.en, speak: p.en, ask: 'O que ele disse?', options: opts, correct: opts.indexOf(p.pt) })
    } else if (others.length >= 2) {
      const opts = shuffle([p.en, ...shuffle(others).slice(0, 2).map(o => o.en)])
      out.push({ npc: `How do you say “${p.pt}”?`, ask: 'Responda em inglês', options: opts, correct: opts.indexOf(p.en) })
    }
  })
  if (out.length < 4) {
    rounds.forEach(r => out.push({ npc: r.prompt, speak: r.speak, ask: 'Escolha a resposta', options: r.options, correct: r.correct }))
  }
  return shuffle(out).slice(0, 8)
}

function statementsOf(pairs: Pair[], rounds: Round[]): Statement[] {
  const out: Statement[] = []
  const usable = pairs.filter(p => p.en.length <= 30 && p.pt.length <= 30)
  if (usable.length >= 4) {
    shuffle(usable).forEach(p => {
      const fix = `“${p.en}” = “${p.pt}”`
      const q = shuffle(usable.filter(o => o !== p))[0]
      out.push({ text: `“${p.en}” significa “${p.pt}”`, truth: true, fix })
      out.push({ text: `“${p.en}” significa “${q.pt}”`, truth: false, fix })
    })
  } else {
    rounds.forEach((r, i) => {
      const right = r.options[r.correct]
      const wrong = r.options.find((_, j) => j !== r.correct) ?? right
      const fix = `${r.prompt} → ${right}`
      out.push(i % 2 === 0 ? { text: `${r.prompt} → ${right}`, truth: true, fix } : { text: `${r.prompt} → ${wrong}`, truth: false, fix })
    })
  }
  return shuffle(out).slice(0, 10)
}

export function buildGame(lesson: Lesson): GameData {
  const rounds = buildRounds(lesson)
  const pairs = pairsOf(lesson)
  const meteorPairs = pairs.filter(p => Math.min(p.en.length, p.pt.length) <= 14 && Math.max(p.en.length, p.pt.length) <= 44)
  const memoryPairs = pairs.filter(p => p.en.length <= 22 && p.pt.length <= 22)
  const words = pairs.filter(p => /^[A-Za-z]{3,9}$/.test(p.en))
  const statements = statementsOf(pairs, rounds)
  const chat = chatOf(pairs, rounds)
  const modes: Mode[] = []
  if (rounds.length >= MIN_ROUNDS) modes.push('fly')
  if (chat.length >= 4) modes.push('chat')
  if (meteorPairs.length >= 4) modes.push('meteor')
  if (memoryPairs.length >= 4) modes.push('memory')
  if (words.length >= 4) modes.push('scramble', 'dictation')
  if (statements.length >= 6) modes.push('tf')
  if (rounds.length >= MIN_ROUNDS) modes.push('boss')
  return { rounds, pairs, meteorPairs, memoryPairs, words, statements, chat, modes }
}

export function suggestMode(data: GameData): Mode {
  return shuffle(data.modes)[0] ?? 'fly'
}
