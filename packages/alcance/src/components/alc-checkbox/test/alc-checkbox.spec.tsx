import { render, h, describe, it, expect, assert } from '@stencil/vitest';

const data = {
  label: 'Voce aceita os termos de uso?',
  hint: 'Dica',
  errorMsg: 'Mensagem de erro',
  id: 'id-checkbox',
};

describe('alc-checkbox', () => {
  it('Deve renderizar corretamente', async () => {
    const { root } = await render(
      <alc-checkbox>
        <input type="checkbox" id={data.id} />
        <label data-test-label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-checkbox>
    );

    const hint = root.querySelector('[data-test-hint]');
    const error = root.querySelector('[data-test-error]');
    const label = root.querySelector('[data-test-label]');
    assert.exists(label, 'O label não foi encontrado');

    expect(hint).toBeNull();
    expect(error).toBeNull();

    expect(root).toHaveClass('hydrated');
    expect(label.textContent).toBe(data.label);
  });

  it('Deve renderizar corretamente com hint', async () => {
    const { root } = await render(
      <alc-checkbox hint={data.hint}>
        <input type="checkbox" id={data.id} />
        <label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-checkbox>
    );

    const hint = root.querySelector('[data-test-hint]');
    assert.exists(hint, 'O hint não foi encontrado');

    expect(root).toEqualAttribute('hint', data.hint);
    expect(hint).toEqualText(data.hint);
    expect(hint).toHaveClass('alc-checkbox__text');
  });

  it('Deve renderizar o html corretamente com erro', async () => {
    const { root } = await render(
      <alc-checkbox error-msg={data.errorMsg}>
        <input type="checkbox" id={data.id} />
        <label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-checkbox>
    );

    const error = root.querySelector('[data-test-error]');
    assert.exists(error, 'O erro não foi encontrado');

    expect(root).toEqualAttribute('error-msg', data.errorMsg);
    expect(error).toEqualText(data.errorMsg);
    expect(error).toHaveClasses(['alc-checkbox__text', 'alc-checkbox__text--error']);
    
  });

  it('Deve renderizar o html corretamente com hint e erro', async () => {
    const { root } = await render(
      <alc-checkbox hint={data.hint} error-msg={data.errorMsg}>
        <input type="checkbox" id={data.id} />
        <label slot="label" htmlFor={data.id}>{data.label}</label>
      </alc-checkbox>
    );

    const error = root.querySelector('[data-test-error]');
    assert.exists(error, 'O erro não foi encontrado');
    expect(error).toEqualText(data.errorMsg);
    expect(error).toHaveClasses(['alc-checkbox__text', 'alc-checkbox__text--error']);
    
    const hint = root.querySelector('[data-test-hint]');
    assert.exists(hint, 'O hint não foi encontrado');
    expect(hint).toEqualText(data.hint);
    expect(hint).toHaveClass('alc-checkbox__text');
  });

  it('Deve renderizar o html corretamente com label', async () => {
    const { root } = await render(
      <alc-checkbox label={data.label}>
        <input type="checkbox" id={data.id} />
      </alc-checkbox>
    );

    const label = root.querySelector<HTMLLabelElement>('[data-test-label]');
    assert.exists(label, 'O label não foi encontrado');

    expect(label).toEqualText(data.label);
    expect(label.htmlFor).toEqual(data.id);
  });

  it('Deve renderizar corretamente id sem especificar o id', async () => {
    const { root } = await render(
      <alc-checkbox label={data.label}>
        <input type="checkbox" data-test-input />
      </alc-checkbox>
    );

    const label = root.querySelector('[data-test-label]');
    const input = root.querySelector('[data-test-input]');

    assert.exists(label, 'O label não foi encontrado');
    assert.exists(input, 'O input não foi encontrado');

    // Espera que o id do input seja igual ao for do label.
    expect(input.getAttribute('id')).toEqual(label.getAttribute('for'));
  });
});
