import type { QuestionnaireFlow, QuestionnaireValidationResult } from './types';

export function validateQuestionnaire(flow: QuestionnaireFlow): QuestionnaireValidationResult {
  const errors: string[] = [];

  // Consent validation
  if (!flow.consent) {
    errors.push(`Questionnaire ${flow.id} must have consent configuration.`);
  } else if (!flow.consent.required) {
    errors.push(`Questionnaire ${flow.id} must require consent before starting.`);
  }

  // Scoring validation
  if (!flow.scoring) {
    errors.push(`Questionnaire ${flow.id} must have a scoring method.`);
  }

  // Threshold validation
  if (!flow.thresholds || flow.thresholds.length === 0) {
    errors.push(`Questionnaire ${flow.id} must have at least one threshold.`);
  }

  // Question ID uniqueness
  const seenIds = new Set<string>();
  for (const question of flow.questions) {
    if (seenIds.has(question.id)) {
      errors.push(`Questionnaire ${flow.id} has duplicate question ID: ${question.id}.`);
      break;
    }
    seenIds.add(question.id);
  }

  // Question next references
  const questionIds = new Set(flow.questions.map((q) => q.id));
  for (const question of flow.questions) {
    if (question.next !== '__end__' && !questionIds.has(question.next)) {
      errors.push(`Question ${question.id} points to missing question ${question.next}.`);
    }
  }

  // Safety rule references
  for (const rule of flow.safetyRules ?? []) {
    if (!questionIds.has(rule.questionId)) {
      errors.push(`Safety rule references missing question ${rule.questionId}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
