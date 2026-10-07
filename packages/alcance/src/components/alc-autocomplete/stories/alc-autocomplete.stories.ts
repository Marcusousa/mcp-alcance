// @ts-ignore
import { argTypes } from './alc-autocomplete.args';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes Alfa/Autocomplete',
  name: 'Autocomplete',
  component: 'alc-autocomplete',
  tags: ['alfa'],
  parameters: {
    docs: {
      story: {
        height: '10rem', // Ajuste conforme necessário
      },
    },
  },
  argTypes: argTypes,
};


const defaultArgs = getDefaultArgs(argTypes);

const Template = (args) => {
  const element = document.createElement('alc-autocomplete');
  element.id = args.id || 'alc-autocomplete';
  element.style.margin = 'var(--alc-spacing-03)';

  // Atribuir propriedades de forma consistente
  Object.keys(args).forEach((key) => {
    if (key === 'items') {
      element.items = args.items;
    } else {
      // Converter camelCase para kebab-case para atributos se necessário
      const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      if (args[key] !== undefined) {
        element.setAttribute(kebabKey, args[key]);
      }
    }
  });

  return element;
};

export const Basico = Template.bind({});
Basico.args = {
  ...defaultArgs,
  displayKeys: 'nome',
  label: 'Thundercats',
  placeholder: 'Lion-O, Cheetara...',
  items: [
    { id: 1, nome: 'Lion-O', arma: 'Espada Justiceira' },
    { id: 2, nome: 'Cheetara', arma: 'Bastão' },
    { id: 3, nome: 'Panthro', arma: 'Nunchaku' },
    { id: 4, nome: 'Tygra', arma: 'Chicote Retrátil' },
  ],
};
Basico.storyName = 'Básico';

export const Hint = Template.bind({});
Hint.args = {
  ...defaultArgs,
  displayKeys: 'nome',
  hint: 'Selecione o seu thundercat',
  label: 'Thundercats',
  placeholder: 'Lion-O, Cheetara...',
  items: [
    { id: 1, nome: 'Lion-O', arma: 'Espada Justiceira' },
    { id: 2, nome: 'Cheetara', arma: 'Bastão' },
    { id: 3, nome: 'Panthro', arma: 'Nunchaku' },
    { id: 4, nome: 'Tygra', arma: 'Chicote Retrátil' },
  ],
};
Hint.storyName = 'Texto de ajuda';

export const Required = Template.bind({});
Required.args = {
  ...defaultArgs,
  displayKeys: 'nome',
  label: 'Thundercats',
  placeholder: 'Lion-O, Cheetara...',
  required: true,
  items: [
    { id: 1, nome: 'Lion-O', arma: 'Espada Justiceira' },
    { id: 2, nome: 'Cheetara', arma: 'Bastão' },
    { id: 3, nome: 'Panthro', arma: 'Nunchaku' },
    { id: 4, nome: 'Tygra', arma: 'Chicote Retrátil' },
  ],
};
Required.storyName = 'Obrigatório';


export const DataAttributes = Template.bind({});
DataAttributes.args = {
  ...defaultArgs,
  displayKeys: 'nome, arma', // Usar camelCase
  label: 'Thundercats',
  placeholder: 'Lion-O, Cheetara...',
  items: [
    { id: 1, nome: 'Lion-O', arma: 'Espada Justiceira' },
    { id: 2, nome: 'Cheetara', arma: 'Bastão' },
    { id: 3, nome: 'Panthro', arma: 'Nunchaku' },
    { id: 4, nome: 'Tygra', arma: 'Chicote Retrátil' },
  ],
};
DataAttributes.storyName = 'display-keys';

export const ListDirection = Template.bind({});
ListDirection.args = {
  ...defaultArgs,
  displayKeys: 'nome, arma',
  label: 'Thundercats',
  placeholder: 'Lion-O, Cheetara...',
  listDirection: 'horizontal',
  items: [
    { id: 1, nome: 'Lion-O', arma: 'Espada Justiceira' },
    { id: 2, nome: 'Cheetara', arma: 'Bastão' },
    { id: 3, nome: 'Panthro', arma: 'Nunchaku' },
    { id: 4, nome: 'Tygra', arma: 'Chicote Retrátil' },
  ],
};
ListDirection.storyName = 'Direção da lista';


export const Disabled = Template.bind({});
Disabled.args = {
  ...defaultArgs,
  displayKeys: 'nome',
  label: 'Thundercats',
  placeholder: 'Lion-O, Cheetara...',
  disabled: true,
  items: [
    { id: 1, nome: 'Lion-O', arma: 'Espada Justiceira' },
    { id: 2, nome: 'Cheetara', arma: 'Bastão' },
    { id: 3, nome: 'Panthro', arma: 'Nunchaku' },
    { id: 4, nome: 'Tygra', arma: 'Chicote Retrátil' },
  ],
};
Disabled.storyName = 'Desabilitado';

export const Error = Template.bind({});
Error.args = {
  ...defaultArgs,
  displayKeys: 'nome',
  label: 'Thundercats',
  placeholder: 'Lion-O, Cheetara...',
  error: true,
  items: [
    { id: 1, nome: 'Lion-O', arma: 'Espada Justiceira' },
    { id: 2, nome: 'Cheetara', arma: 'Bastão' },
    { id: 3, nome: 'Panthro', arma: 'Nunchaku' },
    { id: 4, nome: 'Tygra', arma: 'Chicote Retrátil' },
  ],
};
Error.storyName = 'Erro';

export const Api = Template.bind({});
Api.args = {
  ...defaultArgs,
  displayKeys: 'nome, siglaPartido',
  hint: 'Exclusivamente parlamentares no exercício do mandato',
  label: 'Buscar deputados',
  listDirection: 'horizontal',
  placeholder: 'Digite para iniciar a busca',
};

// Para o story "Api", precisamos lidar com a busca de dados externos
Api.parameters = {
  docs: {
    story: {
      height: '35rem',
    },
  },
};

Api.decorators = [
  (Story, context) => {
    const element = Story(context);
    const url = 'https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome';

    // Função para buscar os dados
    async function fetchData(url, acElement) {
      acElement.loading = true;
      acElement.error = false;
      try {
        // Simulação de atraso
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Fetch dos dados
        const response = await fetch(url);
        const json = await response.json();
        acElement.items = json.dados;
        if (json.dados.length === 0) {
          acElement.emptyResult = true;
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        acElement.items = [];
        acElement.error = true;
      } finally {
        acElement.loading = false;
      }
    }

    // Adicionar o evento para buscar os dados na primeira vez que o input recebe foco
    element.addEventListener(
      'focusin',
      async () => {
        if (!element.items || element.items.length === 0) {
          await fetchData(url, element);
        }
      },
      { once: true }
    );

    return element;
  },
];
Api.storyName = 'Usando API externa';