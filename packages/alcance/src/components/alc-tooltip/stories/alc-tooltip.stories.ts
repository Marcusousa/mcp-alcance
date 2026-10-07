// @ts-ignore
import { argTypes } from './alc-tooltip.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';
import './alc-tooltip.css';

export default {
  title: 'Componentes Alfa/Tooltip',
  name: 'Tooltip',
  component: 'alc-tooltip',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    // 'active': ,
    'content': 'Isto é um tooltip',
    // 'placement': ,
    // 'strategy': ,
    // 'trigger': ,
  },
  render: (args) => (`
<div class="example-basic__container">
  <alc-tooltip ${renderArgs(argTypes, args)}>
    <button slot="trigger" class="alc-button alc-button--secondary">Clique ou foque aqui</button>
  </alc-tooltip>
</div>
  `)
};

export const Placement = {
  name: 'Posição',
  args: {
    ...defaultArgs,
    // 'active': ,
    // 'content': ,
    'placement': 'right',
    // 'strategy': ,
    // 'trigger': ,
  },
  render: (args) => (`
<div class="example-placement__container">
  <alc-tooltip ${renderArgs(argTypes, args)}>
    <button slot="trigger" class="alc-button alc-button--secondary">Clique ou foque aqui</button>
    <p>${args['placement']}</p>
  </alc-tooltip>
</div>

  `)
};

export const Click = {
  name: 'Click',
  args: {
    ...defaultArgs,
    // 'active': ,
    'content': 'Isto é um tooltip',
    // 'placement': ,
    // 'strategy': ,
    'trigger': 'click',
  },
  render: (args) => (`
<div class="example-basic__container">
  <alc-tooltip ${renderArgs(argTypes, args)}>
    <button slot="trigger" class="alc-button alc-button--secondary">Clique aqui</button>
  </alc-tooltip>
</div>
  `)
};

export const Manual = {
  name: 'Manual',
  args: {
    ...defaultArgs,
    // 'active': ,
    'content': 'Coração',
    // 'placement': ,
    // 'strategy': ,
    'trigger': 'manual',
  },
  render: (args) => (`
<div class="example-basic__container">
  <button class="alc-button alc-button--secondary" onclick="openTooltip()">Clique aqui</button>

  <alc-tooltip ${renderArgs(argTypes, args)} id="tooltip-manual">
    <alc-icon name="heart" label="" slot="trigger"></alc-icon>
  </alc-tooltip>
</div>

<script>
  async function openTooltip() {
    const tooltip = document.querySelector('#tooltip-manual');
    tooltip.active ? await tooltip.hide() : await tooltip.show();
  }
</script>
  `)
};

export const HTML = {
  name: 'Usando HTML no tooltip (Slot)',
  args: {
    ...defaultArgs,
    // 'active': ,
    // 'content': ,
    // 'placement': ,
    // 'strategy': ,
    // 'trigger': ,
  },
  render: (args) => (`
<div class="example-basic__container">
  <alc-tooltip ${renderArgs(argTypes, args)}>
    <button slot="trigger" class="alc-button alc-button--secondary">Clique ou foque aqui</button>
    <p>Utilizando <strong>html</strong> no tooltip</p>
  </alc-tooltip>
</div>
  `)
};

export const Strategy = {
  name: 'Estratégia de posicionamento',
  args: {
    ...defaultArgs,
    'active': 'true',
    'content': 'Fixed',
    // 'placement': ,
    'strategy': 'fixed',
    'trigger': 'click',
  },
  render: (args) => (`
<div class="example-strategy__container">
  <alc-tooltip ${renderArgs(argTypes, args)}>
    <button slot="trigger" class="alc-button alc-button--secondary">Fixed</button>
  </alc-tooltip>
  <alc-tooltip content="Absolute" active="true" trigger="click">
    <button slot="trigger" class="alc-button alc-button--secondary">Absolute</button>
  </alc-tooltip>
</div>
  `)
};