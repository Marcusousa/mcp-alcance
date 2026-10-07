import { render, h, describe, it, expect, assert } from '@stencil/vitest';

const data = {
  label: 'Item 1',
  hint: 'Dica',
  errorMsg: 'Mensagem de erro',
  id: 'id-radio',
};

describe('alc-radio', () => {
  it('Deve renderizar o html corretamente', async () => {
    const { root } = await render(
      <alc-radio>
        <input type="radio" id={data.id} />
        <label data-test-label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-radio>
    );

    const hintEl = root.querySelector('[data-test-hint]');
    const errorEl = root.querySelector('[data-test-error]');
    const labelEl = root.querySelector('[data-test-label]');
    assert.exists(labelEl, 'O label não foi encontrado');

    expect(hintEl).toBeNull();
    expect(errorEl).toBeNull();
    expect(root).toHaveClass('hydrated');
    expect(labelEl.textContent).toBe(data.label);
  });

  it('Deve renderizar o html corretamente com hint', async () => {
    const { root } = await render(
      <alc-radio hint={data.hint}>
        <input type="radio" id={data.id} />
        <label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-radio>
    );

    const hintEl = root.querySelector('[data-test-hint]');
    assert.exists(hintEl, 'O hint não foi encontrado');
    expect(hintEl).toEqualText(data.hint);
    expect(hintEl).toHaveClass('alc-radio__text');
  });

  it('Deve renderizar o html corretamente com erro', async () => {
    const { root } = await render(
      <alc-radio errorMsg={data.errorMsg}>
        <input type="radio" id={data.id} />
        <label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-radio>
    );

    const errorEl = root.querySelector('[data-test-error]');
    assert.exists(errorEl, 'O erro não foi encontrado');
    expect(errorEl).toEqualText(data.errorMsg);
    expect(errorEl).toHaveClasses(['alc-radio__text', 'alc-radio__text--error']);
  });

  it('Deve renderizar o html corretamente com hint e erro', async () => {
    const { root } = await render(
      <alc-radio hint={data.hint} errorMsg={data.errorMsg}>
        <input type="radio" id={data.id} />
        <label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-radio>
    );

    const errorEl = root.querySelector('[data-test-error]');
    assert.exists(errorEl, 'O erro não foi encontrado');
    expect(errorEl).toEqualText(data.errorMsg);
    expect(errorEl).toHaveClasses(['alc-radio__text', 'alc-radio__text--error']);

    const hintEl = root.querySelector('[data-test-hint]');
    assert.exists(hintEl, 'O hint não foi encontrado');
    expect(hintEl).toEqualText(data.hint);
    expect(hintEl).toHaveClass('alc-radio__text');
  });

  it('Deve renderizar o html corretamente com label', async () => {
    const { root } = await render(
      <alc-radio label={data.label}>
        <input type="radio" id={data.id} />
      </alc-radio>
    );

    const labelEl = root.querySelector('[data-test-label]');
    assert.exists(labelEl, 'O label não foi encontrado');

    expect(labelEl).toEqualText(data.label);
    expect(labelEl.getAttribute('for')).toEqual(data.id);
    expect(labelEl.textContent).toBe(data.label);
  });

  it('Deve renderizar corretamente id sem especificar o id', async () => {
    const { root } = await render(
      <alc-radio label={data.label}>
        <input type="radio" data-test-input />
      </alc-radio>
    );

    const labelEl = root.querySelector('[data-test-label]');
    assert.exists(labelEl, 'O label não foi encontrado');

    const inputEl = root.querySelector('[data-test-input]');
    assert.exists(inputEl, 'O input não foi encontrado');

    // Espera que o id do input seja igual ao for do label.
    expect(inputEl.getAttribute('id')).toEqual(labelEl.getAttribute('for'));
  });
});
