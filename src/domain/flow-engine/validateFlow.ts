import type { ChoiceFlowNode, FlowNode, FlowValidationResult, GuidedFlow } from './types';

function hasText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateFlow(flow: unknown): FlowValidationResult {
  const errors: string[] = [];
  const flowRecord = isRecord(flow) ? flow : {};
  const flowId = hasText(flowRecord.id) ? String(flowRecord.id) : '';
  const flowLabel = flowId || 'unknown';
  const entry = flowRecord.entry;
  const nodes = flowRecord.nodes;

  if (!hasText(flowRecord.id)) {
    errors.push('Flow id is required.');
  }

  if (!isRecord(entry)) {
    errors.push('Flow entry is required.');
  }

  if (!isRecord(nodes)) {
    errors.push('Flow nodes are required.');
  }

  if (!isRecord(entry) || !isRecord(nodes)) {
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  const nodeIds = new Set(Object.keys(nodes));
  const entryNodeId = entry.nodeId;
  const enteringPhrases = entry.enteringPhrases;

  if (!hasText(entryNodeId) || !nodeIds.has(String(entryNodeId))) {
    errors.push(`Flow ${flowLabel} entry points to missing node ${String(entryNodeId)}.`);
  }

  if (!Array.isArray(enteringPhrases) || enteringPhrases.length === 0 || enteringPhrases.some((phrase) => !hasText(phrase))) {
    errors.push(`Flow ${flowLabel} must define explicit entering phrases.`);
  }

  Object.entries(nodes).forEach(([nodeKey, nodeValue]) => {
    validateNode(flowLabel, nodeKey, nodeValue, nodeIds, errors);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateNode(flowLabel: string, nodeKey: string, nodeValue: unknown, nodeIds: Set<string>, errors: string[]) {
  if (!isRecord(nodeValue)) {
    errors.push(`Flow ${flowLabel} node ${nodeKey} must be an object.`);
    return;
  }

  const node = nodeValue as unknown as FlowNode;

  if (!hasText(node.id)) {
    errors.push(`Flow ${flowLabel} has a node without an id.`);
  } else if (nodeKey !== node.id) {
    errors.push(`Flow ${flowLabel} node key ${nodeKey} must match node id ${node.id}.`);
  }

  if (!hasText(node.text)) {
    errors.push(`Flow ${flowLabel} node ${String(node.id)} must include text.`);
  }

  if (node.kind === 'choice') {
    validateChoiceNode(flowLabel, node, nodeIds, errors);
  }
}

function validateChoiceNode(flowLabel: string, node: ChoiceFlowNode, nodeIds: Set<string>, errors: string[]) {
  if (node.options.length === 0) {
    errors.push(`Flow ${flowLabel} choice node ${node.id} must include options.`);
  }

  node.options.forEach((option) => {
    if (!hasText(option.id)) {
      errors.push(`Flow ${flowLabel} node ${node.id} has an option without an id.`);
    }

    if (!hasText(option.label)) {
      errors.push(`Flow ${flowLabel} option ${option.id} must include a label.`);
    }

    if (!nodeIds.has(option.next)) {
      errors.push(`Flow ${flowLabel} option ${option.id} points to missing node ${option.next}.`);
    }
  });
}
