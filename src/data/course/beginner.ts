import type { CourseLevel, Lesson, Slide } from './types'

export interface Card {
  emoji: string
  en: string
  pt: string
}

const rotate = <T,>(arr: T[], by: number) => arr.map((_, i) => arr[(i + by) % arr.length])

function others(cards: Card[], correct: Card, n: number) {
  const rest = cards.filter(c => c !== correct)
  return rotate(rest, cards.indexOf(correct)).slice(0, n)
}

function listen(cards: Card[], i: number): Slide {
  const c = cards[i % cards.length]
  const opts = [c, ...others(cards, c, 2)]
  const ordered = rotate(opts, i + 1)
  return {
    type: 'listen',
    text: c.en,
    options: ordered.map(o => ({ emoji: o.emoji, text: o.en, correct: o === c })),
  }
}

const ASK: Record<string, string> = {
  'a-2': 'Qual é o nome deste NÚMERO em inglês?',
  'a-3': 'Qual é o nome deste NÚMERO em inglês?',
  'a-4': 'Qual é o nome desta COR em inglês?',
  'b-2': 'Que ALIMENTO ou BEBIDA é este? Diga em inglês.',
  'b-3': 'Qual é o nome deste OBJETO DA CASA em inglês?',
  'b-4': 'Qual é o nome deste ANIMAL em inglês?',
  'd-1': 'Qual é o nome deste NÚMERO em inglês?',
  'd-2': 'Qual é o nome deste NÚMERO em inglês?',
  'd-9': 'Qual é o nome deste ORDINAL em inglês?',
  'd-10': 'Qual é o nome deste ORDINAL em inglês?',
  'd-13': 'Que HORAS são? Diga em inglês.',
  'd-14': 'Que HORAS são? Diga em inglês.',
}

function pictureChoice(cards: Card[], i: number, ask: string): Slide {
  const c = cards[i % cards.length]
  const opts = rotate([c, ...others(cards, c, 2)], i + 2)
  return {
    type: 'multiple_choice',
    question: ask,
    picture: c.emoji,
    options: opts.map(o => ({ text: o.en, correct: o === c, explanation: `${c.emoji} ${c.en} = ${c.pt}` })),
  }
}

function ptToEn(cards: Card[], i: number): Slide {
  const c = cards[i % cards.length]
  const opts = rotate([c, ...others(cards, c, 2)], i)
  return {
    type: 'multiple_choice',
    question: `Como se diz “${c.pt}” em inglês?`,
    options: opts.map(o => ({ text: o.en, correct: o === c, explanation: `${c.pt} = ${c.en}` })),
  }
}

const NON_VISUAL = new Set([
  'a-1', 'a-5', 'b-1', 'b-5', 'c-1', 'c-2', 'c-3', 'c-4',
  'd-3', 'd-4', 'd-5', 'd-6', 'd-7', 'd-8', 'd-11', 'd-12', 'd-15',
  'm-1', 'm-2', 'dt-1', 'dt-2', 'h-1',
])

export function lesson(id: string, title: string, emoji: string, intro: string, cards: Card[]): Lesson {
  const visual = !NON_VISUAL.has(id)
  const slides: Slide[] = [
    {
      type: 'theory',
      title,
      emoji,
      blocks: [
        { kind: 'text', content: intro },
        {
          kind: 'table',
          headers: ['Figura', 'Inglês', 'Português'],
          rows: cards.map(c => [c.emoji, c.en, c.pt]),
          highlightCol: 1,
        },
        { kind: 'tip', content: 'Toque nas palavras em inglês para ouvir a pronúncia.' },
      ],
    },
    listen(cards, 0),
    visual ? pictureChoice(cards, 1, ASK[id]) : ptToEn(cards, 1),
    { type: 'match', instruction: 'Conecte o inglês ao português:', pairs: cards.slice(0, 4).map(c => ({ left: c.en, right: c.pt })) },
    listen(cards, 2),
    ptToEn(cards, 3),
    cards.length > 4 ? (visual ? pictureChoice(cards, 4, ASK[id]) : ptToEn(cards, 4)) : listen(cards, 3),
    { type: 'completion', emoji: '🎉', title: 'Muito bem!', message: 'Você aprendeu palavras novas.' },
  ]
  return { id, title, emoji, duration: '3 min', color: 'from-indigo-500 to-violet-600', slides }
}

