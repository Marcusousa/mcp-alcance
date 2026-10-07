import { render, h, describe, it, expect, assert, beforeEach } from '@stencil/vitest';
import { userEvent, page } from 'vitest/browser';

// yarn stencil-test --project browser alc-header.e2e.tsx

const data = {
  nome: 'Thundercats',
  descricao: 'Tecnologia thundercats',
  url: '#home'
};

describe('alc-header', () => {
  beforeEach(async () => {
    await page.viewport(1440, 785);
  });

  it('Deve renderizar as propriedades corretamente', async () => {
    const { root } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
        <div slot="user">
          <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
        </div>
      </alc-header>
    );

    expect(root.name).toBe(data.nome);
    expect(root.description).toBe(data.descricao);
    expect(root.homeUrl).toBe(data.url);
  });

  it('Deve passar as propriedades para o componente alc-header-id corretamente', async () => {
    const { root } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
        <div slot="user">
          <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
        </div>
      </alc-header>
    );

    const headerIdElement = root.querySelector<HTMLAlcHeaderIdElement>('[data-test-header-id]');
    assert.exists(headerIdElement, 'O header-id não foi encontrado');

    expect(headerIdElement.name).toBe(data.nome);
    expect(headerIdElement.description).toBe(data.descricao);
    expect(headerIdElement.homeUrl).toBe(data.url);
  });

  it('Deve disparar o evento alc-home quando o link home for clicado', async () => {
    const { root, spyOnEvent, waitForChanges } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
        <div slot="user">
          <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
        </div>
      </alc-header>
    );

    const alcHomeEvent = spyOnEvent('alc-home');

    const headerIdElement = root.querySelector<HTMLAlcHeaderIdElement>('[data-test-header-id]');
    assert.exists(headerIdElement, 'O header-id não foi encontrado');

    await userEvent.click(headerIdElement);
    await waitForChanges();

    expect(alcHomeEvent).toHaveReceivedEvent();
    expect(window.location.href).toContain(data.url);
  });

  it('Deve prevenir navegação (alc-home) quando o link home for clicado', async () => {
    const initialUrl = window.location.href;

    const { root, spyOnEvent, waitForChanges } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl="#home-2">
        <div slot="user">
          <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
        </div>
      </alc-header>
    );

    // Adiciona listener que previne navegação
    root.addEventListener('alc-home', (event) => {
      event.preventDefault();
    });

    const alcHomeEvent = spyOnEvent('alc-home');

    const headerIdElement = root.querySelector<HTMLElement>('[data-test-header-id]');
    assert.exists(headerIdElement, 'O header-id não foi encontrado');

    await userEvent.click(headerIdElement);
    await waitForChanges();

    // O evento foi disparado, mas a navegação foi prevenida.
    expect(alcHomeEvent).toHaveReceivedEvent();
    expect(window.location.href).toBe(initialUrl);
  });

  it('Deve mover o componente alc-nav do nav-panel para o drawer quando em mobile', async () => {
    const conteudoNavegacao = "teste";

    const { root, waitForChanges } = await render(
      <div>
        <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
          <div slot="user">
            <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
          </div>
        </alc-header>
        <alc-nav-panel data-test-nav-panel>
          <alc-nav data-test-nav>
            <p>{conteudoNavegacao}</p>
          </alc-nav>
        </alc-nav-panel>
      </div>
    );

    const navPanelElement = root.querySelector<HTMLAlcNavPanelElement>('[data-test-nav-panel]');
    assert.exists(navPanelElement, 'O nav panel não foi encontrado');

    let nav = navPanelElement.querySelector<HTMLElement>('[data-test-nav]');
    assert.exists(nav, 'O nav não foi encontrado');

    expect(navPanelElement.checkVisibility()).toBeTruthy();
    expect(nav).toHaveTextContent(conteudoNavegacao);

    await page.viewport(375, 667);
    await new Promise(resolve => setTimeout(resolve, 300));
    await waitForChanges();

    const drawerElement = root.querySelector<HTMLElement>('[data-test-drawer]');
    assert.exists(drawerElement, 'O drawer não foi encontrado');

    nav = drawerElement.querySelector<HTMLElement>('[data-test-nav]');

    expect(nav).not.toBeNull();
    expect(nav).toHaveTextContent(conteudoNavegacao);

    expect(navPanelElement.checkVisibility()).toBeFalsy();
    expect(navPanelElement.querySelector('alc-nav')).toBeNull();
  });

  it('Deve mover o conteúdo de suporte para dentro do user-menu em mobile', async () => {
    const menuData = {
      ajuda: {
        id: 'support-ajuda',
        text: 'Ajuda'
      },
      contato: {
        id: 'support-contato',
        text: 'Contato',
        url: '#contato'
      }
    };

    const { root, waitForChanges } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
        <div slot="support">
          <alc-header-action id={menuData.ajuda.id} iconName="question-circle" variant="button">{menuData.ajuda.text}</alc-header-action>
          <alc-header-action id={menuData.contato.id} iconName="envelope" variant="link" url={menuData.contato.url}>{menuData.contato.text}</alc-header-action>
        </div>
        <div slot="user">
          <alc-user-menu id="test-user-menu" name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
        </div>
      </alc-header>
    );

    // Verifica estado inicial em desktop
    let supportWrapper = root.querySelector<HTMLElement>('[data-test-support]');
    assert.exists(supportWrapper, 'O suporte não foi encontrado');

    let supportAjuda = supportWrapper.querySelector<HTMLAlcHeaderActionElement>(`#${menuData.ajuda.id}`);
    let supportContato = supportWrapper.querySelector<HTMLAlcHeaderActionElement>(`#${menuData.contato.id}`);

    assert.exists(supportAjuda, 'O item ajuda não foi encontrado');
    assert.exists(supportContato, 'O item contato não foi encontrado');
    expect(supportAjuda).toHaveTextContent(menuData.ajuda.text);
    expect(supportContato).toHaveTextContent(menuData.contato.text);

    expect(supportAjuda.variant).toBe('button');
    expect(supportContato.variant).toBe('link');
    expect(supportContato.url).toBe(menuData.contato.url);

    // Muda para viewport mobile
    await page.viewport(375, 667);
    await new Promise(resolve => setTimeout(resolve, 300));
    await waitForChanges();

    // Verifica que os itens não estão mais no support wrapper
    supportWrapper = root.querySelector<HTMLElement>('[data-test-support]');
    assert.exists(supportWrapper, 'O suporte não foi encontrado');
    
    expect(supportWrapper.querySelector(`#${menuData.ajuda.id}`)).toBeNull();
    expect(supportWrapper.querySelector(`#${menuData.contato.id}`)).toBeNull();

    // Verifica que os itens estão agora dentro do user-menu
    const drawerElement = root.querySelector<HTMLElement>('[data-test-drawer]');
    assert.exists(drawerElement, 'O drawer não foi encontrado');

    const userMenu = drawerElement.querySelector<HTMLAlcUserMenuElement>('#test-user-menu');
    assert.exists(userMenu, 'O user-menu não foi encontrado');

    supportAjuda = userMenu.querySelector<HTMLAlcHeaderActionElement>(`#${menuData.ajuda.id}`);
    supportContato = userMenu.querySelector<HTMLAlcHeaderActionElement>(`#${menuData.contato.id}`);

    assert.exists(supportAjuda, 'O item ajuda não foi encontrado no user-menu');
    assert.exists(supportContato, 'O item contato não foi encontrado no user-menu');
    expect(supportAjuda).toHaveTextContent(menuData.ajuda.text);
    expect(supportContato).toHaveTextContent(menuData.contato.text);

    // Verifica se a variante foi alterada para menu-item/menu-link (conforme lógica do componente)
    expect(supportAjuda.variant).toBe('menu-item');
    expect(supportContato.variant).toBe('menu-link');
    expect(supportContato.url).toBe(menuData.contato.url);
  });

  it('Deve manter o conteúdo do suporte no header quando há espaço', async () => {
    const { root } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
        <div slot="support">
          <alc-header-action iconName="question-circle" variant="button">Ajuda</alc-header-action>
        </div>
        <div slot="user">
          <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
        </div>
      </alc-header>
    );

    const supportWrapper = root.querySelector<HTMLElement>('[data-test-support]');
    assert.exists(supportWrapper, 'O suporte não foi encontrado');

    const supports = supportWrapper.querySelectorAll('alc-header-action');
    expect(supports).toHaveLength(1);
  });

  it('Deve mover o conteúdo do suporte para user-menu quando não há espaço', async () => {
    const { root, waitForChanges } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
        <div slot="support">
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
          <alc-header-action iconName="envelope" variant="button">Contato</alc-header-action>
        </div>
        <div slot="user">
          <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
        </div>
      </alc-header>
    );

    await waitForChanges();

    await new Promise(resolve => setTimeout(resolve, 300));
    // await waitForChanges();

    const supportWrapper = root.querySelector<HTMLElement>('[data-test-support]');
    assert.exists(supportWrapper, 'O suporte não foi encontrado');

    let supports = supportWrapper.querySelectorAll('alc-header-action');
    expect(supports).toHaveLength(0);

    const userMenu = root.querySelector<HTMLElement>('alc-user-menu');
    assert.exists(userMenu, 'O user-menu não foi encontrado');

    supports = userMenu.querySelectorAll('alc-header-action');
    expect(supports).toHaveLength(15);
  });

  it('Deve alterar variação do user-menu entre mobile e desktop', async () => {
    const { root, waitForChanges } = await render<HTMLAlcHeaderElement>(
      <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
        <div slot="user">
          <alc-user-menu id="test-menu" name="Lion-O" registrationNumber="P_12345" logoutUrl="#">
            Thundercat
          </alc-user-menu>
        </div>
      </alc-header>
    );

    // Desktop
    const userMenu = root.querySelector<HTMLAlcUserMenuElement>('#test-menu');
    assert.exists(userMenu, 'O user-menu não foi encontrado');
    expect(userMenu.variation).toBe('desktop');

    // Mobile
    await page.viewport(375, 667);
    await new Promise(resolve => setTimeout(resolve, 300));
    await waitForChanges();

    expect(userMenu.variation).toBe('mobile');
  });

  // describe('Screenshot Tests', () => {
  //   it('Deve capturar screenshot do componente alc-header - desktop', async () => {
  //     await page.viewport(1440, 785);

  //     const { root } = await render<HTMLAlcHeaderElement>(
  //       <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
  //         <div slot="support">
  //           <alc-header-action iconName="question-circle" variant="button">Ajuda</alc-header-action>
  //         </div>
  //         <div slot="fixed">
  //           <alc-header-action iconName="envelope" variant="link" url="#contato">Contato</alc-header-action>
  //         </div>
  //         <div slot="user">
  //           <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
  //         </div>
  //       </alc-header>
  //     );

  //     expect(root).toMatchScreenshot();
  //   });

  //   it('Deve capturar screenshot do componente alc-header - tablet', async () => {
  //     await page.viewport(768, 785);

  //     const { root } = await render<HTMLAlcHeaderElement>(
  //       <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
  //         <div slot="support">
  //           <alc-header-action iconName="question-circle" variant="button">Ajuda</alc-header-action>
  //         </div>
  //         <div slot="fixed">
  //           <alc-header-action iconName="envelope" variant="link" url="#contato">Contato</alc-header-action>
  //         </div>
  //         <div slot="user">
  //           <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
  //         </div>
  //       </alc-header>
  //     );

  //     expect(root).toMatchScreenshot();
  //   });

  //   it('Deve capturar screenshot do componente alc-header - mobile', async () => {
  //     await page.viewport(425, 785);

  //     const { root } = await render<HTMLAlcHeaderElement>(
  //       <alc-header name={data.nome} description={data.descricao} homeUrl={data.url}>
  //         <div slot="support">
  //           <alc-header-action iconName="question-circle" variant="button">Ajuda</alc-header-action>
  //         </div>
  //         <div slot="fixed">
  //           <alc-header-action iconName="envelope" variant="link" url="#contato">Contato</alc-header-action>
  //         </div>
  //         <div slot="user">
  //           <alc-user-menu name="Lion-O" registrationNumber="P_12345" logoutUrl="#"></alc-user-menu>
  //         </div>
  //       </alc-header>
  //     );

  //     expect(root).toMatchScreenshot();
  //   });
  // });
});