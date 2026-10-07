Tudo ia bem até certo ponto, até que fosse necessária alguma automação da geração do dist.

Aí vem o webpack e gera o dist, mas não consigo mais fazer import Tooltip from 'path-to-tooltip/tooltip.js'.

## Questão 1
Isso quer dizer que a saída do webpack não é o que eu esperava. Questão 1: Como fazer com que a saída seja "compatível" com es6/es2015?

### Resposta 1: webpack 5
Resposta 1: Webpack 5 vai suportar isso nativamente, sem necessidade bibliotecas de terceiros.


### Resposta 2: babel-loader
Resposta 2: Parece ser possível fazer usando babel. Vamos investigar

Penso aqui no babel como um transpilador.
Como o webpack entrega código com outro formato de módulos e eu quero usar módulos ES2015, o Babel parece ser uma alternativa lógica.

Instalamos babel-loader, @babel/core
Criamos o .babelrc para indicar o uso do plugin que promete fazer o que precisamos.

Obviamente, foi necessário instalar o plugin: babel-plugin-add-module-exports.

Por alguma razão, isso não funciona. Deixamos a lógica de lado e vamos seguir uma *receita de bolo* aqui que é usar o preset-env do Babel.
Incluímos então essa configuração (presets) no .babelrc, e obviamente foi necessário instalar o plugin: @babel/preset-env

Seguindo ainda a *receita de bolo*, incluímos mais uma configuração no .babelrc, incluindo algo que tem a ver com módulos no webpack. É o indicado aqui:
https://www.npmjs.com/package/babel-plugin-add-module-exports#with-webpack

Esse plugin promete transformar qualquer `exports.default('foo')` (commonJs) em `export default 'foo'` (ES6).

Ainda assim, não funcionou.
É provável que isso seja na "entrada" dos arquivos, e não na "saída".

Vamos tentar obter alguma configuração adicional no webpack-library-example. Isso foi tentado (dentro de "output" do webpack.config.js) na forma de "tentativa-e-erro", mas sem surtir o efeito necessário - apenas mudando o ponto de problema.

  libraryTarget: 'umd',
  globalObject: 'this',
  libraryExport: 'default',
  library: 'Tooltip',

  ...




### Resposta 3: Ainda o babel-loader
Resposta 3: Usar o babel-loader, mas oferecendo simplesmente uma nova configuração para ele no webpack.config.js
Referência: https://philipwalton.com/articles/deploying-es2015-code-in-production-today/

Mesmo usando o projeto do github desse cara (mais atualizado) a coisa não funciona como esperado.
Então, é possível importar os módulos dessa forma:

  <script type="module" src="core.js"/>

Mas isso não é possível:

  <script type="module">
    import ALC from 'core.js';
  </script>

Então isso fica praticamente abandonado.

### Resposta 4: Rollup

Vamos experimentar o Rollup em vez do webpack?

Com uma configuração simples, foi possível gerar os dois módulos (core e tooltip).
Vamos chamar esse ponto a que chegamos de v2.

## Questão 2
Além disso, como o webpack "empacotou" também o core do ALC, corremos o risco de executar o mesmo módulo mais de uma vez, e não é isso o que queremos.
Isso aconteceu em v2 também, usando Rollup. O Rollup "empacotou" o core do ALC, e não é isso o que queremos.

Questão 2: Como fazer o core do ALC ser uma depedência externa?

