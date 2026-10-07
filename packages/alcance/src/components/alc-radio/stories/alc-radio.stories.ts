// @ts-ignore
import { argTypes } from './alc-radio.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Radio',
  name: 'Radio',
  component: 'alc-radio',
  parameters: {},
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-radio label="Lion-O" ${renderArgs(argTypes, args)}>
  <input type="radio" name="personagem"/>
</alc-radio>
  `)
};

export const BasicoComSlot = {
  name: 'Básico com slot',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-radio ${renderArgs(argTypes, args)}>
  <input type="radio" id="radio-example-slot" name="personagem"/>
  <label slot="label" for="radio-example-slot">Tygra</label>
</alc-radio>
  `)
};

export const TextoAjuda = {
  name: 'Texto de ajuda',
  args: {
    ...defaultArgs,
    'hint': 'Não é possível selecionar apenas um deles.',
    'label': 'WilyKit e WilyKat',
  },
  render: (args) => (`
<alc-radio ${renderArgs(argTypes, args)}>
  <input type="radio" name="personagem" />
</alc-radio>
  `)
};

export const Erro = {
  name: 'Texto de erro',
  args: {
    ...defaultArgs,
    'error-msg': 'Você precisa selecionar para prosseguir.',
    'label': 'Panthro',
  },
  render: (args) => (`
<alc-radio ${renderArgs(argTypes, args)}>
  <input type="radio" name="personagem" />
</alc-radio>
  `)
};

export const Desabilitado = {
  name: 'Desabilitado',
  args: {
    ...defaultArgs,
    'label': 'Mumm-Ra',
  },
  render: (args) => (`
<alc-radio ${renderArgs(argTypes, args)}>
  <input type="radio" name="personagem" disabled />
</alc-radio>
  `)
};