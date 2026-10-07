// @ts-ignore
import { argTypes } from './alc-table.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Table',
  name: 'Table',
  component: 'alc-table',
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
  },
  render: args => `
<alc-table${renderArgs(argTypes, args)}>
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
      <tr>
        <td>Data 3</td>
        <td>Data 4</td>
      </tr>
      <tr>
        <td>Data 5</td>
        <td>Data 6</td>
      </tr>
    </tbody>
  </table>
</alc-table>
  `,
};

export const Combinado = {
  name: 'Combinado',
  args: {
    ...defaultArgs,
  },
  render: args => {
    return `
<alc-table ${renderArgs(argTypes, args)}>
  <table id="sortable-table">
    <thead>
      <tr>
        <th id="name-header" style="vertical-align: middle; border-width: 1px; border-style: solid; position: relative; padding: 0.5rem; padding-right: 1.5rem;">
          Nome
          <span style="display: inline-flex; flex-direction: column; height: 1rem; font-size: 0.75rem; position: absolute; top: 0.5rem; right: 0.25rem; color: #b3b3b3;">
            <alc-sort-indicator data-column="name" sorting="none"></alc-sort-indicator>
          </span>
        </th>

        <th id="email-header" style="vertical-align: middle; border-width: 1px; border-style: solid; position: relative; padding: 0.5rem; padding-right: 1.5rem;">
          E-mail
          <span style="display: inline-flex; flex-direction: column; height: 1rem; font-size: 0.75rem; position: absolute; top: 0.5rem; right: 0.25rem; color: #b3b3b3;">
            <alc-sort-indicator data-column="email" sorting="none"></alc-sort-indicator>
          </span>
        </th>
      </tr>
    </thead>
    <tbody id="alc-table-body">
      <tr>
        <td>John Doe</td>
        <td>john.doe@mail.com</td>
      </tr>
      <tr>
        <td>Jane Smith</td>
        <td>jane.smith@mail.com</td>
      </tr>
      <tr>
        <td>Alice Johnson</td>
        <td>alice.johnson@mail.com</td>
      </tr>
    </tbody>
  </table>
</alc-table>
    `;
  },
};