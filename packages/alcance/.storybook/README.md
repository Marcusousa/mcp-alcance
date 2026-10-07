# Storybook

## Documentação da automação Storybook

### **Como rodar o Storybook?**

- Primeiro é necessário gerar a documentação: `yarn build`
- Em seguida, rode o Storybook: `yarn storybook`
- Sempre que surgir uma mensagem de atualização disponível, faça-a.

### **O que ainda resta ser feito?**

- Consumir o `docs.json` (`alcance/utils/docs.json`) e ajustar o `argTypes` para que onde há opções limitadas nas propriedades do componente, seja criada nos controles - referência: (https://storybook.js.org/docs/react/api/arg-types#control);
- Apagar todo o conteúdo das pastas stories **dentro das pastas dos componentes** e gerá-los novamente `yarn build`, assim que a automatização estiver completa.

### **Entendendo a estrutura do Storybook**

- Pasta `.storybook`: Nela encontra-se o `core` do Storybook. Todas as configurações estão contidas nos arquivos: `main.ts` e `preview.ts`. referência (https://storybook.js.org/docs/react/api/main-config)
- Pasta `stories` (`alcance/src/stories`): Nela estão as documentações que não fazem parte dos componentes, por exemplo: Histórico de Versões do Alcance, Documentações de Instalação e outros.
- Pasta `stories` (`alcance/src/components/alc-xx/stories`): Nela estão contidos os `stories` de cada componente, assim como suas respectivas documentações. O que pode ser alterado manualmente? `alc-xxx.mdx`, `alc-xxx.usage.mdx`, `alc-xxx.stories.ts`. **Não altere os arquivos manualmente que não estão listados aqui!**

### **Adicionando categorias e atribuindo documentações a elas**

Para adicionar categorias (separadores) na estrutura do Storybook, abra o arquivo `.storybook/preview.ts` e altere o conteúdo a seguir:

```
    options: {
      storySort: {
        method: "alphabetical",
        order: ['Alcance', 'Instalação', 'Componentes'],
      },
    },
```
Lembre-se que a ordem adicionada aí, é a ordem em que elas vão aparecer na navegação lateral.

Para vincular uma documentação à uma categoria, basta adicionar o separador antes do título da documentação, como no exemplo a seguir:

`<Meta title="Instalação/Histórico de Versões" />`

Onde **Instalação** é a categoria e **Histórico de Versões** é o nome da documentação

### **Entendendo as funções da automação de stories/documentação**

Encontre-o em `alcance/scripts/generate-docs.js`

#### Funções

- `saveUsageMdx()`
Gera e salva a documentação de exemplos dos componentes: `alc-xxx.usage.mdx`;
- `saveMdx()`
Gera e salva a documentação escrita dos componentes: `alc-xxx.mdx`;
- `saveStories()`
Gera e salva o arquivo `alc-xxx.stories.ts`. Função chamada à partir da função `generateStoriesContent()`;
- `saveArgsStories()`
Gera e salva o arquivo `alc-xxx.args.ts`. Função chamada à partir da função `updateArgs()`;
- `generateStoriesContent()`
Cria toda a estrutura dos stories, assim como os exemplos básicos. Chama a função `saveStories()` para processar e salvar o arquivo;
- `updateArgs()`
Cria e atualiza toda a estrutura dos args, consumida pelos stories. Chama a função `saveArgsStories()` para processar e salvar o arquivo;
- `savePropsMd()`
Cria e atualiza as propriedades, métodos, eventos e etc, de cada componente: `alc-xxx.props.md`.
