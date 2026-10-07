// @ts-ignore
import { argTypes } from './alc-alert.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Alert',
  name: 'Alert',
  component: 'alc-alert',
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
<alc-alert ${renderArgs(argTypes, args)}>O alert mais simples possível, sem alterações nas propriedades.</alc-alert>
  `,
};


export const Sumario = {
  name: 'Usando o sumário',
  args: {
    ...defaultArgs,
    'dismissible': false,
    'type': 'warning',
    // 'visible': ,
  },
  render: args => `
<alc-alert ${renderArgs(argTypes, args)}>
  <span slot="summary">Prazo encerrado</span>
  O prazo para as inscrições foi encerrado no dia 26/01/2022.
</alc-alert>
  `,
};
