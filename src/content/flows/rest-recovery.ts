import type { GuidedFlow } from '../../domain/flow-engine/types';

export const restRecoveryFlow = {
  id: 'rest-recovery',
  version: '1.0.0',
  locale: 'pt-BR',
  title: 'Descanso e recuperação',
  type: 'guided_conversation',
  status: 'draft',
  entry: {
    nodeId: 'start',
    enteringPhrases: [
      'Estou com dificuldade para descansar',
      'Não consigo desligar depois da escola',
      'Quero pensar em descanso',
    ],
    transitionMessage: 'Vamos pensar em uma forma pequena e possível de recuperar energia hoje.',
  },
  nodes: {
    start: {
      id: 'start',
      kind: 'choice',
      text: 'Qual tipo de descanso parece mais possível agora?',
      options: [
        {
          id: 'quiet-minute',
          label: 'Um minuto em silêncio',
          next: 'quiet-minute-result',
        },
        {
          id: 'body-release',
          label: 'Soltar o corpo aos poucos',
          next: 'body-release-result',
        },
      ],
    },
    'quiet-minute-result': {
      id: 'quiet-minute-result',
      kind: 'result',
      text: 'Se puder, escolha um lugar mais tranquilo, apoie os pés no chão e observe a respiração por alguns ciclos.',
    },
    'body-release-result': {
      id: 'body-release-result',
      kind: 'result',
      text: 'Experimente relaxar a mandíbula, soltar os ombros e descruzar as mãos. Pequenos sinais ajudam o corpo a reduzir a tensão.',
    },
  },
} satisfies GuidedFlow;
