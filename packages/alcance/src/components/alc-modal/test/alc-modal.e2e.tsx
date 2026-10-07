import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// Posição segura para clicar no overlay, evitando que o clique acione elementos indesejados.
// Por padrão, o clique ocorre no centro do elemento, o que pode representar um clique sobre
// a própria janela modal aberta.
const SECURE_OVERLAY_POSITION =  { x: 5, y: 5 };

// yarn stencil-test --project browser alc-modal.e2e.tsx

describe('components/alc-modal', () => {
  it('Deve renderizar corretamente', async () => {
    const { root } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal"></alc-modal>
    );

    const closeButton = root.querySelector('[data-test-close-button]');

    expect(root).toHaveClass('hydrated');
    expect(root.textContent).toContain('Exemplo de modal');
    assert.exists(closeButton, 'Botão de fechar não encontrado');
  });

  it('Deve renderizar cartão com acessibilidade', async () => {
    const { root } = await render(
      <alc-modal header-text="Exemplo de modal"></alc-modal>
    );

    const card = root.querySelector('[data-test-modal-card]');
    assert.exists(card, 'Card não encontrado');

    expect(card).toHaveAttribute('role');
    expect(card).toHaveAttribute('aria-modal');
    expect(card).toHaveAttribute('aria-labelledby');
  });

  it('Deve renderizar botão de fechar com acessibilidade', async () => {
    const { root } = await render(
      <alc-modal header-text="Exemplo de modal"></alc-modal>
    );

    const closeIcon = root.querySelector('[data-test-close-icon]');
    assert.exists(closeIcon, 'Ícone de fechar não encontrado');

    expect(closeIcon.getAttribute('aria-label')).toBe('Fechar Modal');
  });

  it('Deve renderizar o id dinâmico do titulo com o labelledby do card corretamente', async () => {
    const { root } = await render(
      <alc-modal header-text="Exemplo de modal"></alc-modal>
    );

    const card = root.querySelector('[data-test-modal-card]');
    assert.exists(card, 'Card não encontrado');

    const titleModal = root.querySelector<HTMLElement>('[data-test-modal-title]');
    assert.exists(titleModal, 'Título não encontrado');

    expect(titleModal.id).toBe(card.getAttribute('aria-labelledby'));
  });

  it('Deve esconder a modal ao clicar em fechar', async () => {
    const { root, waitForChanges } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
    );

    const closeButton = root.querySelector<HTMLButtonElement>('[data-test-close-button]');
    assert.exists(closeButton, 'Botão de fechar não encontrado');
    
    await userEvent.click(closeButton);
    await waitForChanges();

    expect(root.open).toBeFalsy();
    expect(root.checkVisibility()).toBeFalsy();
    expect(root.style.display).toBe('none');
  });

  it('Deve esconder a modal ao fechar (método)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
    );

    const hidden = await root.hide();
    await waitForChanges();

    expect(hidden).toBeTruthy();
    expect(root.open).toBeFalsy();
    expect(root.checkVisibility()).toBeFalsy();
    expect(root.style.display).toBe('none');
  });

  it('Deve mostrar a modal ao abrir (método)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal"></alc-modal>
    );

    const shown = await root.show();
    await waitForChanges();

    expect(shown).toBeTruthy();
    expect(root.open).toBeTruthy();
    expect(root.checkVisibility()).toBeTruthy();
    expect(root.style.display).toBe('block');
  });

  it('Deve mostrar a modal ao alterar a propriedade open para true', async () => {
    const { root, waitForChanges } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal"></alc-modal>
    );

    root.setAttribute('open', 'true');
    await waitForChanges();

    expect(root.open).toBeTruthy();
    expect(root.checkVisibility()).toBeTruthy();
    expect(root.style.display).toBe('block');
  });

  it('Deve esconder a modal ao alterar a propriedade open para false', async () => {
    const { root, waitForChanges } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
    );

    root.setAttribute('open', 'false');
    await waitForChanges();

    expect(root.open).toBeFalsy();
    expect(root.checkVisibility()).toBeFalsy();
    expect(root.style.display).toBe('none');
  });

  it('Deve retornar, ao fechar, o foco ao elemento que estava em foco antes de abrir', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <button data-test-initial>Dono do foco</button>
        <alc-modal header-text="Exemplo de modal"></alc-modal>
      </div>
    );

    const button = root.querySelector<HTMLButtonElement>('[data-test-initial]');
    const modal = root.querySelector<HTMLAlcModalElement>('alc-modal');
    assert.exists(button, 'Botão não encontrado');
    assert.exists(modal, 'Modal não encontrada');

    button.focus();
    expect(document.activeElement).toBe(button);

    await modal.show();
    await waitForChanges();
    expect(document.activeElement).not.toBe(button);

    await modal.hide();
    await waitForChanges();
    expect(document.activeElement).toBe(button);
  });

  it('Deve mover o foco corretamente quando a tecla Tab é pressionada', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <a href="#">Não deve ser focado</a>
        <alc-modal header-text="Exemplo de modal">
          <ul>
            <li><a href="#">Institucional</a></li>
            <li><a href="#">Outros</a></li>
          </ul>
        </alc-modal>
      </div>
    );

    const modal = root.querySelector<HTMLAlcModalElement>('alc-modal');
    assert.exists(modal, 'Modal não encontrada');

    // Abre a modal
    await modal.show();
    await waitForChanges();

    // O foco deve estar no primeiro elemento
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Institucional');

    // Pressiona Tab até o último elemento focável
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Outros');

    // Pressiona Tab, o foco deve mover para o botão "Fechar"
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.getAttribute('data-test-footer-close-button')).not.toBeNull();

    // Pressiona Shift + Tab, o foco deve voltar para o último elemento focável
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement?.textContent).toBe('Outros');
  });

  it('Deve navegar corretamente mesmo com conteúdo dinâmico', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <a href="#">Não deve ser focado</a>
        <alc-modal header-text="Exemplo de modal">
          <ul>
            <li><a href="#">Institucional</a></li>
            <li><a href="#" data-test-remove-tabindex>Outros</a></li>
          </ul>
        </alc-modal>
      </div>
    );

    const modal = root.querySelector<HTMLAlcModalElement>('alc-modal');
    assert.exists(modal, 'Modal não encontrada');

    // Abre o modal
    await modal.show();
    await waitForChanges();

    // O foco deve estar no primeiro elemento
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Institucional');

    // Pressiona Tab até o último elemento focável
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Outros');

    // Pressiona Tab, o foco deve mover para o botão "Fechar"
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.getAttribute('data-test-footer-close-button')).not.toBeNull();

    // Altera o último elemento para deixar de ser focável
    const lastElement = root.querySelector('[data-test-remove-tabindex]');
    assert.exists(lastElement, 'Elemento não encontrado');
    lastElement.setAttribute('tabindex', '-1');

    // Pressiona Shift + Tab, o foco deve voltar para o último elemento focável
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement?.textContent).toBe('Institucional');
  });

  it('Deve renderizar conteúdo do header corretamente', async () => {
    const { root } = await render(
      <alc-modal>
        <div slot="header" data-test-header-slot>Custom Header</div>
      </alc-modal>
    );

    expect(root).toHaveClass('hydrated');

    const headerSlot = root.querySelector<HTMLElement>('[data-test-header-slot]');
    assert.exists(headerSlot, 'Slot de header não encontrado');

    expect(headerSlot.textContent).toBe('Custom Header');
  });

  it('Deve renderizar botão fechar, caso não haja conteúdo no slot footer', async () => {
    const { root } = await render(
      <alc-modal></alc-modal>
    );

    const closeButton = root.querySelector('[data-test-footer-close-button]');

    expect(root).toHaveClass('hydrated');
    assert.exists(closeButton, 'Botão de fechar no footer não encontrado');
    
    expect(closeButton.textContent).toBe('Fechar');
    expect(closeButton).not.toBeNull();
  });

  it('Deve renderizar conteúdo do footer corretamente', async () => {
    const { root } = await render(
      <alc-modal>
        <div slot="footer" data-test-footer-slot>
          <button class="alc-button alc-button--secondary">Nao</button>
          <button class="alc-button">Sim</button>
        </div>
      </alc-modal>
    );

    expect(root).toHaveClass('hydrated');

    const footerSlot = root.querySelector<HTMLElement>('[data-test-footer-slot]');
    assert.exists(footerSlot, 'Slot de footer não encontrado');

    const buttons = footerSlot.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass('alc-button--secondary');
    expect(buttons[1]).toHaveClass('alc-button');
    expect(buttons[0].textContent).toBe('Nao');
    expect(buttons[1].textContent).toBe('Sim');
  });

  it('Deve fechar ao clicar fora da modal (overlay)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
    );

    const overlay = root.querySelector<HTMLElement>('[data-test-overlay]');
    assert.exists(overlay, 'Overlay não encontrado');

    await userEvent.click(overlay, { position: SECURE_OVERLAY_POSITION });
    await waitForChanges();

    expect(root.open).toBeFalsy();
    expect(root.checkVisibility()).toBeFalsy();
    expect(root.style.display).toBe('none');
  });

  it('Deve permanecer aberto ao clicar fora da modal (overlay) com prevent-overlay-close', async () => {
    const { root, waitForChanges } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal" open={true} prevent-overlay-close></alc-modal>
    );

    const overlay = root.querySelector<HTMLElement>('[data-test-overlay]');
    assert.exists(overlay, 'Overlay não encontrado');

    await userEvent.click(overlay, { position: SECURE_OVERLAY_POSITION });
    await waitForChanges();

    expect(root.open).toBeTruthy();
    expect(root.checkVisibility()).toBeTruthy();
    expect(root.style.display).toBe('block');
  });

  it('Deve disparar o evento alc-hide com valor do detail correto ao fechar a modal por ESC', async () => {
    const { root, waitForChanges,  spyOnEvent } = await render<HTMLAlcModalElement>(
      <alc-modal header-text="Exemplo de modal" open={true}></alc-modal>
    );

    const hideEvent = spyOnEvent('alc-hide');
    expect(root.open).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    await waitForChanges();
    expect(hideEvent.lastEvent?.detail.from).toBe('keyboard');
  });
  
});
