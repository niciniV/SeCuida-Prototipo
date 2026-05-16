import { describe, expect, it } from 'vitest';
import { advanceFlow } from '../advanceFlow';
import { createInitialFlowState, createInitialFlowStateFromRegistry } from '../loadFlows';
import { resolveOptions } from '../resolveOptions';
import { resumeFlow } from '../resumeFlow';
import { suspendFlow } from '../suspendFlow';
import { validateFlow } from '../validateFlow';
import type { GuidedFlow } from '../types';

const validFlow: GuidedFlow = {
  id: 'fixture-flow',
  version: '1.0.0',
  locale: 'pt-BR',
  title: 'Fluxo de teste',
  type: 'guided_conversation',
  status: 'draft',
  entry: {
    nodeId: 'start',
    enteringPhrases: ['Quero começar o fluxo de teste'],
    transitionMessage: 'Vamos começar com calma.',
  },
  nodes: {
    start: {
      id: 'start',
      kind: 'choice',
      text: 'O que você quer testar?',
      options: [{ id: 'continue', label: 'Continuar', next: 'end' }],
    },
    end: {
      id: 'end',
      kind: 'result',
      text: 'Chegamos ao fim.',
      recommendations: ['respiracao-professores'],
    },
  },
};

const secondFlow: GuidedFlow = {
  id: 'second-flow',
  version: '1.0.0',
  locale: 'pt-BR',
  title: 'Segundo fluxo',
  type: 'guided_conversation',
  status: 'draft',
  entry: {
    nodeId: 'start',
    enteringPhrases: ['Quero trocar de assunto'],
    transitionMessage: 'Vamos olhar para outro ponto com calma.',
  },
  nodes: {
    start: {
      id: 'start',
      kind: 'choice',
      text: 'Por onde você quer começar?',
      options: [{ id: 'finish', label: 'Finalizar este caminho', next: 'end' }],
    },
    end: {
      id: 'end',
      kind: 'result',
      text: 'Este caminho terminou.',
    },
  },
};

describe('validateFlow', () => {
  it('accepts a JSON-compatible guided flow with explicit entering phrases', () => {
    expect(validateFlow(validFlow)).toEqual({ valid: true, errors: [] });
  });

  it('rejects invalid next references before runtime', () => {
    const invalidFlow: GuidedFlow = {
      ...validFlow,
      nodes: {
        ...validFlow.nodes,
        start: {
          ...validFlow.nodes.start,
          kind: 'choice',
          options: [{ id: 'missing', label: 'Ir para lugar ausente', next: 'missing-node' }],
        },
      },
    };

    expect(validateFlow(invalidFlow)).toEqual({
      valid: false,
      errors: ['Flow fixture-flow option missing points to missing node missing-node.'],
    });
  });

  it('returns validation errors for malformed JSON-shaped content instead of throwing', () => {
    expect(validateFlow({})).toEqual({
      valid: false,
      errors: [
        'Flow id is required.',
        'Flow entry is required.',
        'Flow nodes are required.',
      ],
    });
  });

  it('rejects node key and id mismatches', () => {
    const invalidFlow: GuidedFlow = {
      ...validFlow,
      nodes: {
        start: {
          ...validFlow.nodes.start,
          id: 'different-start',
        },
        end: validFlow.nodes.end,
      },
    };

    expect(validateFlow(invalidFlow).errors).toContain('Flow fixture-flow node key start must match node id different-start.');
  });
});

