import { levelD, lesson } from './beginner'
import { levelE, numLesson } from './numbers'
import type { CourseLevel, Lesson } from './types'

const pick = (level: CourseLevel, ids: string[]): Lesson[] =>
  ids.map(id => level.lessons.find(l => l.id === id)).filter((l): l is Lesson => !!l)

export const levelNumbers: CourseLevel = {
  level: 105,
  optional: true,
  title: 'Números',
  description: 'Do 11 aos bilhões, decimais, ordinais e telefones.',
  emoji: '🔢',
  gradient: 'from-amber-500 to-orange-600',
  lessons: [
    ...pick(levelD, ['d-1', 'd-2']),
    ...pick(levelE, ['n-1', 'n-2', 'n-3', 'n-4', 'n-5', 'n-6', 'n-7']),
    ...pick(levelD, ['d-9', 'd-10']),
    ...pick(levelE, ['n-8']),
  ],
}

export const levelMoney: CourseLevel = {
  level: 106,
  optional: true,
  title: 'Dinheiro',
  description: 'Preços, moedas, pagamentos e compras.',
  emoji: '💰',
  gradient: 'from-emerald-500 to-teal-600',
  lessons: [
    ...pick(levelD, ['d-3', 'd-4']),
    lesson('m-1', 'Moedas e notas', '🪙', 'Os nomes das moedas americanas. Cada uma tem um apelido.', [
      { emoji: '1¢', en: 'Penny', pt: 'Um centavo' },
      { emoji: '5¢', en: 'Nickel', pt: 'Cinco centavos' },
      { emoji: '10¢', en: 'Dime', pt: 'Dez centavos' },
      { emoji: '25¢', en: 'Quarter', pt: 'Vinte e cinco centavos' },
      { emoji: '💵', en: 'Bill', pt: 'Nota' },
      { emoji: '🪙', en: 'Coin', pt: 'Moeda' },
    ]),
    numLesson(
      'n-9',
      'Preços com centavos',
      '🏷️',
      [
        { kind: 'text', content: 'Um preço é **dólares + centavos**: $4.99 = four dollars **and** ninety-nine cents.' },
        { kind: 'alert', content: '**Dollar** fica no singular só para $1: one dollar. Nos outros casos é dollars.' },
        { kind: 'tip', content: 'No dia a dia, muita gente diz só “four ninety-nine”.' },
      ],
      ['$4.99', '$0.50', '$1.00', '$12.30', '$25.75', '$100.00'],
      'money',
    ),
    lesson('m-2', 'Pagando', '💳', 'Frases para pagar uma compra.', [
      { emoji: '💳', en: 'I will pay by card', pt: 'Vou pagar no cartão' },
      { emoji: '💵', en: 'Do you take cash', pt: 'Vocês aceitam dinheiro' },
      { emoji: '🪙', en: 'Keep the change', pt: 'Pode ficar com o troco' },
      { emoji: '🧾', en: 'Can I have the receipt', pt: 'Posso pegar o recibo' },
    ]),
  ],
}

export const levelDates: CourseLevel = {
  level: 107,
  optional: true,
  title: 'Datas e calendário',
  description: 'Dias, meses, estações e como dizer a data.',
  emoji: '🗓️',
  gradient: 'from-rose-500 to-orange-500',
  lessons: [
    ...pick(levelD, ['d-5', 'd-6', 'd-7']),
    lesson('dt-1', 'Hoje, ontem e amanhã', '📆', 'Palavras para falar do tempo.', [
      { emoji: '📆', en: 'Today', pt: 'Hoje' },
      { emoji: '⏪', en: 'Yesterday', pt: 'Ontem' },
      { emoji: '⏩', en: 'Tomorrow', pt: 'Amanhã' },
      { emoji: '7', en: 'Week', pt: 'Semana' },
      { emoji: '30', en: 'Month', pt: 'Mês' },
      { emoji: '365', en: 'Year', pt: 'Ano' },
    ]),
    lesson('dt-2', 'Estações do ano', '🍂', 'As quatro estações. Atenção: em inglês americano, outono é “fall”.', [
      { emoji: '🌸', en: 'Spring', pt: 'Primavera' },
      { emoji: '☀️', en: 'Summer', pt: 'Verão' },
      { emoji: '🍂', en: 'Autumn', pt: 'Outono' },
      { emoji: '❄️', en: 'Winter', pt: 'Inverno' },
      { emoji: '🗓️', en: 'Season', pt: 'Estação do ano' },
    ]),
    ...pick(levelD, ['d-8', 'd-11']),
  ],
}

export const levelTime: CourseLevel = {
  level: 108,
  optional: true,
  title: 'Horas e rotina',
  description: 'Dizer as horas e falar do seu dia.',
  emoji: '⏰',
  gradient: 'from-sky-500 to-indigo-600',
  lessons: [
    ...pick(levelD, ['d-12', 'd-13', 'd-14', 'd-15']),
    lesson('h-1', 'Rotina do dia', '🌅', 'Frases para contar a sua rotina.', [
      { emoji: '⏰', en: 'I wake up at seven', pt: 'Eu acordo às sete' },
      { emoji: '🚌', en: 'I go to work at eight', pt: 'Eu vou trabalhar às oito' },
      { emoji: '🍽️', en: 'I have lunch at noon', pt: 'Eu almoço ao meio-dia' },
      { emoji: '🛏️', en: 'I go to bed at ten', pt: 'Eu vou dormir às dez' },
    ]),
  ],
}
