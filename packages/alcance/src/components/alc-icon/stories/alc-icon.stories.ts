// @ts-ignore
import { argTypes } from './alc-icon.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';
import gameSVG from './assets/game.svg'

export default {
  title: 'Componentes/Icon',
  name: 'Icon',
  component: 'alc-icon',
  parameters: {},
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'label': 'ícone de coração',
    'name': 'heart',
  },
  render: (args) => (`
    <alc-icon ${renderArgs(argTypes, args)}></alc-icon>
  `)
};

export const Customizado = {
  name: 'Customizado',
  args: {
    ...defaultArgs,
    'label': 'Ícone de video game',
    'src': gameSVG,
  },
  render: args => `
    <alc-icon ${renderArgs(argTypes, args)}></alc-icon>
  `,
};
