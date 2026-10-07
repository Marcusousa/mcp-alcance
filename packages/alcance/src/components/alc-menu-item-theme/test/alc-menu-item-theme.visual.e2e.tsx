import { render, h, describe, it, expect, assert, vi, afterEach } from '@stencil/vitest';
import { page } from 'vitest/browser';

// yarn stencil-test --project browser alc-menu-item-theme.visual.e2e.tsx
// yarn stencil-test --project dark alc-menu-item-theme.visual.e2e.tsx

/**
 * Componente sem CSS próprio (arquivo alc-menu-item-theme.css vazio) — é só um wrapper fino
 * sobre <alc-menu-item> que controla o tema global. O teste ainda vale como regressão geral
 * (ver seção sobre a coluna "Espaçamento?" no roteiro), mas não participa da comparação
 * antes/depois de tokens.
 *
 * Importante: NÃO clicar no componente durante o teste — o clique chama setAppliedTheme(),
 * que sobrescreve o atributo data-alc-theme do <html> de verdade (o mesmo atributo que os
 * projetos "browser"/"dark" do vitest usam pra forçar o tema do teste). Em vez disso, o
 * estado "checked" é definido de forma determinística escrevendo direto no localStorage
 * ANTES do render (mesma leitura que o componentWillLoad faz via loadUserPreference()).
 */
const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
};

const contentMenuItemTheme = (preferencia: string) => {
  localStorage.setItem('alc-theme', preferencia);

  return (
    <div>
      <alc-menu-item-theme data-test-menu-item-theme></alc-menu-item-theme>
    </div>
  );
};

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

describe('alc-menu-item-theme', () => {

  afterEach(() => {
    localStorage.removeItem('alc-theme');
  });

  // Deve capturar screenshot com o tema claro selecionado (sem marcação)
  it('tema claro selecionado', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItemTheme(THEME.LIGHT));

    const wrapper = root.querySelector<HTMLAlcMenuItemThemeElement>('[data-test-menu-item-theme]');
    assert.exists(wrapper, 'O alc-menu-item-theme não foi encontrado');

    const menuItem = wrapper.querySelector<HTMLAlcMenuItemElement>('alc-menu-item');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    expect(menuItem.getAttribute('aria-checked')).toBe('false');

    await aguardaIcones(menuItem);
    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

  // Deve capturar screenshot com o tema escuro selecionado (marcado, com ícone de check)
  it('tema escuro selecionado', async () => {
    await page.viewport(300, 100);

    const { root, waitForChanges } = await render(contentMenuItemTheme(THEME.DARK));

    const wrapper = root.querySelector<HTMLAlcMenuItemThemeElement>('[data-test-menu-item-theme]');
    assert.exists(wrapper, 'O alc-menu-item-theme não foi encontrado');

    const menuItem = wrapper.querySelector<HTMLAlcMenuItemElement>('alc-menu-item');
    assert.exists(menuItem, 'O alc-menu-item não foi encontrado');

    await waitForChanges();

    expect(menuItem.getAttribute('aria-checked')).toBe('true');

    await aguardaIcones(menuItem);
    await aguardaFontes();

    await expect(menuItem).toMatchScreenshot();
  });

});
