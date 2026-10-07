import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-pagination.visual.e2e.tsx
// yarn stencil-test --project dark alc-pagination.visual.e2e.tsx

/**
 * Os botões "primeira"/"última" página ficam escondidos abaixo do breakpoint "sm" (576px,
 * escala própria do projeto) — por isso o viewport é fixado explicitamente em todos os casos.
 */
const contentPagination = (props: Record<string, unknown> = {}) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-pagination data-test-pagination totalPages={5} currentPage={3} {...props}></alc-pagination>
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
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-pagination', () => {

  // Deve capturar screenshot no meio da paginação, com todos os botões habilitados
  it('página do meio', async () => {
    await page.viewport(700, 400);

    const { root, waitForChanges } = await render(contentPagination());

    const pagination = root.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
    assert.exists(pagination, 'O alc-pagination não foi encontrado');

    // Captura o <nav> interno, não o host: o host não tem "display: block" definido
    // (mesmo caso do alc-user/alc-table/alc-tabs — ver roteiro).
    const nav = pagination.querySelector<HTMLElement>('.alc-pagination');
    assert.exists(nav, 'O nav interno não foi encontrado');

    await waitForChanges();

    await aguardaIcones(pagination);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot na primeira página, com "primeira"/"anterior" desabilitados
  it('primeira página', async () => {
    await page.viewport(700, 400);

    const { root, waitForChanges } = await render(contentPagination({ currentPage: 1 }));

    const pagination = root.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
    assert.exists(pagination, 'O alc-pagination não foi encontrado');

    // Captura o <nav> interno, não o host: o host não tem "display: block" definido
    // (mesmo caso do alc-user/alc-table/alc-tabs — ver roteiro).
    const nav = pagination.querySelector<HTMLElement>('.alc-pagination');
    assert.exists(nav, 'O nav interno não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const botoes = pagination.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
    expect(botoes[0]).toBeDisabled();
    expect(botoes[1]).toBeDisabled();

    await aguardaIcones(pagination);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot na última página, com "próxima"/"última" desabilitados
  it('última página', async () => {
    await page.viewport(700, 400);

    const { root, waitForChanges } = await render(contentPagination({ currentPage: 5 }));

    const pagination = root.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
    assert.exists(pagination, 'O alc-pagination não foi encontrado');

    // Captura o <nav> interno, não o host: o host não tem "display: block" definido
    // (mesmo caso do alc-user/alc-table/alc-tabs — ver roteiro).
    const nav = pagination.querySelector<HTMLElement>('.alc-pagination');
    assert.exists(nav, 'O nav interno não foi encontrado');

    await waitForChanges();

    const botoes = pagination.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
    expect(botoes[2]).toBeDisabled();
    expect(botoes[3]).toBeDisabled();

    await aguardaIcones(pagination);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot de um botão habilitado em estado de hover
  it('com hover no botão', async () => {
    await page.viewport(700, 400);

    const { root, waitForChanges } = await render(contentPagination());

    const pagination = root.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
    assert.exists(pagination, 'O alc-pagination não foi encontrado');

    // Captura o <nav> interno, não o host: o host não tem "display: block" definido
    // (mesmo caso do alc-user/alc-table/alc-tabs — ver roteiro).
    const nav = pagination.querySelector<HTMLElement>('.alc-pagination');
    assert.exists(nav, 'O nav interno não foi encontrado');

    await waitForChanges();

    const botoes = pagination.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');

    await aguardaIcones(pagination);
    await userEvent.hover(botoes[1]);
    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

  // Deve capturar screenshot de um botão habilitado em estado de foco por teclado
  it('com foco no botão', async () => {
    await page.viewport(700, 400);

    const { root, waitForChanges } = await render(contentPagination());

    const pagination = root.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
    assert.exists(pagination, 'O alc-pagination não foi encontrado');

    // Captura o <nav> interno, não o host: o host não tem "display: block" definido
    // (mesmo caso do alc-user/alc-table/alc-tabs — ver roteiro).
    const nav = pagination.querySelector<HTMLElement>('.alc-pagination');
    assert.exists(nav, 'O nav interno não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    await aguardaIcones(pagination);
    // Afasta o ponteiro antes de focar: o teste anterior ("com hover no botão") pode deixar
    // o cursor sobre um botão, e sem mover, ele ficaria com hover residual nesta captura.
    await afastaPonteiro(root);
    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    const botoes = pagination.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
    assert.strictEqual(document.activeElement, botoes[0], 'O primeiro botão não recebeu o foco');

    await aguardaFontes();

    await expect(nav).toMatchScreenshot();
  });

});
