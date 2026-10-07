// @ts-ignore
import { argTypes } from './alc-header-notifications.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Header Notifications',
  name: 'Header Notifications',
  component: 'alc-header-notifications',
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'notifications': 10,
    // 'url': ,
    // 'variant': ,
  },
  render: (args) => (`
<div style="background-color: #40807e; padding: 2rem;">
  <alc-header-notifications ${renderArgs(argTypes, args)}></alc-header-notifications>
</div>
  `)
};

export const Link = {
  name: 'Link',
  args: {
    ...defaultArgs,
    'notifications': 10,
    'url': 'https://www.google.com.br',
    'variant': 'link',
  },
  render: (args) => (`
<div style="background-color: #40807e; padding: 2rem;">
  <alc-header-notifications ${renderArgs(argTypes, args)}></alc-header-notifications>
</div>
  `)
};

export const ExceedsValue = {
  name: 'Número mínimo e máximo de notificações',
  args: {
    ...defaultArgs,
    'notifications': 100,
    // 'url': ,
    // 'variant': ,
  },
  render: (args) => (`
<div style="background-color: #40807e; padding: 2rem;">
  <alc-header-notifications notifications="0"></alc-header-notifications>
  <alc-header-notifications ${renderArgs(argTypes, args)}></alc-header-notifications>
</div>
  `)
};


export const Dropdown = {
  name: 'Uso com Dropdown',
  args: {
    ...defaultArgs,
    'notifications': 2,
    // 'url': ,
    // 'variant': ,
  },
  render: (args) => (`
<div style="background-color: #40807e; padding: var(--alc-spacing-07);">
  <alc-dropdown>
    <alc-header-notifications ${renderArgs(argTypes, args)} slot="trigger"></alc-header-notifications>
    <ul>
      <li style="border-bottom: 1px solid var(--alc-color-border); padding: var(--alc-spacing-02) var(--alc-spacing-04);">Lion-O: “ThunderCats, avante! Nova missão detectada nas redondezas de Thundera.” </li>
      <li style="padding: var(--alc-spacing-02) var(--alc-spacing-04);">Cheetara: “Recebi uma visão! Temos pouco tempo, preparem-se!” </li>
    </ul>
  </alc-dropdown>
</div>
  `)
};

