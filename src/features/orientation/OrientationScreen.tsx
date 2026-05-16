import { useMemo, useState } from 'react';
import { BookOpen, Compass, HeartHandshake, MessageCircle, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../app/routes';
import { flowRegistry } from '../../content/flows/registry';
import { resourcesContent } from '../../content/resources/resources';
import { Badge } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';
import { Page } from '../../design-system/components/Page';
import { advanceFlow } from '../../domain/flow-engine/advanceFlow';
import { createInitialFlowStateFromRegistry } from '../../domain/flow-engine/loadFlows';
import { resolveOptions } from '../../domain/flow-engine/resolveOptions';
import type { ChatMessage, RuntimeOption } from '../../domain/flow-engine/types';

const flows = flowRegistry.flows;

export function OrientationScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [state, setState] = useState(() => createInitialFlowStateFromRegistry(flows, 'work-stress'));
  const activeFlow = flows.find((flow) => flow.id === state.activeFlowId) ?? flows[0];
  const activeNode = activeFlow.nodes[state.activeNodeId ?? activeFlow.entry.nodeId];
  const options = useMemo(() => resolveOptions(state, flows), [state]);
  const filteredOptions = useMemo(() => {
    const normalizedFilter = filter.trim().toLocaleLowerCase('pt-BR');

    if (!normalizedFilter) {
      return options;
    }

    return options.filter((option) => option.label.toLocaleLowerCase('pt-BR').includes(normalizedFilter));
  }, [filter, options]);
  const recommendationIds = activeNode.kind === 'result' ? activeNode.recommendations ?? [] : [];
  const recommendations = resourcesContent.resources.filter((resource) => recommendationIds.includes(resource.id));

  function handleSelect(option: RuntimeOption) {
    if (option.kind === 'global_action' && option.target !== 'end') {
      navigate(option.target);
      return;
    }

    setState((currentState) => advanceFlow(currentState, flows, option.label));
    setFilter('');
  }

  return (
    <Page width="wide" className="gap-stack-md md:gap-stack-lg">
      <section className="grid gap-stack-md lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="flex flex-col gap-stack-md">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
              <Compass size={24} aria-hidden="true" />
            </span>
            <Badge tone="primary">Orientação sem cadastro</Badge>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <h1 className="font-display-lg text-on-background">Orientação guiada</h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl">
              Um caminho breve, com escolhas fechadas, para organizar o que está pesando agora. O SeCuida não interpreta texto livre
              nem substitui atendimento profissional.
            </p>
          </div>

          <Card className="p-gutter bg-surface-container-low">
            <div className="flex items-start gap-3">
              <HeartHandshake className="mt-1 text-primary" size={22} aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-sm text-on-surface">{activeFlow.title}</h2>
                <p className="font-body-md text-on-surface-variant">
                  As respostas ficam apenas nesta sessão em memória. Você pode mudar de caminho ou encerrar quando quiser.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <section className="flex min-h-[620px] flex-col overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest shadow-[0_16px_48px_rgba(17,28,44,0.08)]">
          <div className="flex items-center justify-between border-b border-outline-variant/40 bg-surface-container-low px-4 py-3 md:px-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary shadow-sm">
                <MessageCircle size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-headline-sm text-on-surface">Conversa por escolhas</h2>
                <p className="font-body-md text-on-surface-variant">Selecione uma opção disponível para continuar.</p>
              </div>
            </div>
          </div>

          <div
            className="flex flex-1 flex-col gap-stack-md overflow-y-auto px-4 py-5 md:px-6"
            role="log"
            aria-label="Histórico da orientação guiada"
            aria-live="polite"
          >
            {state.transcript.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {recommendations.map((resource) => (
              <Card key={resource.id} className="ml-auto w-full max-w-[88%] p-gutter bg-surface-container-low">
                <div className="flex flex-col gap-3">
                  <Badge tone="secondary">{resource.source}</Badge>
                  <div>
                    <h3 className="font-headline-sm text-on-surface">{resource.title}</h3>
                    <p className="font-body-md text-on-surface-variant mt-1">{resource.description}</p>
                  </div>
                  <Button type="button" className="w-full sm:w-fit" onClick={() => navigate(routes.education)}>
                    <BookOpen size={20} aria-hidden="true" />
                    Ver material
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="border-t border-outline-variant/40 bg-surface px-4 py-4 md:px-6">
            <label className="font-label-md text-on-surface" htmlFor="orientation-option-filter">
              Opções disponíveis
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} aria-hidden="true" />
              <input
                id="orientation-option-filter"
                type="text"
                placeholder="Filtrar opções disponíveis"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full rounded-full border border-outline-variant bg-surface-container-lowest py-3 pl-12 pr-12 font-body-md text-on-surface placeholder:text-on-surface-variant focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {filter && (
                <button
                  type="button"
                  aria-label="Limpar filtro"
                  onClick={() => setFilter('')}
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {filteredOptions.map((option) => (
                <OptionButton key={`${option.kind}-${option.id}`} option={option} onSelect={handleSelect} />
              ))}
              {filteredOptions.length === 0 && (
                <p className="font-body-md text-on-surface-variant">Nenhuma opção disponível com esse filtro.</p>
              )}
            </div>
          </div>
        </section>
      </section>
    </Page>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'rounded-br-sm bg-primary text-on-primary'
            : 'rounded-bl-sm border border-outline-variant/40 bg-[#EEF8F3] text-on-surface'
        }`}
      >
        <span className="sr-only">{isUser ? 'Você' : 'SeCuida'}</span>
        <p className="font-body-md">{message.text}</p>
      </div>
    </div>
  );
}

function OptionButton({ option, onSelect }: { option: RuntimeOption; onSelect: (option: RuntimeOption) => void }) {
  const isGlobal = option.kind === 'global_action';

  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className={`min-h-11 rounded-full px-4 py-2 text-left font-label-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        isGlobal
          ? 'border border-outline-variant bg-surface-container-lowest text-secondary hover:border-secondary hover:bg-surface-container-low'
          : 'bg-primary-fixed text-on-surface hover:bg-primary-fixed-dim'
      }`}
    >
      {option.label}
    </button>
  );
}
