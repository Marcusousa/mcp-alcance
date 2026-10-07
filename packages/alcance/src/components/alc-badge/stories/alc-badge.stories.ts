// @ts-ignore
import { argTypes } from './alc-badge.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Badge',
  name: 'Badge',
  component: 'alc-badge',
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
    label: 'Novo',
    color: 'success',
    position: 'default',
  },
  render: (args) => (`<alc-badge ${renderArgs(argTypes, args)}></alc-badge>
  `)
};

export const ComContador = {
  name: 'Com Contador',
  args: {
    ...defaultArgs,
    label: '99+',
    count: true,
    color: 'warning',
  },
  render: (args) => (`
<alc-badge ${renderArgs(argTypes, args)}>
  <button class="alc-button alc-button-rounded alc-button--secondary">
    <alc-icon name="bell-fill" label="mensagens"></alc-icon>
    <p class="sr-only">99 notificações.</p>
  </button>
</alc-badge>
  `)
};

export const ComDot = {
  name: 'Com Dot',
  args: {
    ...defaultArgs,
    dot: true,
    color: 'success',
  },
  render: (args) => (`
<alc-badge ${renderArgs(argTypes, args)}>
  <span>Atualizações</span>
</alc-badge>
`)
};

export const ComOutlined = {
  name: 'Com Outlined',
  args: {
    ...defaultArgs,
    label: 'Novo',
    outlined: true,
  },
  render: (args) => (`
<alc-badge ${renderArgs(argTypes, args)}></alc-badge>
  `)
};

export const ComPositionFloating = {
  name: 'Com Posição Floating',
  args: {
    ...defaultArgs,
    label: '3',
    position: 'floating',
  },
  render: (args) => (`
<p>Carrinho
  <alc-badge ${renderArgs(argTypes, args)}></alc-badge>
</p>
`)
};

export const ComPulsate = {
  name: 'Com Pulsate',
  args: {
    ...defaultArgs,
    label: '!',
    pulsate: true,
    color: 'info',
  },
  render: (args) => (`
<alc-badge ${renderArgs(argTypes, args)}>
  <span>Aviso</span> 
</alc-badge>
  `)
};

export const ComAcessibilidade = {
  name: 'Com Acessibilidade (sr-only)',
  args: {
    ...defaultArgs,
    count: true,
    label: '5',
    color: 'error',
  },
  render: (args) => (`
<alc-badge ${renderArgs(argTypes, args)}>
  <button class="alc-button alc-button-rounded">
    <alc-icon name="chat-left-dots-fill" label="mensagens"></alc-icon>
    <p class="sr-only">5 novas mensagens.</p>
  </button>
</alc-badge>
  `)
};
