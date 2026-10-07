# Eventos

## Padrão de nome

### Exemplos
* alc-show
* alc-hide
* alc-after-hide
* alc-home
* alc-logout
* alc-change
* alc-select

### Regras de nomeação

1. Sempre usar o prefixo `alc-`.
2. Não incluir o nome do componente no nome do evento.
3. Usar somente letras minúsculas.
4. Usar "kebab-case".
5. Para eventos que são disparados em sequência (antes e depois de uma transição): o segundo evento deve ter o termo `after-`. Exemplos:
   1. `alc-show` ➡ `alc-after-show`
   2. `alc-hide` ➡ `alc-after-hide`
6. Dar preferência a nomes com uma única palavra. Usar mais de uma palavra deve ser exceção.
7. Dar preferência a nomes genéricos, em vez de nomes específicos. Exemplos:
   1. `alc-show` em vez de `alc-expand`.
   2. `alc-show` em vez de `alc-reveal`.
   3. `alc-change` em vez de `alc-modify`.
8. Sempre que possível, usar os mesmos nomes de eventos em diferentes componentes.
9. Manter o paralelismo em ações opostas. Por exemplo, `alc-show` / `alc- hide` em vez de `alc-show` / `alc-close`.
10. Manter a correspondência de nomes quando houver um método relacionado.

## Propagação

Por padrão, os eventos se propagam. Use `bubbles = true`.

## Cancelamento

É necessário analisar o caso específico para definir se um evento pode ou não ser cancelado.

Os eventos que ocorrem após uma transição (`alc-after-*`) nunca serão canceláveis.

## Quando deve-se disparar um evento

### Interação do usuário

A interação do usuário com um elemento do componente, mudando o estado do componente, pode provocar o disparo de um evento.

### Atividade interna do componente

Quando há uma mudança de estado em razão de atividade interna do componente, um evento pode ser disparado.

### Solicitação de informação para a aplicação

Quando o componente quer obter alguma informação da aplicação, um evento pode ser disparado. O exemplo típico são componentes que precisam manter um estado persistente, e solicitam a informação de estado para a aplicação.

## Quando não se deve disparar um evento

### Em função da mudança do valor de um atributo ou propriedade pela aplicação

Se a aplicação modifica o valor de um atributo ou propriedade, isso não deve gerar o disparo de um evento.

### Em função da chamada de um método da API

Se a aplicação chama um método da API do componente, isso não deve gerar o disparo de um evento.

## Exemplos usando o componente modal

### Quando a aplicação solicita o fechamento da modal

A modal está aberta. A aplicação chama o método `hide()` ou altera a propriedade `open` para `false`. Nenhum evento é disparado imediatamente. O componente faz a transição visual de "aberto" para "fechado" (isso ainda não está implementado, mas está previsto). Assim que a transição termina, o evento `alc-after-hide` é disparado.

Isso mostra que apenas a mudança de estado ocorrida em função de atividade interna do componente (transição) é que gerou disparo de evento.

### Quando o usuário solicita o fechamento da modal

A modal está aberta. O usuário pressiona a tecla `esc`. Imediatamente, o evento `alc-hide` é disparado. Em seguida, o componente faz a transição visual de "aberto" para "fechado" (isso ainda não está implementado, mas está previsto). Assim que a transição termina, o evento `alc-after-hide` é disparado.

Aqui, tanto a ação do usuário sobre o componente quando a atividade interna do componente (transição) geraram disparo de eventos.

## Referências

* [When to dispatch an event - Lit](https://lit.dev/docs/components/events/#when-to-dispatch-an-event)
* [Property Change Events - Web Components Gold Standard](https://github.com/webcomponents/gold-standard/wiki/Property-Change-Events)
* [In event-APIs of Javascript (like DOM), when do the setters for properties which have a corresponding change event do themselves trigger this event? (Stack Overflow)](https://stackoverflow.com/questions/73744745/in-event-apis-of-javascript-like-dom-when-do-the-setters-for-properties-which)
* [Custom Elements Best Practices - web.dev](https://web.dev/articles/custom-elements-best-practices#events)
* [Registros da equipe no kanban](https://kanban.camara.leg.br/?controller=TaskViewController&action=show&task_id=22119&project_id=214)