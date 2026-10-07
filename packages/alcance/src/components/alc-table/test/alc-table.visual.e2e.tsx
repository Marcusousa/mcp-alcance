import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { page } from 'vitest/browser';

// yarn stencil-test --project browser alc-table.visual.e2e.tsx
// yarn stencil-test --project dark alc-table.visual.e2e.tsx

/**
 * A tabela troca de layout no breakpoint "md" (768px, escala própria do projeto):
 * abaixo disso vira um layout empilhado (cabeçalho embutido em cada célula),
 * acima disso é a tabela real (thead/tbody como table-row/table-cell).
 * A captura mira o <table> em si, não o alc-table: o host não tem "display: block"
 * definido, então seu box é degenerado (mesmo caso do alc-user — ver roteiro).
 */
const contentTable = () => (
  <div>
    <a data-test-before href="#" class="alc-link">Foco anterior</a>
    <alc-table data-test-table>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john.doe@mail.com</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>jane.smith@mail.com</td>
          </tr>
        </tbody>
      </table>
    </alc-table>
  </div>
);

/**
 * As fontes do design system são carregadas de forma assíncrona.
 * Capturar antes de estarem prontas gera imagens com a fonte de fallback.
 */
const aguardaFontes = () => document.fonts.ready;

describe('alc-table', () => {

  // Deve capturar screenshot da tabela real (>= md), com o padding do cabeçalho e das células
  it('ampla', async () => {
    await page.viewport(900, 400);

    const { root, waitForChanges } = await render(contentTable());

    const table = root.querySelector<HTMLTableElement>('alc-table table');
    assert.exists(table, 'A table não foi encontrada');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(table.querySelector('.alc-table__header-cell'), 'Classes da tabela não foram aplicadas');

    await aguardaFontes();

    await expect(table).toMatchScreenshot();
  });

  // Deve capturar screenshot do layout empilhado (< sm), com cabeçalho embutido em cada célula
  it('estreita', async () => {
    await page.viewport(400, 600);

    const { root, waitForChanges } = await render(contentTable());

    const table = root.querySelector<HTMLTableElement>('alc-table table');
    assert.exists(table, 'A table não foi encontrada');

    await waitForChanges();

    // Confere o estado antes de capturar: sem isso, uma captura do estado errado passaria
    assert.exists(table.querySelector('.alc-table__inline-header'), 'Cabeçalho embutido não foi criado');

    await aguardaFontes();

    await expect(table).toMatchScreenshot();
  });

});
