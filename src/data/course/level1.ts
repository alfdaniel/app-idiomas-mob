import type { CourseLevel } from './types'

export const level1: CourseLevel = {
  level: 1,
  title: 'Dominando o Verbo To Be',
  description: 'A base de tudo — pronomes, afirmativa, contrações, negativa, perguntas, passado e revisão. O guia completo para sair do zero.',
  emoji: '🌱',
  gradient: 'from-violet-500 via-purple-500 to-indigo-600',
  lessons: [

    // ─────────────────────────────────────────────
    // AULA 1.1 — Pronomes: Quem é Quem?
    // ─────────────────────────────────────────────
    {
      id: '1-1',
      title: 'Quem é Quem? Os Pronomes',
      emoji: '👤',
      duration: '6 min',
      color: 'from-cyan-500 to-blue-600',
      slides: [
        {
          type: 'theory',
          title: 'As Etiquetas das Pessoas e Coisas',
          emoji: '👋',
          blocks: [
            {
              kind: 'text',
              content: 'Antes de usar qualquer verbo, você precisa saber como chamar as pessoas e as coisas em inglês. Esses são os **pronomes pessoais** — as etiquetas que usamos para apontar para nós mesmos ou para o que está ao redor.'
            },
            {
              kind: 'table',
              headers: ['Pronome', 'Pronúncia', 'O que significa na prática'],
              rows: [
                ['I', 'áai', 'Eu (sempre com letra maiúscula!)'],
                ['You', 'iúu', 'Você (serve para uma pessoa só)'],
                ['He', 'rríi', 'Ele (apenas para homens/meninos humanos)'],
                ['She', 'chíi', 'Ela (apenas para mulheres/meninas humanas)'],
                ['It', 'êt', 'Isso / Coisa (objetos, animais, clima, situações)'],
              ],
              highlightCol: 0
            }
          ]
        },
        {
          type: 'theory',
          title: 'O Grande Segredo do "It"',
          emoji: '🐕',
          blocks: [
            {
              kind: 'text',
              content: 'No português, chamamos uma cadeira de "ela" e um carro de "ele". No inglês, **isso não existe**. Objetos, plantas, animais e o clima não têm gênero. Tudo que não for um ser humano vira **It**.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Quando usar "It":',
                  emoji: '📦',
                  items: [
                    'Para objetos: o celular, a mesa, a carteira → It.',
                    'Para animais (de forma geral): o cachorro, o gato → It.',
                    'Para o clima, a hora e a temperatura.'
                  ]
                },
                {
                  label: 'Exemplos com "It" no cotidiano:',
                  emoji: '🌤️',
                  items: [
                    'It is raining today. ☔ (Está chovendo hoje)',
                    "It is 8 o'clock. ⏰ (São 8 horas)",
                    'It is cold outside. 🥶 (Está frio lá fora)',
                    'It is far from here. 🗺️ (É longe daqui)'
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: '🚨 Pegadinha: Em PT dizemos "É lindo!" ocultando o sujeito. Em inglês o verbo NUNCA fica sozinho. Você precisa dizer: "It is beautiful!"'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Falando em Grupo: O Plural',
          emoji: '👥',
          blocks: [
            {
              kind: 'text',
              content: 'Quando há mais de uma pessoa na conversa, use os pronomes plurais:'
            },
            {
              kind: 'table',
              headers: ['Pronome', 'Pronúncia', 'Significado'],
              rows: [
                ['We', 'uíi', 'Nós (você + mais alguém)'],
                ['You', 'iúu', 'Vocês (a palavra é idêntica ao singular!)'],
                ['They', 'dhêi', 'Eles / Elas (pessoas, animais ou objetos no plural)'],
              ],
              highlightCol: 0
            },
            {
              kind: 'tip',
              content: '💡 Como diferenciar "You" (você) de "You" (vocês)? Pelo contexto da conversa!'
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você aponta para uma xícara de café na mesa. Qual pronome usa?',
          context: '☕ Café da manhã.',
          options: [
            { text: 'It', correct: true, explanation: '✅ Perfeito! A xícara é um objeto, então o pronome correto é "It".' },
            { text: 'She', correct: false, explanation: '❌ "She" é usado exclusivamente para mulheres humanas.' },
            { text: 'He', correct: false, explanation: '❌ "He" é usado exclusivamente para homens humanos.' },
            { text: 'They', correct: false, explanation: '❌ "They" é plural. Uma xícara só → singular.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '👪 Você quer dizer que sua família é muito unida.',
          before: '',
          after: ' are a very close family.',
          answers: ['We', 'we'],
          hint: 'Equivalente a "Nós" em inglês.'
        },
        {
          type: 'multiple_choice',
          question: 'Você quer falar sobre seus pais. Qual pronome usa para se referir aos dois juntos?',
          context: '👨‍👩‍👧 Falando sobre a sua família.',
          options: [
            { text: 'They', correct: true, explanation: '✅ "They" é usado para duas ou mais pessoas. Seus pais juntos = They.' },
            { text: 'It', correct: false, explanation: '❌ "It" é para coisas, animais e clima — nunca para pessoas.' },
            { text: 'We', correct: false, explanation: '❌ "We" inclui você na contagem. Seus pais sem você = "They".' },
            { text: 'He', correct: false, explanation: '❌ "He" é singular masculino. Seus pais são duas pessoas.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🎉 Você está recebendo um grupo de amigos em casa.',
          before: '',
          after: ' are all welcome here!',
          answers: ['You', 'you'],
          hint: 'Quando você fala com várias pessoas ao mesmo tempo — igual ao singular, mas no plural!'
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 1.2 — Forma Afirmativa
    // ─────────────────────────────────────────────
    {
      id: '1-2',
      title: 'Forma Afirmativa',
      emoji: '☀️',
      duration: '8 min',
      color: 'from-amber-400 to-orange-500',
      slides: [
        {
          type: 'theory',
          title: 'Uma Palavra, Dois Mundos',
          emoji: '🧠',
          blocks: [
            {
              kind: 'text',
              content: 'No português, temos dois verbos distintos:\n1. **Ser** (algo permanente: *Eu sou brasileiro*)\n2. **Estar** (algo passageiro: *Eu estou cansado*)\n\nO inglês simplifica tudo! O **Verbo To Be** faz o papel dos dois ao mesmo tempo. O contexto da frase define o sentido.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Mesmo verbo, sentidos diferentes:',
                  emoji: '🔄',
                  items: [
                    'I am John. (Eu SOU o John — identidade)',
                    'I am at the supermarket. (Eu ESTOU no supermercado — localização)'
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'theory',
          title: 'Casando os Pronomes com o Verbo',
          emoji: '💍',
          blocks: [
            {
              kind: 'text',
              content: 'O To Be tem apenas **3 formas** no presente: **am**, **is** e **are**. Cada uma tem seus pares exclusivos. Não pode misturar!'
            },
            {
              kind: 'table',
              headers: ['Sujeito', 'To Be', 'Exemplo Prático'],
              rows: [
                ['I', 'am', 'I am happy. (Eu estou feliz)'],
                ['You', 'are', 'You are late. (Você está atrasado)'],
                ['He', 'is', 'He is hungry. (Ele está com fome)'],
                ['She', 'is', 'She is a doctor. (Ela é médica)'],
                ['It', 'is', 'It is cold today. (Está frio hoje)'],
                ['We', 'are', 'We are tired. (Nós estamos cansados)'],
                ['They', 'are', 'They are at home. (Eles estão em casa)'],
              ],
              highlightCol: 1
            },
            {
              kind: 'alert',
              content: '⚠️ Cada sujeito tem um verbo fixo. Não existe liberdade aqui — é na base!'
            }
          ]
        },
        {
          type: 'theory',
          title: 'A Pegadinha da Idade e da Fome',
          emoji: '🎂',
          blocks: [
            {
              kind: 'text',
              content: 'Aqui está o maior erro de quem fala português! Nós "temos" fome e "temos" 30 anos de idade.\n\nPara o inglês, você não carrega a idade ou a fome numa sacola. Você **é** velho o suficiente ou **está** no estado de fome. Portanto, usamos o To Be!'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Forma Correta:',
                  emoji: '🌟',
                  items: [
                    'I am 25 years old. — NUNCA use "I have"!',
                    'He is hungry (rránguiri). (Ele está com fome)',
                    'She is thirsty (rérsiti). (Ela está com sede)'
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'theory',
          title: 'To Be no Seu Dia a Dia',
          emoji: '🗓️',
          blocks: [
            {
              kind: 'text',
              content: 'O To Be aparece o tempo todo em 4 situações do cotidiano:'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Profissão',
                  emoji: '💼',
                  items: [
                    'I am a student.',
                    'She is a nurse.',
                    'He is a teacher.'
                  ]
                },
                {
                  label: 'Origem',
                  emoji: '🌍',
                  items: [
                    'I am from Brazil.',
                    'He is American.',
                    'They are from Canada.'
                  ]
                },
                {
                  label: 'Estado / Sentimento',
                  emoji: '😊',
                  items: [
                    'I am tired today.',
                    'She is happy.',
                    'We are ready!'
                  ]
                },
                {
                  label: 'Localização',
                  emoji: '📍',
                  items: [
                    'I am at home.',
                    'The meeting is at noon.',
                    'We are at the office.'
                  ]
                }
              ]
            },
            {
              kind: 'tip',
              content: '💡 Em PT usamos "ser" e "estar" separados. Em inglês, o To Be faz os dois!'
            }
          ]
        },
        {
          type: 'theory',
          title: 'O Artigo "a" e "an": O Detalhe que Muda Tudo',
          emoji: '🔤',
          blocks: [
            {
              kind: 'text',
              content: 'Em português, dizemos simplesmente "Ela é médica". Em inglês, sempre que falamos de uma profissão ou qualquer substantivo singular, precisamos de um pequeno "marcador" antes da palavra. Esse marcador é o **artigo indefinido**.\n\nSem ele, a frase está errada!'
            },
            {
              kind: 'table',
              headers: ['Quando usar', 'Artigo', 'Exemplos'],
              rows: [
                ['Antes de consoante (b, c, d, f, g...)', 'a', 'a teacher, a doctor, a bus driver'],
                ['Antes de vogal (a, e, i, o, u)', 'an', 'an actor, an engineer, an artist'],
              ],
              highlightCol: 1
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'No dia a dia:',
                  emoji: '🌟',
                  items: [
                    'I am a student. (Eu sou estudante)',
                    'She is a nurse. (Ela é enfermeira)',
                    'He is an actor. (Ele é ator)',
                    'My mom is a teacher. (Minha mãe é professora)'
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: '🚨 "I am programmer." está ERRADO. O correto é "I am a programmer." — nunca esqueça o artigo antes da profissão!'
            }
          ]
        },
        {
          type: 'fill_blank',
          context: '🏥 Você está descrevendo sua amiga para alguém.',
          before: 'She is',
          after: 'nurse.',
          answers: ['a'],
          hint: '"nurse" começa com consoante → use "a"'
        },
        {
          type: 'multiple_choice',
          question: '"He is ___ actor."',
          context: '🎬 Você está falando sobre seu ator favorito.',
          options: [
            { text: 'an', correct: true, explanation: '✅ "actor" começa com vogal (a) → usamos "an".' },
            { text: 'a', correct: false, explanation: '❌ "a" é usado antes de consoante. "actor" começa com vogal → use "an".' },
            { text: 'the', correct: false, explanation: '❌ "the" é o artigo definido ("o/a" específico). Aqui precisamos do indefinido.' },
            { text: '(sem artigo)', correct: false, explanation: '❌ Em inglês, profissões sempre precisam de artigo: "an actor", "a teacher".' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Um amigo te pergunta sua idade. Qual é a forma correta em inglês?',
          context: '🎉 Conversa casual em uma festa.',
          options: [
            { text: 'I am 30 years old.', correct: true, explanation: '✅ Perfeito! Em inglês nós "somos" a nossa idade, usando o To Be.' },
            { text: 'I have 30 years old.', correct: false, explanation: '❌ Erro clássico de português! "Have" é de posse física.' },
            { text: 'I is 30 years old.', correct: false, explanation: '❌ O pronome "I" só faz par com "am".' },
            { text: 'I are 30.', correct: false, explanation: '❌ "are" é usado apenas para You, We e They.' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Complete a frase: "___ a nurse."',
          context: '👩‍⚕️ Sujeito: She',
          options: [
            { text: 'She is', correct: true, explanation: '✅ Perfeito! He/She/It sempre usa "is".' },
            { text: 'She are', correct: false, explanation: '❌ "are" é para You/We/They — não para She.' },
            { text: 'She am', correct: false, explanation: '❌ "am" é exclusivo de "I".' },
            { text: 'She be', correct: false, explanation: '❌ "be" é a forma base, não usada assim no presente.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '📚 Você está se apresentando na escola.',
          before: 'I',
          after: 'a student at this university.',
          answers: ['am'],
          hint: 'Primeira pessoa do singular'
        },
        {
          type: 'fill_blank',
          context: '📅 Alguém pergunta sobre a reunião.',
          before: 'The meeting',
          after: "at nine o'clock.",
          answers: ['is'],
          hint: '"The meeting" = singular (He/She/It)'
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 1.3 — Contrações
    // ─────────────────────────────────────────────
    {
      id: '1-3',
      title: 'Contrações',
      emoji: '💬',
      duration: '6 min',
      color: 'from-pink-400 to-rose-500',
      slides: [
        {
          type: 'theory',
          title: 'Fale Como um Nativo',
          emoji: '⚡',
          blocks: [
            {
              kind: 'text',
              content: 'Ninguém diz "Eu estou em casa" o tempo todo — falamos "Tô em casa". No inglês acontece o mesmo!\n\nEles usam o **apóstrofo (\')** para juntar o pronome com o verbo. Isso torna a fala natural e profissional no dia a dia.'
            },
            {
              kind: 'table',
              headers: ['Forma completa', 'Contração', 'Como soa na fala'],
              rows: [
                ['I am', "I'm", 'áaim'],
                ['You are', "You're", 'iúur'],
                ['He is', "He's", 'rríiz'],
                ['She is', "She's", 'chíiz'],
                ['It is', "It's", 'êts'],
                ['We are', "We're", 'uíir'],
                ['They are', "They're", 'dhéir'],
              ],
              highlightCol: 1
            },
            {
              kind: 'tip',
              content: '💡 Use contrações em: chats, e-mails, conversas, redes sociais. Evite só em documentos formais ou contratos.'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Cuidado com os Gêmeos!',
          emoji: '⚠️',
          blocks: [
            {
              kind: 'text',
              content: 'Dois pares de palavras têm o mesmo som mas significados opostos. Até nativos erram isso na internet:'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: "1. You're vs Your",
                  emoji: '👀',
                  items: [
                    "You're beautiful. (Você É linda — contração de You are) ✅",
                    "Your car is outside. (SEU carro — posse, sem apóstrofo) ✅",
                    "Your beautiful. → ERRADO ❌"
                  ]
                },
                {
                  label: "2. It's vs Its",
                  emoji: '🐶',
                  items: [
                    "It's a bug. (IT IS a bug — contração) ✅",
                    "Its color is blue. (A cor DELE — posse, sem apóstrofo) ✅",
                    "Its a bug. → ERRADO ❌"
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: "🔑 Apóstrofo = contração do verbo. Sem apóstrofo = possessivo. Simples assim!"
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: '"___ a beautiful day! Let\'s go out! ☀️"',
          context: '🌞 Você comenta sobre o dia com um amigo.',
          options: [
            { text: "It's", correct: true, explanation: "✅ It's = It is. O apóstrofo mostra a contração do verbo." },
            { text: "Its", correct: false, explanation: '❌ "Its" sem apóstrofo é possessivo: "Its color" (a cor dele).' },
            { text: "It is's", correct: false, explanation: '❌ Essa forma não existe em inglês.' },
            { text: "Its'", correct: false, explanation: '❌ Apóstrofo depois do S não faz sentido aqui.' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você quer mandar uma mensagem: "Você está atrasado". Qual a grafia correta?',
          context: '📱 WhatsApp.',
          options: [
            { text: "You're late.", correct: true, explanation: "✅ Correto! You're é a contração de You are." },
            { text: 'Your late.', correct: false, explanation: '❌ "Your" sem apóstrofo indica posse (Seu/Sua). Ex: Your name.' },
            { text: "You is late.", correct: false, explanation: "❌ 'You' nunca usa 'is'." },
            { text: "You am late.", correct: false, explanation: "❌ 'am' é exclusivo de I." }
          ]
        },
        {
          type: 'fill_blank',
          context: '🏠 Mensagem no grupo da equipe.',
          before: '',
          after: 'working from home today. See you online! 👋',
          answers: ["She's", 'She is'],
          hint: 'She is → contração'
        },
        {
          type: 'match',
          instruction: 'Conecte a forma completa com a contração:',
          pairs: [
            { left: 'I am', right: "I'm" },
            { left: 'You are', right: "You're" },
            { left: 'He is', right: "He's" },
            { left: 'We are', right: "We're" },
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 1.4 — Forma Negativa
    // ─────────────────────────────────────────────
    {
      id: '1-4',
      title: 'Forma Negativa',
      emoji: '🚫',
      duration: '7 min',
      color: 'from-red-400 to-orange-500',
      slides: [
        {
          type: 'theory',
          title: 'A Posição do "Não" em Inglês',
          emoji: '🛑',
          blocks: [
            {
              kind: 'text',
              content: 'No português, jogamos o "não" antes de tudo: *Eu não estou*.\n\nNo inglês, a lógica é diferente! Primeiro você diz o sujeito + verbo, e só depois adiciona o **NOT**.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Veja a estrutura:',
                  emoji: '⚖️',
                  items: [
                    'Português: Eu [NÃO] estou cansado.',
                    'Inglês: I am [NOT] tired.'
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'theory',
          title: 'Duas Formas de Abreviação',
          emoji: '✂️',
          blocks: [
            {
              kind: 'text',
              content: 'Para negar rapidamente, você pode encurtar de **duas maneiras diferentes** — ambas estão corretas!'
            },
            {
              kind: 'table',
              headers: ['Forma completa', 'Contração 1', 'Contração 2'],
              rows: [
                ['I am not', "I'm not", '— (não existe outra!)'],
                ['You are not', "You're not", "You aren't"],
                ['He is not', "He's not", "He isn't"],
                ['She is not', "She's not", "She isn't"],
                ['It is not', "It's not", "It isn't"],
                ['We are not', "We're not", "We aren't"],
                ['They are not', "They're not", "They aren't"],
              ],
              highlightCol: 1
            },
            {
              kind: 'alert',
              content: '🚨 "I amn\'t" NÃO EXISTE em inglês! A única forma correta é "I\'m not". Sem exceção, nunca.'
            },
            {
              kind: 'tip',
              content: '💡 No passado, as formas negativas são "wasn\'t" (was not) e "weren\'t" (were not). Você vai aprender isso na Aula 1.6!'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Negativando no Dia a Dia',
          emoji: '📱',
          blocks: [
            {
              kind: 'examples',
              groups: [
                {
                  label: 'No dia a dia',
                  emoji: '🌅',
                  items: [
                    "I'm not home right now.",
                    "He isn't at school today.",
                    "We aren't ready for the trip."
                  ]
                },
                {
                  label: 'Situações comuns',
                  emoji: '📱',
                  items: [
                    "She isn't hungry.",
                    "They aren't here yet.",
                    "It isn't working! 😤"
                  ]
                }
              ]
            },
            {
              kind: 'tip',
              content: "💡 Em PT: 'Eu não estou pronto' → o 'não' vem antes do verbo. Em EN: 'I'm not ready' → o 'not' vem DEPOIS do To Be."
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você vai a um restaurante, mas ele não está aberto. Como dizer isso em inglês?',
          context: '📍 Na porta do estabelecimento.',
          options: [
            { text: "It isn't open today.", correct: true, explanation: "✅ Perfeito! 'It' (para o restaurante) + isn't (is not) + open." },
            { text: 'It not is open today.', correct: false, explanation: '❌ Você colocou o "not" antes do verbo, seguindo a lógica do português.' },
            { text: "It amn't open today.", correct: false, explanation: "❌ Como vimos, 'amn't' simplesmente não existe." },
            { text: "They aren't open today.", correct: false, explanation: '❌ O restaurante é singular → "It", não "They".' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Complete: "She ___ at school today. She is sick."',
          context: '🤧 Sua amiga ficou em casa doente.',
          options: [
            { text: "isn't", correct: true, explanation: "✅ She isn't = She is not. Correto!" },
            { text: "aren't", correct: false, explanation: '❌ "aren\'t" é para You/We/They — não para She.' },
            { text: "amn't", correct: false, explanation: '❌ "amn\'t" não existe em inglês.' },
            { text: "not is", correct: false, explanation: '❌ A ordem é: To Be + not. Nunca: not + To Be.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🗣️ Alguém te acusa de estar bravo, mas você está super calmo.',
          before: 'No,',
          after: 'angry!',
          answers: ["I'm not", 'I am not'],
          hint: 'Como se diz "Eu não estou" de forma curta?'
        },
        {
          type: 'fill_blank',
          context: '🚌 O ônibus está atrasado.',
          before: 'The bus',
          after: 'on time today.',
          answers: ["isn't", 'is not'],
          hint: '"The bus" = singular → isn\'t / is not'
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 1.5 — Perguntas
    // ─────────────────────────────────────────────
    {
      id: '1-5',
      title: 'Perguntas',
      emoji: '❓',
      duration: '8 min',
      color: 'from-cyan-400 to-blue-500',
      slides: [
        {
          type: 'theory',
          title: 'O Jogo da Inversão',
          emoji: '🔄',
          blocks: [
            {
              kind: 'text',
              content: 'Para fazer uma pergunta, não basta mudar o tom da voz. Você precisa dar um sinal visual e gramatical.\n\nComo? **Pegamos o To Be e jogamos para o início da frase**, invertendo de lugar com o sujeito.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Afirmativa → Pergunta',
                  emoji: '⚡',
                  items: [
                    'You are ready. → Are you ready?',
                    'She is online. → Is she online?',
                    'They are available. → Are they available?'
                  ]
                },
                {
                  label: 'Todas as formas interrogativas',
                  emoji: '📋',
                  items: [
                    'Am I late?',
                    'Are you free?',
                    'Is he / she / it ready?',
                    'Are we / they on time?'
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: '⚠️ Em PT às vezes mudamos só a entonação: "Você está pronto?" Em inglês escrito, a inversão é obrigatória!'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Short Answers — Respondendo Como Nativo',
          emoji: '🤝',
          blocks: [
            {
              kind: 'text',
              content: 'Se alguém perguntar *"Are you OK?"*, responder só *"Yes"* ou *"No"* soa extremamente seco. O padrão do inglês exige as **Short Answers**, onde você repete o sujeito e o verbo de forma compacta.'
            },
            {
              kind: 'table',
              headers: ['Pergunta', 'Resposta SIM', 'Resposta NÃO'],
              rows: [
                ['Are you ready?', 'Yes, I am.', "No, I'm not."],
                ['Is she online?', 'Yes, she is.', "No, she isn't."],
                ['Are they there?', 'Yes, they are.', "No, they aren't."],
                ['Is it hot?', 'Yes, it is.', "No, it isn't."],
              ]
            },
            {
              kind: 'tip',
              content: '🚨 Regra Crucial: NUNCA use contração para terminar uma resposta afirmativa curta. "Yes, I am." ✅ — "Yes, I\'m." ❌'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Perguntas com WH-',
          emoji: '🗺️',
          blocks: [
            {
              kind: 'text',
              content: 'Além das perguntas de sim/não, há as **WH-questions** — perguntas que pedem informação específica. A estrutura é: **WH-word + To Be + sujeito**.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'WH-questions no cotidiano',
                  emoji: '❓',
                  items: [
                    'Where are you? (Onde você está?)',
                    'What is your name? (Qual é o seu nome?)',
                    'How is the project? (Como está o projeto?)',
                    'Who is the manager? (Quem é o gerente?)',
                    'Why are you late? (Por que você está atrasado?)'
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: '🔑 WH-word + To Be + sujeito. A WH sempre vem primeiro!'
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Como perguntar "Você está disponível?"',
          context: '🧑‍🤝‍🧑 Você quer chamar um amigo para sair.',
          options: [
            { text: 'Are you available?', correct: true, explanation: '✅ Perfeito! To Be (Are) vem antes do sujeito (you).' },
            { text: 'You are available?', correct: false, explanation: '❌ Funciona em fala informal, mas é tradução direta do PT. Na escrita, use a inversão.' },
            { text: 'Is you available?', correct: false, explanation: '❌ "Is" não combina com "you". You → Are.' },
            { text: 'Do you available?', correct: false, explanation: '❌ "Do" é auxiliar de outros verbos, não do To Be.' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Alguém bate na porta e pergunta "Are you in there?". Como responder "Sim, estou" de forma educada?',
          context: '🚪 Resposta curta.',
          options: [
            { text: 'Yes, I am.', correct: true, explanation: '✅ Exato! Short answer afirmativa — sem contração no final.' },
            { text: "Yes, I'm.", correct: false, explanation: "❌ Nunca use contração no final de uma resposta afirmativa curta!" },
            { text: 'Yes, am.', correct: false, explanation: '❌ O sujeito "I" é obrigatório.' },
            { text: 'Yes, I do.', correct: false, explanation: '❌ "Do" é auxiliar de outros verbos, não do To Be.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🍽️ Você quer saber se o almoço está pronto.',
          before: '',
          after: 'lunch ready?',
          answers: ['Is'],
          hint: '"lunch" = singular (He/She/It → Is)'
        },
        {
          type: 'match',
          instruction: 'Conecte a pergunta com o que ela significa:',
          pairs: [
            { left: 'Are you ready?', right: 'Você está pronto?' },
            { left: 'Is she OK?', right: 'Ela está bem?' },
            { left: 'Where are you?', right: 'Onde você está?' },
            { left: 'How is the food?', right: 'Como está a comida?' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 1.6 — Passado: Was / Were
    // ─────────────────────────────────────────────
    {
      id: '1-6',
      title: 'Passado: Was e Were',
      emoji: '⏮️',
      duration: '6 min',
      color: 'from-emerald-400 to-teal-500',
      slides: [
        {
          type: 'theory',
          title: 'Voltando no Tempo',
          emoji: '📸',
          blocks: [
            {
              kind: 'text',
              content: 'A festa de ontem foi boa? O tempo estava ruim? Para falar do passado com To Be, usamos **was** ou **were**.'
            },
            {
              kind: 'table',
              headers: ['Sujeito', 'Presente', 'Passado'],
              rows: [
                ['I', 'am', 'was'],
                ['He / She / It', 'is', 'was'],
                ['You', 'are', 'were'],
                ['We', 'are', 'were'],
                ['They', 'are', 'were'],
              ],
              highlightCol: 2
            },
            {
              kind: 'alert',
              content: '⚠️ "You" usa WERE mesmo sendo uma única pessoa. É assim que funciona — decore!'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Was e Were em Ação',
          emoji: '🎬',
          blocks: [
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Afirmativa',
                  emoji: '✅',
                  items: [
                    'The party was amazing! 🎉',
                    'We were a family of three.',
                    'The rain was heavy all morning. 🌧️'
                  ]
                },
                {
                  label: 'Negativa',
                  emoji: '🚫',
                  items: [
                    "The TV wasn't working. (wasn't = was not) 📺",
                    "They weren't ready. (weren't = were not)"
                  ]
                },
                {
                  label: 'Pergunta',
                  emoji: '❓',
                  items: [
                    'Was the movie good? 🎬',
                    'Were you at home yesterday?',
                    'Was she on time?'
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: '"They ___ late for class yesterday."',
          context: '⏰ Ontem todo mundo chegou atrasado para a aula.',
          options: [
            { text: 'were', correct: true, explanation: '✅ They → were (passado de "are").' },
            { text: 'was', correct: false, explanation: '❌ "was" é para I/He/She/It — singular. They é plural.' },
            { text: 'are', correct: false, explanation: '❌ "are" é presente. Precisamos do passado!' },
            { text: 'is', correct: false, explanation: '❌ "is" é presente singular. Duplamente errado aqui.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🌧️ O tempo estava terrível ontem.',
          before: 'The weather',
          after: 'terrible yesterday.',
          answers: ['was'],
          hint: '"The weather" = singular → was'
        },
        {
          type: 'fill_blank',
          context: '📋 Perguntando sobre ontem.',
          before: '',
          after: 'you at the office yesterday?',
          answers: ['Were'],
          hint: '"You" no passado → Were'
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 1.7 — Revisão Geral
    // ─────────────────────────────────────────────
    {
      id: '1-7',
      title: 'Revisão Geral',
      emoji: '🏆',
      duration: '7 min',
      color: 'from-violet-500 to-purple-600',
      slides: [
        {
          type: 'theory',
          title: 'Tudo Sobre o To Be em Um Só Lugar',
          emoji: '🗺️',
          blocks: [
            {
              kind: 'text',
              content: 'Você chegou até aqui! Vamos revisar todas as formas do To Be antes do desafio final.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Afirmativa',
                  emoji: '✅',
                  items: ["I'm a student.", "She's the teacher.", "We're good friends."]
                },
                {
                  label: 'Negativa',
                  emoji: '🚫',
                  items: ["I'm not hungry.", "He isn't at home.", "They aren't ready."]
                },
                {
                  label: 'Pergunta',
                  emoji: '❓',
                  items: ['Are you free?', 'Is dinner ready?', 'Where are they?']
                },
                {
                  label: 'Passado',
                  emoji: '⏮️',
                  items: ['The trip was great!', "We weren't prepared.", 'Was she on time?']
                }
              ]
            },
            {
              kind: 'tip',
              content: "💡 Dica de ouro: no dia a dia, sempre use contrações — soa mais natural. \"I'm a student\" soa melhor que \"I am a student\"."
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'O que está errado em: "I am programmer."?',
          context: '👤 Você está se apresentando.',
          options: [
            { text: "Falta o artigo 'a': I am a programmer.", correct: true, explanation: "✅ Exato! Em inglês, profissões precisam de artigo: a developer, a teacher, a designer." },
            { text: "'am' deveria ser 'is'", correct: false, explanation: "❌ Não — I sempre usa 'am'. O verbo está certo." },
            { text: "'I' deveria ser 'He'", correct: false, explanation: "❌ O sujeito está certo. O problema está no artigo." },
            { text: "Nada está errado.", correct: false, explanation: "❌ Falta o artigo 'a' antes de 'programmer'." }
          ]
        },
        {
          type: 'multiple_choice',
          question: '"She ___ our teacher."',
          context: '🏫 Apresentando a professora para um amigo.',
          options: [
            { text: "is", correct: true, explanation: "✅ She → is. Simples e correto!" },
            { text: "are", correct: false, explanation: "❌ 'are' é para You/We/They — não She." },
            { text: "am", correct: false, explanation: "❌ 'am' é exclusivo de I." },
            { text: "were", correct: false, explanation: "❌ 'were' é passado. Estamos falando do presente." }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Qual das frases está completamente correta?',
          context: '🔍 Revisão geral.',
          options: [
            { text: "They weren't ready for the test.", correct: true, explanation: "✅ Perfeito! They + weren't (were not) no passado." },
            { text: "They wasn't ready for the test.", correct: false, explanation: "❌ 'wasn't' é singular (I/He/She/It). They → weren't." },
            { text: "They not were ready for the test.", correct: false, explanation: "❌ O 'not' vai depois do To Be: were not / weren't." },
            { text: "They are not ready for the test yesterday.", correct: false, explanation: "❌ 'are' é presente. 'yesterday' indica passado → were." }
          ]
        },
        {
          type: 'fill_blank',
          context: '🎂 Você quer saber quando é o aniversário do amigo.',
          before: '',
          after: 'your birthday this month?',
          answers: ['Is'],
          hint: '"your birthday" = singular → Is'
        },
        {
          type: 'fill_blank',
          context: '✈️ Os seus amigos ainda não estão prontos para a viagem.',
          before: 'They',
          after: 'ready for the trip.',
          answers: ["aren't", 'are not'],
          hint: '"They" → are not / aren\'t'
        },
        {
          type: 'completion',
          emoji: '🎉',
          title: 'Nível 1 Concluído!',
          message: 'Você domina o Verbo To Be! Agora você consegue identificar pronomes, usar a forma afirmativa, contrações, negativa, perguntas e o passado em inglês. Próximo passo: Presente Simples!'
        }
      ]
    }

  ]
}
