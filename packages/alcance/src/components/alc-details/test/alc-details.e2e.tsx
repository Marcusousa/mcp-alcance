import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-details.e2e.tsx

describe('components/alc-details', () => {
  it('Deve renderizar corretamente', async () => {
    const { root } = await render(
      <alc-details summary="Titulo">
        <p>Conteudo</p>
      </alc-details>
    );

    expect(root).toHaveAttribute("summary");
    expect(root.getAttribute('summary')).toBe('Titulo');
    expect(root.textContent).toContain('Titulo');
    expect(root.textContent).toContain('Conteudo');
  });

  it('Deve expandir ao clicar no cabeçalho', async () => {
    const { root, waitForChanges } = await render(
      <alc-details summary="Titulo">
        <p>Conteúdo</p>
      </alc-details>
    );

    const details = root.querySelector('details');
    const summary = root.querySelector('summary');

    assert.exists(details, 'O elemento details não foi encontrado');
    assert.exists(summary, 'O elemento summary não foi encontrado');

    await userEvent.click(summary);
    await waitForChanges();

    expect(details).toHaveAttribute("open");
  });

  it('Deve recolher ao clicar no cabeçalho', async () => {
    const { root, waitForChanges } = await render(
      <alc-details summary="Titulo" opened={true}>
        <p>Conteúdo</p>
      </alc-details>
    );

    const details = root.querySelector('details');
    const summary = root.querySelector('summary');

    assert.exists(details, 'O elemento details não foi encontrado');
    assert.exists(summary, 'O elemento summary não foi encontrado');

    await userEvent.click(summary);
    await waitForChanges();

    expect(details).not.toHaveAttribute("open");
  });

  it('Deve disparar evento ao abrir clicando no sumário', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <alc-details summary="Titulo">
        <p>Conteúdo</p>
      </alc-details>
    );

    const summary = root.querySelector('summary');
    assert.exists(summary, 'O elemento summary não foi encontrado');

    const alcShowEvent = spyOnEvent('alc-show');

    await userEvent.click(summary);
    await waitForChanges();

    expect(alcShowEvent).toHaveReceivedEvent();
  });

  it('Deve disparar evento ao fechar clicando no sumário', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <alc-details summary="Titulo" opened={true}>
        <p>Conteúdo</p>
      </alc-details>
    );

    const summary = root.querySelector('summary');
    assert.exists(summary, 'O elemento summary não foi encontrado');

    const alcCloseEvent = spyOnEvent('alc-close');

    await userEvent.click(summary);
    await waitForChanges();

    expect(alcCloseEvent).toHaveReceivedEvent();
  });

  it('Deve disparar os eventos na ordem esperada ao expandir e recolher clicando no sumário', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <alc-details summary="Titulo">
        <p>Conteúdo</p>
      </alc-details>
    );

    const summary = root.querySelector('summary');
    assert.exists(summary, 'O elemento summary não foi encontrado');

    const alcShowEvent = spyOnEvent('alc-show');
    const alcCloseEvent = spyOnEvent('alc-close');

    await userEvent.click(summary);
    await waitForChanges();

    expect(alcShowEvent).toHaveReceivedEvent();
    expect(alcCloseEvent).not.toHaveReceivedEvent();

    await userEvent.click(summary);
    await waitForChanges();

    expect(alcCloseEvent).toHaveReceivedEvent();
  });
});
