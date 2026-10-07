import { render, h, describe, it, expect, assert, vi } from '@stencil/vitest';

// yarn stencil-test --project spec alc-pagination.spec.tsx

describe('components/alc-pagination', () => {
  describe('Renderização', () => {
    it('Deve renderizar o botão de "Ir para primeira página" e "Ir para página anterior" desabilitado quando estiver na primeira página', async () => {
      const { root } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
      const firstPaginationButton = buttonsPagination[0];
      const prevPaginationButton = buttonsPagination[1];

      expect(firstPaginationButton).toHaveAttribute('disabled');
      expect(firstPaginationButton).toHaveAttribute('aria-disabled');

      expect(prevPaginationButton).toHaveAttribute('disabled');
      expect(prevPaginationButton).toHaveAttribute('aria-disabled');
    });

    it('Deve renderizar o botão de "Ir para próxima página" e "Ir para última página" desabilitado quando estiver na última página', async () => {
      const { root } = await render(
        <alc-pagination totalPages={5} currentPage={5}></alc-pagination>
      );

      const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
      const lastPaginationButton = buttonsPagination[buttonsPagination.length - 1];
      const nextPaginationButton = buttonsPagination[buttonsPagination.length - 2];

      expect(nextPaginationButton).toHaveAttribute('disabled');
      expect(nextPaginationButton).toHaveAttribute('aria-disabled');

      expect(lastPaginationButton).toHaveAttribute('disabled');
      expect(lastPaginationButton).toHaveAttribute('aria-disabled');
    });

    it('Deve renderizar os botões "Ir para primeira/última página" com as classes modificadoras', async () => {
      const { root } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
      const firstPaginationButton = buttonsPagination[0];
      const lastPaginationButton = buttonsPagination[buttonsPagination.length - 1];

      expect(firstPaginationButton).toHaveClass('alc-pagination__button--first');
      expect(lastPaginationButton).toHaveClass('alc-pagination__button--last');
    });

    it('Deve renderizar quantidade de páginas (options) do select corretamente', async () => {
      const { root } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const optionsPaginationSelect = root.querySelectorAll('option');

      expect(optionsPaginationSelect.length).toEqual(5);
    });

    it('Deve renderizar os textos corretamente', async () => {
      const { root } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const textContent = root.textContent;

      expect(textContent).toContain('Página');
      expect(textContent).toContain('de 5');
    });
  });

  describe('Eventos', () => {
    it('Deve capturar o evento ao clicar - listener no componente', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
      const nextPaginationButton = buttonsPagination[buttonsPagination.length - 2];

      const alcChange = spyOnEvent('alc-change');

      nextPaginationButton.click();
      await waitForChanges();

      expect(alcChange).toHaveReceivedEvent();
    });

    it('Deve capturar o evento ao clicar - listener no document', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
      const nextPaginationButton = buttonsPagination[buttonsPagination.length - 2];

      const alcChange = vi.fn();
      document.addEventListener('alc-change', alcChange);

      nextPaginationButton.click();
      await waitForChanges();

      expect(alcChange).toHaveBeenCalled();
    });

    it('Não deve disparar evento ao carregar', async () => {
      const { spyOnEvent } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const alcChange = spyOnEvent('alc-change');

      expect(alcChange).not.toHaveReceivedEvent();
    });

    it('Deve disparar o evento com os dados esperado', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(
        <alc-pagination totalPages={5} currentPage={1}></alc-pagination>
      );

      const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');
      const nextPaginationButton = buttonsPagination[buttonsPagination.length - 2];

      const alcChange = spyOnEvent('alc-change');

      nextPaginationButton.click();
      await waitForChanges();

      expect(alcChange).toHaveReceivedEventDetail({ from: 1, to: 2, using: 'isNext' });
    });
  });

  describe('Acessibilidade', () => {
    it('Deve renderizar corretamente o id dinâmico do select com htmlfor do label', async () => {
      const { root } = await render(
        <alc-pagination id="pagination" totalPages={5} currentPage={1}></alc-pagination>
      );

      const labelEl = root.querySelector('label');
      assert.exists(labelEl, 'O label não foi encontrado');
      
      const selectEl = root.querySelector('select');
      assert.exists(selectEl, 'O select não foi encontrado');

      expect(labelEl).toEqualAttribute('for', selectEl.id);
    });

    it('Deve renderizar aria-label corretamente da navegação', async () => {
      const { root } = await render(
        <alc-pagination id="pagination" totalPages={5} currentPage={1}></alc-pagination>
      );

      const paginationNav = root.querySelector('nav');

      expect(paginationNav).toHaveAttribute('aria-label');
      expect(paginationNav).toEqualAttribute('aria-label', 'Navegação paginada');
    });

    it('Deve renderizar aria-label corretamente do option do select', async () => {
      const { root } = await render(
        <alc-pagination id="pagination" totalPages={5} currentPage={1}></alc-pagination>
      );

      const firstPaginationOption = root.querySelector('option');

      expect(firstPaginationOption).toHaveAttribute('aria-label');
      expect(firstPaginationOption).toEqualAttribute('aria-label', 'Página 1');
    });

    it('Deve renderizar aria-label corretamente dos botões', async () => {
      const { root } = await render(
        <alc-pagination id="pagination" totalPages={5} currentPage={1}></alc-pagination>
      );

      const buttonsPagination = root.querySelectorAll<HTMLButtonElement>('[data-test-pagination-button]');

      const firstPaginationButton = buttonsPagination[0];
      const prevPaginationButton = buttonsPagination[1];
      const lastPaginationButton = buttonsPagination[buttonsPagination.length - 1];
      const nextPaginationButton = buttonsPagination[buttonsPagination.length - 2];

      expect(firstPaginationButton).toHaveAttribute('aria-label');
      expect(firstPaginationButton).toEqualAttribute('aria-label', 'Ir para primeira página');

      expect(prevPaginationButton).toHaveAttribute('aria-label');
      expect(prevPaginationButton).toEqualAttribute('aria-label', 'Ir para página anterior');

      expect(nextPaginationButton).toHaveAttribute('aria-label');
      expect(nextPaginationButton).toEqualAttribute('aria-label', 'Ir para próxima página, Ir para página 2');

      expect(lastPaginationButton).toHaveAttribute('aria-label');
      expect(lastPaginationButton).toEqualAttribute('aria-label', 'Ir para última página, Ir para página 5');
    });
  });
});
