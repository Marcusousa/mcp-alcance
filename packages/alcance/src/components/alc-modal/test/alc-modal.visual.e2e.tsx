import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-modal.visual.e2e.tsx
// yarn stencil-test --project dark alc-modal.visual.e2e.tsx

/**
 * Quando fechada, o Host vira "display: none" — não há nada visível pra capturar, então o
 * estado "fechado" fica fora de escopo aqui. O host também não tem tamanho quando aberto (o
 * conteúdo real é ".alc-modal__base", position: fixed cobrindo a viewport inteira) — mesma
 * classe de bug do host degenerado já vista em outros componentes, então a captura mira
 * ".alc-modal__base" (overlay + cartão), não o host. Viewport >= 576px (breakpoint "sm"), pra
 * pegar o cartão centralizado em vez do modo "folha" mobile (ancorado embaixo da tela).
 */
const contentModal = (props: Record<string, unknown> = {}) => (
  <div>
    <alc-modal data-test-modal open headerText="Título da modal" {...props}>
      <p>Conteúdo da modal.</p>
    </alc-modal>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do cartão, deixando-o sobre um canto do overlay. O overlay é "fixed" e
 * cobre a viewport inteira (z-index alto), então não há como usar um link fora do componente
 * como nos outros testes — ficaria coberto e inalcançável pelo ponteiro real. Um canto
 * explícito evita o centro (onde o Playwright miraria por padrão), que fica coberto pelo
 * cartão centralizado.
 */
const afastaPonteiro = (modal: HTMLElement) => {
  const overlay = modal.querySelector<HTMLElement>('[data-test-overlay]');
  assert.exists(overlay, 'O overlay não foi encontrado');

  return userEvent.hover(overlay, { position: { x: 5, y: 5 } });
};

describe('alc-modal', () => {

  // Deve capturar screenshot da modal aberta (overlay + cartão, tamanho "md" padrão)
  it('aberto', async () => {
    await page.viewport(700, 500);

    const { root, waitForChanges } = await render(contentModal());

    const modal = root.querySelector<HTMLAlcModalElement>('[data-test-modal]');
    assert.exists(modal, 'O alc-modal não foi encontrado');

    const base = modal.querySelector<HTMLElement>('.alc-modal__base');
    assert.exists(base, 'O container interno não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const card = modal.querySelector<HTMLElement>('[data-test-modal-card]');
    assert.exists(card, 'O cartão não foi encontrado');
    expect(card).toBeVisible();

    await aguardaIcones(modal);
    await afastaPonteiro(modal);
    await aguardaFontes();

    await expect(base).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão de fechar (cabeçalho) em estado de hover
  it('com hover no botão de fechar', async () => {
    await page.viewport(700, 500);

    const { root, waitForChanges } = await render(contentModal());

    const modal = root.querySelector<HTMLAlcModalElement>('[data-test-modal]');
    assert.exists(modal, 'O alc-modal não foi encontrado');

    const base = modal.querySelector<HTMLElement>('.alc-modal__base');
    assert.exists(base, 'O container interno não foi encontrado');

    await waitForChanges();

    const closeButton = modal.querySelector<HTMLButtonElement>('[data-test-close-button]');
    assert.exists(closeButton, 'O botão de fechar não foi encontrado');

    await aguardaIcones(modal);
    await userEvent.hover(closeButton);
    await aguardaFontes();

    await expect(base).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão do rodapé em estado de foco por teclado
  it('com foco no botão do rodapé', async () => {
    await page.viewport(700, 500);

    const { root, waitForChanges } = await render(contentModal());

    const modal = root.querySelector<HTMLAlcModalElement>('[data-test-modal]');
    assert.exists(modal, 'O alc-modal não foi encontrado');

    const base = modal.querySelector<HTMLElement>('.alc-modal__base');
    assert.exists(base, 'O container interno não foi encontrado');

    await waitForChanges();

    const closeButton = modal.querySelector<HTMLButtonElement>('[data-test-close-button]');
    assert.exists(closeButton, 'O botão de fechar não foi encontrado');

    // A modal deveria focar sozinha o primeiro elemento focável (botão de fechar do
    // cabeçalho) ao abrir (componentDidRender -> focusFirstElement). Isso não foi observado
    // de forma confiável neste ambiente de teste (document.hasFocus() é false no iframe do
    // vitest/browser) — investigado via diagnóstico isolado, não é um problema do teste em
    // si. Sem alterar o componente, replica aqui manualmente o estado inicial esperado
    // (foco programático, sem :focus-visible) pra poder testar a transição real por teclado.
    closeButton.focus();

    await aguardaIcones(modal);
    await afastaPonteiro(modal);
    // Um Tab real a partir daqui move o foco por teclado pro próximo elemento focável
    // (botão do rodapé), agora sim acionando :focus-visible.
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    const footerButton = modal.querySelector<HTMLButtonElement>('[data-test-footer-close-button]');
    assert.exists(footerButton, 'O botão do rodapé não foi encontrado');
    assert.strictEqual(document.activeElement, footerButton, 'O botão do rodapé não recebeu o foco');

    await aguardaFontes();

    await expect(base).toMatchScreenshot();
  });

});
