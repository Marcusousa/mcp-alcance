import { assert, describe, expect, h, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import { EnvType } from '../environments';

// yarn stencil-test --project browser alc-environment-label.visual.e2e.tsx
// yarn stencil-test --project dark alc-environment-label.visual.e2e.tsx

/**
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada.
 */
// O caso 'não reconhecido' usa um valor fora do EnvType de propósito, por isso o cast
const contentLabel = (env: string) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container>
      <alc-environment-label env={env as EnvType} data-test-label></alc-environment-label>
    </div>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e o conteúdo sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-environment-label', () => {

  const testArray = [
    { name: 'prototype', texto: 'Protótipo' },
    { name: 'development', texto: 'Desenvolvimento' },
    { name: 'testing', texto: 'Teste' },
    { name: 'homologation', texto: 'Homologação' },
    { name: 'nao reconhecido', env: 'qualquer-coisa', texto: 'Não reconhecido' },
  ];

  // Deve capturar screenshot da tarja em cada ambiente
  it.each(testArray)('ambiente $name', async ({ name, env, texto }) => {
    const { root, waitForChanges } = await render(contentLabel(env ?? name));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const label = container.querySelector('[data-test-label]');
    assert.exists(label, 'A tarja não foi encontrada');
    expect(label.textContent).toBe(texto);

    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(container).toMatchScreenshot();
  });

});

// Não há caso para o ambiente de produção: a tarja recebe `hidden` e não renderiza nada,
// e a captura de uma área vazia pega pixels remanescentes do teste anterior.
// O comportamento já é coberto por alc-environment-label.spec.tsx.
