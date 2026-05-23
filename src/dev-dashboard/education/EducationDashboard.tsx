import { useMemo, useState } from 'react';
import type { EducationResource } from '../../domain/resources/types';
import { FieldHint } from '../components/FieldHint';
import { ValidationSummary } from '../components/ValidationSummary';
import { educationContentTypeLabels, educationTypesRequiringUrl } from './educationTypes';
import { validateDashboardEducation } from './educationValidation';

export function EducationDashboard({ resources }: { resources: EducationResource[] }) {
  const [selectedResourceId, setSelectedResourceId] = useState(resources[0]?.id);
  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? resources[0];
  const validation = useMemo(() => validateDashboardEducation(resources), [resources]);

  if (!selectedResource) {
    return <p className="font-body-md text-on-surface-variant">Nenhum material disponível.</p>;
  }

  return (
    <section className="grid gap-stack-md lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-4">
        <h2 className="font-headline-sm text-on-surface">Materiais</h2>
        <div className="mt-3 flex flex-col gap-2">
          {resources.map((resource) => (
            <button
              key={resource.id}
              type="button"
              onClick={() => setSelectedResourceId(resource.id)}
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
            <span className="font-label-md text-on-surface">Título</span>
            <input
              className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
              value={selectedResource.title}
              readOnly
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Descrição</span>
            <textarea
              className="min-h-24 rounded-lg border border-outline-variant bg-surface px-3 py-2"
              value={selectedResource.description}
              readOnly
            />
            <FieldHint>Resumo curto que aparece na lista de materiais.</FieldHint>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Fonte</span>
            <input
              className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
              value={selectedResource.source}
              readOnly
            />
            <FieldHint>Nome da organização, autora ou referência principal do material.</FieldHint>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-on-surface">Tipo do material</span>
            <select
              className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
              value={selectedResource.contentType}
              readOnly
            >
              {Object.entries(educationContentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldHint>Escolha como este material será aberto no app.</FieldHint>
          </label>
          {educationTypesRequiringUrl.includes(selectedResource.contentType) && (
            <label className="flex flex-col gap-2">
              <span className="font-label-md text-on-surface">Link público</span>
              <input
                className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3"
                value={selectedResource.externalUrl ?? ''}
                readOnly
              />
              <FieldHint>
                Use um link público de vídeo, áudio, PDF ou página externa. Uploads não são aceitos.
              </FieldHint>
            </label>
          )}
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
