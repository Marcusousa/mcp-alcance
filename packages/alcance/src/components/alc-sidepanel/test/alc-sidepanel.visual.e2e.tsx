import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { page } from 'vitest/browser';

// yarn stencil-test --project browser alc-sidepanel.visual.e2e.tsx
// yarn stencil-test --project dark alc-sidepanel.visual.e2e.tsx

/**
 * Componente legado, sem classe do grupo Espaçamento (a única candidata, top-[--_offset],
 * referencia uma variável calculada em runtime — ver roteiro/log). Escopo do teste
 * deliberadamente simples: só confirma que renderiza nos estados principais.
 * setOffset() faz document.querySelector('[data-alc-top]').offsetHeight sem checar null —
 * sem esse elemento na página o componente quebra em runtime, por isso ele está sempre presente.
 *
 * PROBLEMA ENCONTRADO (não corrigido aqui, só documentado): os botões de alternância (mobile
 * e desktop) usam "text-white" fixo, independente do tema, e margem negativa
 * (-mt-[3.25rem]/-mt-[3.75rem]) pensada pra encaixar sob um header real. Sem esse header real
 * (contexto que este teste isolado não reproduz de propósito), o ícone branco fica invisível
 * contra o fundo branco da página no tema claro, e o deslocamento negativo pode empurrar o
 * botão pra fora da área capturável. As baselines abaixo refletem esse comportamento real do
 * componente fora do contexto de um header — não foi mascarado com fundo/espaçamento artificial.
 */
const contentSidepanel = (props: Record<string, unknown> = {}) => (
  <div>
    <div data-alc-top style={{ height: '80px' }}></div>
    <alc-sidepanel data-test-sidepanel {...props}>
      <p>Conteúdo do painel.</p>
    </alc-sidepanel>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

describe('alc-sidepanel', () => {

  // Deve capturar screenshot do painel desktop aberto (padrão, visible=true)
  it('desktop aberto', async () => {
    await page.viewport(900, 500);

    const { root, waitForChanges } = await render(contentSidepanel());

    const sidepanel = root.querySelector<HTMLAlcSidepanelElement>('[data-test-sidepanel]');
    assert.exists(sidepanel, 'O alc-sidepanel não foi encontrado');

    await waitForChanges();

    await aguardaFontes();

    await expect(root).toMatchScreenshot();
  });

  // Deve capturar screenshot do painel desktop fechado (visible=false)
  it('desktop fechado', async () => {
    await page.viewport(900, 500);

    const { root, waitForChanges } = await render(contentSidepanel({ visible: false }));

    const sidepanel = root.querySelector<HTMLAlcSidepanelElement>('[data-test-sidepanel]');
    assert.exists(sidepanel, 'O alc-sidepanel não foi encontrado');

    await waitForChanges();

    await aguardaFontes();

    await expect(root).toMatchScreenshot();
  });

  // Deve capturar screenshot do botão que abre o drawer no mobile (drawer fechado)
  it('mobile fechado', async () => {
    await page.viewport(400, 500);

    const { root, waitForChanges } = await render(contentSidepanel());

    const sidepanel = root.querySelector<HTMLAlcSidepanelElement>('[data-test-sidepanel]');
    assert.exists(sidepanel, 'O alc-sidepanel não foi encontrado');

    await waitForChanges();

    await aguardaFontes();

    await expect(root).toMatchScreenshot();
  });

});
