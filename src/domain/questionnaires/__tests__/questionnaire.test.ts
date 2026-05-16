import { describe, expect, it } from 'vitest';
import { checkSafetyInterruption } from '../checkSafetyInterruption';
import { resolveQuestionnaireResult } from '../resolveQuestionnaireResult';
import { scoreQuestionnaire } from '../scoreQuestionnaire';
import { validateQuestionnaire } from '../validateQuestionnaire';
import type { QuestionnaireFlow } from '../types';

const validQuestionnaire: QuestionnaireFlow = {
  id: 'srq-20',
  version: '1.0.0',
  locale: 'pt-BR',
  title: 'Questionário de Rastreio SRQ-20',
  type: 'questionnaire',
  status: 'draft',
  consent: {
    required: true,
    message: 'Este questionário ajuda a identificar sinais de sofrimento emocional. Não é um diagnóstico. Suas respostas ficam apenas nesta sessão.',
    acceptLabel: 'Entendi, quero responder',
    declineLabel: 'Agora não',
  },
  entry: {
    nodeId: 'q1',
    enteringPhrases: ['Quero fazer o questionário de bem-estar'],
    transitionMessage: 'Vamos começar. Responda com calma — não há respostas certas ou erradas.',
  },
  questions: [
    { id: 'q1', text: 'Você tem se sentido nervoso, tenso ou preocupado?', next: 'q2' },
    { id: 'q2', text: 'Você tem dificuldade para dormir?', next: 'q1' },
  ],
  answerOptions: [
    { id: 'yes', label: 'Sim', value: 1 },
    { id: 'no', label: 'Não', value: 0 },
  ],
  scoring: {
    method: 'sum_affirmative',
    answerId: 'yes',
  },
  thresholds: [
    { minScore: 0, maxScore: 4, resultId: 'low-distress' },
    { minScore: 5, maxScore: 20, resultId: 'possible-distress' },
  ],
  results: {
    'low-distress': {
      text: 'Seus respostas indicam poucos sinais de sofrimento emocional. Continue cuidando de si.',
      recommendations: ['teacher-emotional-regulation-classroom'],
    },
    'possible-distress': {
      text: 'Seus respostas podem indicar sofrimento emocional. Considere conversar com alguém de confiança ou buscar apoio.',
      recommendations: ['teacher-emotional-regulation-classroom'],
    },
  },
  safetyRules: [
    {
      questionId: 'q2',
      answerId: 'yes',
      action: 'interrupt',
      message: 'Você mencionou algo importante. Vou te conectar com apoio imediato.',
      destination: '/apoio',
      resumable: false,
    },
  ],
};

