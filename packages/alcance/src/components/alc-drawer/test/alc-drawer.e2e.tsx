import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-drawer.e2e.tsx

describe('alc-drawer', () => {
  it('Deve renderizar corretamente', async () => {
    const { root } = await render(
      <alc-drawer>
        <ul>
          <li><a href="#">Institucional</a></li>
          <li><a href="#">Outros</a></li>
        </ul>
      </alc-drawer>
    );

    expect(root).toHaveClass('hydrated');
    const closeButton = root.querySelector('[data-test-close-button]');
    expect(closeButton).not.toBeNull();
  });

  it('Métodos show e hide devem funcionar corretamente', async () => {
    const { root, waitForChanges } = await render<HTMLAlcDrawerElement>(
      <alc-drawer>
        <ul>
          <li><a href="#">Institucional</a></li>
          <li><a href="#">Outros</a></li>
        </ul>
      </alc-drawer>
    );

    // Chama o método 'show'
    await root.show();
    await waitForChanges();

    // Verifica se o elemento está visível
    let isVisible = root.checkVisibility();
    expect(isVisible).toBe(true);

    // Chama o método 'hide'
    await root.hide();
    await waitForChanges();

    // Verifica se o elemento está oculto
    isVisible = root.checkVisibility();
    expect(isVisible).toBe(false);
  });

  it('Deve fechar o drawer corretamente no botão fechar', async () => {
    const { root, waitForChanges } = await render<HTMLAlcDrawerElement>(
      <alc-drawer>
        <ul>
          <li><a href="#">Institucional</a></li>
          <li><a href="#">Outros</a></li>
        </ul>
      </alc-drawer>
    );

    // Chama o método 'show'
    await root.show();
    await waitForChanges();

    expect(root.checkVisibility()).toBe(true);

    // Simula o clique no botão de fechamento
    const closeButton = root.querySelector<HTMLElement>('[data-test-close-button]');
    assert.exists(closeButton, 'O botão de fechar não foi encontrado');

    await userEvent.click(closeButton);
    await waitForChanges();

    // Verifica se o elemento está oculto
    expect(root.checkVisibility()).toBe(false);
  });

  it('Deve mover o foco corretamente quando a tecla Tab é pressionada', async () => {
    const { root, waitForChanges } = await render<HTMLAlcDrawerElement>(
      <alc-drawer>
        <ul>
          <li><a href="#">Institucional</a></li>
          <li><a href="#">Outros</a></li>
        </ul>
      </alc-drawer>
    );

    // Abre o drawer
    await root.show();
    await waitForChanges();

    // O foco está no botão fechar (primeiro elemento focável); Tab avança para o primeiro link
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Institucional');

    // Pressiona Tab até o último elemento focável
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Outros');

    // Pressiona Tab, o foco deve mover para o botão "Fechar" 
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.getAttribute('data-test-close-button')).not.toBeNull();

    // Pressiona Shift + Tab, o foco deve voltar para o último elemento focável
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement?.textContent).toBe('Outros');
  });

  it('Deve navegar corretamente mesmo com conteúdo dinâmico', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <a href="#">Não deve ser focado</a>
        <alc-drawer>
          <ul>
            <li><a href="#">Institucional</a></li>
            <li><a href="#" data-test-remove-tabindex>Outros</a></li>
          </ul>
        </alc-drawer>
      </div>
    );

    // Como agora temos outros elementos no render, precisamos chamar o método 'show' diretamente no componente alc-drawer
    const drawer = root.querySelector('alc-drawer');
    assert.exists(drawer, 'O componente alc-drawer não foi encontrado');

    await drawer.show();
    await waitForChanges();

    // O foco está no botão fechar (primeiro elemento focável); Tab avança para o primeiro link
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Institucional');

    // Pressiona Tab até o último elemento focável
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('Outros');

    // Pressiona Tab, o foco deve mover para o botão "Fechar" (wrap)
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.getAttribute('data-test-close-button')).not.toBeNull();

    // Altera o último elemento para deixar de ser focável
    const lastElement = root.querySelector('[data-test-remove-tabindex]');
    assert.exists(lastElement, 'O elemento para remover tabindex não foi encontrado');

    lastElement.setAttribute('tabindex', '-1');
    await waitForChanges();

    // Pressiona Shift + Tab, o foco deve voltar para o último elemento focável (agora "Institucional")
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement?.textContent).toBe('Institucional');
  });

  it('Deve renderizar acessibilidade corretamente', async () => {
    const { root } = await render(
      <alc-drawer>
        <ul>
          <li><a href="#">Institucional</a></li>
          <li><a href="#">Outros</a></li>
        </ul>
      </alc-drawer>
    );

    const content = root.querySelector('[data-test-content]');

    // Verifica se possui a acessibilidade necessária do conteúdo
    assert.exists(content, 'O conteúdo do drawer não foi encontrado');
    expect(content.getAttribute('role')).toBe('dialog');
    expect(content.getAttribute('aria-modal')).toBeTruthy();

    // Verifica se possui a acessibilidade necessária do ícone de fechar
    const closeIconButton = root.querySelector('[data-test-close-icon]');
    assert.exists(closeIconButton, 'O ícone de fechar não foi encontrado');
    expect(closeIconButton.getAttribute('label')).not.toBeNull();
    expect(closeIconButton.getAttribute('label')).not.toBe('');
  });

});