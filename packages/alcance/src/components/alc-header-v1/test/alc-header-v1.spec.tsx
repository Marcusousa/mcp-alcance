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


// import { newSpecPage } from '@stencil/core/testing';
// import { AlcHeaderV1 } from '../alc-header-v1';

// const title = "Titulo";
// const url = "/url-test";

// describe('alc-header-v1', () => {
//   it('Deve renderizar corretamente sem informar a url da home', async () => {
//     const page = await newSpecPage({
//       components: [AlcHeaderV1],
//       html: `<alc-header-v1 name="${title}"></alc-header-v1>`,
//     });
    
//     const titleElement = page.root.querySelector('[data-test-title]');
//     const linkElement = page.root.querySelector('[data-test-link]');

//     expect(titleElement).not.toBeNull();
//     expect(titleElement).toEqualText(title);

//     expect(linkElement).toBeNull();
//   });

//   it('Deve renderizar corretamente quando informar a url da home', async () => {
//     const page = await newSpecPage({
//       components: [AlcHeaderV1],
//       html: `<alc-header-v1 name="${title}" home-url="${url}"></alc-header-v1>`,
//     });
    
//     const titleElement = page.root.querySelector('[data-test-title]');
//     const linkElement = page.root.querySelector('[data-test-link]');

//     expect(titleElement).not.toBeNull();
//     expect(titleElement).toEqualText(title);

//     expect(linkElement).not.toBeNull();
//     expect(linkElement.getAttribute("href")).toEqualText(url);
//   });

//   it('Deve emitir evento ao clicar', async () => {
//     const page = await newSpecPage({
//       components: [AlcHeaderV1],
//       html: `<alc-header-v1 name="${title}" home-url="${url}"></alc-header-v1>`,
//     });
    
//     const linkElement = page.root.querySelector('[data-test-link]') as HTMLLinkElement;

//     const clickHome = jest.fn();
//     page.root.addEventListener('alc-home', clickHome);

//     linkElement.click();

//     expect(clickHome).toBeCalled();
//   });

//   it('Deve renderizar corretamente quando usar slot link', async () => {
//     const page = await newSpecPage({
//       components: [AlcHeaderV1],
//       html: `
//       <alc-header-v1>
//         <a slot="link" href="${url}">${title}</a>
//       </alc-header-v1>
//       `,
//     });

//     // O elemento destinado ao slot deve ter sido movido para o local esperado (dentro de title)
//     const linkElement = page.root.querySelector('[data-test-title] [slot="link"]');

//     expect(linkElement).not.toBeNull();
//     expect(linkElement.getAttribute("href")).toEqualText(url);
//     expect(linkElement.textContent).toEqualText(title);
//   });

//   it('Deve renderizar o que for informado na prop (prioridade) e não no slot link', async () => {
//     const page = await newSpecPage({
//       components: [AlcHeaderV1],
//       html: `
//       <alc-header-v1 name="${title}" home-url="${url}">
//         <a slot="link" href="nao-renderizar">Não Renderizar</a>
//       </alc-header-v1>
//       `,
//     });
    
//     const titleElement = page.root.querySelector('[data-test-title]');
//     const linkElement = page.root.querySelector('[data-test-link]');

//     expect(titleElement).not.toBeNull();
//     expect(titleElement).toEqualText(title);

//     expect(linkElement).not.toBeNull();
//     expect(linkElement.getAttribute("href")).toEqualText(url);
//   });
// });
