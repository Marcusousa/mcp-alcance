// @ts-ignore
import { argTypes } from './alc-scroll-panel.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Scroll Panel',
  name: 'Scroll Panel',
  component: 'alc-scroll-panel',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    // 'has-focus': ,
    // 'scrollToElement': ,
  },
  render: args => `
  <style>
    .item {
      display: inline-block;
      width: 100px;
      height: 100px;
      margin: 5px;
      background-color: #f0f0f0;
      line-height: 100px;
      text-align: center;
      border-radius: 10px;
    }
  </style>
  <alc-scroll-panel>
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
    <div class="item">Item 5</div>
    <div class="item">Item 6</div>
    <div class="item">Item 7</div>
    <div class="item">Item 8</div>
    <div class="item">Item 9</div>
    <div class="item">Item 10</div>
    <div class="item">Item 11</div>
    <div class="item">Item 12</div>
    <div class="item">Item 13</div>
    <div class="item">Item 14</div>
    <div class="item">Item 15</div>
  </alc-scroll-panel>
  `,
};
