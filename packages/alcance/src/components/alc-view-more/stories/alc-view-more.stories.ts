// @ts-ignore
import { argTypes } from './alc-view-more.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/View More',
  name: 'View More',
  component: 'alc-view-more',
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
    // 'bg-color-var': ,
    'min-height': '100px',
    // 'text-class': ,
    // 'toggle-position': ,
    'toggle-text-close': 'Ocultar',
    'toggle-text-open': 'Veja mais...',
  },
  render: args => `
<alc-view-more ${renderArgs(argTypes, args)}>
  <p>
  ThunderCats conta as aventuras de um grupo de felinos sobreviventes do planeta Thundera.
  O primeiro episódio da série começa com a destruição de Thundera, forçando os ThunderCats
  (uma espécie de nobreza Thunderiana) a fugir de seu planeta natal. A frota é atacada pelos
  inimigos dos Thunderianos, os mutantes de Plun-Darr, que destruíram todas as naves da frota
  Thunderiana, exceto a nave-mãe, na esperança de capturar a lendária Espada Justiceira que
  eles acreditam estar a bordo desta. A espada possui o Olho Místico de Thundera, a fonte do
  poder dos ThunderCats, encrustado na empunhadura. Embora os Mutantes tenham causado danos à
  nave-mãe, o velho guardião de Lion-O, Jaga, se oferece para pilotar a nave e levá-los em
  segurança ao "Terceiro Mundo". No entanto, Jaga morre no processo porque a viagem leva
  várias décadas, apesar da tecnologia avançada da nave interestelar. Entre os personagens
  principais estão o jovem lorde dos ThunderCats, Lion-O, e os ThunderCats Cheetara, Panthro,
  Tygra, WilyKit, WilyKat e Snarf.
  </p>
  <p>
  Quando os ThunderCats acordam de seu estado de animação suspensa no Terceiro Mundo, Lion-O
  descobre que sua cápsula de suspensão não conseguiu inibir o seu envelhecimento. Ele agora
  é uma criança no corpo de um homem. Juntos, os Thundercats e os nativos amigáveis do
  Terceiro Mundo constroem a "Toca dos Gatos", sua nova casa e sede, mas em pouco tempo, os
  Mutantes chegam ao Terceiro Mundo. Além disso, a chegada das duas raças alienígenas ao
  Terceiro Mundo não passa despercebida: Ao tomar conhecimento do Olho de Thundera, o
  feiticeiro demoníaco mumificado, do Terceiro Mundo, chamado Mumm-Ra recruta os mutantes
  para ajudá-lo a adquirir o Olho de Thundera e destruir os ThunderCats, para que possa
  continuar exercendo seu controle maligno sobre o planeta.
  </p>
</alc-view-more>
  `,
};
