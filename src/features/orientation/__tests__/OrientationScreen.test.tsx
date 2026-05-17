import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrientationScreen } from '../OrientationScreen';

const TYPING_DELAY_MS = 1200;

function renderOrientation() {
  render(
    <MemoryRouter>
      <OrientationScreen />
    </MemoryRouter>,
  );
}

function advanceInitialLoad() {
  act(() => {
    vi.advanceTimersByTime(TYPING_DELAY_MS);
  });
}

describe('OrientationScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders guided orientation without free-text submission', () => {
    renderOrientation();

    expect(screen.queryByText('Orientação sem cadastro')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Orientação guiada' })).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite ou escolha uma opção')).toBeInTheDocument();
    expect(screen.queryByText('Opções disponíveis')).not.toBeInTheDocument();
    expect(screen.queryByText('Sobrecarga na escola')).not.toBeInTheDocument();
  });

  it('advances the flow immediately when the user clicks a bubble', () => {
    renderOrientation();
    advanceInitialLoad();

    fireEvent.click(screen.getByRole('option', { name: 'Muitas tarefas ao mesmo tempo' }));
    advanceInitialLoad();

    expect(screen.getByPlaceholderText('Digite ou escolha uma opção')).toHaveValue('');
    expect(
      screen.getByText('Quando tudo parece urgente, ajuda separar o que precisa de atenção agora do que pode esperar.'),
    ).toBeInTheDocument();
  });

  it('exposes the conversation as an accessible log with sender context', () => {
    renderOrientation();
    advanceInitialLoad();

    expect(screen.getByRole('log', { name: 'Histórico da orientação guiada' })).toBeInTheDocument();
    expect(screen.getAllByText('SeCuida')).toHaveLength(2);
  });

  it('starts SRQ-20 through chatbot autocomplete from JSON flow content', () => {
    renderOrientation();
    advanceInitialLoad();

    fireEvent.change(screen.getByPlaceholderText('Digite ou escolha uma opção'), {
      target: { value: 'SRQ-20' },
    });

    fireEvent.click(screen.getByRole('option', { name: 'Quero responder o SRQ-20' }));
    advanceInitialLoad();

    expect(screen.getByText(/Este é o SRQ-20/i)).toBeInTheDocument();
    expect(screen.getByText(/Antes de começar/i)).toBeInTheDocument();
  });

  it('does not render a questionnaire-specific screen entry', () => {
    renderOrientation();

    expect(screen.queryByRole('link', { name: /SRQ-20/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Responder SRQ-20/i })).not.toBeInTheDocument();
  });

  it('keeps the composer fixed as a chat input above the page navigation', () => {
    renderOrientation();

    expect(screen.getByTestId('orientation-composer')).toHaveClass('fixed');
    expect(screen.getByRole('button', { name: 'Enviar opção selecionada' })).toHaveAttribute('data-icon', 'send');
  });

  it('only enables send when the input exactly matches an available option', () => {
    renderOrientation();
    advanceInitialLoad();

    const input = screen.getByPlaceholderText('Digite ou escolha uma opção');
    const sendButton = screen.getByRole('button', { name: 'Enviar opção selecionada' });

    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'qualquer coisa' } });
    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Dificuldade para descansar' } });
    expect(sendButton).toBeEnabled();
  });

  it('shows matching options in an autocomplete overlay above the input', () => {
    renderOrientation();
    advanceInitialLoad();

    fireEvent.change(screen.getByPlaceholderText('Digite ou escolha uma opção'), {
      target: { value: 'descansar' },
    });

    expect(screen.getByRole('listbox', { name: 'Sugestões de resposta' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dificuldade para descansar' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Muitas tarefas ao mesmo tempo' })).not.toBeInTheDocument();
  });

  it('hides suggestions when input exactly matches an option label', () => {
    renderOrientation();
    advanceInitialLoad();

    const input = screen.getByPlaceholderText('Digite ou escolha uma opção');

    // Initially, node_option pills are visible
    expect(screen.getByRole('option', { name: 'Muitas tarefas ao mesmo tempo' })).toBeInTheDocument();

    // Type an exact match
    fireEvent.change(input, { target: { value: 'Muitas tarefas ao mesmo tempo' } });

    // Suggestions should be hidden
    expect(screen.queryByRole('listbox', { name: 'Sugestões de resposta' })).not.toBeInTheDocument();
  });

  it('shows suggestions when trailing space breaks strict match but send stays enabled', () => {
    renderOrientation();
    advanceInitialLoad();

    const input = screen.getByPlaceholderText('Digite ou escolha uma opção');
    const sendButton = screen.getByRole('button', { name: 'Enviar opção selecionada' });

    // Type exact match — suggestions hidden, send enabled
    fireEvent.change(input, { target: { value: 'Dificuldade para descansar' } });
    expect(screen.queryByRole('listbox', { name: 'Sugestões de resposta' })).not.toBeInTheDocument();
    expect(sendButton).toBeEnabled();

    // Add trailing space — strict match breaks, suggestions reappear, send stays enabled
    fireEvent.change(input, { target: { value: 'Dificuldade para descansar ' } });
    expect(screen.getByRole('listbox', { name: 'Sugestões de resposta' })).toBeInTheDocument();
    expect(sendButton).toBeEnabled();
  });

  it('shows typing indicator before initial greeting appears', () => {
    renderOrientation();

    // Typing indicator visible, no messages yet
    expect(screen.queryByText(/Vamos olhar para essa sobrecarga com calma/)).not.toBeInTheDocument();
    expect(screen.getByText('SeCuida')).toBeInTheDocument(); // avatar in typing indicator

    // After delay, messages appear
    advanceInitialLoad();

    expect(screen.getByText(/Vamos olhar para essa sobrecarga com calma/)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Muitas tarefas ao mesmo tempo' })).toBeInTheDocument();
  });

  it('shows user message immediately and bot response after delay when selecting a node option', () => {
    renderOrientation();
    advanceInitialLoad();

    fireEvent.click(screen.getByRole('option', { name: 'Muitas tarefas ao mesmo tempo' }));

    // User message visible immediately
    expect(screen.getByText('Muitas tarefas ao mesmo tempo')).toBeInTheDocument();

    // Bot response not yet visible, typing indicator shown
    expect(
      screen.queryByText('Quando tudo parece urgente, ajuda separar o que precisa de atenção agora do que pode esperar.'),
    ).not.toBeInTheDocument();

    // Options hidden during reveal
    expect(screen.queryByRole('option')).not.toBeInTheDocument();

    // After delay, bot response and new options appear
    advanceInitialLoad();

    expect(
      screen.getByText('Quando tudo parece urgente, ajuda separar o que precisa de atenção agora do que pode esperar.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Quero pensar em uma pausa curta' })).toBeInTheDocument();
  });

  it('disables input and send while revealing bot messages', () => {
    renderOrientation();
    advanceInitialLoad();

    fireEvent.click(screen.getByRole('option', { name: 'Muitas tarefas ao mesmo tempo' }));

    const input = screen.getByPlaceholderText('Digite ou escolha uma opção');
    const sendButton = screen.getByRole('button', { name: 'Enviar opção selecionada' });

    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();

    advanceInitialLoad();

    expect(input).not.toBeDisabled();
    // send is disabled because no exact match typed, but input is enabled
    expect(sendButton).toBeDisabled();
  });
});
