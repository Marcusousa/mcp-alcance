// @ts-ignore
import { argTypes } from './alc-skip-link.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Skip Link',
  name: 'Skip Link',
  component: 'alc-skip-link',
  parameters: {},
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'anchor': 'main-content',
  },
  render: args => `
<alc-alert dismissible="false">Use tab para navegar e ver o skip-link em ação.</alc-alert>
<alc-skip-link ${renderArgs(argTypes, args)}>conteúdo principal</alc-skip-link>
  `,
};
