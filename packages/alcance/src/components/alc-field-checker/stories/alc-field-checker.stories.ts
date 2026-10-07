// @ts-ignore
import { argTypes } from './alc-field-checker.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Field Checker',
  name: 'Field Checker',
  component: 'alc-field-checker',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'check-on-submit': false,
  },
  render: args => `
<alc-field-checker ${renderArgs(argTypes, args)}>
  <form onsubmit="event.preventDefault()">
    <div class="row">
      <div class="col-12">
        <alc-field label="Nome Completo" error-msg="O campo é obrigatório" style="margin-bottom: var(--alc-spacing-06)" required="true">
          <input id="bnome" type="text"/>
        </alc-field>

        <alc-field label="E-mail" error-msg="Email inválido" style="margin-bottom: var(--alc-spacing-06)" required="true">
          <input id="bemail" type="email"/>
        </alc-field>

        <div style="display: flex; gap: var(--alc-spacing-03);">
            <button class="alc-button">Enviar</button>
        </div>
      </div>
    </div>
  </form>
</alc-field-checker>
  `,
};

export const OnSubmit = {
  name: 'Quando Submetido',
  args: {
    ...defaultArgs,
    'check-on-submit': true,
  },
  render: args => `
<alc-field-checker ${renderArgs(argTypes, args)}>
  <form id="example-form">
    <div class="row">
      <div class="col-12">
        <alc-field label="Nome Completo" style="margin-bottom: var(--alc-spacing-06)" required="true">
          <input id="snome" type="text"/>
        </alc-field>

        <alc-field label="E-mail" style="margin-bottom: var(--alc-spacing-06)" required="true">
          <input id="semail" type="email"/>
        </alc-field>

        <alc-checkbox style="margin-bottom: var(--alc-spacing-08)" hint="Você precisa aceitar os termos de uso antes de continuar." required="true">
            <input id="stermos" type="checkbox" name="termos"/>
            <label slot="label">Você aceita os <a class="alc-link" href="#">termos de uso?</a></label>
        </alc-checkbox>
        <div style="display: flex; gap: var(--alc-spacing-03);">
            <button type="submit" class="alc-button" onclick="checkFields()">Enviar</button>
        </div>
      </div>
    </div>
  </form>
</alc-field-checker>

<script>
  function checkFields() {
    const nomeInput = document.getElementById('snome');
    const emailInput = document.getElementById('semail');
    const termosInput = document.getElementById('stermos');
    
    if (!nomeInput.value) {
      nomeInput.closest('alc-field').setAttribute('error-msg', 'O campo é obrigatório');
    }
    
    if (!emailInput.value || !emailInput.checkValidity()) {
      emailInput.closest('alc-field').setAttribute('error-msg', 'Email inválido');
    }
    if (!termosInput.checked) {
      termosInput.closest('alc-checkbox').setAttribute('error-msg', 'Você deve aceitar os termos');
    }
  };
</script>
  `,
};
