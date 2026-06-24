import type { ResourcesContent } from '../../domain/resources/types';
import { generatedResources } from './generated-resources';
import respiracao1 from '../../../assets/images/respiracao1.jpg';
import respiracao2 from '../../../assets/images/respiracao2.jpg';

const pendingReview = {
  status: 'pending_review',
  reviewedBy: null,
  reviewedAt: null,
  notes: '',
} as const;

const baseResources = [
  {
    id: 'teacher-emotional-regulation-classroom',
    title: 'Guia de Regulação Emocional',
    source: 'FEEVALE',
    description: 'Estratégias de suporte para apoiar o professor no cuidado pessoal com a sua saúde mental.',
    imageUrl: respiracao1,
    tags: ['regulação-emocional', 'respiração', 'professores'],
    audience: 'teachers',
    featuredImage: { kind: 'uploaded', dataUrl: respiracao1, alt: 'Exercício de respiração' },
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
        id: 'respiracao-image-1',
        kind: 'image',
        imageUrl: respiracao1,
        alt: 'Exercício de respiração passo 1',
      },
      {
        id: 'respiracao-image-2',
        kind: 'image',
        imageUrl: respiracao2,
        alt: 'Exercício de respiração passo 2',
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
] satisfies ResourcesContent['resources'];

function mergeGeneratedResources() {
  const generatedById = new Map(generatedResources.map((resource) => [resource.id, resource]));
  const baseIds = new Set(baseResources.map((resource) => resource.id));
  const overriddenBaseResources = baseResources.map((resource) => generatedById.get(resource.id) ?? resource);
  const addedGeneratedResources = generatedResources.filter((resource) => !baseIds.has(resource.id));

  return [...overriddenBaseResources, ...addedGeneratedResources];
}

export const resourcesContent = {
  id: 'education-resources',
  version: '0.1.0',
  status: 'draft',
  locale: 'pt-BR',
  resources: mergeGeneratedResources(),
} satisfies ResourcesContent;

export const featuredOrientationResource = resourcesContent.resources[0];
