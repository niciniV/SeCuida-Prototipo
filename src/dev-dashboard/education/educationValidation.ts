import type { EducationResource } from '../../domain/resources/types';
import { createValidationResult, type DashboardValidationIssue } from '../validation/validationTypes';
import { findDuplicateIds } from '../validation/duplicateIds';
import { educationTypesRequiringUrl } from './educationTypes';

export function validateDashboardEducation(resources: EducationResource[]) {
  const issues: DashboardValidationIssue[] = [];

  findDuplicateIds(resources.map((resource) => resource.id)).forEach((id) => {
    issues.push({
      level: 'error',
      area: 'education',
      id: `duplicate-material-id:${id}`,
      message: `Existe mais de um material com o ID "${id}".`,
    });
  });

  resources.forEach((resource) => {
    if (!resource.title.trim()) pushMissing(issues, resource.id, 'title', 'O título é obrigatório.');
    if (!resource.source.trim()) pushMissing(issues, resource.id, 'source', 'A fonte é obrigatória.');
    if (!resource.description.trim()) pushMissing(issues, resource.id, 'description', 'A descrição é obrigatória.');

    if (resource.tags.length === 0) {
      issues.push({
        level: 'warning',
        area: 'education',
        id: `empty-tags:${resource.id}`,
        message: 'Este material ainda não tem tags.',
        path: `${resource.id}.tags`,
      });
    }

    if (educationTypesRequiringUrl.includes(resource.contentType) && !resource.externalUrl?.trim()) {
      issues.push({
        level: 'error',
        area: 'education',
        id: `missing-url:${resource.id}`,
        message: 'Este tipo de material precisa de um link público.',
        path: `${resource.id}.externalUrl`,
      });
    }

    if (resource.contentType === 'video_link' && resource.externalUrl && !isHttpUrl(resource.externalUrl)) {
      issues.push({
        level: 'error',
        area: 'education',
        id: `invalid-video-url:${resource.id}`,
        message: 'Este link não parece ser um vídeo compatível.',
        path: `${resource.id}.externalUrl`,
      });
    }
  });

  return createValidationResult(issues);
}

function pushMissing(issues: DashboardValidationIssue[], resourceId: string, field: string, message: string) {
  issues.push({
    level: 'error',
    area: 'education',
    id: `missing-${field}:${resourceId}`,
    message,
    path: `${resourceId}.${field}`,
  });
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
