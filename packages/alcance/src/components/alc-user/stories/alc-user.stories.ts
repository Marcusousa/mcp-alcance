// @ts-ignore
import { argTypes } from './alc-user.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/User',
  name: 'User',
  component: 'alc-user',
  parameters: {},
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'name': 'Fulano',
  },
  render: args => `
<alc-user ${renderArgs(argTypes, args)}></alc-user>
  `,
};

export const Ponto = {
  name: 'Ponto/Matrícula',
  args: {
    ...defaultArgs,
    'name': 'Fulano',
    'registration-number': 'P_XXXXX',
  },
  render: args => `
<alc-user ${renderArgs(argTypes, args)}></alc-user>
  `,
};

export const Imagem = {
  name: 'Imagem',
  args: {
    ...defaultArgs,
    'img-src': 'https://source.boringavatars.com/beam/120/Stefan?colors=264653,f4a261,e76f51',
    'name': 'Fulano',
    'registration-number': 'P_XXXXX',
  },
  render: args => `
<alc-user ${renderArgs(argTypes, args)}></alc-user>
  `,
};

export const Logout = {
  name: 'Logout',
  args: {
    ...defaultArgs,
    'logout-url': '##',
    'name': 'Fulano',
    'registration-number': 'P_XXXXX',
  },
  render: args => `
<alc-user ${renderArgs(argTypes, args)}></alc-user>
  `,
};

export const Slot = {
  name: 'Slot',
  args: {
    ...defaultArgs,
    'name': 'Fulano',
    'registration-number': 'P_XXXXX',
  },
  render: args => `
<alc-user ${renderArgs(argTypes, args)}>
  <p>Online</p>
</alc-user>
  `,
};