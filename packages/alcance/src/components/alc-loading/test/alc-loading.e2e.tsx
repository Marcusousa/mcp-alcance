import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project browser alc-loading.e2e.tsx

const text = {
  completed: "Finalizado.",
  loading: "Carregando..."
}

describe('alc-loading', () => {
  it('Deve renderizar corretamente os atributos de acessibilidade', async () => {
    const { root } = await render(
      <alc-loading></alc-loading>
    );

    const acessibilityDiv = root.querySelector('[data-test-acessibility]');
    assert.exists(acessibilityDiv, 'Div de acessibilidade não encontrada');

    expect(acessibilityDiv.getAttribute('role')).toBe('status');
    expect(acessibilityDiv.getAttribute('aria-live')).toBe('polite');
  });

  it('Deve renderizar corretamente ao mostrar o loading por propriedade', async () => {
    const { root, setProps } = await render<HTMLAlcLoadingElement>(
      <alc-loading></alc-loading>
    );

    const acessibilityDiv = root.querySelector('[data-test-acessibility]');
    assert.exists(acessibilityDiv, 'Div de acessibilidade não encontrada');

    await setProps({ active: true });
    expect(root.active).toBeTruthy();
    expect(acessibilityDiv).toHaveTextContent(text.loading);

    await setProps({ active: false });
    expect(root.active).toBeFalsy();
    expect(acessibilityDiv).toHaveTextContent(text.completed);
  });

  it('Deve obter o texto customizado corretamente ao abrir e fechar', async () => {
    const customText = {
      completed: "Concluído.",
      loading: "Aguarde..."
    };

    const { root, setProps } = await render<HTMLAlcLoadingElement>(
      <alc-loading label={customText.loading} endMsg={customText.completed}></alc-loading>
    );

    const acessibilityDiv = root.querySelector('[data-test-acessibility]');
    assert.exists(acessibilityDiv, 'Div de acessibilidade não encontrada');

    await setProps({ active: true });
    expect(root.active).toBeTruthy();
    expect(acessibilityDiv).toHaveTextContent(customText.loading);

    await setProps({ active: false });
    expect(root.active).toBeFalsy();
    expect(acessibilityDiv).toHaveTextContent(customText.completed);
  });
});
