import type { CourseLevel } from './types'

export const level3: CourseLevel = {
  level: 3,
  title: 'Presente Contínuo',
  description: 'Fale sobre o que está acontecendo agora — a forma -ing e suas aplicações no cotidiano.',
  emoji: '🔥',
  gradient: 'from-orange-500 via-red-500 to-pink-600',
  lessons: [
    {
      id: '3-1',
      title: 'O que é o Presente Contínuo?',
      emoji: '⚡',
      duration: '6 min',
      color: 'from-orange-400 to-red-500',
      slides: [
        {
          type: 'theory',
          title: 'Ações Acontecendo Agora',
          emoji: '▶️',
          blocks: [
            {
              kind: 'text',
              content: 'O **Presente Contínuo** (Present Continuous) descreve uma ação que está acontecendo no momento da fala. A estrutura é: **To Be + verbo-ing**.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Exemplos:',
                  emoji: '💬',
                  items: [
                    'I am studying English right now.',
                    'She is working from home today.',
                    'They are watching a movie.'
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Qual frase usa o Presente Contínuo corretamente?',
          context: '📱 Falando sobre o que está acontecendo agora.',
          options: [
            { text: 'She is reading a book.', correct: true, explanation: '✅ To Be (is) + verbo-ing (reading). Perfeito!' },
            { text: 'She reads a book.', correct: false, explanation: '❌ Isso é Presente Simples, não Contínuo.' },
            { text: 'She reading a book.', correct: false, explanation: '❌ Faltou o To Be antes do verbo-ing.' },
            { text: 'She is read a book.', correct: false, explanation: '❌ O verbo precisa terminar em -ing: reading.' }
          ]
        }
      ]
    }
  ]
}
