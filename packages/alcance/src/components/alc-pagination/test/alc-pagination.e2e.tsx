import { render, h, describe, it, expect, assert, beforeEach } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-pagination.e2e.tsx

const DESKTOP_WIDTH = 1280;

describe('components/alc-pagination', () => {
    beforeEach(async () => {
        await page.viewport(DESKTOP_WIDTH, 800);
    });

    it('Deve renderizar corretamente', async () => {
        const { root } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
        );

        expect(root).toHaveClass('hydrated');
    });

    it('Deve esconder os botões de "Ir para primeira/última página" na versão mobile', async () => {
        await page.viewport(360, 740);

        const { root } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
        );

        const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
        const firstButtonPagination = buttonsPagination[0];
        const lastButtonPagination = buttonsPagination[buttonsPagination.length - 1];

        expect(firstButtonPagination.checkVisibility()).toBeFalsy();
        expect(lastButtonPagination.checkVisibility()).toBeFalsy();
    });

    it('Deve renderizar a página atual (default) corretamente', async () => {
        const { root } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(0);
    });

    it('Deve renderizar a página atual (current-page="2") corretamente', async () => {
        const { root } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={2}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(1);
    });

    it('Deve disparar o evento com os dados esperado (select)', async () => {
        const { root, waitForChanges, spyOnEvent } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
        );

        const changeSpy = spyOnEvent('alc-change');

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        await userEvent.selectOptions(selectPagination, '3');
        await waitForChanges();

        expect(changeSpy).toHaveReceivedEventTimes(1);
        expect(changeSpy).toHaveReceivedEventDetail({ from: 1, to: 3, using: 'isSelect' });
    });

    it('Deve renderizar a página atual corretamente ao clicar em "Ir para próxima página"', async () => {
        const { root, waitForChanges } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(0);

        const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
        const nextButtonPagination = buttonsPagination[buttonsPagination.length - 2];

        await userEvent.click(nextButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(1);
    });

    it('Deve renderizar a página atual corretamente ao clicar em "Ir para última página"', async () => {
        const { root, waitForChanges } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(0);

        const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
        const lastButtonPagination = buttonsPagination[buttonsPagination.length - 1];

        await userEvent.click(lastButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(4);
    });

    it('Deve atualizar o total-pages e continuar navegando"', async () => {
        const { root, waitForChanges, setProps, spyOnEvent } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={3} currentPage={1}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(0);

        const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
        const lastButtonPagination = buttonsPagination[buttonsPagination.length - 1];
        const prevButtonPagination = buttonsPagination[1];

        await userEvent.click(lastButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(2);
        expect(root.totalPages).toBe(3);

        await setProps({ totalPages: 5 });
        expect(root.totalPages).toBe(5);

        await userEvent.click(lastButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(4);

        await userEvent.click(prevButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(3);

        const changeSpy = spyOnEvent('alc-change');

        const selectEl = root.querySelector('select');
        assert.exists(selectEl, 'O select não foi encontrado');

        await userEvent.selectOptions(selectEl, '5');
        await waitForChanges();

        expect(changeSpy).toHaveReceivedEventTimes(1);
        expect(changeSpy).toHaveReceivedEventDetail({ from: 4, to: 5, using: 'isSelect' });
    });

    it('Caso total-pages seja menor que o current-page, não deve ser alterado "', async () => {
        const { root, waitForChanges, setProps } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(0);

        const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
        const lastButtonPagination = buttonsPagination[buttonsPagination.length - 1];

        await userEvent.click(lastButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(4);
        expect(root.totalPages).toBe(5);

        await setProps({ totalPages: 3 });

        expect(root.totalPages).toBe(5);
    });

    it('Deve renderizar a página atual corretamente ao clicar em "Ir para página anterior"', async () => {
        const { root, waitForChanges } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={5}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(4);

        const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
        const prevButtonPagination = buttonsPagination[1];

        await userEvent.click(prevButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(3);
    });

    it('Deve renderizar a página atual corretamente ao clicar em "Ir para primeira página"', async () => {
        const { root, waitForChanges } = await render<HTMLAlcPaginationElement>(
            <alc-pagination totalPages={5} currentPage={5}></alc-pagination>
        );

        const selectPagination = root.querySelector<HTMLSelectElement>('select');
        assert.exists(selectPagination, 'O select não foi encontrado');

        expect(selectPagination.selectedIndex).toBe(4);

        const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
        const firstButtonPagination = buttonsPagination[0];
        
        await userEvent.click(firstButtonPagination);
        await waitForChanges();

        expect(selectPagination.selectedIndex).toBe(0);
    });
});