import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

describe('alc-header-v1', () => {
  it('Teste vazio', async () => {
    const { root } = await render(
      <div></div>
    );    

    expect(root).not.toBeNull();
  });
});

// import { newE2EPage } from '@stencil/core/testing';

// const url = "/url-test";

// describe('alc-header-v1', () => {
//   it('Deve navegar ao clicar no link', async () => {
//     const page = await newE2EPage();
//     await page.setContent(`<alc-header-v1 name="Teste" home-url="${url}"></alc-header-v1>`);

//     const link = await page.find('[data-test-link]');
//     await link.click();

//     expect(page.url()).toContain(url);
//   });
//   it('Não deve navegar quando o evento alc-click é impedido', async () => {
//     const page = await newE2EPage();
//     await page.setContent(`
//       <alc-header-v1 name="Teste" home-url="${url}"></alc-header-v1>
//       <script>
//         document.querySelector('alc-header-v1').addEventListener('alc-home', (event) => {
//           event.preventDefault();
//         });
//       </script>
//     `);

//     const homeEvent = await page.spyOnEvent('alc-home');

//     const link = await page.find('[data-test-link]');
//     await link.click();

//     expect(homeEvent).toHaveReceivedEvent();
//     expect(page.url()).not.toContain(url);
//   });
// });