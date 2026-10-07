import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-input-file.spec.tsx

describe('alc-input-file', () => {
  // Cria um arquivo fake para usar nos testes
  const fileData = { name: 'teste.txt', content: 'conteúdo do arquivo' };
  const file = new File([fileData.content], fileData.name, { type: 'text/plain' });

  it('Deve limpar os arquivos corretamente ao chamar o método clear', async () => {
    const { root, waitForChanges } = await render<HTMLAlcInputFileElement>(
      <alc-input-file idInput="id-input-teste"></alc-input-file>
    );

    // Encontre o input do tipo file
    const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
    assert.exists(fileInput, 'O input de arquivo não foi encontrado');

    // Simula um FileList (sobrescrevendo a propriedade 'files' do input)
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });

    // Dispare o evento de mudança
    fileInput.dispatchEvent(new Event('change'));

    // Aguarde a renderização
    await waitForChanges();

    // Verifique se o componente processou o arquivo corretamente
    expect(root.querySelectorAll('[data-test-file]')).toHaveLength(1);

    // Chame o método clear
    await root.clear();
    await waitForChanges();

    // Verifique se os arquivos foram limpos
    expect(root.querySelectorAll('[data-test-file]')).toHaveLength(0);
  });

  it('Deve retornar os arquivos corretamente ao chamar o método getFiles', async () => {
    const { root, waitForChanges } = await render<HTMLAlcInputFileElement>(
      <alc-input-file idInput="id-input-teste"></alc-input-file>
    );

    // Encontre o input do tipo file
    const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
    assert.exists(fileInput, 'O input de arquivo não foi encontrado');

    // Simula um FileList (sobrescrevendo a propriedade 'files' do input)
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });

    // Dispare o evento de mudança
    fileInput.dispatchEvent(new Event('change'));

    // Aguarde a renderização
    await waitForChanges();

    // Chame o método getFiles
    const files = await root.getFiles();

    // Verifique se os arquivos foram retornados corretamente
    expect(files).toHaveLength(1);
    expect(files[0].file.name).toBe(fileData.name);
    expect(new TextDecoder().decode(files[0].content)).toBe(fileData.content);
  });

  it('deve disparar o evento alcFileSelected corretamente', async () => {
    const { root, spyOnEvent, waitForChanges } = await render<HTMLAlcInputFileElement>(
      <alc-input-file idInput="id-input-teste"></alc-input-file>
    );

    // Encontre o input do tipo file
    const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
    assert.exists(fileInput, 'O input de arquivo não foi encontrado');

    // Simula um FileList (sobrescrevendo a propriedade 'files' do input)
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });

    // Espião para o evento alc-file-selected
    const fileSelectedSpy = spyOnEvent('alc-file-selected');

    // Dispare o evento de mudança
    fileInput.dispatchEvent(new Event('change'));

    // Aguarde a renderização
    await waitForChanges();

    // Verifique se o evento foi disparado corretamente
    expect(fileSelectedSpy).toHaveReceivedEvent();
    expect(root.querySelectorAll('[data-test-file]')).toHaveLength(1);
    expect(fileSelectedSpy.firstEvent?.detail.files[0].file.name).toBe(fileData.name);
    expect(new TextDecoder().decode(fileSelectedSpy.firstEvent?.detail.files[0].content)).toBe(fileData.content);
  });
});