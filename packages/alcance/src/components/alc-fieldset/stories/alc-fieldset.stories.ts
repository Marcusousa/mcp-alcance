// @ts-ignore
import { argTypes } from './alc-fieldset.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Fieldset',
  name: 'Fieldset',
  component: 'alc-fieldset',
  parameters: {},
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const BasicoComCheckbox = {
  name: 'Básico usando checkbox',
  args: {
    ...defaultArgs,
    'legend': 'Eu quero receber',
  },
  render: (args) => (`
<alc-fieldset ${renderArgs(argTypes, args)}>
  <div class="flex flex-col gap-2">
    <alc-checkbox label="Notícias da semana" >
      <input type="checkbox" />
    </alc-checkbox>
    <alc-checkbox label="Ofertas e promoções">
      <input type="checkbox" />
    </alc-checkbox>
    <alc-checkbox label="Atualizações">
      <input type="checkbox" />
    </alc-checkbox>
  </div>
</alc-fieldset>
  `)
};

export const BasicoComRadio = {
  name: 'Básico usando radio',
  args: {
    ...defaultArgs,
    'legend': 'Escolha um framework de sua preferência',
  },
  render: (args) => (`
<alc-fieldset ${renderArgs(argTypes, args)}>
  <div class="flex flex-col gap-2">
    <alc-radio label="React">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Angular">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Vue.js">
      <input type="radio" name="framework" />
    </alc-radio>
  </div>
</alc-fieldset>
  `)
};

export const Obrigatorio = {
  name: 'Obrigatório',
  args: {
    ...defaultArgs,
    'legend': 'Escolha um framework de sua preferência',
    'required': true,
  },
  render: (args) => (`
<alc-fieldset ${renderArgs(argTypes, args)}>
  <div class="flex flex-col gap-2">
    <alc-radio label="React">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Angular">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Vue.js">
      <input type="radio" name="framework" />
    </alc-radio>
  </div>
</alc-fieldset>
  `)
};

export const TextoAjuda = {
  name: 'Texto de ajuda',
  args: {
    ...defaultArgs,
    'hint': 'Escolha o framework de sua preferência',
    'legend': 'Framework',
  },
  render: (args) => (`
<alc-fieldset ${renderArgs(argTypes, args)}>
  <div class="flex flex-col gap-2">
    <alc-radio label="React">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Angular">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Vue.js">
      <input type="radio" name="framework" />
    </alc-radio>
  </div>
</alc-fieldset>
  `)
};

export const Erro = {
  name: 'Mensagem de erro',
  args: {
    ...defaultArgs,
    'error-msg': 'Precisa selecionar uma das opções',
    'legend': 'Escolha um framework de sua preferência',
  },
  render: (args) => (`
<alc-fieldset ${renderArgs(argTypes, args)}>
  <div class="flex flex-col gap-2">
    <alc-radio label="React">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Angular">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Vue.js">
      <input type="radio" name="framework" />
    </alc-radio>
  </div>
</alc-fieldset>
  `)
};

export const SemBorda = {
  name: 'Sem borda',
  args: {
    ...defaultArgs,
    'legend': 'Framework',
  },
  render: (args) => (`
<alc-fieldset ${renderArgs(argTypes, args)} class="sem-borda">
  <div class="flex flex-col gap-2">
    <alc-radio label="React">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Angular">
      <input type="radio" name="framework" />
    </alc-radio>
    <alc-radio label="Vue.js">
      <input type="radio" name="framework" />
    </alc-radio>
  </div>
</alc-fieldset>

<style>
  .sem-borda fieldset {
    border: none;
    padding-left: 0;
    padding-right: 0;
  }

  .sem-borda legend {
    padding: 0;
  }
</style>
  `)
};