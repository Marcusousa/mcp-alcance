// @ts-ignore
import { argTypes } from './alc-breadcrumb-item.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Breadcrumb Item',
  name: 'Breadcrumb Item',
  component: 'alc-breadcrumb-item',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'icon-name': 'house',
    'label': 'Thundercats',
    'url': '#',
  },
  render: (args) => (`
<alc-breadcrumb>
  <alc-breadcrumb-item ${renderArgs(argTypes, args)}></alc-breadcrumb-item> 
  <alc-breadcrumb-item label="Personagens" url="#"></alc-breadcrumb-item>
  <alc-breadcrumb-item label="Lion-O" url="#"></alc-breadcrumb-item>
</alc-breadcrumb>
  `)
};

export const Slot = {
  name: 'Slot',
  args: {
    ...defaultArgs,
    'icon-name': 'house',
    // 'label': ,
    // 'url': ,
  },
  render: (args) => (`
<alc-breadcrumb>
  <alc-breadcrumb-item ${renderArgs(argTypes, args)}>
    <a href="#">Thundercats</a>
  </alc-breadcrumb-item> 
  <alc-breadcrumb-item>
    <a href="#">Personagens</a>
  </alc-breadcrumb-item>
  <alc-breadcrumb-item>
    <a href="#">Lion-O</a>
  </alc-breadcrumb-item>
</alc-breadcrumb>
  `)
};