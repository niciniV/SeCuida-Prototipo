import { beforeEach, describe, expect, it } from 'vitest';
import type { GuidedFlow } from '../../domain/flow-engine/types';
import type { EducationResource } from '../../domain/resources/types';
import type { DashboardDraftState } from '../draft-storage/dashboardStorage';
import {
  DASHBOARD_DRAFT_SCHEMA_VERSION,
  clearDashboardDrafts,
  loadDashboardDrafts,
  mergeDashboardDrafts,
  saveDashboardDrafts,
} from '../draft-storage/dashboardStorage';

const emptyDraft: DashboardDraftState = {
  schemaVersion: DASHBOARD_DRAFT_SCHEMA_VERSION,
  flowPatches: [],
  educationMaterialPatches: [],
  addedFlows: [],
  addedEducationMaterials: [],
  updatedAt: '2026-05-22T00:00:00.000Z',
};

describe('dashboardStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty draft when storage is empty', () => {
    expect(loadDashboardDrafts()).toEqual({
      schemaVersion: DASHBOARD_DRAFT_SCHEMA_VERSION,
      flowPatches: [],
      educationMaterialPatches: [],
      addedFlows: [],
      addedEducationMaterials: [],
      updatedAt: null,
    });
  });

  it('saves and loads dashboard drafts', () => {
    saveDashboardDrafts(emptyDraft);

    expect(loadDashboardDrafts()).toEqual(emptyDraft);
  });

  it('clears dashboard drafts', () => {
    saveDashboardDrafts(emptyDraft);
    clearDashboardDrafts();

    expect(loadDashboardDrafts().updatedAt).toBeNull();
  });

  it('merges sparse overrides onto current shipped content', () => {
    const shippedFlow = { id: 'flow-one', title: 'Shipped flow' } as GuidedFlow;
    const shippedMaterial = { id: 'material-one', title: 'Shipped material' } as EducationResource;
    const draft = {
      ...emptyDraft,
      flowPatches: [{ id: 'flow-one', patch: { title: 'Edited flow' } }],
    };

    expect(mergeDashboardDrafts({ flows: [shippedFlow], educationMaterials: [shippedMaterial] }, draft)).toEqual({
      flows: [{ ...shippedFlow, title: 'Edited flow' }],
      educationMaterials: [shippedMaterial],
    });
  });
});
