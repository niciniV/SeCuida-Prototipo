import type { EducationResourceContentType } from '../../domain/resources/types';

export const educationContentTypeLabels: Record<EducationResourceContentType, string> = {
  article: 'Artigo interno',
  summary: 'Resumo interno',
  external_link: 'Link externo',
  pdf_link: 'PDF por link',
  video_link: 'Vídeo incorporado por link',
  audio_link: 'Áudio por link',
};

export const educationTypesRequiringUrl: EducationResourceContentType[] = [
  'external_link',
  'pdf_link',
  'video_link',
  'audio_link',
];
