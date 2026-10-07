import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-breadcrumb-item.spec.tsx

const data = {
  url: 'exemplo-url',
  label: 'exemplo-label',
  icon: 'house',
};

describe('alc-breadcrumb-item', () => {
  it('Deve renderizar as propriedades corretamente', async () => {
    const { root } = await render(
      <alc-breadcrumb-item url={data.url} label={data.label}></alc-breadcrumb-item>
    );

    const link = root.querySelector('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');

    const icon = root.querySelector('[data-test-icon]');

    expect(link.getAttribute('href')).toBe(data.url);
    expect(link).toEqualText(data.label);
    expect(icon).toBeNull();

    // acessibilidade
    expect(root.getAttribute('role')).toBe('listitem');
  });

  it('Deve renderizar o ícone ao ser definido', async () => {
    const { root } = await render(
      <alc-breadcrumb-item url={data.url} label={data.label} iconName={data.icon}></alc-breadcrumb-item>
    );

    const icon = root.querySelector('[data-test-icon]');
    assert.exists(icon, 'O ícone não foi encontrado');

    // Não renderizar ícone para leitor de tela
    expect(icon.getAttribute('aria-hidden')).toBeTruthy();
  });

  it('Deve indicar a pagina atual sem separador ao definir current', async () => {
    const { root, setProps } = await render<HTMLAlcBreadcrumbItemElement>(
      <alc-breadcrumb-item url={data.url} label={data.label}></alc-breadcrumb-item>
    );

    const content = root.querySelector('[data-test-content]');
    assert.exists(content, 'O conteudo do item nao foi encontrado');

    expect(content.getAttribute('aria-current')).toBeNull();
    expect(content).toHaveClass('alc-link');
    assert.exists(root.querySelector('.alc-breadcrumb-item__separator'), 'O separador nao foi encontrado');

    await setProps({ current: true });

    expect(content.getAttribute('aria-current')).toBe('page');
    expect(content).not.toHaveClass('alc-link');
    expect(root.querySelector('.alc-breadcrumb-item__separator')).toBeNull();
  });

  it('Deve renderizar corretamente ao usar slot', async () => {
    const { root } = await render(
      <alc-breadcrumb-item>
        <a href={data.url} data-test-breadcrumb-link>{data.label}</a>
      </alc-breadcrumb-item>
    );

    const link = root.querySelector('[data-test-breadcrumb-link]');
    assert.exists(link, 'O link do slot não foi encontrado');

    expect(link.getAttribute('href')).toBe(data.url);
    expect(link.textContent).toBe(data.label);
  });
});
