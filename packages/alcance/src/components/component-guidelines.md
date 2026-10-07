# Guia de criação de componentes no Alcance

## Configuração

```tsx
@Component({
  tag: 'alc-[nome]',
  styleUrls: { // [1]
    base: 'alc-[nome]-base.css',
    theme: 'alc-[nome].css'
  },
  scoped: false, // [2]
})
```
O componente tem que ter duas folhas de estilo, `base` e `theme`, como mostrado em *[1]*. A folha de estilo com sufixo `-base` deve ser o mínimo estilo funcional. Seria o componente sem preocupação com tema.

O componente não usa shadow dom e não usa o recurso "scoped", e isso é feito com a configuração mostrada em *[2]*.


## Atributos/propriedades que indicam estado

Os atributos/propriedades que indicam estado devem ser nomeadas com `is`. Por exemplo: `is-visible`.

## Nomes de eventos

Em regra, os nomes dos eventos serão verbos no infinitivo, podendo haver ou não os prefixos `will-*` ou `did-*`. Por exemplo:
* `load`
* `change`
* `hide` (ou `will-hide` ou `did-hide`)


## Eventos que podem ser cancelados

Sempre que houver algum evento cujo possibilidade de cancelamento faça sentido, isso deve ser implementado com um par de eventos.

Por exemplo: `will-show` é disparado antes de mostrar algo e pode ser cancelado. `did-show` é disparado depois de mostrar algo.

Tudo o que o componente precisar executar para completar a ação deve estar entre o disparo do `will` e o disparo do `did`. Isso inclui a alteração de estados e execução de animações/transições, por exemplo.


### Evento `will-*`
- Disparado antes de a ação esperada acontecer
- Pode ser cancelado e com isso impedir a execução da ação
- Se for cancelado, o correspondente `did-*` não é disparado

### Evento `did-*`
- Disparado depois de a ação esperada acontecer
- Não pode ser cancelado


## Nomes de métodos e eventos vinculados

Havendo métodos fortemente vinculados aos eventos, sempre que possível seus nomes devem ser correspondentes entre si. Por exemplo:

| Método | Evento(s) |
|--------|--------|
| `show()` | `will-show`, `did-show` |
| `dismiss()` | `will-dismiss`, `did-dismiss` |