export const levelA: CourseLevel = {
  level: 101,
  title: 'Primeiras palavras',
  description: 'Cumprimentos, números e cores. Só tocar e ouvir.',
  emoji: '👋',
  gradient: 'from-indigo-500 to-violet-600',
  lessons: [
    lesson('a-1', 'Olá!', '👋', 'Estas são as palavras mais usadas para cumprimentar alguém.', [
      { emoji: '👋', en: 'Hello', pt: 'Olá' },
      { emoji: '☀️', en: 'Good morning', pt: 'Bom dia' },
      { emoji: '🌙', en: 'Good night', pt: 'Boa noite' },
      { emoji: '🙏', en: 'Thank you', pt: 'Obrigado' },
      { emoji: '😔', en: 'Sorry', pt: 'Desculpe' },
    ]),
    lesson('a-2', 'Números de 1 a 5', '🔢', 'Vamos contar até cinco.', [
      { emoji: '1️⃣', en: 'One', pt: 'Um' },
      { emoji: '2️⃣', en: 'Two', pt: 'Dois' },
      { emoji: '3️⃣', en: 'Three', pt: 'Três' },
      { emoji: '4️⃣', en: 'Four', pt: 'Quatro' },
      { emoji: '5️⃣', en: 'Five', pt: 'Cinco' },
    ]),
    lesson('a-3', 'Números de 6 a 10', '🔟', 'Agora de seis até dez.', [
      { emoji: '6️⃣', en: 'Six', pt: 'Seis' },
      { emoji: '7️⃣', en: 'Seven', pt: 'Sete' },
      { emoji: '8️⃣', en: 'Eight', pt: 'Oito' },
      { emoji: '9️⃣', en: 'Nine', pt: 'Nove' },
      { emoji: '🔟', en: 'Ten', pt: 'Dez' },
    ]),
    lesson('a-4', 'Cores', '🎨', 'As cores que você vê todos os dias.', [
      { emoji: '🔴', en: 'Red', pt: 'Vermelho' },
      { emoji: '🔵', en: 'Blue', pt: 'Azul' },
      { emoji: '🟡', en: 'Yellow', pt: 'Amarelo' },
      { emoji: '🟢', en: 'Green', pt: 'Verde' },
      { emoji: '⚫', en: 'Black', pt: 'Preto' },
      { emoji: '⚪', en: 'White', pt: 'Branco' },
    ]),
    lesson('a-5', 'Apresentações', '🤝', 'Frases para conhecer alguém.', [
      { emoji: '🙋', en: 'My name is Ana', pt: 'Meu nome é Ana' },
      { emoji: '🤝', en: 'Nice to meet you', pt: 'Prazer em conhecer' },
      { emoji: '💬', en: 'How are you', pt: 'Como você está' },
      { emoji: '😊', en: 'I am fine', pt: 'Eu estou bem' },
    ]),
  ],
}

