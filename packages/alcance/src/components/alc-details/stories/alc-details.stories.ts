// @ts-ignore
import { argTypes } from './alc-details.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Details',
  name: 'Details',
  component: 'alc-details',
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
    // 'disabled': ,
    // 'opened': ,
    'summary': 'Básico',
  },
  render: args => `
<alc-details ${renderArgs(argTypes, args)}>
  <p>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet, odit quod. Consequatur excepturi aspernatur maxime perferendis? Iste autem praesentium aut fugiat molestias soluta eaque, distinctio vitae, deleniti provident nihil enim?
  </p>
</alc-details>
  `,
};

export const Styled = {
  name: 'Estilizado',
  args: {
    ...defaultArgs,
    // 'disabled': ,
    // 'opened': ,
    'summary': 'Estilizado',
  },
  render: args => `
<alc-details ${renderArgs(argTypes, args)} style="--bg-color: var(--alc-color-layer-a);">
  <p>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet, odit quod. Consequatur excepturi aspernatur maxime perferendis? Iste autem praesentium aut fugiat molestias soluta eaque, distinctio vitae, deleniti provident nihil enim?
  </p>
</alc-details>
  `,
};

export const Disabled = {
  name: 'Desabilitado',
  args: {
    ...defaultArgs,
    'disabled': true,
    // 'opened': ,
    'summary': 'Desabilitado',
  },
  render: args => `
<alc-details ${renderArgs(argTypes, args)}>
  <p>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet, odit quod. Consequatur excepturi aspernatur maxime perferendis? Iste autem praesentium aut fugiat molestias soluta eaque, distinctio vitae, deleniti provident nihil enim?
  </p>
</alc-details>
  `,
};