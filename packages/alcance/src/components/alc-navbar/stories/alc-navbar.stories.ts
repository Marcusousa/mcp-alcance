// @ts-ignore
import { argTypes } from './alc-navbar.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Navbar',
  name: 'Navbar',
  component: 'alc-navbar',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-navbar ${renderArgs(argTypes, args)}>
  <ul>
    <li><a href="#">Temporadas</a></li>
    <li><a href="#">Personagens</a></li>
    <li><a href="#">Ambientação</a></li>
  </ul>
</alc-navbar>
  `)
};

export const Completo = {
  name: 'Completo',
  parameters: {
    docs: {
      story: { height: '24rem' },
    },
  },
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-navbar ${renderArgs(argTypes, args)}>
  <ul>
    <li>
      <span>
        Thundercats
      </span>
      <alc-nav>
        <ul>
          <li><a href="#">Lion-O</a></li>
          <li><a href="#">Panthro</a></li>
          <li><a href="#">Tygra</a></li>
          <li><a href="#">Cheetara</a></li>
        </ul>
      </alc-nav>
    </li>

    <li>
      <span>
        Vilões
      </span>
      <alc-nav>
        <ul>
          <li><a href="#">Mumm-Ra</a></li>
          <li><a href="#">Abutre</a></li>
          <li><a href="#">Chacal</a></li>
          <li><a href="#">Escamoso</a></li>
          <li><a href="#">Simiano</a></li>
        </ul>
      </alc-nav>
    </li>

    <li>
      <span>
        Objetos
      </span>
      <alc-nav>
        <ul>
          <li>
            <span>
              Místicos
            </span>
            <div data-alc-panel>
              <ul>
                <li><a href="#">Espada Justiceira</a></li>
                <li><a href="#">Olho de Thundera</a></li>
              </ul>
            </div>
          </li>
          <li>
            <span>
              Veículos
            </span>
            <div data-alc-panel>
              <ul>
                <li><a href="#">ThunderTank</a></li>
                <li><a href="#">HoverCat</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </alc-nav>
    </li>

    <li><a href="#">História</a></li>
  </ul>
</alc-navbar>
  `)
};

export const Header = {
  name: 'Junto ao Header',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-header name="Third Earth" description="Thundercats Technology" home-url="#"></alc-header>
<alc-navbar ${renderArgs(argTypes, args)}>
  <ul>
    <li><a href="#">Temporadas</a></li>
    <li><a href="#">Personagens</a></li>
    <li><a href="#">Ambientação</a></li>
  </ul>
</alc-navbar>
  `)
};


