import { render, h, describe, it, expect } from '@stencil/vitest';

const data = {
  name: 'Thundercats',
  registrationNumber: '12345',
  logoutUrl: '/logout',
  imgSrc: 'avatar.png',
  slotText: 'Texto do Slot'
};

const themes = {
  dark: 'dark',
  light: 'light',
}

// yarn stencil-test --project spec alc-user-menu.spec.tsx  

describe('alc-user-menu', () => {

  const variations: ('mobile' | 'desktop')[] = [
    'desktop',
    'mobile'
  ];

  it.each(variations)(`Renderiza as propriedades de %s corretamente`, async (variation) => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation={variation}
      ></alc-user-menu>
    );

    const name = root.querySelector(`[data-test-${variation}] [data-test-name]`);
    expect(name).not.toBeNull();
    expect(name?.textContent).toContain(data.name);

    const registrationNumber = root.querySelector(`[data-test-${variation}] [data-test-registration-number]`);
    expect(registrationNumber).not.toBeNull();
    expect(registrationNumber?.textContent).toContain(`(${data.registrationNumber})`);

    const icon = root.querySelector(`[data-test-${variation}] [data-test-icon]`);
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('name')).toBe('person-fill');
    expect(icon?.getAttribute('label')).toBe(data.name);
  });

  it('Renderiza a propriedade logoutUrl corretamente', async () => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
      ></alc-user-menu>
    );

    const link = root.querySelector(`[data-test-logout]`);
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe(data.logoutUrl);
    expect(link?.textContent).toContain('Sair');
  });

  it.each(variations)('Renderiza a propriedade imgSrc de %s corretamente', async (variation) => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        logoutUrl={data.logoutUrl}
        imgSrc={data.imgSrc}
        variation={variation}
      ></alc-user-menu>
    );

    const img = root.querySelector(`[data-test-${variation}] [data-test-image]`);
    expect(img?.getAttribute('src')).toBe(data.imgSrc);
    expect(img?.getAttribute('alt')).toBe(data.name);
  });

  it('Deve renderizar a variação mobile corretamente', async () => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation="mobile"
      ></alc-user-menu>
    );

    const mobile = root.querySelector('[data-test-mobile]');
    expect(mobile).not.toHaveClass('hidden');

    const desktop = root.querySelector('[data-test-desktop]');
    expect(desktop).toHaveClass('hidden');

    const expander = root.querySelector('[data-test-expander]');
    expect(expander).not.toBeNull();

    const menu = expander?.querySelector('[data-test-menu]');
    expect(menu).not.toBeNull();
    expect(menu?.querySelector('alc-menu-item-theme')).not.toBeNull();
    expect(menu?.querySelector('alc-menu-link')).not.toBeNull();
  });

  it('Deve renderizar a variação desktop corretamente', async () => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation="desktop"
      ></alc-user-menu>
    );

    const mobile = root.querySelector('[data-test-mobile]');
    expect(mobile).toHaveClass('hidden');

    const desktop = root.querySelector('[data-test-desktop]');
    expect(desktop).not.toHaveClass('hidden');

    const dropdown = root.querySelector('[data-test-dropdown]');
    expect(dropdown).not.toBeNull();

    const menu = dropdown?.querySelector('alc-menu');
    expect(menu).not.toBeNull();
    expect(menu?.querySelector('alc-menu-item-theme')).not.toBeNull();
    expect(menu?.querySelector('alc-menu-link')).not.toBeNull();
  });

  it('Deve renderizar corretamente no modo compacto (<1200px)', async () => {
    const { root, waitForChanges } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation="desktop"
      ></alc-user-menu>
    );

    // Simula largura de 1000px
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1000 });
    window.dispatchEvent(new Event('resize'));
    await waitForChanges();

    // Deve renderizar o desktop, mas com info movida para o container interno
    const mobile = root.querySelector('[data-test-mobile]');
    expect(mobile).toHaveClass('hidden');

    const desktop = root.querySelector('[data-test-desktop]');
    expect(desktop).not.toHaveClass('hidden');

    // Os dados tem que estar dentro do alc-dropdown
    const dropdown = root.querySelector('[data-test-dropdown]');
    expect(dropdown).not.toBeNull();
    expect(dropdown?.querySelector('[data-test-name]')).not.toBeNull();
    expect(dropdown?.querySelector('[data-test-registration-number]')).not.toBeNull();
  });

  it('Deve disparar o evento alc-logout ao clicar no link de logout', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
      ></alc-user-menu>
    );

    const logoutEvent = spyOnEvent('alc-logout');

    const link = root.querySelector<HTMLElement>('[data-test-logout]');
    link?.click();
    await waitForChanges();

    expect(logoutEvent).toHaveReceivedEvent();
  });

  it('Deve renderizar o slot default corretamente no modo desktop', async () => {
    const { root, waitForChanges } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation="desktop"
      >
        {data.slotText}
      </alc-user-menu>
    );

    const slot = root.querySelector('[data-test-desktop] [data-test-slot]');
    expect(slot).not.toBeNull();
    expect(slot).toEqualText(data.slotText);

    // Altera para modelo compacto
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1000 });
    window.dispatchEvent(new Event('resize'));
    await waitForChanges();

    // Tem que estar dentro do alc-dropdown
    const compactSlot = root.querySelector('[data-test-dropdown] [data-test-slot]');
    expect(compactSlot).not.toBeNull();
    expect(compactSlot).toEqualText(data.slotText);
  });

  it('Deve renderizar o slot default corretamente no modo mobile', async () => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation="mobile"
      >
        {data.slotText}
      </alc-user-menu>
    );

    const slot = root.querySelector('[data-test-mobile] [data-test-slot]');
    expect(slot).not.toBeNull();
    expect(slot).toEqualText(data.slotText);
  });

  it('Deve renderizar o slot action corretamente no modo desktop', async () => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation="desktop"
      >
        <div slot="actions" data-test-slot-actions>
          <alc-menu-item id="item-ajuda">Ajuda</alc-menu-item>
          <alc-menu-item id="item-contato">Contato</alc-menu-item>
        </div>
      </alc-user-menu>
    );

    // Tem que estar dentro do alc-dropdown
    const menu = root.querySelector('[data-test-dropdown] [data-test-menu]');
    expect(menu).not.toBeNull();
    
    const menuItens = menu?.querySelectorAll('[data-test-slot-actions] alc-menu-item');
    expect(menuItens).toHaveLength(2);
    expect(menuItens?.[0]).toEqualAttribute('id', 'item-ajuda');
    expect(menuItens?.[1]).toEqualAttribute('id', 'item-contato');
  });

  it('Deve renderizar o slot action corretamente no modo mobile', async () => {
    const { root } = await render(
      <alc-user-menu
        name={data.name}
        registrationNumber={data.registrationNumber}
        logoutUrl={data.logoutUrl}
        variation="mobile"
      >
        <div slot="actions" data-test-slot-actions>
          <alc-menu-item id="item-ajuda">Ajuda</alc-menu-item>
          <alc-menu-item id="item-contato">Contato</alc-menu-item>
        </div>
      </alc-user-menu>
    );
    // Tem que estar dentro de alc-expander
    const menu = root.querySelector('[data-test-expander] [data-test-menu]');
    expect(menu).not.toBeNull();


    const menuItens = menu?.querySelectorAll('[data-test-slot-actions] alc-menu-item');
    expect(menuItens).toHaveLength(2);
    expect(menuItens?.[0]).toEqualAttribute('id', 'item-ajuda');
    expect(menuItens?.[1]).toEqualAttribute('id', 'item-contato');
  });

  it('Deve disparar alc-theme-change ao clicar no item de tema', async () => {
    // Limpa o localStorage para garantir que o tema seja o padrão
    globalThis.localStorage?.clear();

    const { root, waitForChanges, spyOnEvent  } = await render(
      <alc-user-menu
        name={data.name}
        logoutUrl={data.logoutUrl}
      ></alc-user-menu>
    );

    const themeChangeHandler = spyOnEvent('alc-theme-change');

    // Verifica o elemento alc-menu-item-theme
    const themeItem = root.querySelector('alc-menu-item-theme');
    expect(themeItem).not.toBeNull();

    // Verifica o elemento alc-menu-item dentro do alc-menu-item-theme
    const menuItem = themeItem?.querySelector('alc-menu-item');
    expect(menuItem).not.toBeNull();
    // Verifica que o item de tema está desmarcado (light)
    expect(menuItem?.checked).toBe(false);

    // Simula o clique
    menuItem?.click();
    await waitForChanges();

    // Verifica se alterou para o modo dark
    expect(menuItem?.checked).toBe(true);
    expect(themeChangeHandler).toHaveReceivedEvent();
    expect(themeChangeHandler).toHaveReceivedEventTimes(1);
    expect(themeChangeHandler).toHaveReceivedEventDetail({ theme: themes.dark });

    // Simula o clique
    menuItem?.click();
    await waitForChanges();

    // Verifica se alterou para o modo light
    expect(menuItem?.checked).toBe(false);
    expect(themeChangeHandler).toHaveReceivedEventTimes(2);
    expect(themeChangeHandler).toHaveReceivedEventDetail({ theme: themes.light });
  });

});