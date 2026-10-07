import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// import { E2EElement, newE2EPage } from '@stencil/core/testing';
// import ptBR from 'datatables.net-plugins/i18n/pt-BR.json';
import { portugues } from '../datatables-setup.js'

async function sortIndicator(column: Element): Promise<string | null> {

  const indicator = column.querySelector<HTMLAlcSortIndicatorElement>('alc-sort-indicator');
  const sorting = indicator ? indicator.sorting : null;
  return sorting;
}

const DEFAULT_INLINE_TABLE = (
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th class="test-nosort">Arma</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Panthro</td>
        <td>Nunchaku</td>
      </tr>
      <tr>
        <td>Lion-O</td>
        <td>Espada Justiceira</td>
      </tr>
    </tbody>
  </table>
);

const DEFAULT_PROPS_TABLE = {
  data: [
    ["Panthro", "Nunchaku"],
    ["Lion-O", "Espada Justiceira"]
  ],
  columns: [
    {"title": "Nome"},
    {"title": "Arma"}
  ]
};

const EXTENDED_INLINE_TABLE = `
  <table id="${Date.now()}">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Panthro</td>
        <td>É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana.</td>
      </tr>
      <tr>
        <td>Lion-O</td>
        <td>É o líder dos ThunderCats, que moram no terceiro mundo e lutam pela ordem e justiça.</td>
      </tr>
      <tr>
        <td>Tygra</td>
        <td>Pertencendo à linhagem dos tigres de Thundera, é um dos mais poderosos e versáteis Thundercats.</td>
      </tr>
      <tr>
        <td>Cheetara</td>
        <td>Representando a chita, é uma guerreira destemida. Forte e decidida, não hesita em entrar em ação para combater os vilões.</td>
      </tr>
      <tr>
        <td>Jaga</td>
        <td>É o mentor e guerreiro mestre de todos os Thundercats e, como seu nome sugere, é representado pelo jaguar.</td>
      </tr>
    </tbody>
  </table>
`;

const EXTENDED_PROPS_TABLE = {
  data: [
    ["Panthro", "É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana."],
    ["Lion-O", "É o líder dos ThunderCats, que moram no terceiro mundo e lutam pela ordem e justiça."],
    ["Tygra", "Pertencendo à linhagem dos tigres de Thundera, é um dos mais poderosos e versáteis Thundercats."],
    ["Cheetara", "Representando a chita, é uma guerreira destemida. Forte e decidida, não hesita em entrar em ação para combater os vilões."],
    ["Jaga", "É o mentor e guerreiro mestre de todos os Thundercats e, como seu nome sugere, é representado pelo jaguar."]
  ],
  columns: [
    {"title": "Nome"},
    {"title": "Descrição"}
  ]
};

const createInlineTable = (additionalOptions: object = {}, atributtes: object = {}) => {

  const options = {
    ...additionalOptions
  };

  return (
    <alc-datatable
      options={ Object.keys(options).length ? JSON.stringify(options) : undefined }
      { ...atributtes }
    >
      { DEFAULT_INLINE_TABLE }
    </alc-datatable>
  );

};

const createPropsTable = (additionalOptions: object = {}) => {

  const options = {
    columns: DEFAULT_PROPS_TABLE.columns,
    ...additionalOptions
  };

  return (
    <alc-datatable
      data={ JSON.stringify(DEFAULT_PROPS_TABLE.data) }
      options={ Object.keys(options).length ? JSON.stringify(options) : undefined }
    >
    </alc-datatable>
  );

};

const createExtendedInlineTable = (additionalOptions: object = {}) => {

  const options = {
    ...additionalOptions
  };

  return `
    <alc-datatable
      ${Object.keys(options).length ? `options='${JSON.stringify(options)}'` : '' }
    >
      ${EXTENDED_INLINE_TABLE}
    </alc-datatable>
  `;
};

const createExtendedPropsTable = (additionalOptions: object) => {

  const options = {
    columns: EXTENDED_PROPS_TABLE.columns,
    ...additionalOptions
  };

  return `
    <alc-datatable
      data='${JSON.stringify(EXTENDED_PROPS_TABLE.data)}'
      ${Object.keys(options).length ? `options='${JSON.stringify(options)}'` : '' }
      table-id='${Date.now()}'
    >
    </alc-datatable>
  `;
};

