import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-dropdown.e2e.tsx

describe('alc-dropdown', () => {
  it('Deve retornar os valores de role e ARIAs corretamente', async () => {
    const { root } = await render(
      <alc-dropdown>
        <button slot="trigger" data-test-trigger>TRIGGER</button>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </alc-dropdown>
    );

    const trigger = root.querySelector('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');

    expect(trigger.getAttribute('role')).toBe('button');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('Deve retornar o valor de aria-expanded corretamente ao abrir e fechar o dropdown', async () => {
    const { root, waitForChanges } = await render(
      <alc-dropdown>
        <button slot="trigger" data-test-trigger>TRIGGER</button>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </alc-dropdown>
    );

    const trigger = root.querySelector('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(trigger);
    await waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('Não deve sobrescrever os valores de role e ARIA quando informado no elemento', async () => {
    const { root } = await render(
      <alc-dropdown>
        <a href="#" slot="trigger" role="link" aria-haspopup="popup" data-test-trigger>TRIGGER</a>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </alc-dropdown>
    );

    const trigger = root.querySelector('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');

    expect(trigger.getAttribute('role')).toBe('link');
    expect(trigger.getAttribute('aria-haspopup')).toBe('popup');
  });

  it('Deve fechar ao perder o foco ao pressionar tab', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <alc-dropdown>
          <button slot="trigger">trigger</button>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </alc-dropdown>
        <button>botao</button>
      </div>
    );

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('alc-dropdown');
    assert.exists(dropdown, 'Dropdown não encontrado');

    // Foco no trigger
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('trigger');

    // Abre dropdown
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    expect(dropdown.open).toBeTruthy();

    // Foco no próximo elemento
    await userEvent.keyboard('{Tab}');
    await waitForChanges();
    expect(document.activeElement?.textContent).toBe('botao');
    expect(dropdown.open).toBeFalsy();
  });

  it('Deve fechar ao perder foco clicando fora do conteúdo', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <alc-dropdown>
          <button slot="trigger" data-test-trigger>trigger</button>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </alc-dropdown>
        <button id="botao" data-test-button>botao</button>
      </div>
    );

    const dropdown = root.querySelector<HTMLAlcDropdownElement>('alc-dropdown');
    const trigger = root.querySelector<HTMLButtonElement>('[data-test-trigger]');
    const botao = root.querySelector<HTMLButtonElement>('[data-test-button]');

    assert.exists(dropdown, 'Dropdown não encontrado');
    assert.exists(trigger, 'Trigger não encontrado');
    assert.exists(botao, 'Botão externo não encontrado');

    // Clica no botão "trigger" e abre dropdown
    await userEvent.click(trigger);
    await waitForChanges();
    expect(dropdown.open).toBeTruthy();

    // Clica no botão "botao" e fecha dropdown
    await userEvent.click(botao);
    await waitForChanges();
    expect(dropdown.open).toBeFalsy();
  });
});
