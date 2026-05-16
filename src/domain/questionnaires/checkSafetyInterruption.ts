import type { QuestionnaireFlow } from './types';

export interface SafetyInterruption {
  message: string;
  destination: '/apoio' | '/contatos';
  resumable: boolean;
}

export function checkSafetyInterruption(
  flow: QuestionnaireFlow,
  questionId: string,
  answerId: string,
): SafetyInterruption | null {
  const rule = flow.safetyRules.find(
    (r) => r.questionId === questionId && r.answerId === answerId,
  );

  if (!rule) {
    return null;
  }

  return {
    message: rule.message,
    destination: rule.destination,
    resumable: rule.resumable,
  };
}
