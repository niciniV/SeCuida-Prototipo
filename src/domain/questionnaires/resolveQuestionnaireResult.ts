import type { QuestionnaireFlow, QuestionnaireResult } from './types';

export function resolveQuestionnaireResult(
  flow: QuestionnaireFlow,
  score: number,
): QuestionnaireResult & { resultId: string } {
  const threshold = flow.thresholds.find((t) => score >= t.minScore && score <= t.maxScore);

  if (!threshold) {
    throw new Error(`No threshold found for score ${score}.`);
  }

  const result = flow.results[threshold.resultId];

  if (!result) {
    throw new Error(`Result ${threshold.resultId} not found.`);
  }

  return {
    resultId: threshold.resultId,
    ...result,
  };
}
