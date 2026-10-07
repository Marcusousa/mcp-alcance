# Colaboração com o Alcance - criação de componentes

Observe os seguintes aspectos ao criar um componente.

## StencilJS

O Alcance usa o [StencilJS](https://stenciljs.com/) para a geração de componentes. É necessário conhecer o básico a respeito dessa biblioteca, no que diz respeito aos componentes: ciclo de vida, propriedades, métodos e eventos.

## Requisitos indispensáveis

Dizem respeito à arquitetura básica definida para os componentes, e à necessidade de evitar que um componente afete elementos fora de seu escopo.

### Configuração do componente
1. `shadow: false`
2. `scoped: false`

### OS `id`s gerados dinamicamente devem ser únicos
Se for necessário gerar um id dinamicamente, use a função `getUniqueId()`.

```TS
import { getUniqueId } from '../utils/getUniqueId';

this.componentId = getUniqueId();
```

### Padrão BEM para classes CSS

Usar o padrão BEM para a definição dos nomes das classes CSS. O nome do componente será considerado o "bloco".
* `alc-autocomplete`
* `alc-autocomplete__result`
* `alc-autocomplete__result-row`
* `alc-autocomplete__result-row--horizontal`
* `alc-autocomplete__result-row--vertical`


### Usar `@Listen` para tratar eventos

O uso de `@Listen` (em vez de `addEventListener` ou outras técnicas similares) evita que manipuladores de eventos permaneçam ativos quando uma instância do componente é removida da página.

Eventos que ocorrem no escopo do componente:

```TS
@Listen('keydown')
handleKeyDown(event: KeyboardEvent) {
  ...
}
```

Eventos que ocorrem fora do escopo do componente (escopo da página), definir o `target`:

```TS
@Listen('resize', { target: 'window' })
handleResize() {
  ...
}
```



## Requisitos fortemente desejados

### Documentação da API

São considerados parte da API do componente:
* Propriedades
* Métodos
* Eventos
* Slots (quando há algum slot além do slot default)

Todos os elementos da API de um componente devem ter uma documentação mínima.

Exemplo da documentação de uma propriedade do alc-icon:
``` TS
  /**
   * Nome do ícone que será mostrado. Deve ser um dos nomes de ícone da biblioteca.
   */
  @Prop({ reflect: true }) name?: string;
```

### Relacionados a propriedades
Propriedades com tipos primitivos (string, boolean e numérico) devem usar reflexão (reflect: true).

```TS
/**
 * Texto do label do input.
 * O texto colocado nesse comentário aparece na documentação.
 */
@Prop({ reflect: true }) label?: string;
```

### Relacionados à identidade visual
* Usar os tokens do Alcance sempre que possível.
* Não usar valores "soltos" no CSS, mas sim o que é fornecido pelo Tailwind. Veja exemplos a seguir

Em vez de valores "soltos" no CSS, usar a estrutura do Tailwind:

```CSS
.alc-my-component {
  @apply rounded-sm py-4 my-2;
  border-left-width: theme('borderWidth.6');
}
```


## Padrões de codificação

### Elementos referenciados

Quando o componente precisar referenciar um elemento html criado por ele mesmo, deve usar o recurso `ref` do Stencil.

```TSX
<div ref={el => this.overlayRef = el}> ... </div>
```

### Eventos disparados pelo componente

Use o decorator `@Event` para declarar eventos. Consulte a documentação do StencilJS para mais detalhes.

Eventos devem ser disparados em resposta a ações do usuário (ex: clicar fora da modal para fechar), e não em chamadas de métodos. A ideia é emitir eventos nos casos em que a aplicação não tem controle direto sobre o que ocorre.

Definições para nomes dos eventos:
1. Seguir o padrão `alc-[evento]`;
2. Usar sempre o prefixo `alc-`;
3. Não incluir no nome do componente;
4. Usar sempre letras minúsculas (kebab-case);

#### Recomendações
* **Eventos "after"**: quando há alguma animação ou transição, pode fazer sentido um evento adicional com "after", por exemplo: `alc-after-hide`.
* **Eventos canceláveis**: sempre que fizer sentido, o evento deve permitir seu cancelamento. Eventos "after" nunca são canceláveis.
* **Nomes simples**: em regra, uma única palavra deve ser usada para descrever o evento. Excepcionalmente pode-se usar mais de uma palavra.
* **Nomes genéricos**: é preferível usar nomes genéricos do que nomes específicos. Por exemplo: `alc-show` (e não `alc-expand`); `alc-change` (e não `alc-modify`).
* **Reutilizar nomes**: usar os mesmos nomes de eventos em diferentes componentes, o tanto quanto possível.
* **Paralelismo**: manter o paralelismo de nomes em eventos opostos, como "show"/"hide" (e não "show"/"close").


### Métodos públicos

Use `@Method()` do Stencil para expor métodos públicos. Os nomes devem ser consistentes entre si: use `show()` / `hide()`, sem misturar verbos diferentes para a mesma ação, como `open()` / `hide()`.

## Recomendações

1. Um componente deve ser focado no "front do front". Não crie componentes que façam requisições de dados em qualquer local.
2. Crie testes automatizados contemplando os aspectos principais do componente.
3. Use o utilitário `testAttributes` para inserir atributos `data-test-*` nos elementos, é utilizado principalmente para querySelector nos testes. Os atributos são injetados apenas em ambiente de desenvolvimento e teste.


## SUGESTÕES
Recorrer a "utils" para funções comuns.

Utilizar componentes já existentes para comportamentos/funcionalidades já existentes.

Como começar um novo componente: `npm run generate` / `yarn generate`.

Não usar ids como seletores CSS.