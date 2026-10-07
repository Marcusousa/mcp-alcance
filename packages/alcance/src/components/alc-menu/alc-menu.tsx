import { Component, h, Host, Element, Listen, Method, readTask, writeTask,  } from '@stencil/core';
import logger from '../utils/logger';

/**
 * Verifica se o valor recebido é um elemento do DOM.
 * Usa nodeType em vez de instanceof porque o mock-doc dos testes
 * não compartilha os construtores globais do documento real.
 */
const isElement = (value: unknown): value is Element => !!value && typeof value === 'object' && (value as Node).nodeType === 1;

@Component({
  tag: 'alc-menu',
  styleUrl: 'alc-menu.css',
  shadow: false,
})
export class AlcMenu {
  @Element() hostElement: HTMLElement;

  private hasFocus = false;
  private items: Element[];
  private dynamicContainerStart: HTMLElement;
  private dynamicContainerEnd: HTMLElement;
  private dynamicItems: { item: Element; position: 'start' | 'end' }[] = [];

  /**
   * @internal
   * Adiciona um item ao menu. O item deve ser um elemento compatível
   * com os itens do menu (por exemplo, um elemento com role="menuitem").
   * Esse método foi projetado para ser usado, a princípio, pelo componente alc-header,
   * e ao menos por enquanto não vai fazer parte da API pública do componente.
   * @param item O elemento a ser adicionado como item do menu.
   * @param position Posição do item no menu: 'start' insere antes dos itens declarados no slot, 'end' (padrão) insere depois.
   * @returns O valor retornado é `true` se o item foi renderizado corretamente,
   * seja pela primeira vez ou por atualização de posição.
   */
  @Method()
  async addMenuItem(item: Element, position: 'start' | 'end' = 'end'): Promise<boolean> {
    if (!isElement(item)) {
      return false;
    }

    if (position !== 'start' && position !== 'end') {
      return false;
    }

    // Adicionar um item que já está no menu não o duplica: apenas atualiza a posição
    // e renderiza novamente, para refletir eventuais alterações no conteúdo do item.
    const currentIndex = this.dynamicItems.findIndex(entry => entry.item === item);

    if (currentIndex >= 0) {
      this.dynamicItems = this.dynamicItems.map((entry, index) => (index === currentIndex ? { item, position } : entry));
    }
    else {
      this.dynamicItems = [...this.dynamicItems, { item, position }];
    }

    return this.renderDynamicItems();
  }

  /**
   * @internal
   * Remove um item do menu. O item pode ser especificado pelo elemento ou pelo índice.
   * Somente é possível remover itens que foram adicionados dinamicamente usando o método addMenuItem.
   * Esse método foi projetado para ser usado, a princípio, pelo componente alc-header,
   * e ao menos por enquanto não vai fazer parte da API pública do componente.
   * @param item O elemento ou índice do item a ser removido do menu.
   * @returns Promise resolvida com `true` depois que o item foi removido e a lista de itens do menu foi atualizada.
   * Resolve com `false` se o elemento não fizer parte dos itens dinâmicos, se o índice estiver fora dos limites da lista
   * ou se a renderização não puder ser concluída.
   */
  @Method()
  async removeMenuItem(item: Element | number): Promise<boolean> {
    let index: number;

    if (typeof item === 'number') {
      index = Number.isInteger(item) ? item : -1;
    }
    else if (isElement(item)) {
      index = this.dynamicItems.findIndex(entry => entry.item === item);
    }
    else {
      return false;
    }

    // Índice fora dos limites da lista ou elemento que não faz parte dos itens dinâmicos.
    if (index < 0 || index >= this.dynamicItems.length) {
      return false;
    }

    this.dynamicItems = this.dynamicItems.filter((_, position) => position !== index);

    return this.renderDynamicItems();
  }

  @Listen('keydown')
  handleKeydown(event: KeyboardEvent) {
    if ('ArrowDown' === event.key) {
      event.preventDefault();
      this.handleFocusedItemIndex();
      return;
    }

    if ('ArrowUp' === event.key) {
      event.preventDefault();
      this.handleFocusedItemIndex(-1);
      return;
    }
  }

