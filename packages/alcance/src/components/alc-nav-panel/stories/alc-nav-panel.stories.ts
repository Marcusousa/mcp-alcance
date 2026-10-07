// @ts-ignore
import { argTypes } from './alc-nav-panel.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Nav Panel',
  name: 'Nav Panel',
  component: 'alc-nav-panel',
  argTypes: {
    ...argTypes,
    open: {
      // Essa opção não renderiza o controle "open" no Storybook
      control: false,
    }
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        // Para definir uma altura no espaço reservado ao exemplo,
        // já que o componente em si não tem uma altura inicial
        height: '20rem',
      },
    },
  },
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-nav-panel ${renderArgs(argTypes, args)}>
  <alc-nav>
    <ul>
      <li><a href="#">Base de operação</a></li>
      <li>
        <span>Salão dos ThunderCats</span>
        <div data-alc-panel>
          <ul>
            <li><a href="#">Lion-O</a></li>
            <li><a href="#">Cheetara</a></li>
            <li><a href="#">Panthro</a></li>
            <li><a href="#">Tygra</a></li>
            <li><a href="#">WilyKit & WilyKat</a></li>
            <li><a href="#">Snarf</a></li>
          </ul>
        </div>
      </li>
      <li><a href="#">Biblioteca de Thundera</a></li>
      <li><a href="#">Sala de Batalhas</a></li>
    </ul>
  </alc-nav>
</alc-nav-panel>
  `)
};
