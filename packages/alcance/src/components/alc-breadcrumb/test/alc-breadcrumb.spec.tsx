import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-breadcrumb.spec.tsx

describe('alc-breadcrumb', () => {
  it('Deve renderizar corretamente os atributos de acessibilidade', async () => {
    const { root } = await render(
      <alc-breadcrumb>
        <alc-breadcrumb-item label="Inicio" url="#"></alc-breadcrumb-item>
        <alc-breadcrumb-item label="Nossos serviços" url="#"></alc-breadcrumb-item>
        <alc-breadcrumb-item label="Midia Digital" url="#"></alc-breadcrumb-item>
        <alc-breadcrumb-item label="Design Web" url="#"></alc-breadcrumb-item>
      </alc-breadcrumb>
    );

    const nav = root.querySelector('[data-test-nav]');
    assert.exists(nav, 'O nav não foi encontrado');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');

    const list = root.querySelector('[data-test-list]');
    assert.exists(list, 'A lista não foi encontrada');
    expect(list.getAttribute('role')).toBe('list');
  });

  it('Deve marcar o ultimo item como pagina atual', async () => {
    const { root } = await render(
      <alc-breadcrumb>
        <alc-breadcrumb-item label="Inicio" url="#"></alc-breadcrumb-item>
        <alc-breadcrumb-item label="Nossos serviços" url="#"></alc-breadcrumb-item>
      </alc-breadcrumb>
    );

    const items = root.querySelectorAll('alc-breadcrumb-item');
    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    expect(firstItem.current).toBe(false);
    expect(lastItem.current).toBe(true);

    // O aria-current fica no elemento interno do item, e nao no host, que pertence a quem usa o componente
    const firstContent = firstItem.querySelector('[data-test-content]');
    assert.exists(firstContent, 'O conteudo do primeiro item nao foi encontrado');

    const lastContent = lastItem.querySelector('[data-test-content]');
    assert.exists(lastContent, 'O conteudo do ultimo item nao foi encontrado');

    expect(firstContent.getAttribute('aria-current')).toBeNull();
    expect(lastContent.getAttribute('aria-current')).toBe('page');
  });
});
