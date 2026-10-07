// @ts-ignore
import { argTypes } from './alc-menu.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Menu',
  name: 'Menu',
  component: 'alc-menu',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: args => `
<alc-menu ${renderArgs(argTypes, args)}>
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
  `,
};
