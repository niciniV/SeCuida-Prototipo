import type { ContentMetadata } from '../../domain/content/types';
import type { QuestionnaireFlow } from '../../domain/questionnaires/types';
import { srq20Questionnaire } from './srq20';

export const questionnaireRegistry = {
  id: 'questionnaire-registry',
  version: '1.0.0',
  status: 'draft',
  locale: 'pt-BR',
  questionnaires: [srq20Questionnaire],
} satisfies ContentMetadata & { questionnaires: QuestionnaireFlow[] };
