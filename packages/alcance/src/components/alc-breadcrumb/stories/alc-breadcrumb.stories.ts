// @ts-ignore
import { argTypes } from './alc-breadcrumb.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Breadcrumb',
  name: 'Breadcrumb',
  component: 'alc-breadcrumb',
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
<alc-breadcrumb ${renderArgs(argTypes, args)}>
  <alc-breadcrumb-item label="Thundercats" url="#"></alc-breadcrumb-item>
  <alc-breadcrumb-item label="Personagens" url="#"></alc-breadcrumb-item>
  <alc-breadcrumb-item label="Lion-O" url="#"></alc-breadcrumb-item>
</alc-breadcrumb>
  `)
};

export const Icone = {
  name: 'Ícone',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-breadcrumb ${renderArgs(argTypes, args)}>
  <alc-breadcrumb-item label="Thundercats" url="#" icon-name="house"></alc-breadcrumb-item>
  <alc-breadcrumb-item label="Personagens" url="#"></alc-breadcrumb-item>
  <alc-breadcrumb-item label="Lion-O" url="#"></alc-breadcrumb-item>
</alc-breadcrumb>
  `)
};


export const Slot = {
  name: 'Usando link',
  args: {
    ...defaultArgs,
  },
  render: (args) => (`
<alc-breadcrumb ${renderArgs(argTypes, args)}>
  <alc-breadcrumb-item>
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