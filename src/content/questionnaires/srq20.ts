import type { QuestionnaireFlow } from '../../domain/questionnaires/types';

export const srq20Questionnaire: QuestionnaireFlow = {
  id: 'srq-20',
  version: '1.0.0',
  locale: 'pt-BR',
  title: 'Rastreio de Sofrimento Psicossocial',
  type: 'questionnaire',
  status: 'draft',

  consent: {
    required: true,
    message:
      'Este questionário serve para identificar sinais de sofrimento e não para diagnosticar nenhum problema. As perguntas são simples e cobrem como você tem se sentido nas últimas semanas. Não existe resposta certa ou errada — responda com sinceridade, pensando no que faz mais sentido para você. Se em algum momento se sentir desconfortável, você pode interromper a qualquer momento.',
    acceptLabel: 'Quero responder',
    declineLabel: 'Agora não',
  },

  entry: {
    nodeId: 'q1',
    enteringPhrases: [
      'quero fazer o questionário',
      'avaliar como estou',
      'preencher o formulário',
      'ver como estou me sentindo',
    ],
    transitionMessage:
      'Vamos começar. Lembre-se: não existe resposta certa ou errada. Responda pensando nas últimas semanas.',
  },

  questions: [
    {
      id: 'q1',
      text: 'Você tem se sentido nervoso(a), tenso(a) ou preocupado(a) sem motivo claro?',
      next: 'q2',
    },
    {
      id: 'q2',
      text: 'Você tem tido dificuldade para dormir — demora para conseguir dormir ou acorda no meio da noite?',
      next: 'q3',
    },
    {
      id: 'q3',
      text: 'Você tem sentido medo ou receio de algo, mesmo sem saber bem o que é?',
      next: 'q4',
    },
    {
      id: 'q4',
      text: 'Você tem sentido o estômago ruim, com dor ou mal-estar, mesmo sem ter comido nada estranho?',
      next: 'q5',
    },
    {
      id: 'q5',
      text: 'Você tem tido tonturas ou sensação de cabeça leve?',
      next: 'q6',
    },
    {
      id: 'q6',
      text: 'Suas mãos tremem mesmo quando você não está fazendo esforço?',
      next: 'q7',
    },
    {
      id: 'q7',
      text: 'Você tem tido menos vontade de comer, mesmo quando é hora da refeição?',
      next: 'q8',
    },
    {
      id: 'q8',
      text: 'Você tem chorado com mais facilidade do que antes, mesmo por coisas pequenas?',
      next: 'q9',
    },
    {
      id: 'q9',
      text: 'Tem sido difícil sentir prazer ou alegria nas coisas que antes te faziam bem?',
      next: 'q10',
    },
    {
      id: 'q10',
      text: 'Você tem tido dificuldade para tomar decisões, mesmo as do dia a dia?',
      next: 'q11',
    },
    {
      id: 'q11',
      text: 'As tarefas do dia a dia — em casa ou no trabalho — têm parecido mais difíceis do que o normal?',
      next: 'q12',
    },
    {
      id: 'q12',
      text: 'Você sente que seu trabalho não está fazendo diferença ou que não está sendo útil?',
      next: 'q13',
    },
    {
      id: 'q13',
      text: 'Você tem perdido o interesse por coisas que antes considerava importantes?',
      next: 'q14',
    },
    {
      id: 'q14',
      text: 'Você tem se sentido sem valor ou como se não fosse capaz?',
      next: 'q15',
    },
    {
      id: 'q15',
      text: 'Você tem se sentido exausto(a), sem energia nem para as coisas básicas?',
      next: 'q16',
    },
    {
      id: 'q16',
      text: 'Você tem sentido alguma sensação desagradável no estômago, como aperto, queimação ou nojo?',
      next: 'q17',
    },
    {
      id: 'q17',
      text: 'Você já teve pensamentos de que seria melhor estar morto(a) ou de se machucar?',
      next: 'q18',
    },
    {
      id: 'q18',
      text: 'Você tem dormido mal — acorda cansado(a) mesmo depois de ter dormido?',
      next: 'q19',
    },
    {
      id: 'q19',
      text: 'Você tem se sentido preocupado(a) com coisas do dia a dia de um jeito que não consegue controlar?',
      next: 'q20',
    },
    {
      id: 'q20',
      text: 'Você se cansa com facilidade, mesmo com atividades que antes não te cansavam?',
      next: '__end__',
    },
  ],

  answerOptions: [
    { id: 'yes', label: 'Sim', value: 1 },
    { id: 'no', label: 'Não', value: 0 },
  ],

  scoring: {
    method: 'sum_affirmative',
    answerId: 'yes',
  },

  thresholds: [
    { minScore: 0, maxScore: 6, resultId: 'low-distress' },
    { minScore: 7, maxScore: 20, resultId: 'possible-distress' },
  ],

  results: {
    'low-distress': {
      text: 'Com base nas suas respostas, você parece estar lidando bem com as demandas do dia a dia. Isso não significa que tudo está perfeito — mas sugere que, neste momento, você tem encontrado formas de cuidar de si. Continue prestando atenção em como se sente e valorize os momentos que te fazem bem.',
      recommendations: [
        'Mantenha rotinas que te ajudam a descansar e recarregar.',
        'Converse com alguém de confiança quando sentir necessidade.',
        'Explore as demais ferramentas do SeCuida para manter o autocuidado em dia.',
      ],
    },
    'possible-distress': {
      text: 'Com base nas suas respostas, você pode estar passando por um momento de maior sofrimento. Isso não é um diagnóstico — é um sinal de que vale a pena prestar mais atenção em si mesmo(a). Muitas pessoas passam por fases assim, e buscar apoio é um ato de coragem, não de fraqueza.',
      recommendations: [
        'Considere conversar com alguém de confiança — um colega, amigo ou profissional de saúde.',
        'Acesse a seção Apoio do SeCuida para encontrar recursos e contatos de ajuda.',
        'Lembre-se: cuidar de si não é egoísmo — é necessidade. Você merece esse cuidado.',
      ],
    },
  },

  safetyRules: [
    {
      questionId: 'q17',
      answerId: 'yes',
      action: 'interrupt',
      message:
        'Agradecemos sua coragem em responder com sinceridade. Pensamentos assim merecem atenção e acolhimento profissional. Vamos te direcionar para recursos de apoio imediato. Você não está sozinho(a).',
      destination: '/apoio',
      resumable: false,
    },
  ],
};
