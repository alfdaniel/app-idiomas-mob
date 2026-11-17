import type { CourseLevel, Lesson, Slide, TheoryBlock } from './types'

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion']

function below1000(n: number): string {
  const parts: string[] = []
  const h = Math.floor(n / 100)
  const r = n % 100
  if (h) parts.push(`${ONES[h]} hundred`)
  if (r) parts.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? `-${ONES[r % 10]}` : ''))
  return parts.join(' ')
}

export function intToWords(digits: string): string {
  const clean = digits.replace(/^0+(?=\d)/, '')
  if (/^0*$/.test(clean)) return 'zero'
  const groups: string[] = []
  for (let end = clean.length; end > 0; end -= 3) groups.unshift(clean.slice(Math.max(0, end - 3), end))
  const out: string[] = []
  groups.forEach((g, i) => {
    const n = Number(g)
    if (!n) return
    const scale = SCALES[groups.length - 1 - i]
    out.push(below1000(n) + (scale ? ` ${scale}` : ''))
  })
  return out.join(' ')
}

export function toWords(input: string): string {
  let s = input.replace(/,/g, '').trim()
  let neg = false
  if (s.startsWith('-')) {
    neg = true
    s = s.slice(1)
  }
  const [i, d] = s.split('.')
  let words = intToWords(i || '0')
  if (d) words += ` point ${d.split('').map(c => ONES[Number(c)]).join(' ')}`
  return (neg ? 'minus ' : '') + words
}

export const digitWords = (s: string) => s.replace(/\D/g, '').split('').map(c => ONES[Number(c)]).join(' ')

export function toMoney(input: string): string {
  const [d, c = '0'] = input.replace(/[$,]/g, '').split('.')
  const dollars = Number(d)
  const cents = Number(c.padEnd(2, '0').slice(0, 2))
  const parts: string[] = []
  if (dollars || !cents) parts.push(`${intToWords(String(dollars))} ${dollars === 1 ? 'dollar' : 'dollars'}`)
  if (cents) parts.push(`${intToWords(String(cents))} ${cents === 1 ? 'cent' : 'cents'}`)
  return parts.join(' and ')
}

type Mode = 'number' | 'digits' | 'money'
const say = (n: string, mode: Mode) => (mode === 'digits' ? digitWords(n) : mode === 'money' ? toMoney(n) : toWords(n))

function variants(num: string): string[] {
  const idxs = num.split('').map((c, i) => (/\d/.test(c) ? i : -1)).filter(i => i >= 0)
  const found: string[] = []
  const push = (chars: string[]) => {
    const v = chars.join('')
    const leadingZero = /^0\d/.test(v.replace(/,/g, '')) && !/^0\./.test(num)
    if (v !== num && !leadingZero && !found.includes(v)) found.push(v)
  }
  for (let j = 0; j < idxs.length - 1; j++) {
    const c = num.split('')
    if (c[idxs[j]] !== c[idxs[j + 1]]) {
      ;[c[idxs[j]], c[idxs[j + 1]]] = [c[idxs[j + 1]], c[idxs[j]]]
      push(c)
      break
    }
  }
  const mid = idxs[Math.floor(idxs.length / 2)]
  const m = num.split('')
  m[mid] = String((Number(m[mid]) + 1) % 10)
  push(m)
  const last = num.split('')
  last[idxs[idxs.length - 1]] = String((Number(last[idxs[idxs.length - 1]]) + 3) % 10)
  push(last)
  const first = num.split('')
  first[idxs[0]] = String((Number(first[idxs[0]]) + 2) % 10 || 1)
  push(first)
  return found
}

const hash = (s: string) => s.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
const rotate = <T,>(arr: T[], by: number) => arr.map((_, i) => arr[(i + by) % arr.length])

function mcSlide(num: string, mode: Mode): Slide {
  const correct = say(num, mode)
  const wrong = variants(num).map(v => say(v, mode)).filter(w => w !== correct).slice(0, 2)
  const opts = rotate([correct, ...wrong], hash(num))
  return {
    type: 'multiple_choice',
    question:
      mode === 'digits' ? 'Como se lê este TELEFONE em inglês?' : mode === 'money' ? 'Como se lê este PREÇO em inglês?' : 'Como se lê este NÚMERO em inglês?',
    picture: num,
    options: opts.map(t => ({ text: t, correct: t === correct, explanation: `${num} = ${correct}` })),
  }
}

