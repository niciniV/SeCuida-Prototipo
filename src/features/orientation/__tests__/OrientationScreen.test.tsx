import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { OrientationScreen } from '../OrientationScreen';

describe('OrientationScreen', () => {
  it('renders guided orientation without free-text submission', () => {
    render(
      <MemoryRouter>
        <OrientationScreen />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Orientação sem cadastro')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Orientação guiada' })).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite ou escolha uma opção')).toBeInTheDocument();
    expect(screen.queryByText('Opções disponíveis')).not.toBeInTheDocument();
    expect(screen.queryByText('Sobrecarga na escola')).not.toBeInTheDocument();
  });

  it('fills the input when the user chooses an available option and only advances after send', () => {
    render(
      <MemoryRouter>
        <OrientationScreen />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('option', { name: 'Muitas tarefas ao mesmo tempo' }));

    expect(screen.getByPlaceholderText('Digite ou escolha uma opção')).toHaveValue('Muitas tarefas ao mesmo tempo');
    expect(
      screen.queryByText('Quando tudo parece urgente, ajuda separar o que precisa de atenção agora do que pode esperar.'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Enviar opção selecionada' }));

    expect(
      screen.getByText('Quando tudo parece urgente, ajuda separar o que precisa de atenção agora do que pode esperar.'),
    ).toBeInTheDocument();
  });

  it('exposes the conversation as an accessible log with sender context', () => {
    render(
      <MemoryRouter>
        <OrientationScreen />
      </MemoryRouter>,
    );

    expect(screen.getByRole('log', { name: 'Histórico da orientação guiada' })).toBeInTheDocument();
    expect(screen.getAllByText('SeCuida')).toHaveLength(2);
  });

  it('keeps the composer fixed as a chat input above the page navigation', () => {
    render(
      <MemoryRouter>
        <OrientationScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('orientation-composer')).toHaveClass('fixed');
    expect(screen.getByRole('button', { name: 'Enviar opção selecionada' })).toHaveAttribute('data-icon', 'send');
  });

  it('only enables send when the input exactly matches an available option', () => {
    render(
      <MemoryRouter>
        <OrientationScreen />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText('Digite ou escolha uma opção');
    const sendButton = screen.getByRole('button', { name: 'Enviar opção selecionada' });

    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'qualquer coisa' } });
    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Dificuldade para descansar' } });
    expect(sendButton).toBeEnabled();
  });

  it('shows matching options in an autocomplete overlay above the input', () => {
    render(
      <MemoryRouter>
        <OrientationScreen />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Digite ou escolha uma opção'), {
      target: { value: 'descansar' },
    });

    expect(screen.getByRole('listbox', { name: 'Sugestões de resposta' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dificuldade para descansar' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Muitas tarefas ao mesmo tempo' })).not.toBeInTheDocument();
  });
});
