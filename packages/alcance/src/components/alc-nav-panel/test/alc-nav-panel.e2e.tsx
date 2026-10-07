import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-nav-panel.e2e.tsx

const DESKTOP_WIDTH = 992;
const TABLET_WIDTH = 768;

describe('alc-nav-panel', () => {
  it('Deve apresentar o conteúdo esperado', async () => {
    await page.viewport(DESKTOP_WIDTH, 800);

    const { root } = await render(
      <alc-nav-panel>
        <div id="test-content">Conteúdo do Nav Panel</div>
      </alc-nav-panel>
    );

    const contentSlot = root.querySelector('[data-test-content]');
    const content = contentSlot?.querySelector('#test-content');

    // O conteúdo passado para o slot deve estar corretamente posicionado na estrutura.
    expect(contentSlot).not.toBeNull();
    expect(content).not.toBeNull();
  });

  it('Deve renderizar aberto por padrão - Desktop', async () => {
    await page.viewport(DESKTOP_WIDTH, 800);

    const { root } = await render<HTMLAlcNavPanelElement>(
      <alc-nav-panel></alc-nav-panel>
    );

    expect(root).toHaveAttribute('open'); // Atributo que aparece no DOM
    expect(root.open).toBeTruthy(); // Propriedade do componente
  });

  it('Deve renderizar fechado por padrão - Tablet', async () => {
    await page.viewport(TABLET_WIDTH, 600);

    const { root } = await render<HTMLAlcNavPanelElement>(
      <alc-nav-panel></alc-nav-panel>
    );

    expect(root).not.toHaveAttribute('open'); // Atributo que aparece no DOM
    expect(root.open).toBeFalsy(); // Propriedade do componente
  });

  it('Deve mostrar/ocultar com métodos', async () => {
    await page.viewport(DESKTOP_WIDTH, 800);

    const { root, waitForChanges } = await render<HTMLAlcNavPanelElement>(
      <alc-nav-panel></alc-nav-panel>
    );

    // Show
    await root.show();
    await waitForChanges();

    expect(root).toHaveAttribute('open');
    expect(root.open).toBeTruthy();

    // Hide
    await root.hide();
    await waitForChanges();

    expect(root).not.toHaveAttribute('open');
    expect(root.open).toBeFalsy();
  });

  it('Deve despachar "alc-state-change" ao mudar o estado', async () => {
    await page.viewport(DESKTOP_WIDTH, 800);

    const { root, spyOnEvent, waitForChanges } = await render(
      <alc-nav-panel></alc-nav-panel>
    );

    const stateChangeSpy = spyOnEvent('alc-state-change');
    const button = root.querySelector<HTMLElement>('[data-test-button]');
    assert.exists(button, 'O botão não foi encontrado');

    await userEvent.click(button);
    await waitForChanges();

    expect(stateChangeSpy).toHaveReceivedEventDetail({ state: { open: false } });

    await userEvent.click(button);
    await waitForChanges();

    expect(stateChangeSpy).toHaveReceivedEventDetail({ state: { open: true } });
  });

  it('Deve despachar "alc-state-request" ao carregar', async () => {
    await page.viewport(DESKTOP_WIDTH, 800);

    // Registra o listener ANTES de renderizar para capturar o evento do componentWillLoad
    let stateRequestReceived = false;
    const handler = () => { stateRequestReceived = true; };
    document.addEventListener('alc-state-request', handler);


    const { waitForChanges } = await render(<alc-nav-panel></alc-nav-panel>);
    await waitForChanges();

    document.removeEventListener('alc-state-request', handler);

    expect(stateRequestReceived).toBe(true);
  });

  it('Deve respeitar o estado salvo se fornecido (por exemplo, fechado)', async () => {
    await page.viewport(DESKTOP_WIDTH, 800);

    // Registra o listener ANTES de renderizar para interceptar e forçar state { open: false }
    const stateHandler = (e: Event) => {
      (e as CustomEvent).detail.state = { open: false };
    };
    document.addEventListener('alc-state-request', stateHandler);

    const { root, waitForChanges } = await render<HTMLAlcNavPanelElement>(
      <alc-nav-panel></alc-nav-panel>
    );
    await waitForChanges();

    document.removeEventListener('alc-state-request', stateHandler);

    expect(root).not.toHaveAttribute('open');
    expect(root.open).toBeFalsy();
  });

  it('Deve alternar o painel ao clicar', async () => {
    await page.viewport(DESKTOP_WIDTH, 800);

    const { root, waitForChanges } = await render<HTMLAlcNavPanelElement>(
      <alc-nav-panel></alc-nav-panel>
    );

    const button = root.querySelector<HTMLElement>('[data-test-button]');
    assert.exists(button, 'O botão não foi encontrado');

    // Inicia aberto, deve fechar
    await userEvent.click(button);
    await waitForChanges();

    expect(root).not.toHaveAttribute('open');
    expect(root.open).toBeFalsy();

    // Inicia fechado, deve abrir
    await userEvent.click(button);
    await waitForChanges();

    expect(root).toHaveAttribute('open');
    expect(root.open).toBeTruthy();
  });

  // it('Deve capturar screenshot do componente alc-nav-panel - Desktop', async () => {
  //   await page.viewport(DESKTOP_WIDTH, 800);

  //   const { root } = await render(<alc-nav-panel></alc-nav-panel>);

  //   expect(root).toMatchScreenshot();
  // });

  // it('Deve capturar screenshot do componente alc-nav-panel - Tablet', async () => {
  //   await page.viewport(TABLET_WIDTH, 600);

  //   const { root } = await render(<alc-nav-panel></alc-nav-panel>);

  //   expect(root).toMatchScreenshot();
  // });
});
