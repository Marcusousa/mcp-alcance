// @ts-ignore
import { argTypes } from './alc-tab.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Tab',
  name: 'Tab',
  component: 'alc-tab',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

// Exemplo Básico
export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    label: 'Lion-O',
    tab: 'tab-1',
    selected: true,
    'content-focus': false,
  },
  render: args => `
<alc-tabs>
  <alc-tab-button slot="button" tab="tab-1">Lion-O</alc-tab-button>
  <alc-tab ${renderArgs(argTypes, args)}>
    <p>
      É o líder dos ThunderCats que moram no terceiro mundo e lutam pela ordem e justiça.
      Criado pelo desenhista Ted Wolf para a Telepictures Corporation.
      No Brasil foi dublado por Newton da Matta.
    </p>
  </alc-tab>
</alc-tabs>
  `,
};

// Exemplo com Múltiplas Abas
export const MultiplasAbas = {
  name: 'Múltiplas Abas',
  args: {
    ...defaultArgs,
    label: 'Lion-O',
    tab: 'tab-1',
    selected: false,
    'content-focus': false,
  },
  render: args => `
<alc-tabs>
  <alc-tab-button slot="button" tab="tab-1">Lion-O</alc-tab-button>
  <alc-tab-button slot="button" tab="tab-2">Panthro</alc-tab-button>
  <alc-tab-button slot="button" tab="tab-3">Cheetara</alc-tab-button>
  <alc-tab ${renderArgs(argTypes, args)}>
    <p>
      É o líder dos ThunderCats que moram no terceiro mundo e lutam pela ordem e justiça.
      Criado pelo desenhista Ted Wolf para a Telepictures Corporation.
      No Brasil foi dublado por Newton da Matta.
    </p>
  </alc-tab>
  <alc-tab label="Panthro" tab="tab-2">
    <p>
      É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana.
      Panthro é o que possui a maior força física no grupo e é mestre em artes marciais,
      além de ser também especialista em mecânica e tecnologia avançada.
    </p>
  </alc-tab>
  <alc-tab label="Cheetara" tab="tab-3">
    <p>
      Representando a chita, Cheetara é uma guerreira destemida.
      Forte e decidida, não hesita em entrar em ação para combater os vilões.
      Sua habilidade de luta é impressionante mas sem dúvida seu grande poder consiste na velocidade inigualável,
      superior a qualquer veículo terrestre motorizado.
    </p>
  </alc-tab>
</alc-tabs>
  `,
};

// Exemplo com Foco no Conteúdo
export const ComFoco = {
  name: 'Com Foco',
  args: {
    ...defaultArgs,
    label: 'Lion-O',
    tab: 'tab-1',
    selected: true,
    'content-focus': true,
  },
  render: args => `
<alc-tabs>
  <alc-tab-button slot="button" tab="tab-1">Lion-O</alc-tab-button>
  <alc-tab-button slot="button" tab="tab-2">Panthro</alc-tab-button>
  <alc-tab ${renderArgs(argTypes, args)}>
    <p>
      É o líder dos ThunderCats que moram no terceiro mundo e lutam pela ordem e justiça.
      Criado pelo desenhista Ted Wolf para a Telepictures Corporation.
      No Brasil foi dublado por Newton da Matta.
    </p>
    <a class="alc-link" href="#">Saiba mais sobre ThunderCats</a>
  </alc-tab>
  <alc-tab label="Panthro" tab="tab-2">
    <p>
      É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana.
      Panthro é o que possui a maior força física no grupo e é mestre em artes marciais,
      além de ser também especialista em mecânica e tecnologia avançada.
    </p>
  </alc-tab>
</alc-tabs>
  `,
};
