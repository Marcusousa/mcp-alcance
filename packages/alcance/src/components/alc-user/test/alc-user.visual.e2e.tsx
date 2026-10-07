import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-user.visual.e2e.tsx
// yarn stencil-test --project dark alc-user.visual.e2e.tsx

// Imagem embutida (data URI), pra não depender de rede numa captura determinística.
const avatarDataUri = 'data:image/svg+xml;base64,' + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56">'
  + '<rect width="56" height="56" fill="#264653"/>'
  + '<circle cx="28" cy="22" r="12" fill="#f4a261"/>'
  + '<rect x="10" y="38" width="36" height="18" rx="9" fill="#e76f51"/>'
  + '</svg>'
);

/**
 * O link antes do componente serve pra estacionar o ponteiro fora da área capturada
 * depois do hover — sem isso, o link "Sair" fica em estado de hover na captura.
 */
const contentUser = (props: Record<string, unknown> = {}, children?: unknown) => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-user data-test-user name="Fulano" registrationNumber="P_XXXXX" logoutUrl="#" {...props}>
      {children}
    </alc-user>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o ícone do avatar ou o de "sair".
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o link "Sair" sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-user', () => {

  // Deve capturar screenshot do padrão, com o ícone de avatar
  it('padrao', async () => {
    const { root } = await render(contentUser());

    const user = root.querySelector<HTMLAlcUserElement>('[data-test-user]');
    assert.exists(user, 'O alc-user não foi encontrado');

    const box = user.querySelector<HTMLElement>('.alc-user');
    assert.exists(box, 'A caixa interna do alc-user não foi encontrada');

    await aguardaIcones(root);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot com o link "Sair" em estado de hover
  it('com hover no link sair', async () => {
    const { root } = await render(contentUser());

    const user = root.querySelector<HTMLAlcUserElement>('[data-test-user]');
    assert.exists(user, 'O alc-user não foi encontrado');

    const box = user.querySelector<HTMLElement>('.alc-user');
    assert.exists(box, 'A caixa interna do alc-user não foi encontrada');

    const logout = user.querySelector<HTMLAnchorElement>('[data-test-logout]');
    assert.exists(logout, 'O link "Sair" não foi encontrado');

    await aguardaIcones(root);
    await userEvent.hover(logout);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot com o link "Sair" em estado de foco por teclado
  it('com foco no link sair', async () => {
    const { root, waitForChanges } = await render(contentUser());

    const user = root.querySelector<HTMLAlcUserElement>('[data-test-user]');
    assert.exists(user, 'O alc-user não foi encontrado');

    const box = user.querySelector<HTMLElement>('.alc-user');
    assert.exists(box, 'A caixa interna do alc-user não foi encontrada');

    const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
    assert.exists(before, 'Link anterior não encontrado');

    await aguardaIcones(root);
    // Foca o elemento anterior e tabula: só assim o navegador entra em modalidade de
    // teclado e aplica o :focus-visible — um focus() direto não garante isso.
    before.focus();
    await userEvent.keyboard('{Tab}');
    await waitForChanges();

    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot com imagem no lugar do ícone padrão
  it('com imagem', async () => {
    const { root } = await render(contentUser({ imgSrc: avatarDataUri }));

    const user = root.querySelector<HTMLAlcUserElement>('[data-test-user]');
    assert.exists(user, 'O alc-user não foi encontrado');

    const box = user.querySelector<HTMLElement>('.alc-user');
    assert.exists(box, 'A caixa interna do alc-user não foi encontrada');

    await aguardaIcones(root);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

  // Deve capturar screenshot com conteúdo adicional pelo slot padrão
  it('com slot', async () => {
    const { root } = await render(contentUser({}, <p>Online</p>));

    const user = root.querySelector<HTMLAlcUserElement>('[data-test-user]');
    assert.exists(user, 'O alc-user não foi encontrado');

    // A captura mira a div interna (.alc-user), não o elemento customizado: o host não tem
    // "display: block" definido (diferente de outros componentes), então seu box é degenerado
    // e a captura do elemento em si acaba incluindo conteúdo vizinho da página.
    const box = user.querySelector<HTMLElement>('.alc-user');
    assert.exists(box, 'A caixa interna do alc-user não foi encontrada');

    await aguardaIcones(root);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(box).toMatchScreenshot();
  });

});
