import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-user-menu.visual.e2e.tsx
// yarn stencil-test --project dark alc-user-menu.visual.e2e.tsx

/**
 * O dropdown (desktop) usa alc-popup com strategy="fixed", então o menu aberto fica fora
 * do box do alc-user-menu. Por isso a captura é feita no contêiner, alto o bastante para
 * conter o gatilho/cabeçalho e o menu ou expander abertos abaixo dele.
 * O link anterior serve para estacionar o ponteiro do mouse fora da área capturada.
 */
const contentUserMenu = (props: Record<string, unknown> = {}, children?: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ height: '340px', width: '460px' }}>
      <alc-user-menu
        data-test-user-menu
        name="Lion-O"
        registrationNumber="P_0001"
        logoutUrl="#"
        {...props}
      >
        Third Earth - Setor 4
        {children}
      </alc-user-menu>
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o ícone do avatar, do chevron ou do "sair".
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o gatilho do menu sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-user-menu', () => {

  // Deve capturar screenshot do menu desktop com o dropdown fechado
  it('desktop fechado', async () => {
    // >= 1200px: sem isso, o viewport padrão do runner é estreito o bastante para o
    // componente mover nome/matrícula pra dentro do dropdown (moveInfo), escondendo-os.
    await page.viewport(1440, 900);

    const { root, waitForChanges } = await render(contentUserMenu());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do gatilho do dropdown em estado de hover, ainda fechado
  it('desktop fechado com hover no gatilho', async () => {
    await page.viewport(1440, 900);

    const { root, waitForChanges } = await render(contentUserMenu());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const trigger = root.querySelector<HTMLElement>('[data-test-dropdown-button]');
    assert.exists(trigger, 'O gatilho do dropdown não foi encontrado');

    await waitForChanges();

    await aguardaIcones(container);
    await userEvent.hover(trigger);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do gatilho do dropdown em estado de foco por teclado, ainda fechado
  it('desktop fechado com foco no gatilho', async () => {
    await page.viewport(1440, 900);

    const { root, waitForChanges } = await render(contentUserMenu());

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    await aguardaIcones(container);
    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do menu desktop com o dropdown aberto e itens extras do slot "actions"
  it('desktop aberto', async () => {
    // >= 1200px: mesma razão do caso "desktop fechado" — mantém nome/matrícula visíveis fora do dropdown.
    await page.viewport(1440, 900);

    const { root, waitForChanges } = await render(contentUserMenu({}, (
      <div slot="actions">
        <alc-menu-item>Ajuda</alc-menu-item>
      </div>
    )));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const trigger = root.querySelector<HTMLElement>('[data-test-dropdown-button]');
    assert.exists(trigger, 'O gatilho do dropdown não foi encontrado');

    await userEvent.click(trigger);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const dropdown = root.querySelector<HTMLAlcDropdownElement>('[data-test-dropdown]');
    assert.exists(dropdown, 'O dropdown não foi encontrado');
    expect(dropdown.open).toBe(true);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do menu mobile com o expander fechado
  it('mobile fechado', async () => {
    const { root, waitForChanges } = await render(contentUserMenu({ variation: 'mobile' }));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do controle do expander em estado de hover, ainda fechado
  it('mobile fechado com hover no controle', async () => {
    const { root, waitForChanges } = await render(contentUserMenu({ variation: 'mobile' }));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const summary = root.querySelector<HTMLElement>('alc-expander summary');
    assert.exists(summary, 'O controle do expander não foi encontrado');

    await waitForChanges();

    await aguardaIcones(container);
    await userEvent.hover(summary);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do controle do expander em estado de foco por teclado, ainda fechado
  it('mobile fechado com foco no controle', async () => {
    const { root, waitForChanges } = await render(contentUserMenu({ variation: 'mobile' }));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await waitForChanges();

    await aguardaIcones(container);
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

  // Deve capturar screenshot do menu mobile com o expander aberto e itens extras do slot "actions"
  it('mobile aberto', async () => {
    const { root, waitForChanges } = await render(contentUserMenu({ variation: 'mobile' }, (
      <div slot="actions">
        <alc-menu-item>Ajuda</alc-menu-item>
      </div>
    )));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    const summary = root.querySelector<HTMLElement>('alc-expander summary');
    assert.exists(summary, 'O controle do expander não foi encontrado');

    await userEvent.click(summary);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const expander = root.querySelector<HTMLAlcExpanderElement>('[data-test-expander]');
    assert.exists(expander, 'O expander não foi encontrado');
    expect(expander.open).toBe(true);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});
