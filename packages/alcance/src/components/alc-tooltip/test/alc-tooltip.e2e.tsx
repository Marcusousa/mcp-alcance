import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-tooltip.e2e.tsx

describe('alc-tooltip', () => {
  it('Deve renderizar corretamente o texto usando slots', async () => {
    const text = "tooltip text";

    const { root } = await render(
      <alc-tooltip>
        <div slot="trigger">
          <alc-icon name="heart" label=""></alc-icon>
        </div>
        {text}
      </alc-tooltip>
    );

    const content = root.querySelector('[data-test-content]');
    assert.exists(content, 'Conteúdo não encontrado');
    expect(content).toHaveTextContent(text);
  });

  it('Deve renderizar corretamente o text usando propriedade', async () => {
    const text = "tooltip text";

    const { root } = await render(
      <alc-tooltip content={text}>
        <div slot="trigger">
          <alc-icon name="heart" label=""></alc-icon>
        </div>
      </alc-tooltip>
    );

    const content = root.querySelector('[data-test-content]');
    assert.exists(content, 'Conteúdo não encontrado');
    expect(content).toHaveTextContent(text);
  });

  it('Deve abrir ao clicar', async () => {
    const { root, waitForChanges } = await render<HTMLAlcTooltipElement>(
      <alc-tooltip content="tooltip text" trigger="click">
        <button slot="trigger" class="alc-button">Click</button>
      </alc-tooltip>
    );

    expect(root.active).toBeFalsy();

    const trigger = root.querySelector<HTMLElement>('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');
    await userEvent.click(trigger);
    await waitForChanges();

    expect(root.active).toBeTruthy();
  });

  it('Deve abrir ao focar', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <a href="#" id="reference-focus-link">referencia para foco</a>
        <alc-tooltip content="tooltip text" trigger="focus">
          <button slot="trigger" class="alc-button">Click</button>
        </alc-tooltip>
      </div>
    );

    const tooltip = root.querySelector<HTMLAlcTooltipElement>('alc-tooltip');
    const linkBefore = root.querySelector<HTMLElement>('#reference-focus-link');
    assert.exists(tooltip, 'Tooltip não encontrado');
    assert.exists(linkBefore, 'Link de referência não encontrado');

    // Foca no link antes do tooltip
    linkBefore.focus();
    await waitForChanges();

    expect(tooltip.active).toBeFalsy();

    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    const button = root.querySelector<HTMLElement>('button[slot="trigger"]');
    expect(document.activeElement).toBe(button);
    expect(tooltip.active).toBeTruthy();
  });

  it('Deve abrir ao passar o mouse em cima do botão', async () => {
    const { root, waitForChanges } = await render<HTMLAlcTooltipElement>(
      <alc-tooltip content="tooltip text" trigger="hover">
        <button slot="trigger" class="alc-button">Hover</button>
      </alc-tooltip>
    );

    const trigger = root.querySelector<HTMLElement>('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');

    // Garante que o mouse não está sobre o trigger (posição pode ter ficado do teste anterior)
    await userEvent.unhover(trigger);
    await waitForChanges();

    expect(root.active).toBeFalsy();

    // Move o mouse para a posição do botão
    await userEvent.hover(trigger);
    await waitForChanges();

    expect(root.active).toBeTruthy();
  });
});
