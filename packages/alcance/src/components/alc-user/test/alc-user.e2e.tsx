import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-user.e2e.tsx

describe('alc-user', () => {

  it('Deve emitir o evento alc-logout ao clicar no link de logout', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <alc-user name="Usuário" registrationNumber="123456" logoutUrl="#logout"></alc-user>
    );

    const alcLogoutEvent = spyOnEvent('alc-logout');
    const logoutLink = root.querySelector<HTMLElement>('[data-test-logout]');
    assert.exists(logoutLink, 'O link de logout não foi encontrado');

    await userEvent.click(logoutLink);
    await waitForChanges();

    expect(alcLogoutEvent).toHaveReceivedEvent();
  });

  it('Não deve navegar quando o evento alc-logout é impedido', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <alc-user name="Usuário" registrationNumber="123456" logoutUrl="#logout"></alc-user>
    );

    root.addEventListener('alc-logout', (event) => {
      event.preventDefault();
    });

    const alcLogoutEvent = spyOnEvent('alc-logout');
    const logoutLink = root.querySelector<HTMLElement>('[data-test-logout]');
    assert.exists(logoutLink, 'O link de logout não foi encontrado');

    await userEvent.click(logoutLink);
    await waitForChanges();

    expect(alcLogoutEvent).toHaveReceivedEvent();
    expect(window.location.href).not.toContain('/logout');
  });

  it('Deve renderizar corretamente o link de logout', async () => {
    const customLogoutUrl = '#meu-link-de-logout';
    const { root, waitForChanges } = await render(
      <alc-user name="Usuário" registrationNumber="123456" logoutUrl={customLogoutUrl}></alc-user>
    );

    const logoutLink = root.querySelector<HTMLElement>('[data-test-logout]');
    assert.exists(logoutLink, 'O link de logout não foi encontrado');

    await userEvent.click(logoutLink);
    await waitForChanges();

    expect(logoutLink).toEqualAttribute('href', customLogoutUrl);
    expect(logoutLink).toEqualText('Sair');

    expect(window.location.href).toContain(customLogoutUrl);
  });

});
