// @ts-ignore
import { argTypes } from './alc-loading.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Loading',
  name: 'Loading',
  component: 'alc-loading',
  tags: ['alfa'],
  parameters: {
    docs: {
      story: {
        // Para definir uma altura no espaço reservado ao exemplo,
        // já que o componente em si não tem uma altura inicial
        height: '25rem',
      },
    },
  },
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// Story: Básico
export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'active': true,
  },
  render: (args) => (`
    <alc-loading ${renderArgs(argTypes, args)}></alc-loading>
  `)
};

// Story: Texto Customizado
export const TextoCustomizado = {
  name: 'Texto customizado',
  args: {
    ...defaultArgs,
    'active': true,
    'end-msg': 'Atualizado.',
    'label': 'Atualizando...',
  },
  render: (args) => (`
    <alc-loading ${renderArgs(argTypes, args)}></alc-loading>
  `)
};

// Story: Dentro de uma Região
export const Container = {
  name: 'Dentro de uma região',
  args: {
    ...defaultArgs,
    'active': true,
    'variant': 'container',
    'label': 'Processando...',
    'end-msg': 'Processo finalizado.',
  },
  render: (args) => (`
<div style="height: 10rem; position: relative; background-color: #f0f0f0;">
  <p>Conteúdo do container</p>
  <alc-loading ${renderArgs(argTypes, args)}></alc-loading>
</div>
  `)
};

// Story: Inline
export const Inline = {
  name: 'Inline',
  args: {
    ...defaultArgs,
    'active': true,
    'variant': 'inline',
    'label': 'Analisando...',
    'end-msg': 'Análise concluída.',
  },
  render: (args) => (`
<p>
  Estamos processando seus dados
  <p>
    <alc-loading ${renderArgs(argTypes, args)}></alc-loading>
  </p>
  Por favor, aguarde.
</p>
  `)
};

// Story: Dentro de um Botão
export const Button = {
  name: 'Dentro de um botão',
  args: {
    ...defaultArgs,
    'active': true,
    'variant': 'button',
    'label': 'Enviando...',
    'end-msg': 'Envio concluído.',
  },
  render: (args) => (`
<button class="alc-button">
  <alc-loading ${renderArgs(argTypes, args)}></alc-loading>
  Enviar
</button>
`)
};

// Story: Controlando o Loading
export const ControlandoLoading = {
  name: 'Controlando o Loading',
  args: {
    ...defaultArgs,
    'active': false,
    'label': 'Carregando dados...',
    'end-msg': 'Dados carregados.',
  },
  render: (args) => (`
<button class="alc-button" id="toggle-loading">Ativar/Desativar Loading</button>
  <alc-loading id="example-loading" ${renderArgs(argTypes, args)}></alc-loading>
<script>
  const loading1 = document.getElementById('example-loading');
  const toggleButton = document.getElementById('toggle-loading');
  toggleButton.addEventListener('click', () => {
    loading1.active = !loading1.active;
  });
</script>
  `)
};

// Story: Loading com Métodos show/hide
export const MetodosShowHide = {
  name: 'Métodos show/hide',
  args: {
    ...defaultArgs,
    'label': 'Carregando...',
    'end-msg': 'Concluído.',
  },
  render: (args) => (`
<button class="alc-button" id="start-loading">Iniciar Loading</button>
  <alc-loading id="loading-methods" ${renderArgs(argTypes, args)}></alc-loading>
<script>
  const loading2 = document.getElementById('loading-methods');
  const startButton = document.getElementById('start-loading');
    startButton.addEventListener('click', () => {
      loading2.show();
      setTimeout(() => {
        loading2.hide();
      }, 3000);
    });
</script>
`)
};