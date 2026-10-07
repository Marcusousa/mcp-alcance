// @ts-ignore
import { argTypes } from './alc-checkbox.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Checkbox',
  name: 'Checkbox',
  component: 'alc-checkbox',
  parameters: {},
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    label: "Notícias da semana"
  },
  render: args => `
<alc-checkbox ${renderArgs(argTypes, args)}>
  <input type="checkbox"/>
</alc-checkbox>
  `,
};

export const BasicoSlot = {
  name: 'Básico usando slot',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-checkbox ${renderArgs(argTypes, args)}>
  <input type="checkbox"/>
  <label slot="label">Notícias da semana</label>
</alc-checkbox>
  `)
};

export const Hint = {
  name: 'Texto de ajuda',
  args: {
    ...defaultArgs,
    hint: "Você vai receber semanalmente as notícias da casa.",
    label: "Notícias da semana"
  },
  render: (args) => (`
<alc-checkbox ${renderArgs(argTypes, args)}>
  <input type="checkbox"/>
</alc-checkbox>
  `)
};

export const Erro = {
  name: 'Mensagem de erro',
  args: {
    ...defaultArgs,
    'error-msg': "Você precisa aceitar os termos de uso para prosseguir.",
    label: "Aceito os termos de uso",
  },
  render: (args) => (`
<alc-checkbox ${renderArgs(argTypes, args)}>
  <input type="checkbox"/>
</alc-checkbox>
  `)
};

export const Desabilitado = {
  name: 'Desabilitado',
  args: {
    ...defaultArgs,
    label: "Aceito os termos de uso"
  },
  render: (args) => (`
<alc-checkbox ${renderArgs(argTypes, args)}>
  <input type="checkbox" disabled/>
</alc-checkbox>
  `)
};