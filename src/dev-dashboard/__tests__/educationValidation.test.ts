import { describe, expect, it } from 'vitest';
import type { EducationResource } from '../../domain/resources/types';
import { validateDashboardEducation } from '../education/educationValidation';

const baseResource: EducationResource = {
  id: 'resource-one',
  title: 'Material de teste',
  source: 'Equipe SeCuida',
  description: 'Descrição clara do material.',
  tags: ['descanso'],
  audience: 'teachers',
  contentType: 'summary',
  review: {
    status: 'pending_review',
    reviewedBy: null,
    reviewedAt: null,
    notes: '',
  },
};

describe('validateDashboardEducation', () => {
  it('rejects duplicate material IDs', () => {
    const result = validateDashboardEducation([baseResource, { ...baseResource }]);

    expect(result.errors).toContainEqual(
      expect.objectContaining({
        id: 'duplicate-material-id:resource-one',
        message: 'Existe mais de um material com o ID "resource-one".',
      }),
    );
  });

  it('rejects video materials without URL', () => {
    const result = validateDashboardEducation([{ ...baseResource, contentType: 'video_link' }]);

    expect(result.errors).toContainEqual(
      expect.objectContaining({
        id: 'missing-url:resource-one',
        message: 'Este tipo de material precisa de um link público.',
      }),
    );
  });

  it('warns when tags are empty', () => {
    const result = validateDashboardEducation([{ ...baseResource, tags: [] }]);

    expect(result.warnings).toContainEqual(
      expect.objectContaining({
        id: 'empty-tags:resource-one',
        message: 'Este material ainda não tem tags.',
      }),
    );
  });
});
