// @ts-ignore
import { argTypes } from './alc-header-v1.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Header (v1)',
  name: 'Header (v1)',
  component: 'alc-header-v1',
  tags: ['descontinuado'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'home-url': '/',
    'name': 'HoverCat Monitor',
  },
  render: args => `
    <alc-header-v1 ${renderArgs(argTypes, args)}></alc-header-v1>
  `,
};

export const Slot = {
  name: 'Slot "link"',
  args: {
    ...defaultArgs,
  },
  render: args => `
<alc-header-v1 ${renderArgs(argTypes, args)}>
  <a slot="link" href="/">HoverCat Monitor</a>
</alc-header-v1>
  `,
};

export const Completo = {
  name: 'Completo',
  args: {
    ...defaultArgs,
    'home-url': '/',
    'name': 'HoverCat Monitor',
  },
  render: (args) => (`
<alc-header-v1 ${renderArgs(argTypes, args)}>
  <alc-environment-label env="development"></alc-environment-label>
  <alc-skip-link anchor="main-content">conteúdo</alc-skip-link>
</alc-header-v1>
  `)
};