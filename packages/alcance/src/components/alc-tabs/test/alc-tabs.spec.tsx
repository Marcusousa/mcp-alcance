import { render, h, describe, it, expect, assert, vi, beforeAll } from '@stencil/vitest';
global.MutationObserver = class {
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
  constructor(_callback: MutationCallback) {}
};

// yarn stencil-test --project spec alc-tabs.spec.tsx

describe('alc-tabs', () => {

  // @TODO - achar outra alternativa para esse teste
  // solução que a IA trouxe é ajustar o componente:
  // Mover esse trecho do componentDidLoad para o componentWillLoad, garantindo que o hasButtonSlot seja definido antes do primeiro render.
  // const slotButton = Array.from(this.el.querySelectorAll('[slot="button"]'));
  // this.hasButtonSlot = slotButton.some(s => s.closest('alc-tabs') === this.el);
    beforeAll(async () => {
    // alc-tabs cria <alc-tab-button> dinamicamente no render() enquanto hasButtonSlot
    // ainda é false. O import() assíncrono do chunk não completa antes da renderização,
    // causando "Constructor for alc-tab-button#undefined was not found" no 1º teste.
    // Este render pré-carrega o bundle via @stencil/vitest antes de qualquer teste rodar.
    await render(<alc-tab-button tab="warmup">Warmup</alc-tab-button>);
  });
  
  it('Deve selecionar a tab quando informado atributo selected em tabs', async () => {
    const { root, waitForChanges, setProps } = await render(
      <alc-tabs>
        <alc-tab-button slot="button" tab="tab-1">Tab 1</alc-tab-button>
        <alc-tab-button slot="button" tab="tab-2">Tab 2</alc-tab-button>

        <alc-tab tab="tab-1">Conteudo da tab 1</alc-tab>
        <alc-tab tab="tab-2">Conteudo da tab 2</alc-tab>
      </alc-tabs>
    );

    await setProps({ selected: 'tab-2' });
    await waitForChanges();

    const tabsButton = root.querySelectorAll('alc-tab-button');
    const tabsContent = root.querySelectorAll('alc-tab');

    expect(tabsButton[0]).not.toHaveAttribute('selected');
    expect(tabsButton[1]).toHaveAttribute('selected');

    expect(tabsContent[0]).not.toHaveAttribute('selected');
    expect(tabsContent[1]).toHaveAttribute('selected');
  });

  it('Deve selecionar a tab informado com o método select (string)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcTabsElement>(
      <alc-tabs>
        <alc-tab-button slot="button" tab="tab-1">Tab 1</alc-tab-button>
        <alc-tab-button slot="button" tab="tab-2">Tab 2</alc-tab-button>

        <alc-tab tab="tab-1">Conteudo da tab 1</alc-tab>
        <alc-tab tab="tab-2">Conteudo da tab 2</alc-tab>
      </alc-tabs>
    );

    const tabsButton = root.querySelectorAll('alc-tab-button');
    const tabsContent = root.querySelectorAll('alc-tab');

    await root.select('tab-2');
    await waitForChanges();

    expect(tabsButton[0]).not.toHaveAttribute('selected');
    expect(tabsButton[1]).toHaveAttribute('selected');

    expect(tabsContent[0]).not.toHaveAttribute('selected');
    expect(tabsContent[1]).toHaveAttribute('selected');
  });

  it('Deve selecionar a tab informado com o método select (HTMLAlcTabElement)', async () => {
    const { root, waitForChanges } = await render<HTMLAlcTabsElement>(
      <alc-tabs>
        <alc-tab-button slot="button" tab="tab-1">Tab 1</alc-tab-button>
        <alc-tab-button slot="button" tab="tab-2">Tab 2</alc-tab-button>

        <alc-tab tab="tab-1">Conteudo da tab 1</alc-tab>
        <alc-tab tab="tab-2">Conteudo da tab 2</alc-tab>
      </alc-tabs>
    );

    const tabsButton = root.querySelectorAll('alc-tab-button');
    const tabsContent = root.querySelectorAll<HTMLAlcTabElement>('alc-tab');

    await root.select(tabsContent[1]);
    await waitForChanges();

    expect(tabsButton[0]).not.toHaveAttribute('selected');
    expect(tabsButton[1]).toHaveAttribute('selected');

    expect(tabsContent[0]).not.toHaveAttribute('selected');
    expect(tabsContent[1]).toHaveAttribute('selected');
  });

  it('Deve selecionar a tab ao clicar em tab-button correspondente', async () => {
    const { root, waitForChanges } = await render(
      <alc-tabs>
        <alc-tab-button slot="button" tab="tab-1">Tab 1</alc-tab-button>
        <alc-tab-button slot="button" tab="tab-2">Tab 2</alc-tab-button>

        <alc-tab tab="tab-1">Conteudo da tab 1</alc-tab>
        <alc-tab tab="tab-2">Conteudo da tab 2</alc-tab>
      </alc-tabs>
    );

    const tabsButton = root.querySelectorAll('alc-tab-button');
    const tabsContent = root.querySelectorAll('alc-tab');

    (tabsButton[1].querySelector('button') as HTMLElement).click();
    await waitForChanges();

    expect(tabsButton[0]).not.toHaveAttribute('selected');
    expect(tabsButton[1]).toHaveAttribute('selected');

    expect(tabsContent[0]).not.toHaveAttribute('selected');
    expect(tabsContent[1]).toHaveAttribute('selected');
  });

  it('Deve criar tab-button corretamente quando informado o atributo label no tab', async () => {
    const labels = { l1: 'Tab1', l2: 'Tab2' };
    const { root } = await render(
      <alc-tabs>
        <alc-tab tab="tab-1" label={labels.l1}>Conteudo da tab 1</alc-tab>
        <alc-tab tab="tab-2" label={labels.l2}>Conteudo da tab 2</alc-tab>
      </alc-tabs>
    );

    const tabsButton = root.querySelectorAll('alc-tab-button');

    expect(tabsButton[0]).toEqualText(labels.l1);
    expect(tabsButton[1]).toEqualText(labels.l2);
  });

    it('Deve renderizar atributos ARIA corretamente', async () => {
    const { root } = await render(
      <alc-tabs>
        <alc-tab-button slot="button" tab="tab-1">Tab 1</alc-tab-button>

        <alc-tab tab="tab-1">Conteudo da tab 1</alc-tab>
      </alc-tabs>
    );

    const tabButton = root.querySelector('alc-tab-button button');
    assert.exists(tabButton, 'Tab button não encontrado');

    const tabPanel = root.querySelector('[data-test-tab]');
    assert.exists(tabPanel, 'Tab panel não encontrado');

    expect(tabButton.getAttribute('role')).toBe('tab');
    expect(tabButton.getAttribute('aria-controls')).toBe(tabPanel.id);

    expect(tabPanel.getAttribute('role')).toBe('tabpanel');
    expect(tabPanel.getAttribute('aria-labelledby')).toBe(tabButton.id);
  });

});