export const levelB: CourseLevel = {
  level: 102,
  title: 'Meu dia',
  description: 'Família, comida, casa e animais.',
  emoji: '🏡',
  gradient: 'from-rose-500 to-orange-500',
  lessons: [
    lesson('b-1', 'Família', '👨‍👩‍👧', 'Quem mora com você?', [
      { emoji: '👩', en: 'Mother', pt: 'Mãe' },
      { emoji: '👨', en: 'Father', pt: 'Pai' },
      { emoji: '👦', en: 'Brother', pt: 'Irmão' },
      { emoji: '👧', en: 'Sister', pt: 'Irmã' },
      { emoji: '👵', en: 'Grandmother', pt: 'Avó' },
      { emoji: '👴', en: 'Grandfather', pt: 'Avô' },
    ]),
    lesson('b-2', 'Comidas e bebidas', '🍎', 'O que tem na sua mesa.', [
      { emoji: '🍎', en: 'Apple', pt: 'Maçã' },
      { emoji: '🍞', en: 'Bread', pt: 'Pão' },
      { emoji: '🥛', en: 'Milk', pt: 'Leite' },
      { emoji: '🥚', en: 'Egg', pt: 'Ovo' },
      { emoji: '💧', en: 'Water', pt: 'Água' },
      { emoji: '☕', en: 'Coffee', pt: 'Café' },
    ]),
    lesson('b-3', 'Na casa', '🏠', 'Objetos que você usa em casa.', [
      { emoji: '🏠', en: 'House', pt: 'Casa' },
      { emoji: '🛏️', en: 'Bed', pt: 'Cama' },
      { emoji: '🚪', en: 'Door', pt: 'Porta' },
      { emoji: '📺', en: 'Television', pt: 'Televisão' },
      { emoji: '⏰', en: 'Clock', pt: 'Relógio' },
      { emoji: '🔑', en: 'Key', pt: 'Chave' },
    ]),
    lesson('b-4', 'Animais', '🐶', 'Os bichinhos mais conhecidos.', [
      { emoji: '🐶', en: 'Dog', pt: 'Cachorro' },
      { emoji: '🐱', en: 'Cat', pt: 'Gato' },
      { emoji: '🐦', en: 'Bird', pt: 'Pássaro' },
      { emoji: '🐟', en: 'Fish', pt: 'Peixe' },
      { emoji: '🐴', en: 'Horse', pt: 'Cavalo' },
      { emoji: '🐮', en: 'Cow', pt: 'Vaca' },
    ]),
    lesson('b-5', 'Frases do dia', '🌅', 'Pequenas frases para o seu dia.', [
      { emoji: '☀️', en: 'Good morning Mom', pt: 'Bom dia mãe' },
      { emoji: '🍞', en: 'I eat bread', pt: 'Eu como pão' },
      { emoji: '💧', en: 'I drink water', pt: 'Eu bebo água' },
      { emoji: '☕', en: 'I like coffee', pt: 'Eu gosto de café' },
    ]),
  ],
}

export const levelC: CourseLevel = {
  level: 103,
  title: 'Frases úteis',
  description: 'Falar como você está, o que gosta e o que quer.',
  emoji: '💬',
  gradient: 'from-emerald-500 to-teal-600',
  lessons: [
    lesson('c-1', 'Como estou', '😀', 'Use “I am” para dizer como você está.', [
      { emoji: '😀', en: 'I am happy', pt: 'Eu estou feliz' },
      { emoji: '😴', en: 'I am tired', pt: 'Eu estou cansado' },
      { emoji: '🍔', en: 'I am hungry', pt: 'Eu estou com fome' },
      { emoji: '🥶', en: 'I am cold', pt: 'Eu estou com frio' },
    ]),
    lesson('c-2', 'Do que eu gosto', '❤️', 'Use “I like” para falar do que você gosta.', [
      { emoji: '🍕', en: 'I like pizza', pt: 'Eu gosto de pizza' },
      { emoji: '🎵', en: 'I like music', pt: 'Eu gosto de música' },
      { emoji: '🐶', en: 'I like dogs', pt: 'Eu gosto de cachorros' },
      { emoji: '⚽', en: 'I like soccer', pt: 'Eu gosto de futebol' },
    ]),
    lesson('c-3', 'O que eu quero', '🙌', 'Use “I want” para pedir o que você quer.', [
      { emoji: '💧', en: 'I want water', pt: 'Eu quero água' },
      { emoji: '☕', en: 'I want coffee', pt: 'Eu quero café' },
      { emoji: '🍞', en: 'I want bread', pt: 'Eu quero pão' },
      { emoji: '🆘', en: 'I want help', pt: 'Eu quero ajuda' },
    ]),
    lesson('c-4', 'Educação', '🙏', 'Frases para pedir com educação.', [
      { emoji: '🙋', en: 'Excuse me', pt: 'Com licença' },
      { emoji: '🙏', en: 'Thank you very much', pt: 'Muito obrigado' },
      { emoji: '💲', en: 'How much is it', pt: 'Quanto custa' },
      { emoji: '☕', en: 'A coffee please', pt: 'Um café por favor' },
    ]),
  ],
}

