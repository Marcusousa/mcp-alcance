import { assert, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-view-more.visual.e2e.tsx
// yarn stencil-test --project dark alc-view-more.visual.e2e.tsx

const conteudo = [
  <p>
    ThunderCats conta as aventuras de um grupo de felinos sobreviventes do planeta Thundera.
    O primeiro episódio da série começa com a destruição de Thundera, forçando os ThunderCats
    a fugir de seu planeta natal.
  </p>,
  <p>
    A frota é atacada pelos inimigos dos Thunderianos, os mutantes de Plun-Darr, que destruíram
    as naves da frota, exceto a nave-mãe, na esperança de capturar a lendária Espada Justiceira.
  </p>,
];

/**
 * O link antes do componente serve pra estacionar o ponteiro fora da área capturada
 * depois do clique no link de alternância — sem isso, ele fica em estado de hover na captura.
 */
const contentViewMore = (props: Record<string, unknown> = {}) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-view-more data-test-view-more minHeight="4em" {...props}>
      {conteudo}
    </alc-view-more>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o link de alternância sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-view-more', () => {

  // Deve capturar screenshot do conteúdo fechado, com o degradê de corte visível
  it('fechado', async () => {
    const { root, waitForChanges } = await render(contentViewMore());

    const viewMore = root.querySelector<HTMLAlcViewMoreElement>('[data-test-view-more]');
    assert.exists(viewMore, 'O alc-view-more não foi encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(viewMore).toMatchScreenshot();
  });

  // Deve capturar screenshot do conteúdo aberto, sem o degradê (oculto quando expandido)
  it('aberto', async () => {
    const { root, waitForChanges } = await render(contentViewMore());

    const viewMore = root.querySelector<HTMLAlcViewMoreElement>('[data-test-view-more]');
    assert.exists(viewMore, 'O alc-view-more não foi encontrado');

    const toggle = root.querySelector<HTMLAnchorElement>('.alc-view-more__toggle a');
    assert.exists(toggle, 'O link de alternância não foi encontrado');

    await userEvent.click(toggle);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(viewMore.querySelector('.alc-view-more__content--opened'), 'Conteúdo não expandiu');

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(viewMore).toMatchScreenshot();
  });

  // Deve capturar screenshot do link de alternância em estado de hover
  it('fechado com hover no link', async () => {
    const { root, waitForChanges } = await render(contentViewMore());

    const viewMore = root.querySelector<HTMLAlcViewMoreElement>('[data-test-view-more]');
    assert.exists(viewMore, 'O alc-view-more não foi encontrado');

    const toggle = root.querySelector<HTMLAnchorElement>('.alc-view-more__toggle a');
    assert.exists(toggle, 'O link de alternância não foi encontrado');

    await waitForChanges();

    await userEvent.hover(toggle);
    await aguardaFontes();

    await expect(viewMore).toMatchScreenshot();
  });

  // Deve capturar screenshot do link de alternância em estado de foco por teclado
  it('fechado com foco no link', async () => {
    const { root, waitForChanges } = await render(contentViewMore());

    const viewMore = root.querySelector<HTMLAlcViewMoreElement>('[data-test-view-more]');
    assert.exists(viewMore, 'O alc-view-more não foi encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(viewMore).toMatchScreenshot();
  });

  const posicoes = [
    { name: 'a esquerda', props: { togglePosition: 'left' } },
    { name: 'a direita', props: { togglePosition: 'right' } },
  ];

  // Deve capturar screenshot do link de alternância em cada alinhamento, com o conteúdo fechado
  it.each(posicoes)('alinhamento $name', async ({ props }) => {
    const { root, waitForChanges } = await render(contentViewMore(props));

    const viewMore = root.querySelector<HTMLAlcViewMoreElement>('[data-test-view-more]');
    assert.exists(viewMore, 'O alc-view-more não foi encontrado');

    await waitForChanges();

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(viewMore).toMatchScreenshot();
  });

});
