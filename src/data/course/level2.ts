import type { CourseLevel } from './types'

export const level2: CourseLevel = {
  level: 2,
  title: 'O Mapa das Coisas: Artigos, Demonstrativos e Posse',
  description: 'Domine a arte de situar objetos no espaço e no tempo, determine posses com precisão e saiba exatamente quem recebe cada ação. As ferramentas do dia a dia que transformam frases quebradas em inglês fluido.',
  emoji: '🗺️',
  gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
  lessons: [
    // ─────────────────────────────────────────────
    // AULA 2.1 — Os Artigos e a Lógica do Som
    // ─────────────────────────────────────────────
    {
      id: '2-1',
      title: 'Artigos: A, An, The e o Poder do Silêncio',
      emoji: '📦',
      duration: '15 min',
      color: 'from-teal-400 to-emerald-500',
      slides: [
        {
          type: 'theory',
          title: 'Geral vs. Específico',
          emoji: '🔍',
          blocks: [
            {
              kind: 'text',
              content: 'No inglês, todo substantivo contável no singular precisa de um artigo. A escolha entre **A/An** e **The** muda completamente o significado da frase:\n\n* **A / An** = Um, Uma — qualquer um, não importa qual.\n* **The** = O, A, Os, As — aquele específico que nós dois já sabemos de qual se trata.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Veja a diferença na prática:',
                  emoji: '💡',
                  items: [
                    'I need a taxi. (Qualquer táxi que vier está ótimo.)',
                    'I need the taxi. (O táxi específico que nós pedimos pelo app.)',
                    'I\'m looking for a job. (Qualquer vaga, estou no mercado.)',
                    'Did you get the job? (Aquela vaga específica em que você se candidatou.)'
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'theory',
          title: 'A Regra Oculta: Não olhe a letra, escute o SOM!',
          emoji: '🗣️',
          blocks: [
            {
              kind: 'text',
              content: 'A escolha entre **A** e **AN** depende exclusivamente do **som inicial da palavra seguinte**, não da letra escrita. Isso evita o choque de vogais na fala real.'
            },
            {
              kind: 'table',
              headers: ['Palavra', 'Som Inicial', 'Artigo Correto', 'Por quê?'],
              rows: [
                ['house', 'Consoante /h/', 'a house', 'O "h" tem som audível.'],
                ['hour', 'Vogal /áu/', 'an hour', 'O "h" é 100% mudo.'],
                ['umbrella', 'Vogal /ã/', 'an umbrella', 'Som limpo de vogal.'],
                ['university', 'Consoante /iú/', 'a university', 'Começa com som de "y" (consoante).'],
                ['honest', 'Vogal /ó/', 'an honest person', 'O "h" é mudo em honest.'],
                ['European', 'Consoante /iú/', 'a European country', 'Começa com som de "y".'],
              ],
              highlightCol: 2
            },
            {
              kind: 'tip',
              content: '💡 Teste rápido: fale a palavra em voz alta. Se a boca ficou bem aberta logo no início, é vogal → use AN. Se houve qualquer obstrução (lábio, dente, garganta), é consoante → use A.'
            }
          ]
        },
        {
          type: 'theory',
          title: 'O Silêncio que Fala: O Artigo Zero',
          emoji: '🔇',
          blocks: [
            {
              kind: 'text',
              content: 'Existe um terceiro "artigo" em inglês: o **silêncio**. Em certas situações você não usa nada — nem A, nem The. Isso acontece quando você fala de algo **em geral**, sem limitação específica.'
            },
            {
              kind: 'table',
              headers: ['Com Artigo (específico)', 'Sem Artigo (geral)'],
              rows: [
                ['Pass me the water. (aquela água à mesa)', 'Water is essential for life. (água como substância)'],
                ['I love the coffee from that café. (aquele específico)', 'I love coffee. (café como bebida em geral)'],
                ['She reads the books I recommend. (esses livros)', 'She loves books. (livros em geral, qualquer um)'],
                ['Turn off the music! (essa música tocando)', 'Music makes me happy. (música como arte)'],
              ],
              highlightCol: 1
            },
            {
              kind: 'alert',
              content: '🚨 Armadilha clássica: "I like the musics" ❌ — Duplo erro: music é incontável (sem plural) e você está falando da categoria geral. O correto é "I love music." ✅'
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você está em um restaurante e quer pedir "um copo dágua". Como você solicita isso corretamente?',
          context: '🍽️ Falando com o garçom.',
          options: [
            { text: 'Can I have a glass of water?', correct: true, explanation: '✅ Perfeito! "Glass" começa com som consonantal /g/, então usamos "a". Você quer um copo qualquer — não específico.' },
            { text: 'Can I have an glass of water?', correct: false, explanation: '❌ "An" antes de som de consoante cria um choque desagradável. "Glass" começa com /g/, som de consoante.' },
            { text: 'Can I have the glass of water?', correct: false, explanation: '❌ "The" indicaria um copo específico já conhecido dos dois. Para pedir algo novo, use "a".' },
            { text: 'Can I have glass of water?', correct: false, explanation: '❌ Substantivos contáveis no singular nunca ficam sem artigo em inglês.' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Seu colega quer saber se você leu o e-mail que ele enviou mais cedo. Como ele pergunta isso?',
          context: '💼 Conversa rápida de escritório.',
          options: [
            { text: 'Did you read the email I sent?', correct: true, explanation: '✅ Exato! "The" é perfeito — ambos sabem qual e-mail é esse. É um objeto específico e conhecido pelo contexto da conversa.' },
            { text: 'Did you read an email I sent?', correct: false, explanation: '❌ "An" tornaria o e-mail anônimo, como se fosse qualquer mensagem aleatória do mundo todo.' },
            { text: 'Did you read email I sent?', correct: false, explanation: '❌ Falta o artigo. Em inglês, substantivos contáveis no singular sempre precisam de artigo.' },
            { text: 'Did you read a email I sent?', correct: false, explanation: '❌ Além de "a" não ser o artigo certo para algo específico, "email" começa com vogal — seria "an email".' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você quer dizer que gosta de ouvir música no geral. Qual frase está 100% correta?',
          context: '🎵 Papo descontraído com amigos.',
          options: [
            { text: 'I love music.', correct: true, explanation: '✅ Perfeito! "Music" é incontável e você fala da categoria geral. Nenhum artigo é necessário — o silêncio é a resposta certa.' },
            { text: 'I love the music.', correct: false, explanation: '❌ "The music" indicaria uma música ou álbum específico que vocês dois estavam discutindo.' },
            { text: 'I love a music.', correct: false, explanation: '❌ "Music" é incontável — não pode ser precedido de "a/an".' },
            { text: 'I love musics.', correct: false, explanation: '❌ "Music" não tem plural em inglês por ser incontável.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '⏰ Você precisa de um minutinho para terminar uma tarefa.',
          before: 'Give me ',
          after: ' minute, please.',
          answers: ['a'],
          hint: '"Minute" começa com som de consoante /m/.'
        },
        {
          type: 'fill_blank',
          context: '🕐 Você está atrasado e pede mais tempo para um colega de trabalho.',
          before: 'Can you give me just ',
          after: ' hour to finish this report?',
          answers: ['an'],
          hint: '"Hour" tem o H completamente mudo. O som inicial é a vogal /áu/.'
        },
        {
          type: 'match',
          instruction: 'Conecte cada palavra ou expressão à sua forma completa com o artigo correto:',
          pairs: [
            { left: 'honest mistake', right: 'an honest mistake' },
            { left: 'European city', right: 'a European city' },
            { left: 'umbrella', right: 'an umbrella' },
            { left: 'university degree', right: 'a university degree' },
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 2.2 — Demonstrativos no Espaço e no Tempo
    // ─────────────────────────────────────────────
    {
      id: '2-2',
      title: 'Apontando no Espaço e no Tempo: This, That, These e Those',
      emoji: '👉',
      duration: '15 min',
      color: 'from-cyan-500 to-blue-600',
      slides: [
        {
          type: 'theory',
          title: 'Perto vs. Longe / Singular vs. Plural',
          emoji: '📏',
          blocks: [
            {
              kind: 'text',
              content: 'Os pronomes demonstrativos situam as coisas em relação ao seu corpo. Antes de escolher, faça duas perguntas mentais:\n1. O objeto está **perto** (consigo tocar/segurar) ou **longe** (além do meu alcance)?\n2. É **um** objeto ou **vários**?'
            },
            {
              kind: 'table',
              headers: ['Distância', 'Singular (1 coisa)', 'Plural (2 ou mais)'],
              rows: [
                ['Perto — aqui comigo', 'This (Este / Esta / Isto)', 'These (Estes / Estas)'],
                ['Longe — ali / lá', 'That (Aquele / Aquela / Aquilo)', 'Those (Aqueles / Aquelas)'],
              ],
              highlightCol: 1
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'No supermercado:',
                  emoji: '🛒',
                  items: [
                    'This bread is fresh. (Estou segurando o pão — perto de mim.)',
                    'That bread looks good. (Pão no balcão, longe de mim.)',
                    'These grapes are sweet. (Estou com as uvas na mão.)',
                    'Those grapes are cheaper. (As uvas lá na prateleira do fundo.)'
                  ]
                }
              ]
            },
            {
              kind: 'tip',
              content: '👂 Dica de pronúncia: "This" = /dhes/ (curto e seco). "These" = /dhíiz/ (longo, com Z no final). Confundi-los muda o singular para o plural!'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Usos Inesperados: Telefone e Apresentações',
          emoji: '📞',
          blocks: [
            {
              kind: 'text',
              content: 'Em inglês, "this" e "that" também surgem em situações abstratas que pegam muitos brasileiros de surpresa:'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: '📱 Ao telefone — como se identificar:',
                  emoji: '📱',
                  items: [
                    '"Hello, this is Ana." ✅ (Alô, aqui é a Ana falando.)',
                    '"Hello, I am Ana." ❌ (Soa robótico e desnaturalizado ao telefone.)',
                    '"Hi, is this Pedro?" ✅ (Oi, é o Pedro?)',
                    '"Hi, is that the manager?" ✅ (Oi, é o gerente? — você sabe quem atendeu, mas não tem certeza.)'
                  ]
                },
                {
                  label: '🤝 Apresentando alguém presencialmente:',
                  emoji: '🤝',
                  items: [
                    '"This is my colleague, Rafael." (Rafael está do seu lado — perto.)',
                    '"That\'s the director I told you about." (Apontando para alguém ao longe na sala.)'
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: '🚨 Regra de ouro: no telefone, nunca diga "I am John." em inglês — soa muito estranho. Use sempre "This is John." para se identificar em ligações.'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Demonstrativos no Tempo: Perto e Longe na Linha do Tempo',
          emoji: '📅',
          blocks: [
            {
              kind: 'text',
              content: 'Os demonstrativos funcionam para situar eventos **no tempo** com a mesma lógica do espaço. Perto no tempo = this/these. Longe no tempo = that/those.'
            },
            {
              kind: 'table',
              headers: ['Expressão', 'Sentido', 'Exemplo prático'],
              rows: [
                ['this week', 'Esta semana (em curso)', 'I have a deadline this week.'],
                ['this year', 'Este ano (em curso)', 'I want to change jobs this year.'],
                ['that day', 'Aquele dia (passado específico)', 'That day changed everything for me.'],
                ['those years', 'Aqueles anos (época distante)', 'Those years in college were tough.'],
                ['these days', 'Hoje em dia / atualmente', 'Everything is remote these days.'],
              ],
              highlightCol: 2
            },
            {
              kind: 'tip',
              content: '💡 "These days" é uma expressão fixa que equivale a "hoje em dia" ou "atualmente". É muito comum em inglês informal: "Nobody calls anymore, these days it\'s all text messages."'
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você está segurando três chaves na mão e quer dizer "Estas chaves são minhas". Qual opção escolher?',
          context: '🔑 Procurando os donos dos pertences.',
          options: [
            { text: 'These keys are mine.', correct: true, explanation: '✅ Perfeito! "These" = plural + perto. Você está segurando as chaves na mão.' },
            { text: 'This keys are mine.', correct: false, explanation: '❌ "This" é singular. Para várias coisas perto de você, use "these".' },
            { text: 'Those keys are mine.', correct: false, explanation: '❌ "Those" indicaria que as chaves estão longe de você, mas você as está segurando.' },
            { text: 'That keys are mine.', correct: false, explanation: '❌ Duplo erro: singular + longe. As chaves são plurais e estão na sua mão.' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você quer contar para um amigo: "Naquele dia, meu voo atrasou três horas". Como você começa a frase?',
          context: '✈️ Contando uma história de viagem.',
          options: [
            { text: 'That day, my flight was three hours late.', correct: true, explanation: '✅ Exato! "That day" = aquele dia específico no passado, distante no tempo. Ponto de referência já conhecido pelos dois.' },
            { text: 'This day, my flight was three hours late.', correct: false, explanation: '❌ "This day" soaria como se o atraso fosse hoje, não no passado.' },
            { text: 'Those day, my flight was three hours late.', correct: false, explanation: '❌ "Day" é singular — "those" só funciona com plurais (those days).' },
            { text: 'These day, my flight was three hours late.', correct: false, explanation: '❌ "Day" é singular e o evento está distante no passado. "These" é para coisas próximas e plurais.' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🚗 Você está caminhando e aponta para um carro estacionado do outro lado da rua.',
          before: 'Look at ',
          after: ' beautiful car over there!',
          answers: ['that'],
          hint: 'O carro está longe (over there) e é apenas um.'
        },
        {
          type: 'fill_blank',
          context: '📱 Você liga para o seu chefe e precisa se identificar.',
          before: 'Hello, ',
          after: ' is Daniel. Is this a good time to talk?',
          answers: ['this'],
          hint: 'Em inglês, para se identificar ao telefone, o padrão é "This is [nome]."'
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 2.3 — De Quem é o Objeto? (Possessivos)
    // ─────────────────────────────────────────────
    {
      id: '2-3',
      title: 'Determinando Posses: Adjetivos, Genitivo e Pronomes',
      emoji: '🏠',
      duration: '15 min',
      color: 'from-blue-500 to-indigo-600',
      slides: [
        {
          type: 'theory',
          title: 'Adjetivos Possessivos: O Dono Dita a Regra',
          emoji: '🇧🇷',
          blocks: [
            {
              kind: 'text',
              content: 'No português, "seu/sua" varia de acordo com o objeto (*seu carro, sua casa*). No inglês, **o possessivo concorda com o dono**, e o gênero do objeto é completamente irrelevante.\n\nIsso significa que "John lost his watch" e "John lost his keys" usam o mesmo "his", seja relógio (masculino em PT) ou chaves (feminino em PT).'
            },
            {
              kind: 'table',
              headers: ['Dono da Coisa', 'Possessivo', 'Exemplo do Dia a Dia'],
              rows: [
                ['Eu (I)', 'my', 'I forgot my charger at home.'],
                ['Você (You)', 'your', 'Your meeting starts in 10 minutes.'],
                ['Ele (He)', 'his', 'He left his umbrella on the bus.'],
                ['Ela (She)', 'her', 'She changed her profile picture.'],
                ['Coisa/Animal (It)', 'its', 'The app lost its connection.'],
                ['Nós (We)', 'our', 'Our reservation is at 8 PM.'],
                ['Eles/Elas (They)', 'their', 'They cancelled their subscription.'],
              ],
              highlightCol: 1
            },
            {
              kind: 'alert',
              content: '🚨 Armadilha: "Mary loves your dog" ≠ "Mary loves her dog". "Your" = o cachorro é SEU (de quem ouve). "Her" = o cachorro é da própria Mary. O possessivo aponta para o dono, não para o objeto.'
            }
          ]
        },
        {
          type: 'theory',
          title: "O Genitivo Saxônico: O 's que Determina Posse",
          emoji: '🔑',
          blocks: [
            {
              kind: 'text',
              content: "Além dos adjetivos possessivos, o inglês tem outra forma de expressar posse muito usada no dia a dia: o **genitivo saxônico**. A fórmula é simples:\n\n**dono + 's + objeto**\n\nÉ mais natural e direto do que estruturas com 'of' e é a forma preferida na conversa."
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'No cotidiano:',
                  emoji: '🏙️',
                  items: [
                    "John's car is parked outside. (O carro do John.)",
                    "My sister's apartment is in the city center. (O apartamento da minha irmã.)",
                    "The doctor's office opens at 9. (O consultório do médico.)",
                    "My boss's email was very direct. (O e-mail do meu chefe.)"
                  ]
                },
                {
                  label: '⚠️ Caso especial — plurais irregulares:',
                  emoji: '⚠️',
                  items: [
                    "The children's room is a mess. (children já é plural — não vira childrens's)",
                    "The women's bathroom is on the left. (women já é o plural de woman)"
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: "🚨 Não confunda: \"it's\" (= it is, com apóstrofo) ≠ \"its\" (possessivo, sem apóstrofo). \"The phone lost its signal.\" ✅ / \"The phone lost it's signal.\" ❌"
            }
          ]
        },
        {
          type: 'theory',
          title: 'Pronomes Possessivos: A Posse que Substitui o Objeto',
          emoji: '🎯',
          blocks: [
            {
              kind: 'text',
              content: 'Quando o objeto já foi mencionado e você quer evitar repetição, usa-se o **pronome possessivo**. Ele substitui o adjetivo possessivo + o substantivo de uma vez só, deixando a frase mais fluida.'
            },
            {
              kind: 'table',
              headers: ['Adjetivo Possessivo', 'Pronome Possessivo', 'Exemplo Comparado'],
              rows: [
                ['my', 'mine', 'This bag is mine. (= my bag)'],
                ['your', 'yours', 'Is this seat yours? (= your seat)'],
                ['his', 'his', "That jacket is his. (= his jacket)"],
                ['her', 'hers', 'The idea was hers. (= her idea)'],
                ['our', 'ours', 'This table is ours. (= our table)'],
                ['their', 'theirs', "The mistake was theirs. (= their mistake)"],
              ],
              highlightCol: 1
            },
            {
              kind: 'tip',
              content: '💡 Pronomes possessivos nunca vêm seguidos de substantivo — eles substituem o substantivo. "This is mine bag." ❌ → "This bag is mine." ✅'
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você está conversando sobre seu amigo Roberto. Você quer dizer que "A esposa dele é simpática". Como fica?',
          context: '👥 Papo social no almoço.',
          options: [
            { text: 'His wife is nice.', correct: true, explanation: '✅ Perfeito! "His" aponta para o dono homem (Roberto). O gênero de "wife" não interfere.' },
            { text: 'Her wife is nice.', correct: false, explanation: '❌ "Her" indicaria que a esposa pertence a uma mulher, não ao Roberto.' },
            { text: 'Your wife is nice.', correct: false, explanation: '❌ Você estaria elogiando a esposa da pessoa com quem está falando, não a do Roberto.' },
            { text: 'He wife is nice.', correct: false, explanation: '❌ "He" é pronome sujeito — não pode expressar posse diretamente colado a um substantivo.' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você quer dizer "O apartamento da minha amiga fica no centro". Como fica em inglês?',
          context: '🏙️ Dando uma dica de onde morar para um conhecido.',
          options: [
            { text: "My friend's apartment is downtown.", correct: true, explanation: "✅ Perfeito! Genitivo saxônico: friend + 's + apartment. Natural, direto e a forma preferida em inglês." },
            { text: 'The apartment of my friend is downtown.', correct: false, explanation: '❌ Gramaticalmente possível, mas excessivamente formal e pouco natural. Genitivo saxônico é sempre preferido.' },
            { text: "My friends apartment is downtown.", correct: false, explanation: "❌ Sem o apóstrofo, 'friends' vira plural (amigos) e a frase perde o sentido possessivo completamente." },
            { text: "My friend her apartment is downtown.", correct: false, explanation: "❌ Estrutura inexistente em inglês. Nunca se usa pronome após o nome para indicar posse assim." }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Alguém pega sua mochila por engano na academia. Você quer dizer "Essa não é minha, é dela". Como fica?',
          context: '🎒 Na saída da academia.',
          options: [
            { text: "This isn't mine, it's hers.", correct: true, explanation: '✅ Exato! "Mine" e "hers" são pronomes possessivos — substituem "my bag" e "her bag" sem repetição.' },
            { text: "This isn't my, it's her.", correct: false, explanation: '❌ "My" e "her" são adjetivos possessivos — precisam de substantivo após eles: "my bag", "her bag".' },
            { text: "This isn't mine, it's her.", correct: false, explanation: '❌ "Mine" está correto, mas "her" sozinho sem substantivo seria um adjetivo possessivo incompleto. Use "hers".' },
            { text: "This isn't mine bag, it's hers.", correct: false, explanation: '❌ "Mine" é pronome possessivo — nunca acompanha um substantivo. Aqui seria "my bag".' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🐶 Você comprou uma casinha nova para o seu filhote de cachorro.',
          before: 'The dog is inside ',
          after: ' new house.',
          answers: ['its', 'his', 'her'],
          hint: 'Possessivo neutro para animais (ou de gênero se você tratar o pet como membro da família).'
        },
        {
          type: 'fill_blank',
          context: '🏥 Você precisa sair mais cedo do trabalho por causa de uma consulta.',
          before: "I need to leave early. I have ",
          after: " doctor's appointment at 3 PM.",
          answers: ['a'],
          hint: "Mesmo antes do genitivo saxônico, usamos artigo. \"Doctor's\" começa com som consonantal /d/ → use \"a\"."
        },
        {
          type: 'match',
          instruction: 'Conecte o adjetivo possessivo ao seu pronome possessivo correspondente:',
          pairs: [
            { left: 'my (car)', right: 'mine' },
            { left: 'your (seat)', right: 'yours' },
            { left: 'her (idea)', right: 'hers' },
            { left: 'their (house)', right: 'theirs' },
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 2.4 — Quem Recebe a Ação? (Pronomes Objeto)
    // ─────────────────────────────────────────────
    {
      id: '2-4',
      title: 'Pronomes Alvo: Quem Sofre a Ação e as Armadilhas das Preposições',
      emoji: '🎯',
      duration: '15 min',
      color: 'from-indigo-500 to-cyan-600',
      slides: [
        {
          type: 'theory',
          title: 'Quem faz vs. Quem recebe',
          emoji: '⚖️',
          blocks: [
            {
              kind: 'text',
              content: 'Os pronomes sujeito executam a ação. Quando a pessoa está no final da frase — **sofrendo ou recebendo** o impacto do verbo — eles mudam completamente de forma.'
            },
            {
              kind: 'table',
              headers: ['Sujeito (quem faz)', 'Objeto (quem recebe)', 'Exemplo do Dia a Dia'],
              rows: [
                ['I', 'me', 'She texted me last night.'],
                ['you', 'you', 'I can pick you up at 8.'],
                ['he', 'him', 'I saw him at the gym.'],
                ['she', 'her', 'Call her when you arrive.'],
                ['it', 'it', 'I found it under the couch.'],
                ['we', 'us', 'They invited us to the party.'],
                ['they', 'them', 'Tell them the meeting is canceled.'],
              ],
              highlightCol: 1
            },
            {
              kind: 'alert',
              content: '🚨 Erro clássico: "I saw he yesterday" ❌ — "He" só aparece como sujeito que executa a ação. Quando recebe a ação de "saw", vira "him": "I saw him yesterday." ✅'
            }
          ]
        },
        {
          type: 'theory',
          title: 'Preposições Exigem Pronomes Objeto — Sempre',
          emoji: '🔗',
          blocks: [
            {
              kind: 'text',
              content: 'Toda preposição em inglês (**for, with, about, without, next to, behind, between**...) deve ser seguida de pronome objeto, nunca de pronome sujeito. Esse erro é frequente entre brasileiros porque no português informal às vezes usamos "eu" depois de preposição ("entre eu e você").'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: '✅ Correto vs ❌ Incorreto:',
                  emoji: '🔍',
                  items: [
                    'Come with me to the meeting. ✅ / Come with I. ❌',
                    'This gift is for her. ✅ / This gift is for she. ❌',
                    'He did it without us. ✅ / He did it without we. ❌',
                    'She\'s always talking about him. ✅ / ...about he. ❌',
                    'The table next to them is free. ✅ / ...next to they. ❌'
                  ]
                }
              ]
            },
            {
              kind: 'tip',
              content: '💡 Regra de ouro: se vier preposição antes do pronome, use automaticamente a forma objeto (me, him, her, us, them). Sem exceções.'
            }
          ]
        },
        {
          type: 'theory',
          title: 'A Armadilha do "Between You and Me"',
          emoji: '🪤',
          blocks: [
            {
              kind: 'text',
              content: '"Between" é uma preposição como qualquer outra — e por isso deve ser seguida de pronome objeto. O erro mais famoso do inglês é usar "I" após "between", possivelmente por soar mais "sofisticado".\n\nNativos cultos sabem que "between you and I" é um erro a ser evitado.'
            },
            {
              kind: 'examples',
              groups: [
                {
                  label: 'Uso correto de between no cotidiano:',
                  emoji: '🤫',
                  items: [
                    '"This is between you and me." ✅ (Isso fica entre nós dois.)',
                    '"Between you and I." ❌ — erro clássico, mesmo em nativos.',
                    '"The decision is between him and her." ✅ (A decisão é entre ele e ela.)',
                    '"Just between us, I\'m thinking of quitting." ✅ (Entre nós, estou pensando em sair.)'
                  ]
                }
              ]
            },
            {
              kind: 'alert',
              content: '🚨 Regra final: toda estrutura com "between + pronome" usa pronomes objeto. Between me, you, him, her, us, them — NUNCA I, he, she, we, they.'
            }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você precisa passar um recado: diga ao seu colega para ligar para o Carlos (seu chefe) mais tarde.',
          context: '📞 Recado rápido de escritório.',
          options: [
            { text: 'Call him later.', correct: true, explanation: '✅ Perfeito! "Him" é o pronome objeto que substitui um homem recebendo a ação do verbo "call".' },
            { text: 'Call he later.', correct: false, explanation: '❌ "He" é pronome sujeito — só pode executar ações, nunca recebê-las.' },
            { text: 'Call his later.', correct: false, explanation: '❌ "His" é possessivo. Você não pode ligar para um possessivo.' },
            { text: 'Call me later.', correct: false, explanation: '❌ Você estaria pedindo para ligarem para você mesmo, não para o Carlos.' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Sua chefe informa que a reunião vai acontecer sem você e sem o Rafael. Como ela diz isso?',
          context: '💼 Briefing de equipe.',
          options: [
            { text: 'The meeting will happen without you and him.', correct: true, explanation: '✅ Exato! "Without" é preposição — exige pronomes objeto: "you" (não muda) e "him" (não "he").' },
            { text: 'The meeting will happen without you and he.', correct: false, explanation: '❌ "He" é sujeito. Após qualquer preposição, use pronome objeto: "him".' },
            { text: 'The meeting will happen without your and his.', correct: false, explanation: '❌ "Your" e "his" são possessivos, não pronomes objeto. Estão no contexto errado.' },
            { text: 'The meeting will happen without we.', correct: false, explanation: '❌ "We" é sujeito. Após "without", use sempre pronome objeto: "us".' }
          ]
        },
        {
          type: 'multiple_choice',
          question: 'Você quer dizer a um amigo que determinada informação "fica entre vocês dois". Qual é a forma correta?',
          context: '🤫 Compartilhando algo em segredo.',
          options: [
            { text: 'This is between you and me.', correct: true, explanation: '✅ Correto! "Between" é preposição — seguida de "you" e "me" (pronomes objeto). A forma gramaticalmente impecável.' },
            { text: 'This is between you and I.', correct: false, explanation: '❌ Erro clássico! "I" é pronome sujeito e nunca vem após preposição. Mesmo soando "mais formal", está errado.' },
            { text: 'This is between us and them.', correct: false, explanation: '❌ Pronomes corretos, mas o sentido mudou: agora são dois grupos distintos, não vocês dois especificamente.' },
            { text: 'This is between you and myself.', correct: false, explanation: '❌ "Myself" é pronome reflexivo e só é usado quando o sujeito e o objeto da ação são a mesma pessoa.' }
          ]
        },
        {
          type: 'match',
          instruction: 'Conecte o pronome sujeito ao seu pronome objeto correspondente:',
          pairs: [
            { left: 'he', right: 'him' },
            { left: 'she', right: 'her' },
            { left: 'we', right: 'us' },
            { left: 'they', right: 'them' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🏋️ Na academia, você chega primeiro e quer guardar um lugar para seu amigo.',
          before: 'Can you save a spot for ',
          after: '? My friend is still parking.',
          answers: ['me', 'him', 'her', 'us'],
          hint: 'Após a preposição "for", sempre vem pronome objeto.'
        },
      ]
    },

    // ─────────────────────────────────────────────
    // AULA 2.5 — Revisão: Prática Intensiva
    // ─────────────────────────────────────────────
    {
      id: '2-5',
      title: 'Revisão: Prática Intensiva do Nível 2',
      emoji: '🔥',
      duration: '15 min',
      color: 'from-violet-500 to-purple-700',
      slides: [
        {
          type: 'fill_blank',
          context: '🚗 Você chega atrasado à reunião e explica o motivo.',
          before: 'Sorry I\'m late — I had to find ',
          after: ' parking spot.',
          answers: ['a'],
          hint: '"Parking" começa com som de consoante /p/ e é algo indefinido — qualquer vaga que aparecesse.'
        },
        {
          type: 'fill_blank',
          context: '😷 Você explica por que não foi trabalhar ontem.',
          before: 'I couldn\'t come in. I had ',
          after: ' awful headache all morning.',
          answers: ['an'],
          hint: '"Awful" começa com som de vogal /ó/. Olhe o som, não a letra.'
        },
        {
          type: 'fill_blank',
          context: '📅 Você liga para o RH para confirmar uma entrevista que acontece nesta semana.',
          before: 'I\'m calling to confirm my interview ',
          after: ' week.',
          answers: ['this'],
          hint: 'A semana está em andamento agora — perto no tempo.'
        },
        {
          type: 'fill_blank',
          context: '📱 Você conta o que aconteceu com o celular do seu irmão.',
          before: 'My brother dropped ',
          after: ' phone in the pool.',
          answers: ['his'],
          hint: 'O dono é um homem (brother). O possessivo concorda com o dono, não com o objeto.'
        },
        {
          type: 'fill_blank',
          context: '☂️ Alguém encontrou um guarda-chuva no escritório e você sabe que é da equipe de vendas.',
          before: 'This umbrella is ',
          after: ', not ours.',
          answers: ['theirs'],
          hint: 'Pronome possessivo que substitui "their umbrella". O substantivo não é repetido.'
        },
        {
          type: 'fill_blank',
          context: '📢 Seu chefe pede para você avisar toda a equipe sobre uma mudança de agenda.',
          before: 'Please tell ',
          after: ' about the schedule change.',
          answers: ['them'],
          hint: 'A equipe (they) recebe o aviso. Após o verbo, use pronome objeto.'
        },
        {
          type: 'multiple_choice',
          question: 'Você quer dizer nostalgicamente "Naquele tempo, a vida era mais simples". Qual forma está completamente correta?',
          context: '💭 Lembrança do passado em conversa com amigos.',
          options: [
            { text: 'Those days, life was simpler.', correct: true, explanation: '✅ Perfeito! "Those days" = naquele tempo. Plural + longe no tempo = those.' },
            { text: 'These days, life was simpler.', correct: false, explanation: '❌ "These days" significa "hoje em dia" — perto no tempo, presente. O sentido ficaria completamente oposto.' },
            { text: 'That days, life was simpler.', correct: false, explanation: '❌ "Days" é plural — "that" é singular. Use "those" para plural + longe no tempo.' },
            { text: 'This days, life was simpler.', correct: false, explanation: '❌ Duplo erro: "this" é singular (days é plural) e indica proximidade no tempo (presente).' }
          ]
        },
        {
          type: 'match',
          instruction: 'Revisão geral — conecte cada contexto ao pronome correto:',
          pairs: [
            { left: 'She helped ___ (eu recebi a ajuda)', right: 'me' },
            { left: '___ car broke down (dele)', right: 'his' },
            { left: 'The prize is ___ (delas)', right: 'theirs' },
            { left: 'Come with ___ (nós)', right: 'us' }
          ]
        },
        {
          type: 'fill_blank',
          context: '🤫 Você recebeu uma notícia confidencial e pede discrição ao amigo.',
          before: 'This stays between you and ',
          after: ', okay?',
          answers: ['me'],
          hint: '"Between" é preposição — sempre seguida de pronome objeto. Nunca "I" após preposição.'
        },
        {
          type: 'completion',
          emoji: '🏆',
          title: 'Nível 2 Totalmente Dominado!',
          message: 'Parabéns! Você concluiu a revisão intensiva e provou que o conteúdo saiu da teoria e entrou na prática. Artigos, demonstrativos, possessivos e pronomes objeto — tudo isso agora faz parte do seu repertório ativo. Prepare-se para o Nível 3: os Verbos de Ação!'
        }
      ]
    }
  ]
}
