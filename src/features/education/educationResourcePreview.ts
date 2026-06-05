import { resourcesContent } from '../../content/resources/resources';
import type { EducationResource } from '../../domain/resources/types';
import { getShippedDashboardContent } from '../../dev-dashboard/content/shippedContent';
import {
  createEmptyDashboardDraftState,
  loadDashboardDrafts,
  mergeDashboardDrafts,
} from '../../dev-dashboard/draft-storage/dashboardStorage';

export interface EducationResourcePreviewState {
  resources: EducationResource[];
  isPreviewingDrafts: boolean;
}

export function resolveEducationResourcesForPreview(): EducationResourcePreviewState {
  const drafts = safeLoadDrafts();
  const hasEducationDrafts = drafts.educationMaterialPatches.length > 0 || drafts.addedEducationMaterials.length > 0;

  if (!hasEducationDrafts) {
    return { resources: resourcesContent.resources, isPreviewingDrafts: false };
  }

  return {
    resources: mergeDashboardDrafts(getShippedDashboardContent(), drafts).educationMaterials,
    isPreviewingDrafts: true,
  };
}

function safeLoadDrafts() {
  try {
    return loadDashboardDrafts();
  } catch {
    return createEmptyDashboardDraftState();
  }
}
