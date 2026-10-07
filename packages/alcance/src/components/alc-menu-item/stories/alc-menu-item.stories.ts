// @ts-ignore
import { argTypes } from './alc-menu-item.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Menu Item',
  name: 'Menu Item',
  component: 'alc-menu-item',
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
    // 'checked': ,
    // 'disabled': ,
    // 'type': ,
    'value': "visao",
  },
  render: args => `
<alc-menu>
    <alc-menu-item ${renderArgs(argTypes, args)}>
        Visão além do alcance
    </alc-menu-item>
    <alc-menu-item value="sinal">
        Disparar sinal do Olho de Thundera
    </alc-menu-item>
    <alc-menu-item value="desativar">
        Desativar
    </alc-menu-item>
</alc-menu>
  `,
};

export const Radio = {
  name: 'Radio',
  args: {
    ...defaultArgs,
    'checked': true,
    // 'disabled': ,
    'type': "radio",
    'value': "eco",
  },
  render: args => `
<alc-menu>
    <alc-menu-item ${renderArgs(argTypes, args)}>
        Economia de energia
    </alc-menu-item>
    <alc-menu-item value="padrao" type="radio">
        Equilíbrio energético
    </alc-menu-item>
    <alc-menu-item value="total" type="radio">
        Potência total
    </alc-menu-item>
</alc-menu>
  `,
};

export const Checkbox = {
  name: 'Checkbox',
  args: {
    ...defaultArgs,
    'checked': true,
    // 'disabled': ,
    'type': "checkbox",
    'value': "camuflagem",
  },
  render: args => `
<alc-menu>
    <alc-menu-item ${renderArgs(argTypes, args)}>
        Sistema de camuflagem
    </alc-menu-item>
    <alc-menu-item value="escudos" type="checkbox">
        Escudos de proteção
    </alc-menu-item>
    <alc-menu-item value="luzes" type="checkbox" checked>
        Luzes de navegação
    </alc-menu-item>
    <alc-menu-item value="alerta" type="checkbox">
        Alerta sonoro
    </alc-menu-item>
</alc-menu>
  `,
};