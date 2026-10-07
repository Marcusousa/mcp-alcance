import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-alert.visual.e2e.tsx
// yarn stencil-test --project dark alc-alert.visual.e2e.tsx

// O link antes do alerta serve para estacionar o ponteiro do mouse fora da área capturada.
const contentAlert = (type: 'info' | 'error' | 'warning' | 'success') => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <alc-alert type={type} data-test-alert>
      <span slot="summary">Resumo do alerta.</span>
      Mensagem do alerta.
    </alc-alert>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * O alc-icon busca o SVG por HTTP e o injeta depois da renderização, sem segurar o load.
 * Sem esperar, a captura pode sair sem o ícone do tipo ou sem o "x" do botão dispensar.
 */
const aguardaIcones = (alert: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(alert.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do alerta, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o botão dispensar sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-alert', () => {

  const testArray = [
    { name: 'info', content: contentAlert('info') },
    { name: 'error', content: contentAlert('error') },
    { name: 'warning', content: contentAlert('warning') },
    { name: 'success', content: contentAlert('success') },
  ];

  // Deve capturar screenshot do alerta em cada tipo
  it.each(testArray)('type $name', async ({ content }) => {
    const { root } = await render(content);

    const alert = root.querySelector<HTMLAlcAlertElement>('[data-test-alert]');
    assert.exists(alert, 'Alerta não encontrado');

    await aguardaIcones(alert);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(alert).toMatchScreenshot();
  });

  // Deve capturar screenshot do alerta sem o botão dispensar
  it('nao dispensavel', async () => {
    const { root } = await render(
      <div>
        <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
        <alc-alert type="info" dismissible={false} data-test-alert>
          <span slot="summary">Resumo do alerta.</span>
          Mensagem do alerta.
        </alc-alert>
      </div>
    );

    const alert = root.querySelector<HTMLAlcAlertElement>('[data-test-alert]');
    assert.exists(alert, 'Alerta não encontrado');

    await aguardaIcones(alert);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(alert).toMatchScreenshot();
  });

  // Deve capturar screenshot do alerta sem o slot summary
  it('sem resumo', async () => {
    const { root } = await render(
      <div>
        <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
        <alc-alert type="info" data-test-alert>
          Mensagem do alerta, sem resumo.
        </alc-alert>
      </div>
    );

    const alert = root.querySelector<HTMLAlcAlertElement>('[data-test-alert]');
    assert.exists(alert, 'Alerta não encontrado');

    await aguardaIcones(alert);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(alert).toMatchScreenshot();
  });

});

// Não há caso para o botão dispensar em hover: a captura desse estado varia entre execuções
// e reprovaria na comparação exata. Diferente da borda do campo, aqui fixar o offset em
// valor inteiro não resolve. Os demais casos são estáveis.
