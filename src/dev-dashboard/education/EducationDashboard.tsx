import { useMemo, useState } from 'react';
import type { EducationResource } from '../../domain/resources/types';
import { FieldHint } from '../components/FieldHint';
import { ValidationSummary } from '../components/ValidationSummary';
import { educationContentTypeLabels, educationTypesRequiringUrl } from './educationTypes';
import { validateDashboardEducation } from './educationValidation';

export function EducationDashboard({
  resources,
  onResourceChange,
}: {
  resources: EducationResource[];
  onResourceChange: (resourceIndex: number, resourceId: string, patch: Partial<EducationResource>) => void;
}) {
  const [selectedResourceIndex, setSelectedResourceIndex] = useState(0);
  const selectedResource = resources[selectedResourceIndex] ?? resources[0];
  const validation = useMemo(() => validateDashboardEducation(resources), [resources]);

  if (!selectedResource) {
    return <p className="font-body-md text-on-surface-variant">Nenhum material disponível.</p>;
  }

  return (
    <section className="grid gap-stack-md lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-4">
        <h2 className="font-headline-sm text-on-surface">Materiais</h2>
        <div className="mt-3 flex flex-col gap-2">
          {resources.map((resource, resourceIndex) => (
            <button
              key={`${resource.id}-${resourceIndex}`}
              type="button"
              onClick={() => setSelectedResourceIndex(resourceIndex)}
              className={`rounded-lg px-3 py-2 text-left font-label-md ${
                selectedResource.id === resource.id
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              {resource.title}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex flex-col gap-stack-md">
        <section className="flex flex-col gap-stack-sm rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-5">
          <h2 className="font-headline-sm text-on-surface">Dados principais</h2>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Título do material</span>
            <input
              aria-label="Título do material"
              className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
              value={selectedResource.title}
              onChange={(event) => onResourceChange(selectedResourceIndex, selectedResource.id, { title: event.target.value })}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Descrição do material</span>
            <textarea
              aria-label="Descrição do material"
              className="min-h-24 rounded-lg border border-outline-variant bg-surface px-3 py-2"
              value={selectedResource.description}
              onChange={(event) =>
                onResourceChange(selectedResourceIndex, selectedResource.id, { description: event.target.value })
              }
            />
            <FieldHint>Resumo curto que aparece na lista de materiais.</FieldHint>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Fonte do material</span>
            <input
              aria-label="Fonte do material"
              className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
              value={selectedResource.source}
              onChange={(event) => onResourceChange(selectedResourceIndex, selectedResource.id, { source: event.target.value })}
            />
            <FieldHint>Nome da organização, autora ou referência principal do material.</FieldHint>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Tipo do material</span>
            <select
              className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
              value={selectedResource.contentType}
              onChange={(event) =>
                onResourceChange(selectedResourceIndex, selectedResource.id, {
                  contentType: event.target.value as EducationResource['contentType'],
                })
              }
            >
              {Object.entries(educationContentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldHint>Escolha como este material será aberto no app.</FieldHint>
          </label>
          <>
            {educationTypesRequiringUrl.includes(selectedResource.contentType) && (
              <label className="flex flex-col gap-2">
                <span className="font-label-md text-on-surface">Link público do material</span>
                <input
                  aria-label="Link público do material"
                  className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
                  value={selectedResource.externalUrl ?? ''}
                  onChange={(event) =>
                    onResourceChange(selectedResourceIndex, selectedResource.id, { externalUrl: event.target.value })
                  }
                />
                <FieldHint>
                  Use um link público de vídeo, áudio, PDF ou página externa. Uploads não são aceitos.
                </FieldHint>
              </label>
            )}
          </>
          <div>
            <h3 className="font-headline-sm text-on-surface">Tags</h3>
            <FieldHint>Use palavras curtas para ajudar professores a encontrar o material.</FieldHint>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedResource.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary-fixed px-3 py-1 font-label-sm text-on-surface">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
        <ValidationSummary result={validation} />
      </div>
    </section>
  );
}