describe('alc-datatable', () => {

  describe('Toda tabela', () => {

    const testArray = [
      {
        name: 'inline',
        create: createInlineTable
      },
      {
        name: 'propriedades',
        create: createPropsTable
      }
    ];

    it.each(testArray)('Deve renderizar corretamente o controle de ordenação ao iniciar ($name)', async (table) => {

      const { root } = await render(table.create());

      const columns = root.querySelectorAll('thead th');
      const orderButton = root.querySelector('[data-test-dropdown-order] button');

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[0]).toHaveClass('dt-ordering-asc');
      expect(columns[0].getAttribute('aria-sort')).toBe('ascending');
      expect(columns[1]).toHaveClass('dt-orderable-asc');
      expect(columns[1]).toHaveClass('dt-orderable-desc');

      assert.exists(orderButton, 'Botão de ordenação deve existir');
      expect(orderButton.textContent.trim()).toBe('Ordenação');

      // Verifica se os ícones estão renderizando corretamente
      expect(await sortIndicator(columns[0])).toEqual('asc');
      expect(await sortIndicator(columns[1])).toEqual('none');

    });

    it.each(testArray)('Deve renderizar corretamente o controle de ordenação ao clicar ($name)', async (table) => {

      const { root, waitForChanges } = await render(table.create());

      const columns = root.querySelectorAll<HTMLElement>('thead th');

      // Nota: userEvent.click() usa o Playwright internamente e falha porque o DataTables
      // envolve a tabela em uma estrutura dt-layout que faz o Playwright computar a role como
      // "cell" (em vez de "columnheader") e combinar textContent + aria-label em um nome
      // ambíguo ("Nome Nome: Inverter a ordena…").
      // TimeoutError: locator.click: Timeout 14830ms exceeded.
      // Call log:
      //  - waiting for locator('[data-vitest="true"]').contentFrame().getByRole('cell', { name: 'Nome Nome: Inverter a ordena' })

      //  O click() nativo dispara o evento click
      // que o DataTables escuta para ordenação, sem passar pela resolução de locator do Playwright.

      // Deve mudar a ordenação para descendente ao clicar na primeira coluna
      columns[0].click();
      await waitForChanges();

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[0]).toHaveClass('dt-ordering-desc');
      expect(columns[0].getAttribute('aria-sort')).toBe('descending');
      expect(columns[1]).toHaveClass('dt-orderable-asc');
      expect(columns[1]).toHaveClass('dt-orderable-desc');

      // Verifica se os ícones estão renderizando corretamente
      expect(await sortIndicator(columns[0])).toEqual('desc');
      expect(await sortIndicator(columns[1])).toEqual('none');

      // Deve mudar a ordenação para ascendente ao clicar na segunda coluna
      columns[1].click();
      await waitForChanges();

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[1]).toHaveClass('dt-ordering-asc');
      expect(columns[1]).toHaveClass('dt-orderable-desc');
      expect(columns[1]).toHaveClass('dt-ordering-asc');
      expect(columns[1].getAttribute('aria-sort')).toBe('ascending');

      // Verifica se os ícones estão renderizando corretamente
      expect(await sortIndicator(columns[0])).toEqual('none');
      expect(await sortIndicator(columns[1])).toEqual('asc');
    });

    it.each(testArray)('Deve possuir texto acessível no cabeçalho da tabela - não ordenada ($name)', async (table) => {
      const { root } = await render(table.create({
        order: []
      }));

      const orderingButton = root.querySelectorAll<HTMLElement>('[data-test-order-button]');
      const columns = root.querySelectorAll<HTMLElement>('thead th');

      // Primeira coluna não ordenada, deve conter o texto de ativar ordenação
      expect(orderingButton[0]).toHaveAttribute('aria-label');
      expect(orderingButton[0].getAttribute('aria-label')).toMatch(new RegExp(`${portugues.aria.orderable}$`));
      expect(columns[0].getAttribute('aria-sort')).toBeNull();
    });

    it.each(testArray)('Deve possuir texto acessível no cabeçalho da tabela - crescente ($name)', async (table) => {
      const { root } = await render(table.create({
        order: [[0, 'asc']]
      }));

      const orderingButton = root.querySelectorAll<HTMLElement>('[data-test-order-button]');
      const columns = root.querySelectorAll<HTMLElement>('thead th');

      // Primeira coluna crescente, deve conter o texto de ordenação reversa
      expect(orderingButton[0]).toHaveAttribute('aria-label');
      expect(orderingButton[0].getAttribute('aria-label')).toMatch(new RegExp(`${portugues.aria.orderableReverse}$`));
      expect(columns[0].getAttribute('aria-sort')).toBe('ascending');
    });

    it.each(testArray)('Deve possuir texto acessível no cabeçalho da tabela - decrescente ($name)', async (table) => {
      const { root } = await render(table.create({
        order: [[0, 'desc']]
      }));

      const orderingButton = root.querySelectorAll<HTMLElement>('[data-test-order-button]');
      const columns = root.querySelectorAll<HTMLElement>('thead th');

      // Primeira coluna decrescente, deve conter o texto de remover ordenação
      expect(orderingButton[0]).toHaveAttribute('aria-label');
      expect(orderingButton[0].getAttribute('aria-label')).toMatch(new RegExp(`${portugues.aria.orderableRemove}$`));
      expect(columns[0].getAttribute('aria-sort')).toBe('descending');
    });

    it.each(testArray)('Deve renderizar o campo de pesquisa ao iniciar ($name)', async (table) => {
      const { root } = await render(table.create());

      const searchField = root.querySelector('[data-test-search-field]');
      assert.exists(searchField, 'Campo de pesquisa deve existir');

      const searchInput = searchField.querySelector('input[type="search"]');

      const searchLabel = searchField.querySelector('label');
      assert.exists(searchLabel, 'Campo de pesquisa deve conter um label');

      expect(searchField).not.toBeNull();
      expect(searchInput).not.toBeNull();
      expect(searchLabel).toHaveTextContent('Pesquisar por:');
    });

    it.each(testArray)('Deve mostrar o resultado esperado ao utilizar o campo de pesquisa ($name)', async (table) => {
      const { root } = await render(table.create());

      const searchInput = root.querySelector<HTMLInputElement>('alc-field input[type="search"]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      let trTable = root.querySelectorAll('tbody tr');
      expect(trTable).toHaveLength(2);

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'Espada');

      trTable = root.querySelectorAll('tbody tr');
      expect(trTable).toHaveLength(1);
      expect(trTable[0]).toHaveTextContent('Espada');
    });

    it.each(testArray)('Deve renderizar corretamente o indicador de ordenação quando a coluna ordenada for escondida ($name)', async (table) =>  {
      const { root, waitForChanges } = await render(table.create());

      const columnsButton = root.querySelector<HTMLElement>('[data-test-dropdown-columns]');
      assert.exists(columnsButton, 'Botão de colunas deve existir');

      // Clica no botão "Colunas"
      await userEvent.click(columnsButton);
      await waitForChanges();

      const menuItens = columnsButton.querySelectorAll('alc-menu-item');
      assert.exists(menuItens, 'Itens do menu devem existir');

      await userEvent.click(menuItens[0]);
      await waitForChanges();

      const columns = root.querySelectorAll('thead th');
      expect(columns).toHaveLength(1);

      const alcSortIndicator = columns[0].querySelector('alc-sort-indicator');
      assert.exists(alcSortIndicator, 'Indicador de ordenação deve existir');

      expect(alcSortIndicator.getAttribute('sorting')).toBe('none');

    });

    it.each(testArray)('Deve renderizar corretamente o menu de ordenação ao clicar em ordenar pelo header ($name)', async (table) =>  {
      const { root, waitForChanges } = await render(table.create());

      const columns = root.querySelectorAll<HTMLElement>('thead th');

      const orderButton = root.querySelector('[data-test-dropdown-order]');
      assert.exists(orderButton, 'Botão de ordenação deve existir');
      
      const menuItens = orderButton.querySelectorAll('alc-menu-item');
      assert.exists(menuItens, 'Itens do menu devem existir');

      expect(columns[0]).toHaveClass('dt-ordering-asc');
      expect(menuItens[0]).toHaveAttribute('checked');

      columns[0].click();
      await waitForChanges();

      expect(columns[0]).toHaveClass('dt-ordering-desc');
      expect(menuItens[1]).toHaveAttribute('checked');
      expect(menuItens[0]).not.toHaveAttribute('checked');

    });

    it.each(testArray)('Não deve trazer resultados ao pesquisar uma coluna desabilitada ($name)', async (table) => {
      const { root, waitForChanges } = await render(table.create(
          {
            columnDefs: [{ searchable: false, targets: 1 }]
          }
        ));

      const searchInput = root.querySelector<HTMLInputElement>('alc-field input[type="search"]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      let trTable = root.querySelectorAll('tbody tr');
      expect(trTable).toHaveLength(2);

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'Espada');
      await waitForChanges();

      trTable = root.querySelectorAll('tbody tr');
      expect(trTable).toHaveLength(1);
      expect(trTable[0]).toHaveTextContent(portugues.zeroRecords);

    });

    it.each(testArray)('Deve atualizar o campo de busca ao usar a busca pela Api ($name)', async (table) => {
      const { root, waitForChanges } = await render<HTMLAlcDatatableElement>(table.create());

      const SEARCHING = 'Panthro';

      const inputSearch = root.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(inputSearch, 'Campo de pesquisa deve existir');

      // Verifica se o campo de busca está vazio
      expect(inputSearch.value).toBe('');

      // Chama a api de busca
      const api = await root.getApi();
      api.search(SEARCHING);
      await waitForChanges();

      // Verifica se o campo de busca está preenchido
      expect(inputSearch.value).toBe(SEARCHING);
    });

    it.each(testArray)('Deve renderizar corretamente o seletor de tamanho de página ($name)', async (table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create());

      const lengthField = root.querySelector('[data-test-length-field]');

      expect(lengthField).not.toBeNull();
    });

    it.each(testArray)('Não deve renderizar o seletor de tamanho de página ao desabilitar a opção lengthChange ($name)', async (table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        lengthChange: false
      }));

      const lengthField = root.querySelector('[data-test-length-field]');

      expect(lengthField).toBeNull();
    });

    it.each(testArray)('Não deve renderizar o seletor de tamanho de página ao desabilitar a opção paging ($name)', async (table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        paging: false
      }));

      const lengthField = root.querySelector('[data-test-length-field]');

      expect(lengthField).toBeNull();
    });

    it.each(testArray)('Deve renderizar corretamente o seletor de tamanho de página ao ser personalizado ($name)', async (table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        lengthMenu: [ [5, 50, -1], [5, 50, "Todos"] ],
        pageLength : 5
      }));

      const lengthField = root.querySelector('[data-test-length-field]');
      assert.exists(lengthField, 'Campo de seleção de tamanho de página deve existir');

      const options = lengthField.querySelectorAll<HTMLOptionElement>('option');
      assert.exists(options, 'Opções do seletor de tamanho de página devem existir');

      expect(options).toHaveLength(3);

      expect(options[0].value).toBe('5');
      expect(options[1].value).toBe('50');
      expect(options[2].value).toBe('-1');

      expect(options[0].innerText).toBe('5');
      expect(options[1].innerText).toBe('50');
      expect(options[2].innerText).toBe('Todos');
    });

    it.each(testArray)('Deve renderizar a paginação corretamente ($name)', async (table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        pageLength: 1
      }));

      const rows = root.querySelectorAll('tbody tr');

      const pageInfo = root.querySelector('[data-test-page-info]');
      assert.exists(pageInfo, 'Informação de paginação deve existir');

      const pagination = root.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
      assert.exists(pagination, 'Componente de paginação deve existir');

      expect(rows).toHaveLength(1);

      expect(pageInfo).toHaveTextContent('1 de 2 itens');

      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalPages).toBe(2);
    });

    it.each(testArray)('Deve selecionar e remover seleção ao clicar na primeira célula da linha ao ativar opção select ($name)', async (table) => {
      const { root, waitForChanges } = await render<HTMLAlcDatatableElement>(table.create({
        select: true
      }));

      const firstRow = root.querySelector('tbody tr');
      assert.exists(firstRow, 'Deve existir ao menos uma linha na tabela');

      const firstCell = firstRow.querySelector('td');
      assert.exists(firstCell, 'A primeira célula da linha deve existir');

      await userEvent.click(firstCell);
      await waitForChanges();
      expect(firstRow).toHaveClass('selected');

      await userEvent.click(firstCell);
      await waitForChanges();
      expect(firstRow).not.toHaveClass('selected');
    });

    it.each(testArray)('Não deve renderizar o controle de ordenação ao desabilitar a ordenação ($name)', async (table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        ordering: false
      }));

      const columns = root.querySelectorAll('thead th');
      assert.exists(columns, 'Colunas devem existir');

      expect(columns[0]).toHaveClass('dt-orderable-none');
      expect(columns[1]).toHaveClass('dt-orderable-none');

      expect(columns[0].querySelector('alc-sort-indicator')).toBeNull();
      expect(columns[1].querySelector('alc-sort-indicator')).toBeNull();
    });

    it.each(testArray)('Não deve renderizar o campo de pesquisa ao desabilitar a pesquisa ($name)', async (table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        searching: false
      }));

      const searchField = root.querySelector('[data-test-search-field]');
      expect(searchField).toBeNull();
    });

    it.each(testArray)('Deve mostrar, no campo de pesquisa, o valor configurado inicialmente ($name)', async (table) => {
      const searchString = 'li';

      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        search: {
          search: searchString
        }
      }));

      const searchField = root.querySelector('[data-test-search-field]');
      assert.exists(searchField, 'Campo de pesquisa deve existir');

      const searchInput = searchField.querySelector<HTMLInputElement>('input[type="search"]');
      assert.exists(searchInput, 'Campo de pesquisa deve conter um input do tipo search');

      expect(searchInput.value).toBe(searchString);
    });
  });

  describe('Toda tabela (usando um conjunto maior de dados)', () => {

    const testArray = [
      {
        name: 'inline',
        create: createExtendedInlineTable
      },
      {
        name: 'propriedades',
        create: createExtendedPropsTable
      }
    ];

    it.each(testArray)('Deve renderizar a paginação corretamente ao pesquisar ($name)', async (table) =>  {
      const { root, waitForChanges } = await render<HTMLAlcDatatableElement>(table.create({
        pageLength: 2,
      }));

      const searchInput = await root.querySelector<HTMLInputElement>('alc-field input[type="search"]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'li');
      await waitForChanges();

      const pageInfo = root.querySelector('[data-test-page-info]');
      assert.exists(pageInfo, 'Informação de paginação deve existir');

      const pagination = root.querySelector<HTMLAlcPaginationElement>('[data-test-pagination]');
      assert.exists(pagination, 'Componente de paginação deve existir');

      expect(pageInfo.textContent).toContain('De 1 até 2 de 3 itens - de um total de 5 itens');

      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalPages).toBe(2);
    });

    it.each(testArray)('Deve voltar para a página 1 ao pesquisar quando esta em outra página ($name)', async (table) => {
      const { root, waitForChanges } = await render<HTMLAlcDatatableElement>(table.create({
        pageLength: 2,
      }));

      const searchInput = root.querySelector<HTMLInputElement>('alc-field input[type="search"]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      const pagination = root.querySelector<HTMLAlcPaginationElement>('alc-pagination');
      assert.exists(pagination, 'Componente de paginação deve existir');

      const alert = root.querySelector<HTMLAlcAlertElement>('alc-alert');
      assert.exists(alert, 'Componente de alerta deve existir');

      const buttonsPagination = root.querySelectorAll('[data-test-pagination-button]');
      assert.exists(buttonsPagination, 'Botões de paginação devem existir');

      const nextButtonPagination = buttonsPagination[buttonsPagination.length - 2];

      await userEvent.click(nextButtonPagination);
      await waitForChanges();

      expect(pagination.currentPage).toBe(2);
      expect(alert.visible).toBeFalsy();

      await userEvent.type(searchInput, 'li');
      await waitForChanges();

      expect(pagination.currentPage).toBe(1);
      expect(alert.visible).toBeTruthy();
    });

    
  });

  describe('Tabela com ordenação habilitada em algumas colunas', () => {

    const testArray = [
      {
        name: 'inline',
        create: createInlineTable
      },
      {
        name: 'propriedades',
        create: createPropsTable
      }
    ];

    it.each(testArray)('Deve renderizar corretamente o controle de ordenação - usando columnDefs.orderable ($name)', async(table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        columnDefs: [{
          orderable: false,
          targets: [1]
        }]
      }));

      const columns = root.querySelectorAll('thead th');

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[1]).toHaveClass('dt-orderable-none');

      expect(await sortIndicator(columns[0])).toEqual('asc');
      expect(columns[1].querySelector('alc-sort-indicator')).toBeNull();
    });

    it.each(testArray)('Deve renderizar corretamente o controle de ordenação - usando columns ($name)', async(table) => {
      const { root } = await render<HTMLAlcDatatableElement>(table.create({
        columns: [
          {title: "Nome"},
          {title: "Arma", orderable: false}
        ]
      }));

      const columns = root.querySelectorAll('thead th');

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[1]).toHaveClass('dt-orderable-none');

      expect(await sortIndicator(columns[0])).toEqual('asc');
      expect(columns[1].querySelector('alc-sort-indicator')).toBeNull();

    });

  });

  describe('Tabela com datas', () => {

    // Datas na ordem esperada de ordenação
    const DATES = [
      '',
      '01/01/2023',
      '02/01/2023',
      '01/02/2023'
    ];

    const createDateInlineTable = () => {
      return `
        <alc-datatable>
          <table>
            <thead>
              <tr>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${DATES[3]}</td>
              </tr>
              <tr>
                <td>${DATES[0]}</td>
              </tr>
              <tr>
                <td>${DATES[2]}</td>
              </tr>
              <tr>
                <td>${DATES[1]}</td>
              </tr>
            </tbody>
          </table>
        </alc-datatable>
      `;
    };

    const createDatePropsTable = () => {
      return `
        <alc-datatable
          data='[["${DATES[3]}"], ["${DATES[0]}"], ["${DATES[2]}"], ["${DATES[1]}"]]'
          options='{
            "columns": [
              {"title": "Data"}
            ]
          }'
        >
        </alc-datatable>
      `;
    };

    it.each([
      { name: 'inline', create: createDateInlineTable },
      { name: 'propriedades', create: createDatePropsTable }
    ])('Deve ordenar corretamente as datas ($name)', async (table) => {
      const { root, waitForChanges } = await render<HTMLAlcDatatableElement>(table.create());

      const columns = root.querySelectorAll<HTMLElement>('thead th');
      assert.exists(columns, 'Colunas devem existir');

      // Deve mudar a ordenação para descendente ao clicar na primeira coluna
      columns[0].click();
      await waitForChanges();

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[0]).toHaveClass('dt-ordering-desc');
      expect(columns[0].getAttribute('aria-sort')).toBe('descending');

      // Verifica se os ícones estão renderizando corretamente
      expect(await sortIndicator(columns[0])).toEqual('desc');

      // Deve remover a ordenação ao clicar na mesma coluna
      columns[0].click();
      await waitForChanges();

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[0]).not.toHaveClass('dt-ordering-asc');
      expect(columns[0]).not.toHaveClass('dt-ordering-desc');
      expect(columns[0]).not.toHaveAttribute('aria-sort');

      // Verifica se os ícones estão renderizando corretamente
      expect(await sortIndicator(columns[0])).toEqual('none');

      // Deve mudar a ordenação para ascendente ao clicar na mesma coluna
      columns[0].click();
      await waitForChanges();

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[0]).toHaveClass('dt-ordering-asc');
      expect(columns[0].getAttribute('aria-sort')).toBe('ascending');

      // Verifica se os ícones estão renderizando corretamente
      expect(await sortIndicator(columns[0])).toEqual('asc');

      // Verifica o conteúdo da coluna
      const data = root.querySelectorAll<HTMLElement>('td');
      const dataContent = Array.from(data).map(element => element.textContent.trim());
      expect(dataContent).toEqual(DATES);
    });
  });

  describe('Tabela com stateSave', () => {
    // Cria id para as tabelas (necessita por causa do stateSave)
    const id = Date.now();

    const STATESAVE_INLINE_TABLE = `
  <table id="inline-${id}">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Panthro</td>
        <td>É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana.</td>
      </tr>
      <tr>
        <td>Lion-O</td>
        <td>É o líder dos ThunderCats, que moram no terceiro mundo e lutam pela ordem e justiça.</td>
      </tr>
      <tr>
        <td>Tygra</td>
        <td>Pertencendo à linhagem dos tigres de Thundera, é um dos mais poderosos e versáteis Thundercats.</td>
      </tr>
      <tr>
        <td>Cheetara</td>
        <td>Representando a chita, é uma guerreira destemida. Forte e decidida, não hesita em entrar em ação para combater os vilões.</td>
      </tr>
      <tr>
        <td>Jaga</td>
        <td>É o mentor e guerreiro mestre de todos os Thundercats e, como seu nome sugere, é representado pelo jaguar.</td>
      </tr>
    </tbody>
  </table>
    `;

    const STATESAVE_PROPS_TABLE = {
      data: [
        ["Panthro", "É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana."],
        ["Lion-O", "É o líder dos ThunderCats, que moram no terceiro mundo e lutam pela ordem e justiça."],
        ["Tygra", "Pertencendo à linhagem dos tigres de Thundera, é um dos mais poderosos e versáteis Thundercats."],
        ["Cheetara", "Representando a chita, é uma guerreira destemida. Forte e decidida, não hesita em entrar em ação para combater os vilões."],
        ["Jaga", "É o mentor e guerreiro mestre de todos os Thundercats e, como seu nome sugere, é representado pelo jaguar."]
      ],
      columns: [
        {"title": "Nome"},
        {"title": "Descrição"}
      ]
    };

    const createStateSaveInlineTable = (additionalOptions: object = {}) => {

      const options = {
        ...additionalOptions
      };
    
      return `
        <alc-datatable
          ${Object.keys(options).length ? `options='${JSON.stringify(options)}'` : '' }
        >
          ${STATESAVE_INLINE_TABLE}
        </alc-datatable>
      `;
    };
    
    const createStateSavePropsTable = (additionalOptions: object) => {
    
      const options = {
        columns: EXTENDED_PROPS_TABLE.columns,
        ...additionalOptions
      };
    
      return `
        <alc-datatable
          data='${JSON.stringify(STATESAVE_PROPS_TABLE.data)}'
          ${Object.keys(options).length ? `options='${JSON.stringify(options)}'` : '' }
          table-id='props-${id}'
        >
        </alc-datatable>
      `;
    };

    const testArray = [
      {
        name: 'inline',
        create: createStateSaveInlineTable
      },
      {
        name: 'propriedades',
        create: createStateSavePropsTable
      }
    ];

    it.each(testArray)('Deve manter os estados ao usar stateSave ($name)', async (table) => {  
      const options = {
        pageLength: 2,
        lengthMenu: [1, 2, 3],
        stateSave: true,
      }

      const { root, waitForChanges } = await render<HTMLAlcDatatableElement>(table.create(options));

      let pagination = root.querySelector<HTMLAlcPaginationElement>('alc-pagination');
      assert.exists(pagination, 'Componente de paginação deve existir');

      const buttonsPagination = pagination.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
      assert.exists(buttonsPagination, 'Botões de paginação devem existir');

      // Aplicar um filtro. (Vai devolver 4 resultados do total de 5)
      let searchInput = root.querySelector<HTMLInputElement>('[data-test-search-field]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'ThunderCats');
      await waitForChanges();

      const selectOption = root.querySelector<HTMLSelectElement>('[data-test-length-field] select');
      assert.exists(selectOption, 'Campo de seleção de tamanho de página deve existir');

      // Trocar para exibir 3 por paginas
      await userEvent.selectOptions(selectOption, '3');

      // Ordenar crescente a segunda coluna
      let columns = root.querySelectorAll<HTMLElement>('thead th');
      assert.exists(columns, 'Colunas devem existir');
      
      columns[1].click();
      await waitForChanges();

      // Esconder a segunda coluna
      const columnsButton = root.querySelectorAll<HTMLAlcDropdownElement>('alc-dropdown');
      await userEvent.click(columnsButton[1]);
      await waitForChanges();

      const menuItens = columnsButton[1].querySelectorAll<HTMLAlcMenuItemElement>('alc-menu-item');
      await userEvent.click(menuItens[1]);
      await waitForChanges();

      // Navegar para a última página (página 2)
      const lastButtonPagination = buttonsPagination[buttonsPagination.length - 1];
      lastButtonPagination.click();
      await waitForChanges();

      // Removendo o componente e recriando-o com o mesmo ID de tabela,
      // o DataTables carregará o estado persistido — simulando um reload de página.
      root.remove();
      expect(root).not.toBeInTheDocument();
      
      const { root: root2, waitForChanges: waitForChanges2 } = await render<HTMLAlcDatatableElement>(table.create(options));
      await waitForChanges2();

      // Espera-se que continue com uma coluna visivel
      const columns2 = root2.querySelectorAll('thead th');
      expect(columns2).toHaveLength(1);
      expect(columns2[0]).not.toHaveClass('dt-ordering-asc');
      expect(columns2[0].textContent.trim()).toBe('Nome');

      // Espera-se que continue na página 2
      const pagination2 = root2.querySelector<HTMLAlcPaginationElement>('alc-pagination');
      assert.exists(pagination2, 'Componente de paginação deve existir');
      expect(pagination2.currentPage).toBe(2);

      // Espera-se que continua com o filtro
      const searchInput2 = root2.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(searchInput2, 'Campo de pesquisa deve existir');
      expect(searchInput2.value).toBe('ThunderCats');

      // Espera-se que continue com 3 linhas por página
      const lengthField2 = root2.querySelector<HTMLSelectElement>('[data-test-length-field] select');
      assert.exists(lengthField2, 'Campo de seleção de tamanho de página deve existir');
      expect(lengthField2.value).toBe('3');

      // Espera-se que tenha 1 resultado na segunda página
      const cells2 = root2.querySelectorAll('tbody td');
      expect(cells2).toHaveLength(1);
    });
  });

  describe('Tabela com acentos nos dados', () => {

    const ACCENT_DATA = [
      ['aa'],
      ['Aa'],
      ['ae'],
      ['Ae'],
      ['áa'],
      ['Áa'],
      ['áe'],
      ['Áe']
    ];

    const createAccentInlineTable = () => {
      return `
        <alc-datatable options='{"order": []}'>
          <table>
            <thead>
              <tr>
                <th>Dados</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>aa</td>
              </tr>
              <tr>
                <td>Aa</td>
              </tr>
              <tr>
                <td>ae</td>
              </tr>
              <tr>
                <td>Ae</td>
              </tr>
              <tr>
                <td>áa</td>
              </tr>
              <tr>
                <td>Áa</td>
              </tr>
              <tr>
                <td>áe</td>
              </tr>
              <tr>
                <td>Áe</td>
              </tr>
            </tbody>
          </table>
        </alc-datatable>
      `;
    };

    const createAccentPropsTable = () => {
      return `
        <alc-datatable
          data='${JSON.stringify(ACCENT_DATA)}'
          options='{
            "columns": [
              {"title": "Dados"}
            ],
            "order": []
          }'
        >
        </alc-datatable>
      `;
    };

    const testArray = [
      {
        name: 'inline',
        create: createAccentInlineTable
      },
      {
        name: 'propriedades',
        create: createAccentPropsTable
      }
    ];

    it.each(testArray)('Deve filtrar "aa" retornando as linhas 1, 2, 5 e 6 ($name)', async (table) => {
      const { root, waitForChanges } = await render(table.create());
      await waitForChanges();

      const searchInput = root.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');
      
      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'aa');
      await waitForChanges();

      const rows = root.querySelectorAll('tbody tr');
      const rowContents = Array.from(rows).map(row => row.textContent.trim());

      expect(rows).toHaveLength(4);
      expect(rowContents).toEqual(['aa', 'Aa', 'áa', 'Áa']);
    });

    it.each(testArray)('Deve filtrar "AA" retornando as linhas 1, 2, 5 e 6 (case insensitive) ($name)', async (table) => {
      const { root, waitForChanges } = await render(table.create());

      const searchInput = root.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'AA');
      await waitForChanges();

      const rows = root.querySelectorAll('tbody tr');
      const rowContents = Array.from(rows).map(row => row.textContent.trim());

      expect(rows).toHaveLength(4);
      expect(rowContents).toEqual(['aa', 'Aa', 'áa', 'Áa']);
    });

    it.each(testArray)('Deve filtrar "áá" retornando as linhas 1, 2, 5 e 6 ($name)', async (table) => {
      const { root, waitForChanges } = await render(table.create());

      const searchInput = root.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'áá');
      await waitForChanges();

      const rows = root.querySelectorAll('tbody tr');
      const rowContents = Array.from(rows).map(row => row.textContent.trim());

      expect(rows).toHaveLength(4);
      expect(rowContents).toEqual(['aa', 'Aa', 'áa', 'Áa']);
    });

    it.each(testArray)('Deve filtrar "ÁA" retornando as linhas 1, 2, 5 e 6 (case insensitive com acentos) ($name)', async (table) => {
      const { root, waitForChanges } = await render(table.create());

      const searchInput = root.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'ÁA');
      await waitForChanges();

      const rows = root.querySelectorAll('tbody tr');
      const rowContents = Array.from(rows).map(row => row.textContent.trim());

      expect(rows).toHaveLength(4);
      expect(rowContents).toEqual(['aa', 'Aa', 'áa', 'Áa']);
    });

    it.each(testArray)('Deve filtrar "é" não retornando as linhas 3, 4, 7 e 8 ($name)', async (table) => {
      const { root, waitForChanges } = await render(table.create());

      const searchInput = root.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'é');
      await waitForChanges();

      const rows = root.querySelectorAll('tbody tr');
      const rowContents = Array.from(rows).map(row => row.textContent.trim());

      expect(rows).toHaveLength(4);
      expect(rowContents).toEqual(['ae', 'Ae', 'áe', 'Áe']);
    });

    it.each(testArray)('Deve filtrar "a" retornando todas as linhas ($name)', async (table) => {
      const { root, waitForChanges } = await render(table.create());

      const searchInput = root.querySelector<HTMLInputElement>('[data-test-input-search]');
      assert.exists(searchInput, 'Campo de pesquisa deve existir');

      await userEvent.click(searchInput);
      await userEvent.type(searchInput, 'a');
      await waitForChanges();

      const rows = root.querySelectorAll('tbody tr');
      const rowContents = Array.from(rows).map(row => row.textContent.trim());

      expect(rows).toHaveLength(8);
      expect(rowContents).toEqual(['aa', 'Aa', 'ae', 'Ae', 'áa', 'Áa', 'áe', 'Áe']);
    });

  });

  // Testes específicos para tabela inline (ou seja, cujo código não se aplica a outro tipo de tabela)
  describe('Tabela inline', () => {
    it('Deve renderizar corretamente', async () => {
      const { root } = await render(createInlineTable());

      const headers = root.querySelectorAll('th');
      const headerContent = Array.from(headers).map(element => element.textContent.trim());

      const data = root.querySelectorAll('td');
      const dataContent = Array.from(data).map(element => element.textContent.trim());

      expect(root).toHaveClass('hydrated');
      expect(headerContent).toEqual(['Nome', 'Arma']);
      expect(dataContent).toEqual(['Lion-O', 'Espada Justiceira', 'Panthro', 'Nunchaku']);
    });

    it('Deve renderizar corretamente o controle de ordenação - usando columnDefs.orderable referenciando classe CSS', async() => {
      const { root } = await render(createInlineTable({
        columnDefs: [
          {
            orderable: false,
            targets: "test-nosort"
          },
        ]
      }));

      const columns = root.querySelectorAll('thead th');

      expect(columns[0]).toHaveClass('dt-orderable-asc');
      expect(columns[0]).toHaveClass('dt-orderable-desc');
      expect(columns[1]).toHaveClass('dt-orderable-none');

      expect(await sortIndicator(columns[0])).toEqual('asc');
      expect(columns[1].querySelector('alc-sort-indicator')).toBeNull();
    });

    it('Deve mostrar a tabela após chamar o método start() quando ativar a opção defer-start', async () => {
      const { root, waitForChanges } = await render<HTMLAlcDatatableElement>(createInlineTable({}, {
          deferStart: true
        })
      );

      // Antes de chamar start(), a tabela não deve estar visível
      let table = root.querySelector('table');
      expect(table).not.toBeNull();
      expect(table).not.toBeVisible();
      // Chama o método start()
      const started = await root.start();
      await waitForChanges();
      // Verifica que o método retornou true (indicando que foi realmente iniciado)
      expect(started).toBe(true);
      // Após chamar start(), a tabela deve estar renderizada e visível
      expect(table).toBeVisible();
    });
  });

  // Testes específicos para tabela por propriedade (ou seja, cujo código não se aplica a outro tipo de tabela)
  describe('Tabela por propriedade', () => {
    it('Deve renderizar corretamente', async () => {
      const { root } = await render<HTMLAlcDatatableElement>(createPropsTable());

      const headers = root.querySelectorAll('th');
      const headerContent = Array.from(headers).map(element => element.textContent.trim());

      expect(root).toHaveClass('hydrated');
      expect(root).toHaveAttribute('data');
      expect(root).toHaveProperty('options');

      expect(headerContent).toEqual(['Nome', 'Arma']);

      expect(JSON.parse(root.data as string)).toEqual( DEFAULT_PROPS_TABLE.data);
      expect(JSON.parse(root.options as string)).toEqual({ "columns": DEFAULT_PROPS_TABLE.columns });
    });

    it('Deve voltar para a pagina 1 ao atualizar `data` quando esta em outra página', async () =>  {
      const { root, waitForChanges, setProps } = await render<HTMLAlcDatatableElement>(createExtendedPropsTable({
        pageLength: 2
      }));

      const pagination = root.querySelector<HTMLAlcPaginationElement>('alc-pagination');
      assert.exists(pagination, 'Componente de paginação deve existir');

      const alert = root.querySelector<HTMLAlcAlertElement>('alc-alert');
      assert.exists(alert, 'Componente de alerta deve existir');

      const buttonsPagination = root.querySelectorAll('[data-test-pagination-button]');
      const nextButtonPagination = buttonsPagination[buttonsPagination.length - 2];
      await userEvent.click(nextButtonPagination);
      await waitForChanges();

      expect(pagination.currentPage).toBe(2);
      expect(alert.visible).toBeFalsy();

      // Simula a modificação (ainda que o conteúdo dos dados seja o mesmo).
      await setProps({data: EXTENDED_PROPS_TABLE.data});
      await waitForChanges();

      expect(pagination.currentPage).toBe(1);
      expect(alert.visible).toBeTruthy();
    });

  });
});
