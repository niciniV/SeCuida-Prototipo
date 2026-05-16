import type { QuestionnaireFlow } from './types';

export function scoreQuestionnaire(flow: QuestionnaireFlow, answers: Record<string, string>): number {
  const { method, answerId } = flow.scoring;

  if (method === 'sum_affirmative') {
    return flow.questions.reduce((score, question) => {
      return score + (answers[question.id] === answerId ? 1 : 0);
    }, 0);
  }

  return 0;
}
