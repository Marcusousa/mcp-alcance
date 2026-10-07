// @ts-ignore
import { argTypes } from './alc-menu-link.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Menu Link',
  name: 'Menu Link',
  component: 'alc-menu-link',
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
  },
  render: args => `
<alc-menu>
    <alc-menu-link ${renderArgs(argTypes, args)}>
        <a href="/">Página Inicial do Alcance</a>
    </alc-menu-link>
    <alc-menu-link>
        <a href="https://google.com">Google</a>
    </alc-menu-link>
    <alc-menu-item>
        Não link
    </alc-menu-item>
</alc-menu>
  `,
};