// @ts-ignore
import { argTypes } from './alc-sort-indicator.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Sort Indicator',
  name: 'Sort Indicator',
  component: 'alc-sort-indicator',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// Exemplo Básico
export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    sorting: 'none', // Sem ordenação
  },
  render: args => `
    <alc-sort-indicator ${renderArgs(argTypes, args)}></alc-sort-indicator>
  `,
};

// Exemplo Ascendente
export const Ascendente = {
  name: 'Ascendente',
  args: {
    ...defaultArgs,
    sorting: 'asc', // Ordenação ascendente
  },
  render: args => `
    <alc-sort-indicator ${renderArgs(argTypes, args)}></alc-sort-indicator>
  `,
};

// Exemplo Descendente
export const Descendente = {
  name: 'Descendente',
  args: {
    ...defaultArgs,
    sorting: 'desc', // Ordenação descendente
  },
  render: args => `
    <alc-sort-indicator ${renderArgs(argTypes, args)}></alc-sort-indicator>
  `,
};