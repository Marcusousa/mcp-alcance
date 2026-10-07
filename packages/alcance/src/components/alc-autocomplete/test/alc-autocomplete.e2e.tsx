import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-autocomplete.e2e.tsx

const data = [
  {id: 0, nome: 'José'},
  {id: 1, nome: 'Maria'},
  {id: 2, nome: 'João'},
]

describe('alc-autocomplete', () => {
  it('Deve renderizar os itens corretamente', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    const results = root.querySelector('[data-test-autocomplete-results]');
    assert.exists(results, 'Os resultados não foram encontrados');

    setProps({ items: data });
    await waitForChanges();

    await userEvent.click(input)
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(results.querySelectorAll('li')).toHaveLength(2);
  });

  it('Deve fechar os itens ao clicar em esc', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    const results = root.querySelector('[data-test-autocomplete-results]');
    assert.exists(results, 'Os resultados não foram encontrados');

    const popup = root.querySelector<HTMLAlcPopupElement>('[data-test-autocomplete-popup]');
    assert.exists(popup, 'O popup não foi encontrado');

    setProps({ items: data });
    await waitForChanges();

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(results.querySelectorAll('li')).toHaveLength(2);
    expect(popup.active).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    await waitForChanges();

    expect(results.querySelectorAll('li')).toHaveLength(0);
    expect(popup.active).toBeFalsy();
  });

  it('Deve limpar o filtro ao clicar no botão de limpar', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    setProps({ items: data });
    await waitForChanges();

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(input.value).toBe('jo');

    const clearButton = root.querySelector<HTMLElement>('[data-test-autocomplete-clear-button]');
    assert.exists(clearButton, 'O botão de limpar não foi encontrado');

    await userEvent.click(clearButton);
    await waitForChanges();

    expect(input.value).toBe('');
  });

  it('Deve permanecer o filtro ao tirar o foco e voltar', async () => {
    const { root, waitForChanges, setProps } = await render(
      <div>
        <alc-autocomplete
          id="dados-teste"
          label="Autocomplete"
          placeholder="Digite para iniciar a busca"
          displayKeys="nome"
          listDirection="horizontal"
        ></alc-autocomplete>

        <a href="#" id="link">Link</a>
      </div>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    setProps({ items: data });
    await waitForChanges();

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(input.value).toBe('jo');

    // Pressiona Tab para ir para o próximo elemento (Botão de limpar)
    await userEvent.keyboard('{Tab}');
    // Pressiona Tab para ir para o próximo elemento (Link)
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.id).toBe('link');

    // Pressiona Shift + Tab, o foco deve voltar para o autocomplete
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');

    expect(input.value).toBe('jo');
  });

  it('Deve navegar pelos itens por teclado', async () => {
    const complexData = [
      {id: 0, nome: 'José', sobrenome: 'Silva'},
      {id: 1, nome: 'Maria', sobrenome: 'Santos'},
      {id: 2, nome: 'João', sobrenome: 'Souza'},
    ]

    const { root, waitForChanges, setProps } = await render(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome, sobrenome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    const results = root.querySelector('[data-test-autocomplete-results]');

    assert.exists(input, 'O input não foi encontrado');
    assert.exists(results, 'Os resultados não foram encontrados');

    setProps({ items: complexData });
    await waitForChanges();

    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(input.value).toBe('jo');
    expect(results.querySelectorAll('li')).toHaveLength(2);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();

    // Pressiona seta para baixo para focar o primeiro item
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(input.getAttribute('aria-activedescendant')).toBe('result-item-0x0');

    // Pressiona seta para baixo para focar o segundo item
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(input.getAttribute('aria-activedescendant')).toBe('result-item-1x0');

    // Pressiona seta para cima para focar o primeiro item
    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();
    expect(input.getAttribute('aria-activedescendant')).toBe('result-item-0x0');

    // Pressiona seta para direita para focar a segunda informação (sobrenome) do primeiro item
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    expect(input.getAttribute('aria-activedescendant')).toBe('result-item-0x1');
  });

  it('Deve selecionar um item ao clicar', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    const results = root.querySelector('[data-test-autocomplete-results]');

    assert.exists(input, 'O input não foi encontrado');
    assert.exists(results, 'Os resultados não foram encontrados');

    setProps({ items: data });
    await waitForChanges();

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(input.value).toBe('jo');

    // Obtém os itens do resultado
    const items = results.querySelectorAll<HTMLElement>('li');
    assert.exists(items, 'Os itens não foram encontrados');   
    // Simula o "blur" do elemento que estiver ativo antes de realizar o clique
    // Isso torna o teste mais próximo do comportamento real do usuário.
    // (document.activeElement as HTMLElement)?.blur();
    // items[0].click();

    // Não é necessário simular o blur antes do clique, pois o userEvent já simula o comportamento real do usuário.
    await userEvent.click(items[0]);
    await waitForChanges();

    expect(input.value).toBe('José');
  });

  it('Deve selecionar ao pressionar "Enter"', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    setProps({ items: data });
    await waitForChanges();

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    const results = root.querySelector('[data-test-autocomplete-results]');

    assert.exists(input, 'O input não foi encontrado');
    assert.exists(results, 'Os resultados não foram encontrados');

    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(input.value).toBe('jo');

    // Pressiona seta para baixo para focar o primeiro item
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    // Pressiona Enter para selecionar o primeiro item
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(input.value).toBe('José');
  });

  it('Deve disparar o evento ao selecionar um item', async () => {
    const { root, spyOnEvent, waitForChanges, setProps } = await render(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    setProps({ items: data });
    await waitForChanges();

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    const results = root.querySelector('[data-test-autocomplete-results]');

    assert.exists(input, 'O input não foi encontrado');
    assert.exists(results, 'Os resultados não foram encontrados');

    const changeSpy = spyOnEvent('alc-change');

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    expect(input.value).toBe('jo');

    const items = results.querySelectorAll<HTMLElement>('li');
    assert.exists(items, 'Os itens não foram encontrados');
    
    (document.activeElement as HTMLElement)?.blur();
    items[0].click();
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail(data[0]);
  });

  it('Deve retonar o valor correto ao usar o método getSelected()', async () => {
    const { root, waitForChanges, setProps } = await render<HTMLAlcAutocompleteElement>(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    const results = root.querySelector('[data-test-autocomplete-results]');
    assert.exists(input, 'O input não foi encontrado');
    assert.exists(results, 'Os resultados não foram encontrados');

    setProps({ items: data });
    await waitForChanges();

    await userEvent.click(input);
    await waitForChanges();

    await userEvent.keyboard('jo');
    await waitForChanges();

    const items = results.querySelectorAll<HTMLElement>('li');
    assert.exists(items, 'Os itens não foram encontrados');

    // (document.activeElement as HTMLElement)?.blur();
    // items[1].click();

    // Não é necessário simular o blur antes do clique, pois o userEvent já simula o comportamento real do usuário.
    await userEvent.click(items[1]);
    await waitForChanges();

    // O resultado da pesquisa retorna o primeiro e o terceiro dado (José e João), então o resultado esperado é o terceiro item (João)
    expect(await root.getSelected()).toEqual(data[2]);
  });

  it('Deve retonar o valor correto ao usar o método setSelected()', async () => {
    const { root, waitForChanges, setProps   } = await render<HTMLAlcAutocompleteElement>(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    assert.exists(input, 'O input não foi encontrado');

    setProps({ items: data });
    await waitForChanges();

    await root.setSelected(data[1]);

    expect(await root.getSelected()).toEqual(data[1]);
    expect(input.value).toBe('Maria');
  });

  it('Deve limpar o valor ao usar o método clearSelected()', async () => {
    const { root, waitForChanges, setProps } = await render<HTMLAlcAutocompleteElement>(
      <alc-autocomplete
        id="dados-teste"
        label="Autocomplete"
        placeholder="Digite para iniciar a busca"
        displayKeys="nome"
        listDirection="horizontal"
      ></alc-autocomplete>
    );

    const input = root.querySelector<HTMLInputElement>('[data-test-autocomplete-input]');
    const results = root.querySelector('[data-test-autocomplete-results]');

    assert.exists(input, 'O input não foi encontrado');
    assert.exists(results, 'Os resultados não foram encontrados');

    setProps({ items: data });
    await waitForChanges();

    await root.setSelected(data[1]);
    expect(await root.getSelected()).toEqual(data[1]);
    expect(input.value).toBe('Maria');

    await root.clearSelected();
    expect(await root.getSelected()).toBeNull();
    expect(input.value).toBe('');
  });
});