// @ts-ignore
import { argTypes } from './alc-field.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';
import { styles } from './alc-field-styles.js'

export default {
  title: 'Componentes/Field',
  name: 'Field',
  component: 'alc-field',
  // parameters: {
  //   design: {
  //     type: 'figma',
  //     url: 'https://www.figma.com/design/CmLe03rQGdTBW2CZcxjvnF/Alcance?node-id=9329-1670&t=cjYv9irPRwmVU6UP-4'
  //   }
  // },
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'label': 'Nome',
  },
  // parameters: {
  //   design: {
  //     type: 'figma',
  //     url: 'https://www.figma.com/proto/CmLe03rQGdTBW2CZcxjvnF/Alcance?node-id=9329-1670&t=7S4L3iPPbIecy0Mi-0&scaling=min-zoom&content-scaling=fixed&page-id=8388%3A1727'
  //   }
  // },
  render: args => `
<alc-field ${renderArgs(argTypes, args)}>
  <input type="text"/>
</alc-field>
  `,
};

export const Obrigatorio = {
  name: 'Input Obrigatório',
  args: {
    ...defaultArgs,
    'label': 'Mensagem',
    'required': true,
  },
  render: args => `
<alc-field ${renderArgs(argTypes, args)}>
  <textarea name="msg" rows="4" cols="50"></textarea>
</alc-field>
  `,
};

export const TextoAjuda = {
  name: 'Input com texto de ajuda',
  args: {
    ...defaultArgs,
    'hint': 'Unidade da Federação',
    'label': 'UF',
  },
  // parameters: {
  //   design: {
  //     type: 'figspec',
  //     url: 'https://www.figma.com/design/CmLe03rQGdTBW2CZcxjvnF/Alcance?node-id=9329-3573&t=7S4L3iPPbIecy0Mi-4'
  //   }
  // },
  render: args => `
<alc-field ${renderArgs(argTypes, args)}>
  <select name="uf">
    <option value="" selected>
      (Selecione)
    </option>
    <option value="AC">Acre</option>
    <option value="DF">Distrito Federal</option>
  </select>
</alc-field>
  `,
};

export const Erro = {
  name: 'Input com error',
  args: {
    ...defaultArgs,
    'error-msg': 'Esse apelido ja existe.',
    'label': 'Apelido',
  },
  render: args => `
<alc-field ${renderArgs(argTypes, args)}>
  <input type="text"/>
</alc-field>
  `,
};

export const Desabilitado = {
  name: 'Input desabilitado',
  args: {
    ...defaultArgs,
    'label': 'Nome',
  },
  render: args => `
<alc-field ${renderArgs(argTypes, args)}>
  <input type="text" disabled />
</alc-field>
  `,
};

export const FormularioInline = {
  name: 'Formulário inline',
  args: {
    ...defaultArgs,
    'hint': 'Nome completo',
    'required': true,
  },
  render: args => `
<div class="inline-field-example">
  <alc-field ${renderArgs(argTypes, args)}>
    <div slot="label" class="inline-field-example__label">
      <label name="label" for="inline-nome">Nome</label>
    </div>
    <input type="text" name="nome" id="inline-nome" />
  </alc-field>
</div>

<style>
${styles.inlineField}
</style>
`,
};

export const FormularioComIcone = {
  name: 'Formulário com ícone',
  args: {
    ...defaultArgs,
    'hint': 'Endereço',
  },
  render: args => `
<alc-field ${renderArgs(argTypes, args)}>
  <div slot="label">
    <label name="label" for="example-with-icon">
      <alc-icon 
        name="envelope" 
        label=""
        class="inline-field-example__icon"
      ></alc-icon>
      Endereço
    </label>
  </div>
  <input type="text" name="endereco" id="example-with-icon" />
</alc-field>

<style>
${styles.labelIcon}
</style>
`,
};