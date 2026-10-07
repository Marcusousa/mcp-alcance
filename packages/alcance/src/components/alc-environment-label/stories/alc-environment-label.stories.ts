// @ts-ignore
import { argTypes } from './alc-environment-label.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Environment Label',
  name: 'Environment Label',
  component: 'alc-environment-label',
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
    'env': 'development',
  },
  render: args => `
    <alc-environment-label ${renderArgs(argTypes, args)}></alc-environment-label>
  `,
};
