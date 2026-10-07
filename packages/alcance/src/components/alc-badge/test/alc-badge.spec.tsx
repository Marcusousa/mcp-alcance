import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-badge.spec.tsx

describe('alc-badge', () => {
  it('Deve renderizar o componente vazio quando nenhuma prop é fornecida', async () => {
    const { root } = await render(
      <alc-badge></alc-badge>
    );    
    
    expect(root).toHaveClass('alc-badge-wrapper');
    expect(root.querySelector('[data-test-badge-span]')).toBeNull();
  });

  it('Deve renderizar com um label especificado', async () => {
    const { root } = await render(
      <alc-badge label="Novo"></alc-badge>
    );

    const badge = root.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge não foi encontrado');

    expect(badge).toHaveClass('alc-badge');
    expect(badge.textContent).toBe('Novo');
  });

  it('Deve renderizar como dot quando dot=true', async () => {
    const { root } = await render(
      <alc-badge dot={true}></alc-badge>
    );

    const badge = root.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge dot não foi encontrado');

    expect(badge).toHaveClass('alc-badge--dot');
    expect(badge.textContent).toBe('');
  });

  it('Deve renderizar com count', async () => {
    const { root } = await render(
      <alc-badge label="99+" count={true}></alc-badge>
    );

    const badge = root.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge count não foi encontrado');

    expect(badge.textContent).toBe('99+');
    expect(badge).toHaveClass('alc-badge--count');

  });

  it('Deve aplicar a cor adequada', async () => {
    const { root } = await render(
      <alc-badge label="Alert" color="error"></alc-badge>
    );

    const badge = root.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge com cor error não foi encontrado');
    
    expect(badge.textContent).toBe('Alert');
    expect(badge).toHaveClass('alc-badge--error');

  });

  it('Deve ser escondido quando hidden=true', async () => {
    const { root } = await render(
      <alc-badge label="Hidden" hidden={true}></alc-badge>
    );

    expect(root.querySelector('[data-test-badge-span]')).toBeNull();
  });

  it('Deve renderizar com contorno quando outlined=true', async () => {
    const { root } = await render(
      <alc-badge label="Outlined" outlined={true}></alc-badge>
    );

    const badge = root.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge outlined não foi encontrado');

    expect(badge.textContent).toBe('Outlined');
    expect(badge).toHaveClass('alc-badge--outlined');
  });

  it('Deve renderizar na posição inline corretamente', async () => {
    const { root } = await render(
      <alc-badge label="Inline" position="inline"></alc-badge>
    );

    const badge = root.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge inline não foi encontrado');

    expect(badge.textContent).toBe('Inline');
    expect(badge).toHaveClass('alc-badge--inline');

  });

  it('Deve renderizar com pulsação quando pulsate=true', async () => {
    const { root } = await render(
      <alc-badge label="Pulse" pulsate={true}></alc-badge>
    );

    const badge = root.querySelector('[data-test-badge-span]');
    assert.exists(badge, 'O badge pulsate não foi encontrado');

    expect(badge.textContent).toBe('Pulse');
    expect(badge).toHaveClass('alc-badge--pulsate');
  });
});
