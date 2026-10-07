import { render, h, describe, it, expect, assert } from '@stencil/vitest';

const data = {
  name: 'Thundercats',
  description: 'Thundercats Technology',
  homeUrl: '/home',
};

describe('alc-header-id', () => {

  it('O link deve apontar para a URL correta', async () => {
    const { root } = await render(
      <alc-header-id name={data.name} homeUrl={data.homeUrl}></alc-header-id>
    );

    const link = root.querySelector('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');
    expect(link.getAttribute('href')).toBe(data.homeUrl);
  });

  it('Deve renderizar a logo com alt', async () => {
    const { root } = await render(
      <alc-header-id name={data.name} homeUrl={data.homeUrl}></alc-header-id>
    );

    const image = root.querySelector('[data-test-image]');
    assert.exists(image, 'A imagem não foi encontrada');
    expect(image.getAttribute('alt')).toBe('Logo da Câmara dos Deputados');
  });

  it('Deve atualizar nome dinamicamente', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-header-id name={data.name} homeUrl={data.homeUrl}></alc-header-id>
    );

    let name = root.querySelector('[data-test-name]');
    assert.exists(name, 'O nome não foi encontrado');
    expect(name.textContent).toBe(data.name);

    const novoNome = 'Thundercats 2.0';
    setProps({ name: novoNome });
    await waitForChanges();

    name = root.querySelector('[data-test-name]');
    assert.exists(name, 'O nome não foi encontrado');

    expect(name.textContent).toBe(novoNome);
  });

  it('Deve atualizar descrição dinamicamente', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-header-id 
        name={data.name} 
        homeUrl={data.homeUrl} 
        description={data.description}
      ></alc-header-id>
    );

    let descriptionEl = root.querySelector('[data-test-description]');
    assert.exists(descriptionEl, 'A descrição não foi encontrada');
    expect(descriptionEl.textContent).toBe(data.description);

    const novaDescricao = 'Thundercats Technology v2.0';
    setProps({ description: novaDescricao });
    await waitForChanges();

    descriptionEl = root.querySelector('[data-test-description]');
    assert.exists(descriptionEl, 'A descrição não foi encontrada');
    expect(descriptionEl.textContent).toBe(novaDescricao);

    setProps({ description: '' });
    await waitForChanges();

    descriptionEl = root.querySelector('[data-test-description]');
    expect(descriptionEl).toBeNull();
  });

  it('Deve atualizar URL dinamicamente', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-header-id name={data.name} homeUrl={data.homeUrl}></alc-header-id>
    );

    const link = root.querySelector('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');
    expect(link.getAttribute('href')).toBe(data.homeUrl);

    const novaUrl = '/url-test-2';
    setProps({ homeUrl: novaUrl })
    await waitForChanges();

    expect(link.getAttribute('href')).toBe(novaUrl);
  });

  it('Deve atualizar aria-label dinamicamente', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-header-id name={data.name} homeUrl={data.homeUrl}></alc-header-id>
    );

    const link = root.querySelector('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');
    expect(link.getAttribute('aria-label')).toBe(`Página inicial do ${data.name}`);

    const novoNome = 'Thundercats 2.0';
    setProps({ name: novoNome });
    await waitForChanges();

    expect(link.getAttribute('aria-label')).toBe(`Página inicial do ${novoNome}`);
  });
});
