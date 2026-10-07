// @ts-ignore
import { argTypes } from './alc-header.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Header',
  name: 'Header',
  component: 'alc-header',
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

export const Basico = {
  name: 'Básico',
  parameters: {
    docs: {
      story: { height: '13rem' },
    },
  },
  args: {
    ...defaultArgs,
    'home-url': '/',
    'name': 'HoverCat Monitor',
  },
  render: (args) => (`
<alc-header ${renderArgs(argTypes, args)}>
  <alc-environment-label env="prototype"></alc-environment-label>
  <alc-skip-link anchor='main-content'>conteúdo principal</alc-skip-link>
    <div slot="user">
      <alc-user-menu name="Tygra a'Latus" registration-number="P_0000"
        img-src="https://static.wikia.nocookie.net/thundercatslair/images/0/05/Tygra2.jpg">
      </alc-user-menu>
    </div>
</alc-header>
  `),
};

export const Versao = {
  name: 'Versão do sistema',
  parameters: {
    docs: {
      story: { height: '22rem' },
    },
  },
  args: {
    ...defaultArgs,
    'home-url': '/',
    'name': 'HoverCat Monitor',
    'version': '2.0.1',
  },
  render: function Render(args) {
    return `
<alc-header ${renderArgs(argTypes, args)}>
  <alc-environment-label env="prototype"></alc-environment-label>
  <alc-skip-link anchor='main-content'>conteúdo principal</alc-skip-link>
    <div slot="user">
      <alc-user-menu name="Tygra a'Latus" registration-number="P_0000"
        img-src="https://static.wikia.nocookie.net/thundercatslair/images/0/05/Tygra2.jpg">
      </alc-user-menu>
    </div>
</alc-header>`
  }
};

export const Completo = {
  name: 'Completo',
  parameters: {
    docs: {
      story: { height: '20rem' },
    },
  },
  args: {
    ...defaultArgs,
    'description': 'Thundercats Technology',
    'home-url': '/',
    'name': 'HoverCat Monitor',
  },
  render: (args) => (`
<style>
  .example { padding: var(--alc-spacing-04); }
</style>
<alc-header ${renderArgs(argTypes, args)}>
  <alc-environment-label env="prototype"></alc-environment-label>
  <alc-skip-link anchor='main-content'>conteúdo principal</alc-skip-link>
    <div slot="support">
      <alc-header-action icon-name="question-circle" variant="button">Ajuda</alc-header-action>
      <alc-header-action icon-name="envelope" url="/contato" variant="link">Contato</alc-header-action>
    </div>
    <div slot="fixed">
      <alc-dropdown>
        <alc-header-notifications
          slot="trigger"
          notifications="2"
        ></alc-header-notifications>
        <div class="example">
          <p>
            O Alcance não define como exibir detalhes de notificações.
            Pode ser usando um dropdown, "Notificações" pode ser um link para uma outra página,
            ou outra forma adequada ao contexto de uso.
          </p>
        </div>
      </alc-dropdown>
    </div>
    <div slot="user">
      <alc-user-menu name="Tygra a'Latus" registration-number="P_0000"
        img-src="https://static.wikia.nocookie.net/thundercatslair/images/0/05/Tygra2.jpg">
        Revisor
      </alc-user-menu>
    </div>
</alc-header>
  `)
};