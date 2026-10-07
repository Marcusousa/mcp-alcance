import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-skip-to-nav.spec.tsx

// Este teste é simplificado devido a complexidade das dependências externas
describe('alc-skip-to-nav', () => {
  it('Deve renderizar', async () => {
    const { root } = await render(
      <alc-skip-to-nav></alc-skip-to-nav>
    );

    // Teste básico apenas para verificar se renderiza sem erros
    // A lógica específica é testada nos testes e2e
    expect(root).toBeTruthy();
    expect(root).toHaveClass('hydrated');
    
  });

  it('Deve ter atributos data-test corretos', async () => {
    const { root } = await render(
      <alc-skip-to-nav></alc-skip-to-nav>
    );

    // Verifica se o componente tem o atributo data-test
    expect(root).toHaveAttribute('data-test-skip-to-nav-component');

    // Verifica se o link tem o atributo data-test
    const link = root.querySelector('[data-test-skip-to-nav-link]');
    expect(link).toBeTruthy();
    expect(link).toHaveAttribute('data-test-skip-to-nav-link');
  });

  it('Deve renderizar o link com estrutura correta', async () => {
    const { root } = await render(
      <alc-skip-to-nav></alc-skip-to-nav>
    );

    const link = root.querySelector('[data-test-skip-to-nav-link]');
    assert.exists(link, 'O link não foi encontrado');
    
    expect(link.getAttribute('href')).toBe('#');
    expect(link).toHaveClass('alc-link');
    expect(link).toHaveClass('text-center');
    expect(link.textContent.trim()).toBe('Ir para navegação');
  });
});