  /**
   * Focar item recém-selecionado
   */
  @Listen('alc-select')
  handleAlcSelect (e: CustomEvent) {
    const index = this.items.findIndex(item => item === e.target);

    if(index === null) return;

    this.handleFocusItem(index);
  }

  @Listen('focusin')
  handleFocusin ({ target }) {
    // Se já tem o foco, nada a fazer
    if (this.hasFocus) {
      return;
    }
    if (this.hostElement.contains(target)) {
      this.setHasFocus(true);
    }
  }

  @Listen('focusout')
  handleFocusout ({ relatedTarget }) {
    if (!this.hostElement.contains(relatedTarget)) {
      this.setHasFocus(false);
    }
  }

  /**
   * Método para atualizar os itens do menu. Deve ser chamado sempre que os itens forem alterados dinamicamente.
   * Atualiza a lista de itens do menu e garante que o primeiro item esteja incluído na navegação por tabulação.
   */
  private refresh() {
    this.items = this.getListItems();
    this.includeFirstItemInTabNavigation();
  }

  handleFocusedItemIndex(direction: -1 | 1 = 1) {
    const currentIndex = this.items.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    const itemsLength = this.items.length - 1;

    if (nextIndex > itemsLength) {
      nextIndex = 0;
    }

    if (nextIndex < 0) {
      nextIndex = itemsLength;
    }

    this.handleFocusItem(nextIndex);
  }

  handleFocusItem(index: number) {
    const item = this.items[index];

    if(item instanceof HTMLElement) {
      // Seta foco no atual
      item.focus();
    }

  }

  getListItems = () => Array.from(this.hostElement.querySelectorAll('[role^=menuitem]'));

  includeFirstItemInTabNavigation = () => {
    this.items.forEach((item, pos) => {
      item.setAttribute('tabindex', pos === 0 ? '0' : '-1')
    });
  }

  removeAllItemsFromTabNavigation = () => {
    this.items.forEach(item => item.setAttribute('tabindex', '-1'));
  }


  setHasFocus = (hasFocus = true) => {

    this.hasFocus = hasFocus;

    if (hasFocus) {
      this.removeAllItemsFromTabNavigation();
    }
    else {
      this.includeFirstItemInTabNavigation();
    }

  }

  /**
   * Agenda manipulação do DOM para renderizar os itens dinâmicos.
   * Remove os itens atuais e adiciona os itens dinâmicos atualizados.
   * Depois disso, agenda uma leitura para atualizar a lista de itens do menu.
   * @returns Promise resolvida com `true` somente após o retorno do refresh agendado na leitura,
   * ou com `false` se a renderização não puder ser concluída.
   */
  renderDynamicItems = (): Promise<boolean> => new Promise<boolean>(resolve => {
    writeTask(() => {
      try {
        // Sem os contêineres não há onde renderizar os itens.
        if (!this.dynamicContainerStart || !this.dynamicContainerEnd) {
          resolve(false);
          return;
        }

        // Não usa replaceChildren() porque o mock-doc dos testes não o implementa
        const clear = (container: HTMLElement) => {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        };
        clear(this.dynamicContainerStart);
        clear(this.dynamicContainerEnd);

        this.dynamicItems.forEach(({ item, position }) => {
          const container = position === 'start' ? this.dynamicContainerStart : this.dynamicContainerEnd;
          container.appendChild(item);
        });

        // Necessário agendar uma leitura após a escrita para garantir que o DOM
        // seja atualizado antes de tentar ler os itens novamente.
        readTask(() => {
          try {
            this.refresh();
            resolve(true);
          }
          catch (error) {
            logger.error('Erro em alc-menu > renderDynamicItems > readTask\n', error);
            resolve(false);
          }
        });
      }
      catch (error) {
        logger.error('Erro em alc-menu > renderDynamicItems > writeTask\n', error);
        resolve(false);
      }
    });
  });

  componentDidLoad() {
    this.refresh();
  }

  render() {
    return (
      <Host role="menu" class="alc-menu">
        <div ref={el => this.dynamicContainerStart = el}></div>
        <slot />
        <div ref={el => this.dynamicContainerEnd = el}></div>
      </Host>
    );
  }
}
