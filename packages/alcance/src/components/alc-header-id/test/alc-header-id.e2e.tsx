import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const data = {
  name: 'Thundercats',
  description: 'Thundercats Technology',
};

describe('alc-header-id', () => {

  it('Deve disparar o evento alc-home ao clicar no link', async () => {
    const url = "#url-test-1";
    const { root, spyOnEvent, waitForChanges } = await render(
      <alc-header-id name={data.name} homeUrl={url}></alc-header-id>
    );

    const alcHomeEvent = spyOnEvent('alc-home');
    const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');

    await userEvent.click(link);
    await waitForChanges();

    expect(alcHomeEvent).toHaveReceivedEvent();
    expect(window.location.href).toContain(url);
  });

  it('Não deve navegar quando o evento alc-home é impedido', async () => {
    const url = "#url-test-2";

    const { root, spyOnEvent, waitForChanges } = await render(
      <alc-header-id name={data.name} homeUrl={url}></alc-header-id>
    );

    root.addEventListener('alc-home', (event) => {
      event.preventDefault();
    });

    const alcHomeEvent = spyOnEvent('alc-home');
    const link = root.querySelector<HTMLAnchorElement>('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');

    await userEvent.click(link);
    await waitForChanges();

    expect(alcHomeEvent).toHaveReceivedEvent();
    expect(window.location.href).not.toContain(url);
  });

  it('Deve funcionar corretamente a acessibilidade via teclado (Tab + Enter)', async () => {
    const url = "#url-test-3";

    const { root, spyOnEvent, waitForChanges } = await render(
      <alc-header-id name={data.name} homeUrl={url}></alc-header-id>
    );

    const alcHomeEvent = spyOnEvent('alc-home');
    const link = root.querySelector<HTMLElement>('[data-test-link]');
    assert.exists(link, 'O link não foi encontrado');

    await userEvent.keyboard('{Tab}');
    await waitForChanges();
    expect(document.activeElement).toBe(link);

    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(alcHomeEvent).toHaveReceivedEvent();
    expect(window.location.href).toContain(url);
  
  });
});
