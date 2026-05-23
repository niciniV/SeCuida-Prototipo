import { useMemo, useState } from 'react';
import type { EducationResource } from '../../domain/resources/types';
import type { GuidedFlow } from '../../domain/flow-engine/types';
import { ValidationSummary } from '../components/ValidationSummary';
import { validateDashboardFlows } from './flowValidation';
import { FlowEditor } from './FlowEditor';
import { FlowMap } from './FlowMap';
import { FlowPreview } from './FlowPreview';

export function FlowDashboard({
  flows,
  resources,
  onFlowChange,
}: {
  flows: GuidedFlow[];
  resources: EducationResource[];
  onFlowChange: (flowIndex: number, flowId: string, patch: Partial<GuidedFlow>) => void;
}) {
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(0);
  const selectedFlow = flows[selectedFlowIndex] ?? flows[0];
  const validation = useMemo(
    () =>
      validateDashboardFlows(
        flows,
        resources.map((resource) => resource.id),
      ),
    [flows, resources],
  );

  if (!selectedFlow) {
    return <p className="font-body-md text-on-surface-variant">Nenhum fluxo disponível.</p>;
  }

  return (
    <section className="grid gap-stack-md lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-4">
        <h2 className="font-headline-sm text-on-surface">Fluxos</h2>
        <div className="mt-3 flex flex-col gap-2">
          {flows.map((flow, flowIndex) => (
            <button
              key={`${flow.id}-${flowIndex}`}
              type="button"
              onClick={() => setSelectedFlowIndex(flowIndex)}
              className={`rounded-lg px-3 py-2 text-left font-label-md ${
                selectedFlow.id === flow.id ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'
              }`}
            >
              {flow.title}
            </button>
          ))}
        </div>
      </aside>
      <div className="flex flex-col gap-stack-md">
        <FlowEditor flow={selectedFlow} onChange={(patch) => onFlowChange(selectedFlowIndex, selectedFlow.id, patch)} />
        <FlowMap flow={selectedFlow} />
        <FlowPreview flow={selectedFlow} flows={flows} />
        <ValidationSummary result={validation} />
      </div>
    </section>
  );
}