function listenSlide(num: string, mode: Mode): Slide {
  const correct = say(num, mode)
  const vs = variants(num).filter(v => say(v, mode) !== correct).slice(0, 2)
  const opts = rotate([num, ...vs], hash(num) + 1)
  return { type: 'listen', text: correct, options: opts.map(n => ({ emoji: n, text: '', correct: n === num })) }
}

function buildSlide(num: string, mode: Mode): Slide {
  const correct = say(num, mode)
  const have = new Set(correct.split(' '))
  const extras = variants(num)
    .flatMap(v => say(v, mode).split(' '))
    .filter((w, i, a) => !have.has(w) && a.indexOf(w) === i)
    .slice(0, 2)
  const words = [...correct.split(' '), ...(extras.length ? extras : ['and'])]
  return { type: 'build', prompt: `Escreva por extenso: ${num}`, answer: correct, words }
}

function numberSlides(nums: string[], mode: Mode = 'number'): Slide[] {
  return nums.map((n, i) => (i % 3 === 0 ? mcSlide(n, mode) : i % 3 === 1 ? buildSlide(n, mode) : listenSlide(n, mode)))
}

const done: Slide = { type: 'completion', emoji: '🎉', title: 'Muito bem!', message: 'Você já sabe ler esses números.' }

export function numLesson(
  id: string,
  title: string,
  emoji: string,
  blocks: TheoryBlock[],
  nums: string[],
  mode: Mode = 'number',
): Lesson {
  const rows = nums.map(n => [n, say(n, mode)])
  return {
    id,
    title,
    emoji,
    duration: '4 min',
    color: 'from-amber-500 to-orange-600',
    slides: [
      {
        type: 'theory',
        title,
        emoji,
        blocks: [
          ...blocks,
          { kind: 'table', headers: ['Número', 'Em inglês'], rows, highlightCol: 1 },
          { kind: 'tip', content: 'Toque nas palavras em inglês para ouvir a pronúncia.' },
        ],
      },
      ...numberSlides(nums, mode),
      done,
    ],
  }
}

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function randomNumbers(): string[] {
  const dec = `${rnd(1, 999)}.${String(rnd(1, 999)).padStart(rnd(2, 3), '0')}`
  return [
    String(rnd(21, 99)),
    String(rnd(100, 999)),
    fmt(rnd(1000, 99999)),
    fmt(rnd(100000, 9999999)),
    fmt(rnd(10000000, 999999999)),
    dec,
  ]
}

function randomLesson(): Lesson {
  const theory: Slide = {
    type: 'theory',
    title: 'Treino livre',
    emoji: '🎲',
    blocks: [
      { kind: 'text', content: 'Aqui os números são **sorteados** a cada vez. Pode repetir quantas vezes quiser: nunca é o mesmo treino.' },
      { kind: 'tip', content: 'Lembre da regra: separe em grupos de 3 dígitos, da direita para a esquerda.' },
    ],
  }
  return {
    id: 'n-8',
    title: 'Treino livre',
    emoji: '🎲',
    duration: '3 min',
    color: 'from-amber-500 to-orange-600',
    get slides(): Slide[] {
      return [theory, ...numberSlides(randomNumbers()), done]
    },
  }
}