### Resposta 1: Configuração do Rollup
Com o Rollup, isso foi feito em 3 passos:
1. Em tooltip.js, passamos a importar o ALC usando o id do módulo. Ou seja, `import ALC from 'alc'` (em vez de `import ALC from '../node_modules/alc/core.js` );
2. Em rollup.config.js, incluímos a indicação de que o ALC é uma dependência externa, usando `external: ['alc']`. (https://rollupjs.org/guide/en/#external)
3. Também em rollup.config.js, indicamos o caminho do 'alc' para ser usado no bundle, usando `output.paths: { alc: '../alc/core.js' }` (https://rollupjs.org/guide/en/#outputpaths)

Com essa configuração, foi possível evitar que o core fosse executado mais de uma vez.
Vamos chamar esse ponto a que chegamos de v3.

## Questão 3
Até agora fizemos só coisas com o Javascript, mas o ALC tem também o CSS.
A prova de conceito feita com webpack permitia que o CSS fosse injetado na página.
Como fazer o mesmo com Rollup?

### Resposta

Isso funcionou com o uso dos plugins:
* `rollup-plugin-styles`: Um plugin "universal" para estilos, trata por si só os CSS.
* `rollup-plugin-scss`: Um plugin para tratar os arquivos Sass (.scss).

Bastou para isso:
* instalar os plugins
* fazer a configuração no `rollup.config.js`
* fazer os `import` no `alc.js`

O módulo gerado inclui código para embutir o CSS no head da página - como o webpack faz.

## Questão 4
E o Boostrap, dá para fazer entrar?

### Resposta
Sim.
1. Instalei o bootstrap via npm.
2. Criei o arquivo `global.scss`
3. Criei o import desse arquivo em `alc.js`

Com isso temos também o Bootstrap.
Vamos marcar esse ponto como v4.

## Questão 5
E nossos bundles?

É possível gerar bundles de forma que possam ser "chamados" pelo navegador,
em vez de ter que fazer "import"?

Isso é o que fizemos inicialmente com webpack, e depois não conseguimos
fazer o caminho reverso, ou seja, gerar para ser usado com imports.

### Resposta
Sim, bastou fazer uma nova configuração de output, indicando:
* o arquivo de saída
* o formato
* um nome de variável global

Quanto ao formato, `iife` atende aos navegadores. É possível informar `umd`, que engloba `amd` (tipo RequireJS), `cjs` (CommonJS, para Node e outros bundlers) e `iife` no mesmo arquivo (https://rollupjs.org/guide/en/#outputformat). Isso parece ser mais flexível, pensando na integração com outros frameworks.

Vamos marcar esse ponto como v5.


## Criar widgets com Custom Elements?

Opção: Stencil (https://stenciljs.com/)
Ele é um compilador. Gera o código do custom element em tempo de compilação,
e o custom element pode ser simplesmente usado no navegador. OU seja, não
depende de execução de scripts no navegador para tal fim.

*O que fiz aqui foi a partir da pasta `display`*.

1. Atualizei meu node (versão 14.13.0)
2. $ npm init stencil
  * Opção "component"
  * Project name: "display-stencil"
3. $ cd display-stencil
4. $ npm install
5. $ npm run build

Isso gera uma pasta `display-stencil`. Não alterei nada manualmente nessa pasta.

Temos um "componente modelo" gerado pelo stencil.

Como incluir esse componente em nosso processo de build?

1. Instalei e configurei npm e rollup nessa pasta, de forma similar ao que havia feito no tooltip.
Para isso, eu copiei os arquivos package.json e rollup.config.js do tooltip, e fiz os ajustes dos valores.
2. $ npm install
3. $ npm install rollup // Não ser por que precisei fazer isso, por que não instalou automaticamente.

Agora, o arquivo de entrada (fonte) para que o rollup faça o build não está em `src` como nos demais.
Em vez disso, vamos usar o arquivo gerado pelo stencil. Por quê?
* O `src` do stencil não é um arquivo Javascript.
* O build do stencil gera uma compilação. Nessa compilação é que está o arquivo Javascript (o módulo que queremos).

Então, o que acontece é que, em vez de escrever o módulo manualmente, estamos usando o stencil como ferramenta para isso. Tendo o módulo, o build do rollup é praticamente igual ao que fizemos no tooltip, por exemplo.

Então, é preciso alterar o rollup.config.js para que o `input` aponte para o arquivo certo gerado pelo stencil.

E, como o módulo gerado pelo stencil tem dependências de pacotes npm (o módulo faz imports do tipo `import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';`), o rollup precisa de um plugin para resolver módulos do node. Instalamos então esse plugin:

$ npm install @rollup/plugin-node-resolve

E configuramos o rollup para usar esse plugin. (rollup.config.js).

Agora, ao fazer o build:

$ npm run build

Teremos a pasta `dist`, da mesma forma como para os demais widgets/componentes.

Posso usar na aplicação.

*Agora na pasta `_app`*

$ npm install ../display/dist/

Alteramos o index.html para importar o módulo.

### Nova compreensão do StencilJS

A forma como foi descrita acima decorreu da interpretação equivocada de algumas coisas do Stencil.

Na verdade, ele faz muito além do que havia entendido inicialmente.

Uma das coisas é que não deveríamos ter essas duas "etapas" para geração,
como havia sido feito: StencilJS ==> Rollup.

Fazer dessa forma fez com que uma parte importante das vantagens do StencilJS fosse
deixada de lado. O mais visível foi a capacidade de uma página importar uma biblioteca
inteira, sem se preocupar com o que tem lá dentro, e o código dessa biblioteca
carregar dinamicamente os componentes, na medida em que são usados.

Agora foi incluído um modelo (alc-stencil) que agrega, até o momento, dois componentes
a título de exemplo. A página que o utiliza não tem que se preocupar em fazer
`import` de cada componente, como era o caminho que estávamos seguindo até aqui.
O que a página faz é incluir a biblioteca e usar do componentes.

O StencilJS gera códigos que podem ser utilizados de outras formas, mas
não foi possível ainda compreender os detalhes disso. Por exemplo, ainda não está
claro se é possível gerar um bundle que possa ser usado sem o uso de módulos.
Ou seja, algo semelhantes ao `index-file.html`, que pode ser aberto diretamente pelo sistema
de arquivos, sem necessidade de um servidor web.

## Dependências em runtime

A princípio, uma biblioteca feita com Stencil não tem qualquer dependência em runtime.
Entretanto, como optamos por oferecer dist-custom-elements, nesse caso o
`@stencil/core` terá que ser uma dependência do projeto em runtime.

Comentário de Adam Bradley:
"Yes, for a custom elements build, @stencil/core will have to be a dependency of your project."
https://github.com/ionic-team/stencil/issues/2566#issuecomment-656711569

Documentação do Stencil:
"(...) be sure to set @stencil/core as a dependency of the package."
https://stenciljs.com/docs/custom-elements#distributing-custom-elements




## Datatables.net sem jQuery

Manual para usar o datatables.net sem precisar fazer referência ao jQuery.

```
// Inicialmente
import DataTableModule from 'datatables.net';
```

```
// Assíncrono para aguardar a inicialização do DataTables
async componentWillLoad() {
  // @ts-ignore
  const DataTable = DataTableModule();

  .
  .
  .

  return new Promise((resolve) => {

    let dataTablesConfig: any = {
      .
      .
      .
      // Será executado ao iniciar o DataTables
      initComplete: function () {
        .
        .
        .
        // Chama resolve aqui (ou seja, quando dataTables termina de ser iniciado)
        resolve(true);
      }
    };

    const init = () => {

      // Sem necessidade de fazer referência ao jQuery
      this.dataTable = new DataTable(`#${domTable.id}`, dataTablesConfig);
      // Exemplo de configuração de evento
      this.dataTable
        .on('order.dt', function (e, _settings, ordArr) {
          const table = e.currentTarget;
          const headers = table.querySelectorAll('th');

          headers.forEach((header, index) => {
            . . .
          })
        });

      resolve(true);
    }

    // Tem que testar/verificar melhor se é necessário fazer todo esse teste
    // ou se pode chamar, simplesmente, o init() direto.
    if (document.readyState === 'loading') {  // Loading hasn't finished yet
      document.addEventListener('DOMContentLoaded', init);
    } else {  // `DOMContentLoaded` has already fired
      init();
    }
  }
}
