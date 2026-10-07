// @ts-ignore
import { argTypes } from './alc-skip-to-nav.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Skip To Nav',
  name: 'Skip To Nav',
  component: 'alc-skip-to-nav',
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-alert dismissible="false">Use tab para navegar e ver o skip-to-nav em ação.</alc-alert>
<alc-skip-to-nav ${renderArgs(argTypes, args)}></alc-skip-to-nav>
  `)
};