export const levelD: CourseLevel = {
  level: 104,
  optional: true,
  title: 'Números, dinheiro, datas e horas',
  description: 'Contar, pagar, falar de datas e dizer as horas. Opcional.',
  emoji: '🗓️',
  gradient: 'from-amber-500 to-orange-600',
  lessons: [
    lesson('d-1', 'Números de 11 a 20', '🔢', 'Depois do dez, os números mudam de forma. Toque para ouvir cada um.', [
      { emoji: '11', en: 'Eleven', pt: 'Onze' },
      { emoji: '12', en: 'Twelve', pt: 'Doze' },
      { emoji: '13', en: 'Thirteen', pt: 'Treze' },
      { emoji: '15', en: 'Fifteen', pt: 'Quinze' },
      { emoji: '18', en: 'Eighteen', pt: 'Dezoito' },
      { emoji: '20', en: 'Twenty', pt: 'Vinte' },
    ]),
    lesson('d-2', 'De vinte a cem', '💯', 'As dezenas: de vinte até cem.', [
      { emoji: '20', en: 'Twenty', pt: 'Vinte' },
      { emoji: '30', en: 'Thirty', pt: 'Trinta' },
      { emoji: '40', en: 'Forty', pt: 'Quarenta' },
      { emoji: '50', en: 'Fifty', pt: 'Cinquenta' },
      { emoji: '60', en: 'Sixty', pt: 'Sessenta' },
      { emoji: '100', en: 'One hundred', pt: 'Cem' },
    ]),
    lesson('d-3', 'Dinheiro', '💰', 'Palavras para falar de dinheiro.', [
      { emoji: '💰', en: 'Money', pt: 'Dinheiro' },
      { emoji: '💵', en: 'Dollar', pt: 'Dólar' },
      { emoji: '¢', en: 'Cent', pt: 'Centavo' },
      { emoji: '🏷️', en: 'Price', pt: 'Preço' },
      { emoji: '👍', en: 'Cheap', pt: 'Barato' },
      { emoji: '👎', en: 'Expensive', pt: 'Caro' },
    ]),
    lesson('d-4', 'Preços', '🏷️', 'Frases para perguntar e dizer preços.', [
      { emoji: '💲', en: 'How much is it', pt: 'Quanto custa' },
      { emoji: '5', en: 'It is five dollars', pt: 'Custa cinco dólares' },
      { emoji: '10', en: 'It is ten dollars', pt: 'Custa dez dólares' },
      { emoji: '🧾', en: 'Here is your change', pt: 'Aqui está o seu troco' },
    ]),
    lesson('d-5', 'Dias da semana', '📅', 'Os sete dias da semana, de segunda a domingo.', [
      { emoji: 'SEG', en: 'Monday', pt: 'Segunda-feira' },
      { emoji: 'TER', en: 'Tuesday', pt: 'Terça-feira' },
      { emoji: 'QUA', en: 'Wednesday', pt: 'Quarta-feira' },
      { emoji: 'QUI', en: 'Thursday', pt: 'Quinta-feira' },
      { emoji: 'SEX', en: 'Friday', pt: 'Sexta-feira' },
      { emoji: 'SÁB', en: 'Saturday', pt: 'Sábado' },
      { emoji: 'DOM', en: 'Sunday', pt: 'Domingo' },
    ]),
    lesson('d-6', 'Meses: janeiro a junho', '🗓️', 'Os primeiros seis meses do ano.', [
      { emoji: 'JAN', en: 'January', pt: 'Janeiro' },
      { emoji: 'FEV', en: 'February', pt: 'Fevereiro' },
      { emoji: 'MAR', en: 'March', pt: 'Março' },
      { emoji: 'ABR', en: 'April', pt: 'Abril' },
      { emoji: 'MAI', en: 'May', pt: 'Maio' },
      { emoji: 'JUN', en: 'June', pt: 'Junho' },
    ]),
    lesson('d-7', 'Meses: julho a dezembro', '🗓️', 'Os últimos seis meses do ano.', [
      { emoji: 'JUL', en: 'July', pt: 'Julho' },
      { emoji: 'AGO', en: 'August', pt: 'Agosto' },
      { emoji: 'SET', en: 'September', pt: 'Setembro' },
      { emoji: 'OUT', en: 'October', pt: 'Outubro' },
      { emoji: 'NOV', en: 'November', pt: 'Novembro' },
      { emoji: 'DEZ', en: 'December', pt: 'Dezembro' },
    ]),
    lesson('d-9', 'Ordinais: 1º a 5º', '🥇', 'Os ordinais dizem a posição: primeiro, segundo, terceiro...', [
      { emoji: '1st', en: 'First', pt: 'Primeiro' },
      { emoji: '2nd', en: 'Second', pt: 'Segundo' },
      { emoji: '3rd', en: 'Third', pt: 'Terceiro' },
      { emoji: '4th', en: 'Fourth', pt: 'Quarto' },
      { emoji: '5th', en: 'Fifth', pt: 'Quinto' },
    ]),
    lesson('d-10', 'Ordinais: 6º a 10º', '🏅', 'Continuando: do sexto ao décimo.', [
      { emoji: '6th', en: 'Sixth', pt: 'Sexto' },
      { emoji: '7th', en: 'Seventh', pt: 'Sétimo' },
      { emoji: '8th', en: 'Eighth', pt: 'Oitavo' },
      { emoji: '9th', en: 'Ninth', pt: 'Nono' },
      { emoji: '10th', en: 'Tenth', pt: 'Décimo' },
    ]),
    lesson('d-8', 'Datas', '🎂', 'Frases para falar de dias e datas.', [
      { emoji: '📆', en: 'Today is Monday', pt: 'Hoje é segunda-feira' },
      { emoji: '🌅', en: 'Tomorrow is Tuesday', pt: 'Amanhã é terça-feira' },
      { emoji: '❓', en: 'What day is it', pt: 'Que dia é hoje' },
      { emoji: '🎂', en: 'My birthday is in May', pt: 'Meu aniversário é em maio' },
    ]),
    lesson('d-11', 'Datas com ordinal', '🎄', 'Em inglês, a data usa o ordinal: “May first” é “primeiro de maio”.', [
      { emoji: '📆', en: 'Today is May first', pt: 'Hoje é primeiro de maio' },
      { emoji: '🎂', en: 'My birthday is June tenth', pt: 'Meu aniversário é 10 de junho' },
      { emoji: '🎄', en: 'Christmas is December twenty-fifth', pt: 'O Natal é 25 de dezembro' },
      { emoji: '🥇', en: 'It is my first day', pt: 'É o meu primeiro dia' },
    ]),
    lesson('d-12', 'Partes do dia', '🕐', 'Palavras para falar de horas e momentos do dia.', [
      { emoji: '🕐', en: 'Hour', pt: 'Hora' },
      { emoji: '⏱️', en: 'Minute', pt: 'Minuto' },
      { emoji: '🌅', en: 'Morning', pt: 'Manhã' },
      { emoji: '🌞', en: 'Afternoon', pt: 'Tarde' },
      { emoji: '🌇', en: 'Evening', pt: 'Início da noite' },
      { emoji: '🌙', en: 'Night', pt: 'Noite' },
    ]),
    lesson('d-13', 'Horas em ponto', '🕒', 'Para horas cheias, use “o’clock”: “It is three o’clock” é “São três horas”.', [
      { emoji: '1:00', en: 'It is one o’clock', pt: 'É uma hora' },
      { emoji: '3:00', en: 'It is three o’clock', pt: 'São três horas' },
      { emoji: '5:00', en: 'It is five o’clock', pt: 'São cinco horas' },
      { emoji: '7:00', en: 'It is seven o’clock', pt: 'São sete horas' },
      { emoji: '9:00', en: 'It is nine o’clock', pt: 'São nove horas' },
      { emoji: '12:00', en: 'It is twelve o’clock', pt: 'São doze horas' },
    ]),
    lesson('d-14', 'Meia hora e quinze minutos', '🕧', '“Half past” é e meia. “Quarter past” é e quinze. “Quarter to” é quinze para.', [
      { emoji: '2:30', en: 'It is half past two', pt: 'São duas e meia' },
      { emoji: '3:15', en: 'It is a quarter past three', pt: 'São três e quinze' },
      { emoji: '3:45', en: 'It is a quarter to four', pt: 'São quinze para as quatro' },
      { emoji: '5:10', en: 'It is ten past five', pt: 'São cinco e dez' },
      { emoji: '9:30', en: 'It is half past nine', pt: 'São nove e meia' },
      { emoji: '6:50', en: 'It is ten to seven', pt: 'São dez para as sete' },
    ]),
    lesson('d-15', 'Perguntar as horas', '⏰', 'Frases para perguntar e falar sobre o horário.', [
      { emoji: '❓', en: 'What time is it', pt: 'Que horas são' },
      { emoji: '🚶', en: 'It is time to go', pt: 'É hora de ir' },
      { emoji: '✅', en: 'I am on time', pt: 'Estou na hora' },
      { emoji: '😬', en: 'I am late', pt: 'Estou atrasado' },
    ]),
  ],
}
