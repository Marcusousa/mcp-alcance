// @ts-ignore
import { argTypes } from './alc-header-action.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Header Action',
  name: 'Header Action',
  component: 'alc-header-action',
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'icon-name': 'search',
    // 'url': ,
    // 'variant': ,
  },
  render: (args) => (`
<div style="background-color: #40807e; padding: var(--alc-spacing-06);">
  <alc-header-action ${renderArgs(argTypes, args)}>Buscar</alc-header-action>
</div>
  `)
};

export const Link = {
  name: 'Link',
  args: {
    ...defaultArgs,
    'icon-name': 'envelope',
    'url': '#',
    'variant': 'link',
  },
  render: (args) => (`
<div style="background-color: #40807e; padding: var(--alc-spacing-06);">
  <alc-header-action ${renderArgs(argTypes, args)}>Contato</alc-header-action>
</div>
  `)
};