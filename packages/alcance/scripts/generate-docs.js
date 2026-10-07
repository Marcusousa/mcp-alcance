const fs = require('fs').promises;
const path = require('path');
let buildMode = '';
let defaultURL = '';

function verifyBuildMode() {
  const args = process.argv.slice(2);

  // Verifica se 'storybook' foi passado como parâmetro para o build
  // Por exemplo: stencil build storybook
  if (args.includes('storybook')) {
    console.log("Executando configuração padrão Storybook");
    buildMode = 'storybook';
    defaultURL = '/docs/componentes-componentes--documentação';
  } else {
    console.log("Executando com configurações para Docusaurus");
    buildMode = 'docusaurus';
    defaultURL = '/alcance/docs/components/introducao';
  }
}

async function ensureDirectoryExists(dir) {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Busca por um arquivo, que corresponda a um padrão regex, em um diretório.
 *
 * @param {string} dirPath - Caminho do diretório onde buscar
 * @param {string} pattern - Padrão regex (como string) para identificar o arquivo
 * @returns {Promise<string|false>} Nome do primeiro arquivo encontrado ou false
 *
 * @example
 * // Busca por arquivo que comece com 'alc-button' e termine com '.mdx'
 * const file = await findExistingFile('./stories', '^alc-button(\\.\\d+)?\\.mdx$');
 * // Retorna: "alc-button.01.mdx" (se existir) ou false
 */
async function findExistingFile(dir, pattern) {

  const files = await fs.readdir(dir);
  const expression = new RegExp(pattern);
  let existingFile;
  const fileExists = files.some(file => {
    existingFile = file;
    return expression.test(file);
  });

  return fileExists ? existingFile : false;
}


function toPascalCase(str) {
  return str
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

function toSpaceCase(str) {
  return str
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

// Função para salvar API mdx para Docusaurus
async function saveApi(name, content) {
  const utilsMdxDir = path.join(__dirname, '../utils/mdx');
  const utilsMdxFile = path.join(utilsMdxDir, `${name}.mdx`);

  await ensureDirectoryExists(utilsMdxDir);
  await fs.writeFile(utilsMdxFile, content);
}

// Função para salvar documentação .mdx
async function saveMdx(name) {
  const storiesDir = path.join(__dirname, '../src/components', name, 'stories');
  const mdxFile = path.join(storiesDir, `${name}.mdx`);

  await ensureDirectoryExists(storiesDir);

  // Verifica se o arquivo já existe (incluindo variações com sufixos numéricos)
  const existingFile = await findExistingFile(storiesDir, `^${name}(\\.\\d+)?\\.mdx$`);

  if (existingFile) {
    console.log('O arquivo', existingFile, 'já existe, não será sobrescrito.');
    return;
  }

  const componentNameWithoutPrefix = name.replace('alc-', '');
  const capitalizedComponentName = toPascalCase(componentNameWithoutPrefix);

  const mdxContent = `\
{/* ${name}.mdx */}
import { Canvas, Meta, Controls, Markdown } from '@storybook/addon-docs/blocks';
import * as Stories from './${name}.stories';
import ${capitalizedComponentName}Props from './${name}.props.md?raw';

<Meta of={Stories} name="Documentação" />

# {Stories.default.name}

[comment]: <> (Insira o conteúdo aqui)

<Markdown>{${capitalizedComponentName}Props}</Markdown>
`;

  await fs.writeFile(mdxFile, mdxContent);
}

// Função para salvar usage .mdx
async function saveUsageMdx(name) {
  const storiesDir = path.join(__dirname, '../src/components', name, 'stories');
  const mdxFile = path.join(storiesDir, `${name}.usage.mdx`);

  await ensureDirectoryExists(storiesDir);

  // Verifica se o arquivo já existe (incluindo variações com sufixos numéricos)
  const existingFile = await findExistingFile(storiesDir, `^${name}(\\.\\d+)?\\.usage\\.mdx$`);

  if (existingFile) {
    console.log('O arquivo', existingFile, 'já existe, não será sobrescrito.');
    return;
  }

  const mdxContent = `\
{/* ${name}.usage.mdx */}

import { Canvas, Meta, Controls, Unstyled, Markdown } from '@storybook/addon-docs/blocks';
import * as Stories from './${name}.stories';

<Meta of={Stories} name="Exemplos" />

# Exemplos

## {Stories.Basico.name}

<Canvas of={Stories.Basico} sourceState="shown" />
<Controls of={Stories.Basico} />

`;

  await fs.writeFile(mdxFile, mdxContent);
}

async function saveStories(name, content) {
  const storiesDir = path.join(__dirname, '../src/components', name, 'stories');
  const storiesFile = path.join(storiesDir, `${name}.stories.ts`);

  await ensureDirectoryExists(storiesDir);

  try {
    let existingContent = await fs.readFile(storiesFile, 'utf-8');

    // Verificar se "import" já existe no arquivo
    if (existingContent.includes('import')) {
      console.log('O arquivo já contém "import", ignorando: ', `${name}.stories.ts`);
      return;
    }

    const newContent = `${content}\n\n${existingContent}`;
    await fs.writeFile(storiesFile, newContent);
  } catch {
    // Se o arquivo não existir, ele será criado
    await fs.writeFile(storiesFile, content);
  }
}

async function saveArgsStories(name, content) {
  const storiesArgsDir = path.join(__dirname, '../src/components', name, 'stories');
  const storiesArgsFile = path.join(storiesArgsDir, `${name}.args.ts`);

  await ensureDirectoryExists(storiesArgsDir);

  const exportedContent = `export const argTypes = ${content};`;

  await fs.writeFile(storiesArgsFile, exportedContent);
}

function generateControlField(propType) {
  if (propType.includes('|')) {
    const types = propType.split('|').map(type => type.trim());
    if (types.some(type => type === 'string' || type === 'JSON' || type === 'HTMLElement')) {
      return `control: 'text'`;
    } else {
      const options = types.map(option => option.replace(/"/g, '')).join("', '");
      return `control: 'select', options: ['${options}']`;
    }
  } else {
    return `control: '${propType}'`;
  }
}

function updateArgs(component) {
  const componentName = component.tag;
  let argsContent = `{\n`;

  component.props.forEach((prop) => {
    const propName = prop.attr ? (prop.attr.includes('-') ? `'${prop.attr}'` : prop.attr) : prop.name;
    const propType = prop.type.replace(/string/g, 'text');
    const propDescription = CRLFtoBR(prop.docs).replace(/'/g, "\\'");
    const controlField = generateControlField(propType);
    let propDefault = prop.default;

    if (typeof propDefault === 'string') {
      propDefault = `"${propDefault}"`;
    }

    if (propDefault === undefined) {
      propDefault = '"undefined"';
    }

    argsContent += `    ${propName}: {
      ${controlField},
      table: {
        defaultValue: { summary: ${propDefault} },
      },
      description: '${propDescription}',
      type: {
        required: ${prop.required}
      }
    },\n`;
  });

  argsContent += `  }`;

  saveArgsStories(componentName, argsContent);
}

function generateStoriesContent(component) {
  const componentName = component.tag;
  const cleanComponentName = componentName.replace('alc-', '');
  const spaceCaseComponentName = toSpaceCase(cleanComponentName);

  let storyArgs = '{\n';
  storyArgs += `    ...defaultArgs,\n`;
  component.props.forEach(prop => {
    storyArgs += `    // '${prop.attr}': ,\n`;
  });
  storyArgs += '  }';

  const storiesContent = `\
// @ts-ignore
import { argTypes } from './${componentName}.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/${spaceCaseComponentName}',
  name: '${spaceCaseComponentName}',
  component: '${componentName}',
  tags: ['alfa'],
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

// ESTRUTURA BÁSICA PARA CRIAR EXEMPLOS DO COMPONENTE
// PARA NOVOS EXEMPLOS, REPLIQUE O CÓDIGO ABAIXO E SUBSTITUA O 'Basico' POR OUTRO TIPO DE EXEMPLO: 'Avancado'

export const Basico = {
  name: 'Básico',
  args: ${storyArgs},
  render: (args) => (\`
    <${componentName} \${renderArgs(argTypes, args)}\></${componentName}>
  \`)
};
`;

  saveStories(componentName, storiesContent);
}

async function savePropsMd(name, content) {
  const storiesDir = path.join(__dirname, '../src/components', name, 'stories');
  const mdxFile = path.join(storiesDir, `${name}.props.md`);

  await ensureDirectoryExists(storiesDir);

  await fs.writeFile(mdxFile, content);
}

function CRLFtoBR(str) {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br/>');
}

function escapeHTML(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');

  if (buildMode === 'storybook') {
    return str;
  }

  str = str.replace(/}/g, '&#125;');
  str = str.replace(/{/g, '&#123;');
  str = str.replace(/\|/g, '&#124;');

  return str;
}

function removeWhiteSpaces(str) {
  // Remove espaços em branco (no início e no fim) para que o markdown não processe como blocos de código.
  return str.replace(/^ +| +$/gm, '');
}

function createPropertiesSection(props) {
  if (!props.length) {
    return '';
  }

  let content = `
    ## Propriedades
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Tipo</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
  `;

  props.forEach(prop => {
    content += `
      <tr>
        <td><code>${prop.attr}</code> ${prop.required ? ' <em>(obrigatório)</em>' : ''}</td>
        <td>${CRLFtoBR(prop.docs)}</td>
        <td><code>${escapeHTML(prop.type)}</code></td>
        <td><code>${prop.default}</code></td>
      </tr>
    `;
  });

  content += `
      </tbody>
    </table>
    <p><i>Aprenda mais sobre <a href="${defaultURL}#propriedades" class="alc-link">propriedades</a>.</i></p>
  `;

  return removeWhiteSpaces(content);
}

function createEventsSection(events) {
  if (!events.length) {
    return '';
  }

  let content = `
    ## Eventos
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Detalhe</th>
        </tr>
      </thead>
      <tbody>
  `;

  events.forEach(event => {
    content += `
      <tr>
        <td><code>${event.event}</code></td>
        <td>${CRLFtoBR(event.docs)}</td>
        <td><code>${escapeHTML(event.detail)}</code></td>
      </tr>
    `;
  });

  content += `
      </tbody>
    </table>
    <p><i>Aprenda mais sobre <a href="${defaultURL}#eventos" class="alc-link">eventos</a>.</i></p>
  `;

  return removeWhiteSpaces(content);
}

function createMethodsSection(methods) {
  if (!methods.length) {
    return '';
  }

  let content = `
    ## Métodos
  `;

  methods.forEach(method => {
    content += `
      ### <code>${method.name}()</code>

      <table>
          <tr>
            <th>Descrição</th>
            <td>${CRLFtoBR(method.docs)}</td>
          </tr>
          <tr>
            <th>Retorno</th>
            <td>${CRLFtoBR(method.returns.docs) || '-'}</td>
          </tr>
          <tr>
            <th>Assinatura</th>
            <td><code>${escapeHTML(method.signature)}</code></td>
          </tr>
      </table>
    `;
  });

  content += `
    <p><i>Aprenda mais sobre <a href="${defaultURL}#métodos" class="alc-link">métodos</a>.</i></p>
  `;

  return removeWhiteSpaces(content);
}

function createSlotsSection(slots) {
  if (!slots.length) {
    return '';
  }

  let content = `
    ## Slots
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
  `;

  slots.forEach(slot => {
    content += `
      <tr>
        <td>${slot.name ? '<code>' + slot.name + '</code>' : '(default)'}</td>
        <td>${CRLFtoBR(slot.docs)}</td>
      </tr>
    `;
  });

  content += `
      </tbody>
    </table>
    <p><i>Aprenda mais sobre <a href="${defaultURL}#slot" class="alc-link">slots</a>.</i></p>
  `;

  return removeWhiteSpaces(content);
}

function createCSSCustomPropertiesSection(props) {
  if (!props.length) {
    return '';
  }

  let content = `
    ## Propriedades CSS customizadas
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
  `;

  props.forEach(prop => {
    content += `
      <tr>
        <td><code>${escapeHTML(prop.name)}</code></td>
        <td>${CRLFtoBR(prop.docs)}</td>
      </tr>
    `;
  });

  content += `
      </tbody>
    </table>
    <p>
      <em>Aprenda mais sobre <a href="${defaultURL}#propriedades-de-css-customizadas" class="alc-link">propriedades CSS customizadas</a>.</em>
    </p>
  `;

  return removeWhiteSpaces(content);
}

function createCSSClassesSection(cssClasses) {
  if (!cssClasses.length) {
    return '';
  }

  let content = `
    ## Classes CSS
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
  `;

  cssClasses = cssClasses.map(cssClass => cssClass.text.split(' - '));

  cssClasses.forEach(cssClass => {
    content += `
      <tr>
        <td><code>${escapeHTML(cssClass[0])}</code></td>
        <td>${CRLFtoBR(cssClass[1])}</td>
      </tr>
    `;
  });

  content += `
      </tbody>
    </table>
  `;

  return removeWhiteSpaces(content);
}

module.exports = function generate(docs) {
  verifyBuildMode();

  docs.components.forEach((component) => {
    const fileName = component.tag;

    const content = [
      createPropertiesSection(component.props),
      createMethodsSection(component.methods),
      createEventsSection(component.events),
      createSlotsSection(component.slots),
      createCSSCustomPropertiesSection(component.styles),
      createCSSClassesSection(component.docsTags.filter(docsTag => docsTag.name === 'cssClass'))
    ].join('');

    if (buildMode === 'storybook') {
      updateArgs(component);
      generateStoriesContent(component);

      savePropsMd(fileName, content);
      saveMdx(fileName);
      saveUsageMdx(fileName);
    } else {
      saveApi(fileName, content);
    }
  });
};