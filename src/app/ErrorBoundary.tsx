import { Component, type ReactNode } from 'react';
import { Button } from '../design-system/components/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center gap-6 bg-background">
          <h1 className="font-headline-lg text-on-surface">Algo deu errado</h1>
          <p className="font-body-md text-on-surface-variant max-w-md">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
