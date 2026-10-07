// @ts-ignore
import { argTypes } from './alc-drawer.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Drawer',
  name: 'Drawer',
  component: 'alc-drawer',
  tags: ['alfa'],
  parameters: {
    docs: {
      story: {
        // Para definir uma altura no espaço reservado ao exemplo,
        // já que o componente em si não tem uma altura inicial
        height: '25rem',
      },
    },
  },
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    //'element-to-focus': 'a',
    'is-visible': true,
  },
  render: args => `
<alc-drawer ${renderArgs(argTypes, args)}>
  <ul style="margin-left: var(--alc-spacing-06)">
     <li><a href="/">Início do conteúdo</a></li>
     <li>Item 0</li>
     <li>Item 1</li>
     <li>Item 2</li>
     <li>Item 3</li>
     <li>Item 4</li>
  </ul>
</alc-drawer>
  `,
};

export const DrawerAcionador = {
  name: 'Com Acionador',
  args: {
    ...defaultArgs,
    'element-to-focus': 'botao-acionador',
    'is-visible': false,
  },
  render: args => `
<div style="padding: var(--alc-spacing-06)">  
  <button id="botao-acionador" onclick="document.querySelector('#drawer-acionavel').show()" class="alc-button">
    Abrir Drawer
  </button>

  <alc-drawer id="drawer-acionavel" ${renderArgs(argTypes, args)}>
    <ul style="margin-left: var(--alc-spacing-06)">
      <li><a href="/">Início do conteúdo</a></li>
      <li>Item 0</li>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
    </ul>
  </alc-drawer>
</div>
  `,
};