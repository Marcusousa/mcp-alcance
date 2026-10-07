import { render, h, describe, expect, it, assert } from '@stencil/vitest';

const data = {
  hint: 'Dica',
  error: 'Mensagem de erro',
  legend: 'Selecione',
};

describe('alc-fieldset', () => {
  it('Deve renderizar o html corretamente', async () => {
    const { root } = await render(
      <alc-fieldset legend={data.legend}></alc-fieldset>
    );

    const hintEl = root.querySelector('[data-test-hint]');
    const errorEl = root.querySelector('[data-test-error]');
    const legendEl = root.querySelector('[data-test-legend]');

    expect(hintEl).toBeNull();
    expect(errorEl).toBeNull();
    expect(legendEl).not.toBeNull();
  });

  it('Deve renderizar o html corretamente com hint', async () => {
    const { root } = await render(
      <alc-fieldset legend={data.legend} hint={data.hint}></alc-fieldset>
    );

    const hintEl = root.querySelector('[data-test-hint]');
    const fieldsetEl = root.querySelector('[data-test-fieldset]');

    assert.exists(hintEl);
    assert.exists(fieldsetEl);

    const hintId = hintEl.getAttribute('id');
    expect(hintEl).toEqualText(data.hint);
    expect(fieldsetEl.getAttribute('aria-describedby')).toEqual(hintId);
  });

  it('Deve renderizar o html corretamente com erro', async () => {
    const { root } = await render(
      <alc-fieldset legend={data.legend} error-msg={data.error}></alc-fieldset>
    );

    const errorEl = root.querySelector('[data-test-error]');
    const fieldsetEl = root.querySelector('[data-test-fieldset]');

    assert.exists(errorEl);
    assert.exists(fieldsetEl);

    const errorId = errorEl.getAttribute('id');
    expect(errorEl).toEqualText(data.error);
    expect(fieldsetEl.getAttribute('aria-describedby')).toEqual(errorId);
  });


  it('Deve renderizar o html corretamente com hint e erro', async () => {
    const { root } = await render(
      <alc-fieldset 
        legend={data.legend} 
        hint={data.hint} 
        error-msg={data.error}
      ></alc-fieldset>
    );

    const fieldsetEl = root.querySelector('[data-test-fieldset]');
    const errorEl = root.querySelector('[data-test-error]');
    const hintEl = root.querySelector('[data-test-hint]');

    assert.exists(errorEl);
    assert.exists(fieldsetEl);

    const errorId = errorEl.getAttribute('id');
    expect(errorEl).toEqualText(data.error);

    assert.exists(hintEl);
    const hintId = hintEl.getAttribute('id');
    expect(hintEl).toEqualText(data.hint);

    expect(fieldsetEl.getAttribute('aria-describedby')).toEqual(`${errorId} ${hintId}`);
  });
});
