// @ts-ignore
import { argTypes } from './alc-user-menu.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/User Menu',
  name: 'User Menu',
  component: 'alc-user-menu',
  argTypes: argTypes,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        // Para definir uma altura no espaço reservado ao exemplo,
        // já que o componente em si não tem uma altura inicial
        height: '15rem',
      },
    },
  },
};

const defaultArgs = getDefaultArgs(argTypes);
const bgStyle = 'background-color: var(--alc-color-layer-a); padding: var(--alc-spacing-06);';

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    // 'img-src': ,
    'logout-url': '#',
    // 'name': ,
    // 'registration-number': ,
    // 'role': ,
    // 'variation': ,
  },
  render: (args) => (`
<div style="${bgStyle}">
  <alc-user-menu ${renderArgs(argTypes, args)}></alc-user-menu>
</div>
  `)
};

export const Completo = {
  name: 'Completo',
  args: {
    ...defaultArgs,
    'img-src': 'https://static.wikia.nocookie.net/thundercats/images/c/c2/LionOFromThunderCats1985SeriesEpisodeTroubleWithTimeSc01.jpg',
    'logout-url': '#',
    'name': 'Lion-O',
    'registration-number': 'P_0001',
    // 'role': ,
    // 'variation': ,
  },
  render: (args) => (`
<div style="${bgStyle}">
  <alc-user-menu ${renderArgs(argTypes, args)}></alc-user-menu>
</div>
  `)
};

export const Slot = {
  name: 'Usando Slot',
  args: {
    ...defaultArgs,
    'img-src': 'https://static.wikia.nocookie.net/thundercats/images/c/c2/LionOFromThunderCats1985SeriesEpisodeTroubleWithTimeSc01.jpg',
    'logout-url': '#',
    'name': 'Lion-O',
    'registration-number': 'P_0001',
    // 'role': ,
    // 'variation': ,
  },
  render: (args) => (`
<div style="${bgStyle}">
  <alc-user-menu ${renderArgs(argTypes, args)}>
    Third Earth - Setor 4
  </alc-user-menu>
</div>
  `)
};