describe('validateQuestionnaire', () => {
  it('accepts a valid questionnaire with consent and scoring', () => {
    expect(validateQuestionnaire(validQuestionnaire)).toEqual({ valid: true, errors: [] });
  });

  it('rejects a questionnaire without consent', () => {
    const noConsent = { ...validQuestionnaire, consent: undefined } as unknown as QuestionnaireFlow;

    expect(validateQuestionnaire(noConsent)).toEqual({
      valid: false,
      errors: ['Questionnaire srq-20 must have consent configuration.'],
    });
  });

  it('rejects a questionnaire with consent.required = false', () => {
    const optionalConsent = {
      ...validQuestionnaire,
      consent: { ...validQuestionnaire.consent, required: false },
    };

    expect(validateQuestionnaire(optionalConsent)).toEqual({
      valid: false,
      errors: ['Questionnaire srq-20 must require consent before starting.'],
    });
  });

  it('rejects when question next references are missing', () => {
    const brokenNext = {
      ...validQuestionnaire,
      questions: [
        { id: 'q1', text: 'Question?', next: 'missing-question' },
      ],
      safetyRules: [],
    };

    expect(validateQuestionnaire(brokenNext)).toEqual({
      valid: false,
      errors: ['Question q1 points to missing question missing-question.'],
    });
  });

  it('rejects when question IDs are not unique', () => {
    const duplicateIds = {
      ...validQuestionnaire,
      questions: [
        { id: 'q1', text: 'First?', next: 'q1' },
        { id: 'q1', text: 'Duplicate?', next: 'q1' },
      ],
      safetyRules: [],
    };

    expect(validateQuestionnaire(duplicateIds)).toEqual({
      valid: false,
      errors: ['Questionnaire srq-20 has duplicate question ID: q1.'],
    });
  });

  it('rejects when scoring method is missing', () => {
    const noScoring = { ...validQuestionnaire, scoring: undefined } as unknown as QuestionnaireFlow;

    expect(validateQuestionnaire(noScoring)).toEqual({
      valid: false,
      errors: ['Questionnaire srq-20 must have a scoring method.'],
    });
  });

  it('rejects when thresholds are missing', () => {
    const noThresholds = { ...validQuestionnaire, thresholds: [] };

    expect(validateQuestionnaire(noThresholds)).toEqual({
      valid: false,
      errors: ['Questionnaire srq-20 must have at least one threshold.'],
    });
  });

  it('rejects when safety rule references missing question', () => {
    const badSafetyRule = {
      ...validQuestionnaire,
      questions: [
        { id: 'q1', text: 'First?', next: 'q2' },
        { id: 'q2', text: 'Second?', next: 'q1' },
      ],
      safetyRules: [
        {
          questionId: 'missing-question',
          answerId: 'yes',
          action: 'interrupt' as const,
          message: 'Important.',
          destination: '/apoio' as const,
          resumable: false,
        },
      ],
    };

    expect(validateQuestionnaire(badSafetyRule)).toEqual({
      valid: false,
      errors: ['Safety rule references missing question missing-question.'],
    });
  });
});

describe('scoreQuestionnaire', () => {
  it('scores answers using sum_affirmative method', () => {
    const answers = { q1: 'yes', q2: 'no' };

    expect(scoreQuestionnaire(validQuestionnaire, answers)).toBe(1);
  });

  it('returns 0 when no affirmative answers', () => {
    const answers = { q1: 'no', q2: 'no' };

    expect(scoreQuestionnaire(validQuestionnaire, answers)).toBe(0);
  });

  it('counts all affirmative answers', () => {
    const answers = { q1: 'yes', q2: 'yes' };

    expect(scoreQuestionnaire(validQuestionnaire, answers)).toBe(2);
  });
});

describe('resolveQuestionnaireResult', () => {
  it('returns low-distress result for score below threshold', () => {
    const result = resolveQuestionnaireResult(validQuestionnaire, 2);

    expect(result.resultId).toBe('low-distress');
    expect(result.text).toContain('poucos sinais');
  });

  it('returns possible-distress result for score at or above threshold', () => {
    const result = resolveQuestionnaireResult(validQuestionnaire, 7);

    expect(result.resultId).toBe('possible-distress');
    expect(result.text).toContain('sofrimento emocional');
  });

  it('includes recommendations from the result', () => {
    const result = resolveQuestionnaireResult(validQuestionnaire, 7);

    expect(result.recommendations).toContain('teacher-emotional-regulation-classroom');
  });

  it('uses maxScore for upper bound inclusive', () => {
    const result = resolveQuestionnaireResult(validQuestionnaire, 4);

    expect(result.resultId).toBe('low-distress');
  });

  it('uses minScore for lower bound inclusive', () => {
    const result = resolveQuestionnaireResult(validQuestionnaire, 5);

    expect(result.resultId).toBe('possible-distress');
  });
});

describe('checkSafetyInterruption', () => {
  it('returns null when no safety rule matches', () => {
    const interruption = checkSafetyInterruption(validQuestionnaire, 'q1', 'no');

    expect(interruption).toBeNull();
  });

  it('returns interruption when safety rule matches', () => {
    const interruption = checkSafetyInterruption(validQuestionnaire, 'q2', 'yes');

    expect(interruption).toEqual({
      message: 'Você mencionou algo importante. Vou te conectar com apoio imediato.',
      destination: '/apoio',
      resumable: false,
    });
  });

  it('checks both questionId and answerId', () => {
    const interruption = checkSafetyInterruption(validQuestionnaire, 'q2', 'no');

    expect(interruption).toBeNull();
  });
});
