// @ts-ignore
import { argTypes } from './alc-dropdown.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Dropdown',
  name: 'Dropdown',
  component: 'alc-dropdown',
  tags: ['alfa'],
  parameters: {
    docs: {
      story: {
        height: '12rem',
      }
    },
  },
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: args => `
<alc-dropdown ${renderArgs(argTypes, args)}>
  <button slot="trigger" class="alc-button">
      Mostrar <alc-icon name="chevron-down" label=""></alc-icon>
  </button>
  <div class="p-4"> Conteúdo </div>
</alc-dropdown>
  `,
};

export const ComMenu = {
  name: 'Com menu',
  args: {
    ...defaultArgs,
  },
  render: args => `
<alc-dropdown ${renderArgs(argTypes, args)}>
  <button slot="trigger" class="alc-button alc-button--secondary">
      <alc-icon name="three-dots-vertical" label="Ações..."></alc-icon>
  </button>
  <alc-menu>
      <alc-menu-item value="excluir">
          Excluir
      </alc-menu-item>
      <alc-menu-item value="prioritario">
          Marcar como prioritário
      </alc-menu-item>
      <alc-menu-item value="adiar">
          Adiar
      </alc-menu-item>
  </alc-menu>
</alc-dropdown>
  `,
};

export const RotuloVisivel = {
  name: 'Disparador com rótulo visível',
  args: {
    ...defaultArgs,
  },
  render: args => `
<alc-dropdown ${renderArgs(argTypes, args)}>
  <button slot="trigger" class="alc-button">
      Ações <alc-icon name="chevron-down" label=""></alc-icon>
  </button>
  <alc-menu>
      <alc-menu-item value="excluir">
          Excluir
      </alc-menu-item>
      <alc-menu-item value="prioritario">
          Marcar como prioritário
      </alc-menu-item>
      <alc-menu-item value="adiar">
          Adiar
      </alc-menu-item>
  </alc-menu>
</alc-dropdown>
  `,
};

export const RotuloNaoVisivel = {
  name: 'Disparador com rótulo não visível',
  args: {
    ...defaultArgs,
  },
  render: args => `
<alc-dropdown ${renderArgs(argTypes, args)}>
  <button slot="trigger" class="alc-button">
      <alc-icon name="three-dots-vertical" label="Ações"></alc-icon>
  </button>
  <alc-menu>
      <alc-menu-item value="excluir">
          Excluir
      </alc-menu-item>
      <alc-menu-item value="prioritario">
          Marcar como prioritário
      </alc-menu-item>
      <alc-menu-item value="adiar">
          Adiar
      </alc-menu-item>
  </alc-menu>
</alc-dropdown>
  `,
};

export const FechamentoAutomatico = {
  name: 'Fechamento automático',
  args: {
    ...defaultArgs,
    'hide-on': 'alc-select'
  },
  render: args => `
<alc-dropdown ${renderArgs(argTypes, args)}>
  <button slot="trigger" class="alc-button">
      Ações <alc-icon name="chevron-down" label=""></alc-icon>
  </button>
  <alc-menu>
      <alc-menu-item value="excluir">
          Excluir
      </alc-menu-item>
      <alc-menu-item value="prioritario">
          Marcar como prioritário
      </alc-menu-item>
      <alc-menu-item value="adiar">
          Adiar
      </alc-menu-item>
  </alc-menu>
</alc-dropdown>
  `,
};