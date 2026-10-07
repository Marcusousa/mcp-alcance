// @ts-ignore
import { argTypes } from './alc-pagination.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Pagination',
  name: 'Pagination',
  component: 'alc-pagination',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'total-pages': 5,
  },
  render: args => `
    <alc-pagination ${renderArgs(argTypes, args)}></alc-pagination>
  `,
};

export const BasicoConteudo = {
  name: 'Básico com conteúdo',
  // Definindo o máx e mín dos controls para não dar erro 
  argTypes: {
    'current-page': {
      ...argTypes['current-page'],
      control: {
        type: 'number',
        min: '1',
        max: '3'
      }
    },
    'total-pages': {
      ...argTypes['total-pages'],
      control: {
        type: 'number',
        min: '1',
        max: '3'
      }
    }
  },
  args: {
    ...defaultArgs,
    'current-page': 1,
    'total-pages': 3,
  },
  render: args => {
    customElements.whenDefined('alc-pagination').then(() => {
      // Trata a mudança de página ao mudar o valor do control
      let pages = document.querySelectorAll('.js-page');
      let currentPage = args['current-page'] - 1;

      pages.forEach(page => page.classList.add('hidden'));
      pages[currentPage].classList.remove('hidden');
    })

    return `
<div class="js-page">
  Episódio 1: Êxodo (Exodus). Lançado em 23 de janeiro de 1985.
</div>
<div class="js-page hidden">
  Episódio 2: Aliança Profana (The Unholy Alliance). Lançado em 23 de janeiro de 1985.
</div>
<div class="js-page hidden">
  Episódio 3: Berbils. Lançado em 11 de setembro de 1985.
</div>
<alc-pagination ${renderArgs(argTypes, args)} id="comp-pagination"></alc-pagination>

<script>
  // Captura o evento alc-change e faz o ajuste visual no conteúdo
  // Esse exemplo não está completo porque não implementa a comunicação da mudança de conteúdo para leitores de tela.
  document.querySelector("#comp-pagination").addEventListener("alc-change", function (e) {
    let pages = document.querySelectorAll('.js-page');
    const index = e.detail.to ? (e.detail.to - 1) : 0; // Para garantir que 'index' tenha um valor válido.
    pages.forEach(page => page.classList.add('hidden'));
    pages[index].classList.remove('hidden');
  });
</script>
  `},
};