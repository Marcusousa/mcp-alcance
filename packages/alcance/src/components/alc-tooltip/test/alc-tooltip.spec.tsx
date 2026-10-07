import { render, h, describe, it, expect, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-tooltip.spec.tsx

describe('alc-tooltip', () => {
  it('Deve abrir/fechar o tooltip ao usar o método show() e hide()', async () => {
    const { root, waitForChanges } = await render<HTMLAlcTooltipElement>(
      <alc-tooltip content="tooltip text">
        <div slot="trigger">
          <alc-icon name="heart" label=""></alc-icon>
        </div>
      </alc-tooltip>
    );

    expect(root.active).toBeFalsy();

    await root.show();
    await waitForChanges();
    expect(root.active).toBeTruthy();

    await root.hide();
    await waitForChanges();
    expect(root.active).toBeFalsy();
  });

  it('Deve capturar os eventos na ordem esperada ao abrir o tooltip', async () => {
    const { root, waitForChanges } = await render<HTMLAlcTooltipElement>(
      <alc-tooltip content="tooltip text" trigger="click">
        <button slot="trigger">Open</button>
      </alc-tooltip>
    );

    const calls: string[] = [];
    root.addEventListener('alc-show', () => calls.push('alc-show'));
    root.addEventListener('alc-after-show', () => calls.push('alc-after-show'));

    const trigger = root.querySelector<HTMLElement>('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');

    trigger.click();
    await waitForChanges();

    expect(calls).toEqual(['alc-show', 'alc-after-show']);
  });

  it('Deve capturar os eventos na ordem esperada ao fechar o tooltip', async () => {
    const { root, waitForChanges } = await render<HTMLAlcTooltipElement>(
      <alc-tooltip content="tooltip text" trigger="click" active={true}>
        <button slot="trigger">Close</button>
      </alc-tooltip>
    );

    const calls: string[] = [];
    root.addEventListener('alc-hide', () => calls.push('alc-hide'));
    root.addEventListener('alc-after-hide', () => calls.push('alc-after-hide'));

    const trigger = root.querySelector<HTMLElement>('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');

    trigger.click();
    await waitForChanges();

    expect(calls).toEqual(['alc-hide', 'alc-after-hide']);
  });

  it('Deve disparar apenar os eventos "alc-show" quando cancelado ao abrir o tooltip', async () => {
    const { root, spyOnEvent, waitForChanges } = await render<HTMLAlcTooltipElement>(
      <alc-tooltip content="tooltip text" trigger="click">
        <button slot="trigger">Open</button>
      </alc-tooltip>
    );

    const alcShowSpy = spyOnEvent('alc-show');
    const alcAfterShowSpy = spyOnEvent('alc-after-show');

    root.addEventListener('alc-show', (event) => {
      event.preventDefault();
    });

    const trigger = root.querySelector<HTMLElement>('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');

    trigger.click();
    await waitForChanges();

    expect(alcShowSpy).toHaveReceivedEvent();
    expect(alcAfterShowSpy).not.toHaveReceivedEvent();
  });

  it('Deve disparar apenar os eventos "alc-hide" quando cancelado ao fechar o tooltip', async () => {
    const { root, spyOnEvent, waitForChanges } = await render<HTMLAlcTooltipElement>(
      <alc-tooltip content="tooltip text" trigger="click" active={true}>
        <button slot="trigger">Close</button>
      </alc-tooltip>
    );

    const alcHideSpy = spyOnEvent('alc-hide');
    const alcAfterHideSpy = spyOnEvent('alc-after-hide');

    root.addEventListener('alc-hide', (event) => {
      event.preventDefault();
    });

    const trigger = root.querySelector<HTMLElement>('[data-test-trigger]');
    assert.exists(trigger, 'Trigger não encontrado');
    
    trigger.click();
    await waitForChanges();

    expect(alcHideSpy).toHaveReceivedEvent();
    expect(alcAfterHideSpy).not.toHaveReceivedEvent();
  });
});
