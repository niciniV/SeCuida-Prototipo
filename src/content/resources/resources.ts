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
      title: 'Guia Prático de Regulação Emocional em Sala de Aula',
      source: 'FEEVALE',
      description:
        'Descubra estratégias práticas e acessíveis para lidar com a sobrecarga diária e gerenciar o estresse no ambiente escolar. Este material foi desenvolvido com foco no acolhimento e na preservação da saúde mental do professor.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUu8741_OQaC5gUnsKWur7Ue7XjPl0zrmuOIJ4Beja1qwe3ecefY-jAPirXyxkalCbdbrni9ru9BNvN445eECuIikPSHgiq06Tzqu-95xgP3UoyvMQVVQI36N81_js4EGvH1QQRVXJ_e8rIpiTlui2vOpllyou7wJMei-tkTvrlnzhswzlJVMxW6GA0QKmGziWmfB7sY5Eskwn6YISBEpc1HqIHOmjdvGPEcHf13Ez2CF_WEnk99EtkQo2HAQMRaTBB1WY5bv-ygQ',
      tags: ['regulação-emocional', 'sala-de-aula', 'professores'],
      audience: 'teachers',
      contentType: 'summary',
      featuredImage: { kind: 'catalog', imageId: 'hands-holding-plant' },
      body: [
        {
          id: 'overview',
          kind: 'paragraph',
          title: 'Sobre este material',
          text:
            'Este conteúdo reúne orientações breves para reconhecer sinais de tensão, organizar pequenas pausas e retomar a rotina com mais presença. Ele não substitui atendimento profissional e não tem finalidade diagnóstica.',
        },
        {
          id: 'breathing-video',
          kind: 'video',
          title: 'Vídeo: pausa de respiração para professores',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Embed configurável pelo dashboard.',
        },
        {
          id: 'practice',
          kind: 'paragraph',
          title: 'Aplicação prática',
          text:
            'Uma sugestão é reservar um momento curto antes ou depois da aula para uma pausa guiada. O professor pode adaptar a prática ao tempo disponível e ao contexto da turma.',
        },
        {
          id: 'source',
          kind: 'sourceLink',
          label: 'Acessar fonte original',
          url: 'https://www.feevale.br/',
        },
      ],
      review: pendingReview,
    },
  ],
} satisfies ResourcesContent;

export const featuredOrientationResource = resourcesContent.resources[0];
