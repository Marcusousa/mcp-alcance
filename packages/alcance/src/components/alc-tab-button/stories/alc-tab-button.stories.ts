// @ts-ignore
import { argTypes } from './alc-tab-button.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Tab Button',
  name: 'Tab Button',
  component: 'alc-tab-button',
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
    // 'selected': ,
    'tab': 'tab-1',
  },
  render: args => `
<alc-tabs>
  <alc-tab-button slot="button" ${renderArgs(argTypes, args)}>Lion-O</alc-tab-button>
  <alc-tab label="Lion-O" tab="tab-1">
    <p>
      É o líder dos ThunderCats que moram no terceiro mundo e lutam pela ordem e justiça.
      Criado pelo desenhista Ted Wolf para a Telepictures Corporation.
      No Brasil foi dublado por Newton da Matta.
    </p>
  </alc-tab>
</alc-tabs>
  `,
};

export const Selecionado = {
  name: 'Selecionado',
  args: {
    ...defaultArgs,
    'selected': true,
    'tab': 'tab-2',
  },
  render: args => `
<alc-tabs ${args.selected ? `selected="${args.tab}"` : ''}>
  <alc-tab-button slot="button" tab='tab-1' ${args.tab === 'tab-1' ? 'selected="true"' : ''}>Lion-O</alc-tab-button>
  <alc-tab-button slot="button" tab='tab-2' ${args.tab === 'tab-2' ? 'selected="true"' : ''}>Panthro</alc-tab-button>
  <alc-tab-button slot="button" tab='tab-3' ${args.tab === 'tab-3' ? 'selected="true"' : ''}>Cheetara</alc-tab-button>
  
  <alc-tab label="Lion-O" tab="tab-1" ${args.tab === 'tab-1' ? 'selected="true"' : ''}>
    <p>
      É o líder dos ThunderCats que moram no terceiro mundo e lutam pela ordem e justiça.
      Criado pelo desenhista Ted Wolf para a Telepictures Corporation.
      No Brasil foi dublado por Newton da Matta.
    </p>
  </alc-tab>
  <alc-tab label="Panthro" tab="tab-2" ${args.tab === 'tab-2' ? 'selected="true"' : ''}>
    <p>
      É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana.
      Panthro é o que possui a maior força física no grupo e é mestre em artes marciais,
      além de ser também especialista em mecânica e tecnologia avançada.
    </p>
  </alc-tab>
  <alc-tab label="Cheetara" tab="tab-3" ${args.tab === 'tab-3' ? 'selected="true"' : ''}>
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
