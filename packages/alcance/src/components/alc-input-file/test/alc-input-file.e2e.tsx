import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-input-file.e2e.tsx


// @TODO Analisar outra forma de verificar os buttons/input e dragAndDrop?
describe('components/alc-input-file', () => {
    const files = [
        { name: 'arquivoteste.txt', content: 'Este é um arquivo de teste' },
        { name: 'arquivoteste2.txt', content: 'Este é um arquivo de teste 2' },
    ];

    it('Deve fazer upload do arquivo corretamente - button', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const button = root.querySelector<HTMLButtonElement>('[data-test-button]');
        assert.exists(button, 'O botão não foi encontrado');
        await userEvent.click(button);

        const testFile = new File([files[0].content], files[0].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, testFile);
        await waitForChanges();

        assert.exists(fileInput.files, 'Arquivos não foram encontrados');

        expect(fileInput.files.length).toBe(1);
        expect(fileInput.files[0].name).toBe(files[0].name);
        expect(await fileInput.files[0].text()).toBe(files[0].content);
        expect(root.querySelectorAll('[data-test-file]')).toHaveLength(1);
    });

    it('Deve fazer upload de 2 arquivos corretamente - button', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste" multiple={true}></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const testFile1 = new File([files[0].content], files[0].name, { type: 'text/plain' });
        const testFile2 = new File([files[1].content], files[1].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, [testFile1, testFile2]);
        await waitForChanges();

        assert.exists(fileInput.files, 'Arquivos não foram encontrados');

        expect(fileInput.files.length).toBe(2);
        expect(fileInput.files[0].name).toBe(files[0].name);
        expect(await fileInput.files[0].text()).toBe(files[0].content);
        expect(fileInput.files[1].name).toBe(files[1].name);
        expect(await fileInput.files[1].text()).toBe(files[1].content);
        expect(root.querySelectorAll('[data-test-file]')).toHaveLength(2);
    });

    it('Deve remover o arquivo ao clicar no botão de excluir - button', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const testFile = new File([files[0].content], files[0].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, testFile);
        await waitForChanges();

        const fileElements = root.querySelectorAll('[data-test-file]');
        expect(fileElements).toHaveLength(1);

        const deleteButton = fileElements[0].querySelector<HTMLButtonElement>('[data-test-delete-file-button]');
        assert.exists(deleteButton, 'O botão de excluir não foi encontrado');

        await userEvent.click(deleteButton);
        await waitForChanges();

        expect(root.querySelectorAll('[data-test-file]')).toHaveLength(0);
    });

    it('Deve fazer upload do arquivo corretamente - input', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste" mode="input"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const inputEl = root.querySelector<HTMLInputElement>('[data-test-input]');
        assert.exists(inputEl, 'O input não foi encontrado');

        const testFile = new File([files[0].content], files[0].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, testFile);
        await waitForChanges();

        assert.exists(fileInput.files, 'Arquivos não foram encontrados');

        expect(fileInput.files.length).toBe(1);
        expect(fileInput.files[0].name).toBe(files[0].name);
        expect(await fileInput.files[0].text()).toBe(files[0].content);
        expect(inputEl.value).toBe(files[0].name);
    });

    it('Deve fazer upload de 2 arquivos corretamente - input', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste" multiple={true} mode="input"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const inputEl = root.querySelector<HTMLInputElement>('[data-test-input]');
        assert.exists(inputEl, 'O input não foi encontrado');

        const testFile1 = new File([files[0].content], files[0].name, { type: 'text/plain' });
        const testFile2 = new File([files[1].content], files[1].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, [testFile1, testFile2]);
        await waitForChanges();

        assert.exists(fileInput.files, 'Arquivos não foram encontrados');

        expect(fileInput.files.length).toBe(2);
        expect(fileInput.files[0].name).toBe(files[0].name);
        expect(await fileInput.files[0].text()).toBe(files[0].content);
        expect(fileInput.files[1].name).toBe(files[1].name);
        expect(await fileInput.files[1].text()).toBe(files[1].content);
        expect(inputEl.value).toContain(`${files[0].name}, ${files[1].name}`);
    });

    it('Deve remover o arquivo ao clicar no botão de excluir - input', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste" mode="input"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const inputEl = root.querySelector<HTMLInputElement>('[data-test-input]');
        assert.exists(inputEl, 'O input não foi encontrado');

        const testFile = new File([files[0].content], files[0].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, testFile);
        await waitForChanges();

        expect(inputEl.value).toBe(files[0].name);

        const deleteButton = root.querySelector<HTMLButtonElement>('[data-test-delete-file-button]');
        assert.exists(deleteButton, 'O botão de excluir não foi encontrado');

        await userEvent.click(deleteButton);
        await waitForChanges();

        expect(inputEl.value).toBe('');
    });

    // No modo dropzone o teste é clicando no dropzone e selecionando o arquivo, não sei se é possível simular o drag and drop
    it('Deve fazer upload do arquivo corretamente - dropzone', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste" mode="dropzone"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const testFile = new File([files[0].content], files[0].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, testFile);
        await waitForChanges();

        assert.exists(fileInput.files, 'Arquivos não foram encontrados');

        expect(fileInput.files.length).toBe(1);
        expect(fileInput.files[0].name).toBe(files[0].name);
        expect(await fileInput.files[0].text()).toBe(files[0].content);
        expect(root.querySelectorAll('[data-test-file]')).toHaveLength(1);
    });

    it('Deve fazer upload de 2 arquivos corretamente - dropzone', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste" multiple={true} mode="dropzone"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const testFile1 = new File([files[0].content], files[0].name, { type: 'text/plain' });
        const testFile2 = new File([files[1].content], files[1].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, [testFile1, testFile2]);
        await waitForChanges();

        assert.exists(fileInput.files, 'Arquivos não foram encontrados');

        expect(fileInput.files.length).toBe(2);
        expect(fileInput.files[0].name).toBe(files[0].name);
        expect(await fileInput.files[0].text()).toBe(files[0].content);
        expect(fileInput.files[1].name).toBe(files[1].name);
        expect(await fileInput.files[1].text()).toBe(files[1].content);
        expect(root.querySelectorAll('[data-test-file]')).toHaveLength(2);
    });

    it('Deve remover o arquivo ao clicar no botão de excluir - dropzone', async () => {
        const { root, waitForChanges } = await render(
            <alc-input-file idInput="id-input-teste" mode="dropzone"></alc-input-file>
        );

        const fileInput = root.querySelector<HTMLInputElement>('[data-test-file-input]');
        assert.exists(fileInput, 'O input de arquivo não foi encontrado');

        const testFile = new File([files[0].content], files[0].name, { type: 'text/plain' });

        await userEvent.upload(fileInput, testFile);
        await waitForChanges();

        const fileElements = root.querySelectorAll('[data-test-file]');
        expect(fileElements).toHaveLength(1);

        const deleteButton = fileElements[0].querySelector<HTMLButtonElement>('[data-test-delete-file-button]');
        assert.exists(deleteButton, 'O botão de excluir não foi encontrado');
        await userEvent.click(deleteButton);
        await waitForChanges();

        expect(root.querySelectorAll('[data-test-file]')).toHaveLength(0);
    });
})