// @ts-ignore
import { argTypes } from './alc-popup.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';
import './alc-popup.css'

export default {
  title: 'Componentes Alfa/Popup',
  name: 'Popup',
  component: 'alc-popup',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'active': true,
    // 'distance': ,
    // 'flip': ,
    // 'placement': ,
    // 'shift': ,
    // 'strategy': ,
  },
  render: args => `
<div class="popup-example__container">
  <alc-popup ${renderArgs(argTypes, args)} class="popup-example__popup">
    <div slot="anchor" class="popup-example__anchor">Anchor</div>
    <div class="popup-example__box">Popup</div>
  </alc-popup>
</div>
  `,
};

export const Placement = {
  name: 'Posição',
  args: {
    ...defaultArgs,
    'active': true,
    // 'distance': ,
    // 'flip': ,
    'placement': 'right',
    // 'shift': ,
    // 'strategy': ,
  },
  render: args => `
<div class="popup-example__container">
  <alc-popup ${renderArgs(argTypes, args)} class="popup-example__popup">
    <div slot="anchor" class="popup-example__anchor">Anchor</div>
    <div class="popup-example__box">Popup</div>
  </alc-popup>
</div>
  `,
};

export const Distance = {
  name: 'Distancia',
  args: {
    ...defaultArgs,
    'active': true,
    'distance': 5,
    // 'flip': ,
    // 'placement': ,
    // 'shift': ,
    // 'strategy': ,
  },
  render: args => `
<div class="popup-example__container">
  <alc-popup ${renderArgs(argTypes, args)} class="popup-example__popup">
    <div slot="anchor" class="popup-example__anchor">Anchor</div>
    <div class="popup-example__box">Popup</div>
  </alc-popup>
</div>
  `,
};

export const Flip = {
  name: 'Flip',
  args: {
    ...defaultArgs,
    'active': true,
    // 'distance': ,
    'flip': true,
    'placement': 'top',
    // 'shift': ,
    // 'strategy': ,
  },
  render: args => `
<div class="popup-example__container popup-example__container-scroll">
  <alc-popup ${renderArgs(argTypes, args)} class="popup-example__popup popup-example__popup-scroll-vertical">
    <div slot="anchor" class="popup-example__anchor">Anchor</div>
    <div class="popup-example__box">Popup</div>
  </alc-popup>
</div>
  `,
};

export const Shift = {
  name: 'Shift',
  args: {
    ...defaultArgs,
    'active': true,
    // 'distance': ,
    // 'flip': ,
    'placement': 'top',
    'shift': true,
    // 'strategy': ,
  },
  render: args => `
<div class="popup-example__container popup-example__container-scroll popup-example__container-scroll-horizontal">
  <alc-popup ${renderArgs(argTypes, args)} class="popup-example__popup popup-example__popup-scroll-horizontal">
    <div slot="anchor" class="popup-example__anchor">Anchor</div>
    <div class="popup-example__box popup-example__box-shift">Popup</div>
  </alc-popup>
</div>
  `,
};


export const Strategy = {
  name: 'Strategy',
  args: {
    ...defaultArgs,
    'active': true,
    // 'distance': ,
    // 'flip': ,
    'placement': 'top',
    // 'shift': ,
    'strategy': 'fixed',
  },
  render: args => `
<div class="popup-example__container popup-example__container-scroll">
  <alc-popup ${renderArgs(argTypes, args)} class="popup-example__popup popup-example__popup-scroll-vertical">
    <div slot="anchor" class="popup-example__anchor">Anchor</div>
    <div class="popup-example__box">Popup</div>
  </alc-popup>
</div>
  `,
};
