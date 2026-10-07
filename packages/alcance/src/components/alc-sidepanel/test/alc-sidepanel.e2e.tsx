import { render, h, describe, it, expect, assert } from '@stencil/vitest';

describe('alc-sidepanel', () => {
  it('Teste vazio', async () => {
    const { root } = await render(
      <div></div>
    );    

    expect(root).not.toBeNull();
  });
});

// import { newE2EPage } from '@stencil/core/testing';

// describe('alc-sidepanel', () => {
//   it('renders', async () => {
//     const page = await newE2EPage();
//     await page.setContent('<alc-sidepanel></alc-sidepanel>');

//     const element = await page.find('alc-sidepanel');
//     expect(element).toHaveClass('hydrated');
//   });

//   it('Emite o evento alc-state-change ao esconder/mostrar', async () => {
//     const page = await newE2EPage();
//     await page.setContent('<alc-sidepanel></alc-sidepanel>');
//     const sidepanel = await page.find('alc-sidepanel');

//     const changeSpy = await sidepanel.spyOnEvent('alc-state-change');

//     await page.evaluate(() => {
//       const button = document.querySelector('[data-test-sidepanel-desktop-close-button]');
//       if (button instanceof HTMLElement) {
//         button.click();
//       }
//     });

//     await page.waitForChanges();

//     expect(changeSpy).toHaveReceivedEventDetail({ state: { visible: false } });

//     await page.evaluate(() => {
//       const button = document.querySelector('[data-test-sidepanel-desktop-close-button]');
//       if (button instanceof HTMLElement) {
//         button.click();
//       }
//     });

//     await page.waitForChanges();

//     expect(changeSpy).toHaveReceivedEventDetail({ state: { visible: true } });
//   });

//   it('Renderiza escondido quando é informado o estado `{ visible: false }` no evento alc-state-request', async () => {
//     const page = await newE2EPage();

//     // Cria esqueleto da página e prepara spy para o evento
//     await page.setContent('<div></div>');
//     await page.waitForChanges();
//     const spy = await page.spyOnEvent('alc-state-request', 'document');

//     // Inclui dinamicamente o componente
//     // Trata o evento para forçar o estado não visível.
//     await page.evaluate(() => {
//       const div = document.querySelector('div');
//       const sidepanel = document.createElement('alc-sidepanel');
//       // Força o estado { visible: false }
//       document.addEventListener('alc-state-request', (e: any) => e.detail.state = { visible: false });

//       div.appendChild(sidepanel);
//     });

//     await page.waitForChanges();

//     const sidepanel = await page.find('alc-sidepanel');

//     expect(spy).toHaveReceivedEvent();
//     expect(await sidepanel.getProperty('visible')).toBeFalsy();
//   });
// });
