import { render, h, describe, it, expect } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-tabs.e2e.tsx

describe('alc-tabs', () => {
  it('Deve disparar evento alc-change ao navegar pelo teclado', async () => {
    const { waitForChanges, spyOnEvent } = await render(
      <alc-tabs>
        <alc-tab-button slot="button" tab="tab-1">Tab 1</alc-tab-button>
        <alc-tab-button slot="button" tab="tab-2">Tab 2</alc-tab-button>
        <alc-tab-button slot="button" tab="tab-3">Tab 3</alc-tab-button>

        <alc-tab tab="tab-1">Conteudo da tab 1</alc-tab>
        <alc-tab tab="tab-2">Conteudo da tab 2</alc-tab>
        <alc-tab tab="tab-3">Conteudo da tab 3</alc-tab>
      </alc-tabs>
    );

    const changeSpy = spyOnEvent('alc-change');

    await userEvent.keyboard('{Tab}');

    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    expect(changeSpy).toHaveReceivedEventDetail({ tab: 'tab-2' });

    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();
    expect(changeSpy).toHaveReceivedEventDetail({ tab: 'tab-1' });

    await userEvent.keyboard('{End}');
    await waitForChanges();
    expect(changeSpy).toHaveReceivedEventDetail({ tab: 'tab-3' });

    await userEvent.keyboard('{Home}');
    await waitForChanges();
    expect(changeSpy).toHaveReceivedEventDetail({ tab: 'tab-1' });
  });
});