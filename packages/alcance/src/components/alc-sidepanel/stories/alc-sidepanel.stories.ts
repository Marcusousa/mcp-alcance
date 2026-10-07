// @ts-ignore
import { argTypes } from './alc-sidepanel.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';
import './alc-sidepanel.css';

export default {
  title: 'Componentes/Sidepanel',
  name: 'Sidepanel',
  component: 'alc-sidepanel',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['descontinuado'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
  },
  render: args => `
<div class="sidepanel-example-container">
  <alc-header-v1 name="Alcance" home-url="#"></alc-header-v1>

  <div class="alc-layout">
    <alc-sidepanel ${renderArgs(argTypes, args)}>
      <alc-nav>
        <ul>
          <li><a href="#">Item 1</a></li>
          <li><a href="#">Item 2</a></li>
          <li><a href="#">Item 3</a></li>
        </ul>
      </alc-nav>
    </alc-sidepanel>

    <div class="alc-layout__content">
      <div class="container">
        <h1>Título da página</h1>
        <alc-alert dismissible="false">
          Experimente fazer o resize para ver na versão mobile!
        </alc-alert>
      </div>
    </div>
  </div>
</div>
  `,
};