export const levelE: CourseLevel = {
  level: 105,
  optional: true,
  title: 'Números sem limite',
  description: 'Aprenda a regra para ler qualquer número, de 21 até bilhões e decimais.',
  emoji: '🔢',
  gradient: 'from-amber-500 to-orange-600',
  lessons: [
    numLesson(
      'n-1',
      'Números de 21 a 99',
      '🔢',
      [
        { kind: 'text', content: 'De 21 a 99, junte a dezena e a unidade com **hífen**: 20 + 1 = **twenty-one**.' },
        { kind: 'alert', content: 'Atenção: **forty** (40) não tem “u”. E não confunda -teen (13 a 19) com -ty (30 a 90): thirteen ≠ thirty.' },
      ],
      ['21', '35', '42', '58', '67', '99'],
    ),
    numLesson(
      'n-2',
      'Centenas: 100 a 999',
      '💯',
      [
        { kind: 'text', content: 'Diga o número e depois **hundred**: 300 = three hundred. Some o resto: 305 = three hundred five.' },
        { kind: 'alert', content: 'No inglês americano não se diz “and”: 102 = one hundred two. No britânico: one hundred **and** two. Os dois estão certos.' },
        { kind: 'tip', content: 'Hundred nunca vai para o plural: two hundred (não “two hundreds”).' },
      ],
      ['102', '250', '305', '418', '777', '999'],
    ),
    numLesson(
      'n-3',
      'Milhares',
      '🏔️',
      [
        { kind: 'text', content: 'Mil é **thousand**. Diga o número e depois thousand: 45,000 = forty-five thousand.' },
        { kind: 'alert', content: 'Em inglês a **vírgula** separa os milhares: 1,000. Em português usamos ponto: 1.000.' },
        { kind: 'tip', content: 'Thousand também não vai para o plural: two thousand.' },
      ],
      ['1,000', '2,500', '10,000', '45,000', '100,000', '999,999'],
    ),
    numLesson(
      'n-4',
      'Milhões e bilhões',
      '🚀',
      [
        { kind: 'text', content: 'Milhão é **million**, bilhão é **billion**. Segue a mesma ideia: diga o número e depois a palavra.' },
        { kind: 'tip', content: '1,792,799 = one million seven hundred ninety-two thousand seven hundred ninety-nine.' },
      ],
      ['1,000,000', '2,500,000', '1,792,799', '35,000,000', '1,000,000,000', '7,250,000,000'],
    ),
    numLesson(
      'n-5',
      'Como ler qualquer número',
      '🧠',
      [
        { kind: 'text', content: 'Truque: separe o número em **grupos de 3 dígitos**, da direita para a esquerda, e leia cada grupo com o seu nome.' },
        {
          kind: 'table',
          headers: ['Grupo', 'Nome', 'Valor'],
          rows: [
            ['1 | 792 | 799', 'million · thousand', 'milhão · mil'],
            ['thousand', 'mil', '1,000'],
            ['million', 'milhão', '1,000,000'],
            ['billion', 'bilhão', '1,000,000,000'],
            ['trillion', 'trilhão', '1,000,000,000,000'],
          ],
          highlightCol: 0,
        },
        { kind: 'alert', content: 'Grupo com 000 não é lido: 208,040 = two hundred eight thousand forty.' },
      ],
      ['3,450', '12,305', '208,040', '5,006,700', '90,100,200', '1,792,799'],
    ),
    numLesson(
      'n-6',
      'Decimais, vírgula e ponto',
      '🔣',
      [
        { kind: 'text', content: 'Em inglês, a vírgula decimal é um **ponto** e se lê **point**. Depois dele, cada dígito é lido separado: 3.14 = three point one four.' },
        { kind: 'alert', content: 'Cuidado: em português escrevemos 1.000,50 (ponto nos milhares, vírgula no decimal). Em inglês é o contrário: **1,000.50**.' },
        { kind: 'tip', content: '0.5 pode ser “zero point five” ou só “point five”.' },
      ],
      ['1.5', '0.25', '3.14', '10.05', '1,000.50', '1,339,923.9292'],
    ),
    numLesson(
      'n-7',
      'Telefone e códigos',
      '📞',
      [
        { kind: 'text', content: 'Telefones e códigos são lidos **dígito por dígito**: 555-0102 = five five five, zero one zero two.' },
        { kind: 'alert', content: 'O zero pode ser “zero” ou “oh” (como a letra O). Os dois aparecem em telefones.' },
      ],
      ['555-0102', '911', '407-3318', '800-1234', '212-5550', '305-9988'],
      'digits',
    ),
    randomLesson(),
  ],
}