describe('flow runtime', () => {
  it('starts a flow with the entry transition and current node prompt', () => {
    const state = createInitialFlowState(validFlow, [validFlow]);

    expect(state.activeFlowId).toBe('fixture-flow');
    expect(state.activeNodeId).toBe('start');
    expect(state.transcript.map((message) => message.text)).toEqual([
      'Vamos começar com calma.',
      'O que você quer testar?',
    ]);
  });

  it('advances only through currently available options', () => {
    const state = createInitialFlowState(validFlow, [validFlow]);

    expect(() => advanceFlow(state, [validFlow], 'Resposta livre')).toThrow(
      'Selection Resposta livre is not available for node start.',
    );

    const nextState = advanceFlow(state, [validFlow], 'Continuar');

    expect(nextState.activeNodeId).toBe('end');
    expect(nextState.transcript.at(-1)?.text).toBe('Chegamos ao fim.');
  });

  it('resolves current options and global actions', () => {
    const state = createInitialFlowState(validFlow, [validFlow]);
    const labels = resolveOptions(state, [validFlow]).map((option) => option.label);

    expect(labels).toContain('Continuar');
    expect(labels).toContain('Quero apoio agora');
  });

  it('validates every registered flow before creating initial state', () => {
    const invalidRegisteredFlow: GuidedFlow = {
      ...secondFlow,
      nodes: {
        ...secondFlow.nodes,
        start: {
          ...secondFlow.nodes.start,
          kind: 'choice',
          options: [{ id: 'bad', label: 'Opção inválida', next: 'missing' }],
        },
      },
    };

    expect(() => createInitialFlowStateFromRegistry([validFlow, invalidRegisteredFlow], 'fixture-flow')).toThrow(
      'Flow second-flow option bad points to missing node missing.',
    );
  });

  it('switches flows through another flow entry phrase without merging answers', () => {
    const answeredState = advanceFlow(createInitialFlowState(validFlow, [validFlow, secondFlow]), [validFlow, secondFlow], 'Continuar');
    const switchedState = advanceFlow(answeredState, [validFlow, secondFlow], 'Quero trocar de assunto');

    expect(switchedState.activeFlowId).toBe('second-flow');
    expect(switchedState.activeNodeId).toBe('start');
    expect(switchedState.answers).toEqual({});
    expect(switchedState.suspendedFlows['fixture-flow']?.answers).toEqual({ start: 'continue' });
    expect(switchedState.transcript.map((message) => message.text)).toEqual([
      'Vamos olhar para outro ponto com calma.',
      'Por onde você quer começar?',
    ]);
  });

  it('offers resume only from result nodes when safety rules allow it', () => {
    const switchedState = advanceFlow(createInitialFlowState(validFlow, [validFlow, secondFlow]), [validFlow, secondFlow], 'Quero trocar de assunto');
    const finishedSecondFlow = advanceFlow(switchedState, [validFlow, secondFlow], 'Finalizar este caminho');

    expect(resolveOptions(finishedSecondFlow, [validFlow, secondFlow]).map((option) => option.label)).toContain('Retomar Fluxo de teste');

    const safetyBlockedState = {
      ...finishedSecondFlow,
      safetyFlags: { 'block-resume:fixture-flow': true },
    };

    expect(resolveOptions(safetyBlockedState, [validFlow, secondFlow]).map((option) => option.label)).not.toContain('Retomar Fluxo de teste');
  });

  it('ends the active flow when the end action is selected', () => {
    const state = createInitialFlowState(validFlow, [validFlow]);
    const endedState = advanceFlow(state, [validFlow], 'Encerrar por enquanto');

    expect(endedState.activeFlowId).toBeUndefined();
    expect(endedState.activeNodeId).toBeUndefined();
    expect(endedState.transcript.at(-1)?.text).toBe('Tudo bem. Você pode retomar uma orientação quando quiser.');
    expect(resolveOptions(endedState, [validFlow]).some((option) => option.kind === 'node_option')).toBe(false);
  });

  it('suspends and resumes a flow in memory', () => {
    const state = createInitialFlowState(validFlow, [validFlow]);
    const suspended = suspendFlow(state);
    const resumed = resumeFlow({ ...suspended, activeFlowId: undefined, activeNodeId: undefined }, 'fixture-flow');

    expect(resumed.activeFlowId).toBe('fixture-flow');
    expect(resumed.activeNodeId).toBe('start');
  });
});
