// @ts-ignore
import { argTypes } from './alc-input-file.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Input File',
  name: 'Input File',
  component: 'alc-input-file',
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
    'id-input': 'inputFileBasico',
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

export const Multiplo = {
  name: 'Seleção Múltipla',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileMultiplo',
    'multiple': true,
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

export const ModoInput = {
  name: 'Modo Input',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileModoInput',
    'mode': 'input',
    'icon-name': 'upload',
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

export const ModoDropzone = {
  name: 'Modo Dropzone',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileDropzone',
    'mode': 'dropzone',
    'icon-name': 'upload',
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

export const TiposEspecificos = {
  name: 'Tipos de Arquivos Específicos',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileTiposEspecificos',
    'accept': 'image/png, image/jpeg',
    'multiple': true,
    'mode': 'input',
    'icon-name': 'upload',
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

export const Desabilitado = {
  name: 'Desabilitado',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileDesabilitado',
    'disabled': true,
    'mode': 'button',
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

export const ComAlcField = {
  name: 'Integrado com AlcField',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileComAlcField',
    'multiple': true,
    'mode': 'dropzone',
    'icon-name': 'upload',
  },
  render: args => `
    <alc-field label="Anexar Documentos" required error-msg="Por favor, selecione pelo menos um arquivo.">
      <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
    </alc-field>
  `,
};

export const BotaoSecundario = {
  name: 'Botão Secundário',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileBotaoSecundario',
    'button-type': 'secondary',
    'mode': 'button',
    'icon-name': 'upload',
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

export const IconePersonalizado = {
  name: 'Ícone Personalizado',
  args: {
    ...defaultArgs,
    'id-input': 'inputFileIconePersonalizado',
    'mode': 'button',
    'icon-name': 'paperclip',
  },
  render: args => `
    <alc-input-file ${renderArgs(argTypes, args)}></alc-input-file>
  `,
};

