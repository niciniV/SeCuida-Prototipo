import { useMemo, useState } from 'react';
import { Page } from '../design-system/components/Page';
import { PageHeader } from '../design-system/components/PageHeader';
import { DashboardShell, type DashboardTab } from './components/DashboardShell';
import { getShippedDashboardContent } from './content/shippedContent';
import { EducationDashboard } from './education/EducationDashboard';
import { validateDashboardEducation } from './education/educationValidation';
import { ExportDashboard } from './export/ExportDashboard';
import { FlowDashboard } from './flows/FlowDashboard';
import { validateDashboardFlows } from './flows/flowValidation';

export function DashboardRoute() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('flows');
  const shipped = useMemo(() => getShippedDashboardContent(), []);
  const validation = useMemo(() => {
    const flowValidation = validateDashboardFlows(
      shipped.flows,
      shipped.educationMaterials.map((resource) => resource.id),
    );
    const educationValidation = validateDashboardEducation(shipped.educationMaterials);

    return {
      errors: [...flowValidation.errors, ...educationValidation.errors],
      warnings: [...flowValidation.warnings, ...educationValidation.warnings],
    };
  }, [shipped]);
  const drafts = {
    flows: shipped.flows,
    educationMaterials: shipped.educationMaterials,
  };

  return (
    <Page>
      <PageHeader title="Dashboard" description="Rascunhos locais para fluxos e materiais educativos." />
      <DashboardShell activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'flows' && <FlowDashboard flows={shipped.flows} resources={shipped.educationMaterials} />}
        {activeTab === 'education' && <EducationDashboard resources={shipped.educationMaterials} />}
        {activeTab === 'export' && <ExportDashboard shipped={shipped} drafts={drafts} validation={validation} />}
      </DashboardShell>
    </Page>
  );
}
