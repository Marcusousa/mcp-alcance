import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { page } from 'vitest/browser';

const LG_BREAKPOINT = 992;
const MD_BREAKPOINT = 768;

describe('alc-skip-to-nav', () => {

  describe('Comportamento visual', () => {

    it('Deve estar invisível inicialmente (sr-only)', async () => {
      const { root } = await render(<alc-skip-to-nav></alc-skip-to-nav>);

      // Uma forma encontrada de verificar se está sr-only
      const computedStyle = window.getComputedStyle(root);
      expect(computedStyle.width).toEqual('1px');
      expect(computedStyle.height).toEqual('1px');
    });

    it('Deve aparecer ao receber foco', async () => {
      const { root, waitForChanges } = await render(<alc-skip-to-nav></alc-skip-to-nav>);

      const link = root.querySelector<HTMLAnchorElement>('[data-test-skip-to-nav-link]');
      assert.exists(link, 'O link não foi encontrado');

      link.focus();
      await waitForChanges();

      // Uma forma encontrada de verificar se não está mais com sr-only
      // Pega width e height computados e remove a unidade (px) para transformar em número
      const computedStyle = window.getComputedStyle(root);
      const width = Number.parseInt(computedStyle.width.slice(0, -2));
      const height = Number.parseInt(computedStyle.height.slice(0, -2));

      expect(width).toBeGreaterThan(1);
      expect(height).toBeGreaterThan(1);
    });

  });

  describe('Interações do usuário', () => {

    it('Clique no link deve levar para elemento correto em desktop (alc-nav-panel aberto)', async () => {
      await page.viewport(LG_BREAKPOINT, 785);

      const { root, waitForChanges } = await render(
        <div>
          <alc-skip-to-nav></alc-skip-to-nav>
          <alc-nav-panel id="nav-panel">
            <alc-nav>
              <ul>
                <li>
                  <a href="#" id="nav-link">Funcionalidade 1</a>
                </li>
              </ul>
            </alc-nav>
          </alc-nav-panel>
        </div>
      );

      await waitForChanges();

      const link = root.querySelector<HTMLAnchorElement>('[data-test-skip-to-nav-link]');
      assert.exists(link, 'O link não foi encontrado');

      const navPanel = root.querySelector<HTMLAlcNavPanelElement>('#nav-panel');
      assert.exists(navPanel, 'O painel de navegação não foi encontrado');

      // Verifica se o link existe e é clicável
      expect(link.getAttribute('href')).toBe('#');

      // Garante que o painel de navegação esteja aberto
      navPanel.open = true;
      await waitForChanges();
      // Tem que dar o foco antes do clique para que funcione, já que o link fica oculto se não estiver focado
      link.focus();
      link.click();
      await waitForChanges();
      // Espera que o foco esteja no link de navegação.
      const navLink = document.querySelector('#nav-link');
      assert.exists(navLink, 'O link de navegação não foi encontrado');
      expect(document.activeElement === navLink).toBe(true);
    });

    it('Clique no link deve levar para elemento correto em desktop (alc-nav-panel fechado)', async () => {
      await page.viewport(LG_BREAKPOINT, 785);

      const { root, waitForChanges } = await render(
        <div>
          <alc-skip-to-nav></alc-skip-to-nav>
          <alc-nav-panel id="nav-panel">
            <alc-nav>
              <ul>
                <li>
                  <a href="#" id="nav-link">Funcionalidade 1</a>
                </li>
              </ul>
            </alc-nav>
          </alc-nav-panel>
        </div>
      );

      await waitForChanges();

      const link = root.querySelector<HTMLAnchorElement>('[data-test-skip-to-nav-link]');
      const navPanel = root.querySelector<HTMLAlcNavPanelElement>('#nav-panel');

      // Verifica se o link existe e é clicável
      assert.exists(link, 'O link não foi encontrado');
      expect(link.getAttribute('href')).toBe('#');

      // Garante que o painel de navegação esteja fechado
      assert.exists(navPanel, 'O painel de navegação não foi encontrado');
      navPanel.open = false;
      await waitForChanges();

      // Tem que dar o foco antes do clique para que funcione, já que o link fica oculto se não estiver focado
      link.focus();
      link.click();
      await waitForChanges();

      // Espera que o foco esteja botão que abre o painel.
      const openPanelButton = document.querySelector('[data-alc-navpanel-button]');
      assert.exists(openPanelButton, 'O botão de abrir painel não foi encontrado');
      expect(document.activeElement === openPanelButton).toBe(true);
    });

    it('Clique no link deve levar para elemento correto em mobile (drawer)', async () => {
      await page.viewport(MD_BREAKPOINT - 1, 785);

      const { root, waitForChanges } = await render(
        <div>
          <alc-header name="Teste do Sistema" homeUrl='#'>
            <alc-skip-to-nav></alc-skip-to-nav>
            <div slot="user">
              <alc-user-menu name="Usuário Teste" registrationNumber="T_0000" logoutUrl="#"></alc-user-menu>
            </div>
          </alc-header>
          <alc-nav-panel id="nav-panel">
            <alc-nav>
              <ul>
                <li>
                  <a href="#" id="nav-link">Funcionalidade 1</a>
                </li>
              </ul>
            </alc-nav>
          </alc-nav-panel>
        </div>
      );

      await waitForChanges();

      const link = root.querySelector<HTMLAnchorElement>('[data-test-skip-to-nav-link]');

      // Verifica se o link existe e é clicável
      assert.exists(link, 'O link não foi encontrado');
      expect(link.getAttribute('href')).toBe('#');

      // Tem que dar o foco antes do clique para que funcione, já que o link fica oculto se não estiver focado
      link.focus();
      link.click();
      await waitForChanges();

      // Espera que o foco esteja no botão que abre o drawer.
      const openPanelButton = document.querySelector('[data-alc-header-drawer-button]');
      assert.exists(openPanelButton, 'O botão de abrir drawer não foi encontrado');
      expect(document.activeElement === openPanelButton).toBe(true);
    });
  });

  // TESTES DANDO PROBLEMA, ESTA PEGANDO SCREENSHOT DE OUTROS TESTES QUE NÃO SÃO OS TESTES ABAIXOS
  // describe('Screenshot Tests', () => {

  //   it('Screenshot - estado padrão', async () => {
  //     const { root, waitForChanges } = await render(<alc-skip-to-nav></alc-skip-to-nav>);

  //     await waitForChanges();
  //     expect(root).toMatchScreenshot();
  //   });

  //   it('Screenshot - com foco', async () => {
  //     const { root, waitForChanges } = await render(<alc-skip-to-nav></alc-skip-to-nav>);

  //     const link = root.querySelector<HTMLAnchorElement>('[data-test-skip-to-nav-link]');
  //     assert.exists(link, 'O link não foi encontrado');

  //     link.focus();
  //     await waitForChanges();

  //     expect(root).toMatchScreenshot();
  //   });

  // });

});