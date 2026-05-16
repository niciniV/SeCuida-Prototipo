import type { ContentLocale, ContentStatus } from '../content/types';

export interface ConsentConfig {
  required: boolean;
  message: string;
  acceptLabel: string;
  declineLabel: string;
}

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  next: string;
}

export interface AnswerOption {
  id: string;
  label: string;
  value: number;
}

export interface ScoringConfig {
  method: 'sum_affirmative';
  answerId: string;
}

export interface Threshold {
  minScore: number;
  maxScore: number;
  resultId: string;
}

export interface QuestionnaireResult {
  text: string;
  recommendations?: string[];
}

export interface SafetyRule {
  questionId: string;
  answerId: string;
  action: 'interrupt';
  message: string;
  destination: '/apoio' | '/contatos';
  resumable: boolean;
}

export interface QuestionnaireFlow {
  id: string;
  version: string;
  locale: ContentLocale;
  title: string;
  type: 'questionnaire';
  status: ContentStatus;
  consent: ConsentConfig;
  entry: {
    nodeId: string;
    enteringPhrases: string[];
    transitionMessage: string;
  };
  questions: QuestionnaireQuestion[];
  answerOptions: AnswerOption[];
  scoring: ScoringConfig;
  thresholds: Threshold[];
  results: Record<string, QuestionnaireResult>;
  safetyRules: SafetyRule[];
}

export interface QuestionnaireValidationResult {
  valid: boolean;
  errors: string[];
}
