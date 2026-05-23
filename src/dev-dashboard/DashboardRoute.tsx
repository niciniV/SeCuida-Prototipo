import { useMemo, useState } from 'react';
import { Page } from '../design-system/components/Page';
import { PageHeader } from '../design-system/components/PageHeader';
import { DashboardShell, type DashboardTab } from './components/DashboardShell';
import { getShippedDashboardContent } from './content/shippedContent';
import {
  loadDashboardDrafts,
  mergeDashboardDrafts,
  saveDashboardDrafts,
} from './draft-storage/dashboardStorage';
import { EducationDashboard } from './education/EducationDashboard';
import { validateDashboardEducation } from './education/educationValidation';
import { ExportDashboard } from './export/ExportDashboard';
import { FlowDashboard } from './flows/FlowDashboard';
import { validateDashboardFlows } from './flows/flowValidation';

function upsertPatchById<T extends { id: string }>(
  records: Array<{ id: string; patch: Partial<T> }>,
  id: string,
  patch: Partial<T>,
) {
  const existingIndex = records.findIndex((record) => record.id === id);
  if (existingIndex === -1) return [...records, { id, patch }];

  return records.map((record, index) =>
    index === existingIndex ? { id, patch: { ...record.patch, ...patch } } : record,
  );
}

export function DashboardRoute() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('flows');
  const shipped = useMemo(() => getShippedDashboardContent(), []);
  const [draftState, setDraftState] = useState(() => loadDashboardDrafts());
  const mergedDrafts = useMemo(() => mergeDashboardDrafts(shipped, draftState), [draftState, shipped]);

  function updateDraftState(updater: (current: typeof draftState) => typeof draftState) {
    setDraftState((current) => {
      const next = {
        ...updater(current),
        updatedAt: new Date().toISOString(),
      };

      saveDashboardDrafts(next);
      return next;
    });
  }

  const validation = useMemo(() => {
    const flowValidation = validateDashboardFlows(
      mergedDrafts.flows,
      mergedDrafts.educationMaterials.map((resource) => resource.id),
    );
    const educationValidation = validateDashboardEducation(mergedDrafts.educationMaterials);

    return {
      errors: [...flowValidation.errors, ...educationValidation.errors],
      warnings: [...flowValidation.warnings, ...educationValidation.warnings],
    };
  }, [mergedDrafts]);
  const drafts = {
    flows: mergedDrafts.flows,
    educationMaterials: mergedDrafts.educationMaterials,
  };

  return (
    <Page>
      <PageHeader title="Dashboard" description="Rascunhos locais para fluxos e materiais educativos." />
      <DashboardShell activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'flows' && (
          <FlowDashboard
            flows={mergedDrafts.flows}
            resources={mergedDrafts.educationMaterials}
            onFlowChange={(flowIndex, flowId, patch) =>
              updateDraftState((current) => ({
                ...current,
                flowPatches: upsertPatchById(current.flowPatches, flowId, patch),
              }))
            }
          />
        )}
        {activeTab === 'education' && (
          <EducationDashboard
            resources={mergedDrafts.educationMaterials}
            onResourceChange={(resourceIndex, resourceId, patch) =>
              updateDraftState((current) => ({
                ...current,
                educationMaterialPatches: upsertPatchById(current.educationMaterialPatches, resourceId, patch),
              }))
            }
          />
        )}
        {activeTab === 'export' && <ExportDashboard shipped={shipped} drafts={drafts} validation={validation} />}
      </DashboardShell>
    </Page>
  );
}
