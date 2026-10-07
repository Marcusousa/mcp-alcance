import { assert, describe, expect, h, it, render, vi } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-field-checker.visual.e2e.tsx
// yarn stencil-test --project dark alc-field-checker.visual.e2e.tsx

/**
 * A captura é feita no contêiner porque o alc-alert do resumo de erros não tem regra de
 * display no host e seu box abrange a linha anterior.
 * A altura fixa do bloco do link mantém o componente em um offset inteiro — em offset
 * fracionário as bordas mudam a cada execução.
 * O link também serve para estacionar o ponteiro do mouse fora da área capturada: os
 * links do resumo têm estado de hover.
 */
const contentChecker = (checker: unknown) => (
  <div>
    <div style={{ height: '32px' }}><a data-test-before href="#" class="alc-link">Foco anterior</a></div>
    <div data-test-container style={{ padding: '4px' }}>
      {checker}
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
 * Sem esperar, a captura pode sair sem o ícone do alerta.
 */
const aguardaIcones = (container: HTMLElement) => vi.waitFor(() => {
  const icones = Array.from(container.querySelectorAll('alc-icon'));
  assert.isNotEmpty(icones, 'Nenhum ícone encontrado');

  icones.forEach(icone => assert.exists(icone.querySelector('svg'), 'Ícone ainda não carregado'));
});

/**
 * Afasta o ponteiro do componente, deixando-o sobre o link anterior.
 * O cursor permanece onde o último teste o largou, e um link do resumo sob o ponteiro
 * seria capturado em estado de hover.
 */
const afastaPonteiro = (root: HTMLElement) => {
  const before = root.querySelector<HTMLAnchorElement>('[data-test-before]');
  assert.exists(before, 'Link anterior não encontrado');

  return userEvent.hover(before);
};

describe('alc-field-checker', () => {

  const testArray = [
    {
      name: 'sem erros',
      erros: 0,
      checker: (
        <alc-field-checker data-test-checker>
          <alc-field label="Nome">
            <input type="text" />
          </alc-field>
        </alc-field-checker>
      ),
    },
    {
      name: 'um erro',
      erros: 1,
      checker: (
        <alc-field-checker data-test-checker>
          <alc-field label="Nome" errorMsg="Informe um nome válido.">
            <input type="text" />
          </alc-field>
        </alc-field-checker>
      ),
    },
    {
      name: 'dois erros',
      erros: 2,
      checker: (
        <alc-field-checker data-test-checker>
          <alc-field label="Nome" errorMsg="Informe um nome válido.">
            <input type="text" />
          </alc-field>
          <alc-field label="E-mail" errorMsg="Informe um e-mail válido.">
            <input type="text" />
          </alc-field>
        </alc-field-checker>
      ),
    },
    {
      name: 'erro em checkbox',
      erros: 1,
      checker: (
        <alc-field-checker data-test-checker>
          <alc-checkbox label="Aceito os termos de uso" errorMsg="É preciso aceitar os termos.">
            <input type="checkbox" />
          </alc-checkbox>
        </alc-field-checker>
      ),
    },
    {
      name: 'erro em fieldset',
      erros: 1,
      checker: (
        <alc-field-checker data-test-checker>
          <alc-fieldset legend="Personagens" errorMsg="Selecione ao menos um personagem.">
            <alc-checkbox label="Lion-O">
              <input type="checkbox" />
            </alc-checkbox>
          </alc-fieldset>
        </alc-field-checker>
      ),
    },
  ];

  // Deve capturar screenshot do resumo de erros em cada composição de campos
  it.each(testArray)('variacao $name', async ({ checker, erros }) => {
    const { root, waitForChanges } = await render(contentChecker(checker));

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const alerta = container.querySelector('alc-alert');
    expect(!!alerta).toBe(erros > 0);
    expect(container.querySelectorAll('alc-alert li')).toHaveLength(erros);

    if (erros > 0) {
      await aguardaIcones(container);
    }
    await afastaPonteiro(root);
    await aguardaFontes();

    // Com erro, captura o resumo em vez do contêiner: os campos abaixo do alerta ficam em
    // offset fracionário (a altura do alerta varia com o texto) e suas bordas oscilam entre
    // execuções. A aparência dos campos já é coberta por alc-field.visual.e2e.tsx.
    await expect(alerta ?? container).toMatchScreenshot();
  });

  // Deve capturar screenshot do resumo aparecendo somente após a submissão do formulário
  it('verificado na submissao', async () => {
    const { root, waitForChanges } = await render(
      contentChecker(
        <alc-field-checker checkOnSubmit data-test-checker>
          <form onSubmit={(event: Event) => event.preventDefault()}>
            <alc-field label="Nome" errorMsg="Informe um nome válido.">
              <input type="text" />
            </alc-field>
            <button type="submit" style={{ width: '160px' }} data-test-submit>Enviar</button>
          </form>
        </alc-field-checker>
      )
    );

    const container = root.querySelector<HTMLElement>('[data-test-container]');
    assert.exists(container, 'Contêiner não encontrado');

    await waitForChanges();

    // Com checkOnSubmit o resumo não aparece antes da submissão
    assert.notExists(container.querySelector('alc-alert'), 'O resumo não deveria estar visível antes da submissão');

    const enviar = container.querySelector<HTMLElement>('[data-test-submit]');
    assert.exists(enviar, 'O botão de envio não foi encontrado');

    await userEvent.click(enviar);
    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    const alerta = container.querySelector('alc-alert');
    assert.exists(alerta, 'O resumo não foi renderizado após a submissão');
    expect(container.querySelectorAll('alc-alert li')).toHaveLength(1);

    await aguardaIcones(container);
    await afastaPonteiro(root);
    await aguardaFontes();

    await expect(alerta).toMatchScreenshot();
  });

});
