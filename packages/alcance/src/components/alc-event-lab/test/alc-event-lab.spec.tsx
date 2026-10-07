import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';


describe('alc-event-lab', () => {
  it('Teste vazio', async () => {
    const { root } = await render(
      <div></div>
    );    

    expect(root).not.toBeNull();
  });
});

// import { newSpecPage } from '@stencil/core/testing';
// import { AlcEventLab } from '../alc-event-lab';

// describe('alc-event-lab', () => {

//   describe('iniciando a página com o componente já presente', () => {

//     it('permite a captura dos eventos na ordem esperada - listener em document', async () => {
//       const page = await newSpecPage({
//         components: [AlcEventLab],
//         html: '<alc-event-lab></alc-event-lab>'
//       });
//       const calls = [];
//       page.doc.addEventListener('alc-change', () => calls.push('alc-change'));
//       page.doc.addEventListener('alc-after-change', () => calls.push('alc-after-change'));

//       page.root.changePage(2);
//       await page.waitForChanges();

//       expect(calls).toEqual(['alc-change', 'alc-after-change']);
//     });

//     it('permite a captura dos eventos na ordem esperada - listener no componente', async () => {
//       const page = await newSpecPage({
//         components: [AlcEventLab],
//         html: '<alc-event-lab></alc-event-lab>'
//       });
//       const calls = [];
//       page.root.addEventListener('alc-change', () => calls.push('alc-change'));
//       page.root.addEventListener('alc-after-change', () => calls.push('alc-after-change'));

//       page.root.changePage(2);
//       await page.waitForChanges();

//       expect(calls).toEqual(['alc-change', 'alc-after-change']);
//     });

//     it('dispara os eventos com o detail esperado', async () => {
//       const page = await newSpecPage({
//         components: [AlcEventLab],
//         html: '<alc-event-lab></alc-event-lab>'
//       });
//       const alcChange = jest.fn();
//       const alcAfterChange = jest.fn();
//       page.doc.addEventListener('alc-change', alcChange);
//       page.doc.addEventListener('alc-after-change', alcAfterChange);

//       page.root.changePage(2);
//       await page.waitForChanges();

//       expect(alcChange).toBeCalledWith(
//         expect.objectContaining({
//           detail: {
//             from: 1,
//             to: 2
//           }
//         })
//       );
//       expect(alcAfterChange).toBeCalledWith(
//         expect.objectContaining({
//           detail: {
//             from: 1,
//             to: 2
//           }
//         })
//       );
//     });

//     it('não dispara alcAfterChange se alcChange for cancelado', async () => {
//       const page = await newSpecPage({
//         components: [AlcEventLab],
//         html: '<alc-event-lab></alc-event-lab>'
//       });
//       const alcChange = jest.fn();
//       const alcAfterChange = jest.fn();
//       page.doc.addEventListener('alc-change', e => {
//         e.preventDefault()
//         alcChange(e);
//       });
//       page.doc.addEventListener('alc-after-change', alcAfterChange);

//       page.root.changePage(2);
//       await page.waitForChanges();

//       expect(alcChange).toBeCalled();
//       expect(alcAfterChange).not.toBeCalled();
//     });
//   });

//   describe('inserindo o componente na página dinamicamente', () => {

//     it('dispara alcAfterChange ao renderizar', async () => {
//       const page = await newSpecPage({
//         components: [AlcEventLab],
//         html: '',
//       });
//       const alcAfterChange = jest.fn();
//       page.doc.addEventListener('alc-after-change', alcAfterChange);

//       await page.setContent('<alc-event-lab></alc-event-lab>');

//       expect(alcAfterChange).toBeCalledWith(
//         expect.objectContaining({
//           detail: {
//             from: undefined,
//             to: 1
//           }
//         })
//       );
//     });
//   });
// });
