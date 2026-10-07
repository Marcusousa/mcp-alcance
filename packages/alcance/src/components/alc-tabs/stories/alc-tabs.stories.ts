// @ts-ignore
import { argTypes } from './alc-tabs.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Tabs',
  name: 'Tabs',
  component: 'alc-tabs',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: args => `
<alc-tabs ${renderArgs(argTypes, args)}>
  <alc-tab-button slot="button" tab="tab-1">Lion-O</alc-tab-button>
  <alc-tab-button slot="button" tab="tab-2">Panthro</alc-tab-button>
  <alc-tab-button slot="button" tab="tab-3">Cheetara</alc-tab-button>

  <alc-tab tab="tab-1">
    <p>
      É o líder dos ThunderCats que moram no terceiro mundo e lutam pela ordem e justiça.
      Criado pelo desenhista Ted Wolf para a Telepictures Corporation.
      No Brasil foi dublado por Newton da Matta.
    </p>
  </alc-tab>

  <alc-tab tab="tab-2">
    <p>
      É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana.
      Panthro é o que possui a maior força física no grupo e é mestre em artes marciais,
      além de ser também especialista em mecânica e tecnologia avançada.
    </p>
  </alc-tab>

  <alc-tab tab="tab-3">
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
