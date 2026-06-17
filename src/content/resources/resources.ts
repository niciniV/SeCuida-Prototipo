import type { ResourcesContent } from '../../domain/resources/types';

const pendingReview = {
  status: 'pending_review',
  reviewedBy: null,
  reviewedAt: null,
  notes: '',
} as const;

export const resourcesContent = {
  id: 'education-resources',
  version: '0.1.0',
  status: 'draft',
  locale: 'pt-BR',
  resources: [
    {
      id: 'teacher-emotional-regulation-classroom',
      title: 'Guia de Regulação Emocional',
      source: 'FEEVALE',
      description:
        'Estratégias de suporte para apoiar o professor no cuidado pessoal com a sua saúde mental.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUu8741_OQaC5gUnsKWur7Ue7XjPl0zrmuOIJ4Beja1qwe3ecefY-jAPirXyxkalCbdbrni9ru9BNvN445eECuIikPSHgiq06Tzqu-95xgP3UoyvMQVVQI36N81_js4EGvH1QQRVXJ_e8rIpiTlui2vOpllyou7wJMei-tkTvrlnzhswzlJVMxW6GA0QKmGziWmfB7sY5Eskwn6YISBEpc1HqIHOmjdvGPEcHf13Ez2CF_WEnk99EtkQo2HAQMRaTBB1WY5bv-ygQ',
      tags: ['regulação-emocional', 'respiração', 'professores'],
      audience: 'teachers',
      featuredImage: {
        kind: 'external',
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBUu8741_OQaC5gUnsKWur7Ue7XjPl0zrmuOIJ4Beja1qwe3ecefY-jAPirXyxkalCbdbrni9ru9BNvN445eECuIikPSHgiq06Tzqu-95xgP3UoyvMQVVQI36N81_js4EGvH1QQRVXJ_e8rIpiTlui2vOpllyou7wJMei-tkTvrlnzhswzlJVMxW6GA0QKmGziWmfB7sY5Eskwn6YISBEpc1HqIHOmjdvGPEcHf13Ez2CF_WEnk99EtkQo2HAQMRaTBB1WY5bv-ygQ',
      },
      body: [
        {
          id: 'overview',
          kind: 'paragraph',
          title: 'Sobre este material',
          text: 'Este conteúdo reúne orientações breves para reconhecer sinais de desconforto emocional, organizar pequenas pausas e retomar a rotina com mais presença. É um material informativo e sem finalidade diagnóstica, portanto, não substitui o atendimento especializado com profissional.',
        },
        {
          id: 'breathing-video',
          kind: 'video',
          title: 'Vídeo: Técnica de respiração',
          url: 'https://www.youtube.com/watch?v=kiEmbhvv7Fo',
        },
        {
          id: 'practice',
          kind: 'paragraph',
          title: 'Aplicação prática',
          text: 'Recomendamos reservar um tempo adequado da sua rotina para esta prática. Você pode adaptar o tempo da prática de acordo com o contexto em que está inserido no momento.',
        },
      ],
      review: pendingReview,
    },
  ],
} satisfies ResourcesContent;

export const featuredOrientationResource = resourcesContent.resources[0];
