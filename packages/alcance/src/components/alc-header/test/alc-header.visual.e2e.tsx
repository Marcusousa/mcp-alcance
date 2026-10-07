import { render, h, describe, it, expect, assert, vi, beforeEach } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-header.visual.e2e.tsx
// yarn stencil-test --project dark alc-header.visual.e2e.tsx

const data = {
  nome: 'Thundercats',
  descricao: 'Tecnologia thundercats',
  url: '#home',
};

/**
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: os
 * controles do header têm estado de hover.
 */
const contentHeader = (header: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    {header}
  </div>
);

const header = (props: Record<string, unknown> = {}) => (
  <alc-header name={data.nome} description={data.descricao} homeUrl={data.url} data-test-header {...props}>
    <div slot="user">
      <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
    </div>
  </alc-header>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem os ícones do header.
 */
const aguardaIcones = (elemento: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(elemento.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Espera o header parar de se reorganizar. Ele reage ao resize da janela movendo itens
 * entre o header, o dropdown de apoio e o drawer, de forma assíncrona: capturar antes
 * disso pega um estado intermediário, que muda a cada execução.
 */
const aguardaLayoutEstavel = async (elemento: HTMLElement) => {
  let anterior = '';

  await vi.waitFor(() => {
    const atual = `${elemento.offsetWidth}x${elemento.offsetHeight}:${elemento.innerHTML}`;
    const estavel = atual === anterior;
    anterior = atual;
    assert.isTrue(estavel, 'O layout do header ainda está mudando');
  }, { interval: 100 });
};

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e um controle sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-header', () => {

  beforeEach(async () => {
    await page.viewport(1440, 785);
  });

  // Deve capturar screenshot do header padrão
  it('padrao', async () => {
    const { root, waitForChanges } = await render(contentHeader(header()));

    const elemento = root.querySelector<HTMLAlcHeaderElement>('[data-test-header]');
    assert.exists(elemento, 'O header não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const userMenu = elemento.querySelector<HTMLAlcUserMenuElement>('alc-user-menu');
    assert.exists(userMenu, 'O menu de usuário não foi encontrado');
    // O header reage ao resize da janela, que não é síncrono com a renderização
    await vi.waitFor(() => expect(userMenu.variation).toBe('desktop'));
    await waitForChanges();

    await aguardaIcones(elemento);
    await aguardaLayoutEstavel(elemento);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(elemento).toMatchScreenshot();
  });

});

// Não há casos para tablet, mobile, nem para os itens de apoio e fixos: o header reorganiza itens entre o header, o dropdown de
// apoio e o drawer em resposta ao resize, de forma assíncrona, e a captura sai em estados
// diferentes a cada execução mesmo esperando o layout estabilizar. Trocar a viewport entre
// casos no mesmo arquivo agrava o problema. O comportamento responsivo é coberto por
// alc-header.e2e.tsx. Os alc-header-action têm largura definida pelo texto e são movidos
// entre header e dropdown conforme o espaço, o que reprova a comparação exata.
// Também não há caso para a propriedade version: ela desloca o menu de usuário para perto do
// ponto em que ele alterna entre expandido e compacto, e a captura sai diferente a cada
// execução. Aumentar a viewport não resolveu.
