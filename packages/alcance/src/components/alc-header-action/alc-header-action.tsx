import { Component, Host, Prop, Event, EventEmitter, Element, h } from '@stencil/core';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

export interface AlcActionDetail {
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * @slot DEFAULT - Slot para o conteúdo do componente.
 */
@Component({
  tag: 'alc-header-action',
  styleUrl: 'alc-header-action.css',
  shadow: false,
})
export class AlcHeaderAction {
  @Element() hostElement: HTMLElement;

  slot: HTMLSlotElement;
  slotNodes = null;
  buttonContainer: HTMLElement;
  linkContainer: HTMLElement;
  menuItemContainer: HTMLElement;
  menuLinkContainer: HTMLElement;

  /**
   * Nome do ícone a ser exibido.
   */
  @Prop({
    reflect: true
  })
  iconName: string = 'square';

  /**
   * Define o tipo de elemento a ser renderizado.
   */
  @Prop({
    reflect: true
  })
  variant: 'button' | 'menu-item' | 'link' | 'menu-link' = 'button';

  /**
   * URL para a página de suporte. Usado quando a propriedade `variant` é `link` ou `menu-link`.
   */
  @Prop() url: string = '';

  private spaceKeyEvent: KeyboardEvent = null;

  /**
   * Evento disparado quando o usuário aciona o suporte.
   */
  @Event({ eventName: 'alc-select', bubbles: true })
  alcSelect: EventEmitter<{
    originalEvent: MouseEvent | KeyboardEvent;
  }>;

  /** handler comum a todas as ativações locais */
  private triggerEvent = (detail: AlcActionDetail) => {
    this.alcSelect.emit(detail);
  };

  handleKeyDownLink(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      const anchor = this.hostElement.querySelector('a');
      if (anchor) {
        this.spaceKeyEvent = event;
        anchor.click();
      }
    }
  }

  handleClickLink(event: MouseEvent) {
    const originalEvent = this.spaceKeyEvent ?? event;
    this.spaceKeyEvent = null; // Despreza esse evento para os próximos disparos.
    this.triggerEvent({ originalEvent: originalEvent });
  }

  handleKeyDownButton(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.triggerEvent({ originalEvent: event });
    }
  }

  handleClickButton(event: MouseEvent) {
    event.preventDefault()
    this.triggerEvent({ originalEvent: event });
  }

  handleAlcSelect(event: CustomEvent) {
    // Esse código faz com que o evento deixe de ser do menu-item ou do menu-link
    // e passe a ser um evento do header-action.
    // Dessa forma, o usuário desse componente não precisa se preocupar com esse
    // detalhe da implementação interna. Ou seja, para todos os efeitos, para quem
    // vê de fora, o evento é disparado pelo header-action.
    event.stopPropagation();
    this.triggerEvent({
      originalEvent: event.detail.originalEvent
    });
  }

  componentDidLoad() {
    this.slotNodes = this.slot.assignedNodes();
  }

  componentDidRender() {
    logger.debug('alc-header-action did render', this.slotNodes);

    // Captura os nós do <slot> apenas na primeira execução
    this.slotNodes ??= this.slot?.assignedNodes();

    // Mapeia cada variante ao respectivo container
    const containerByVariant: Record<AlcHeaderAction['variant'], HTMLElement | undefined> = {
      button: this.buttonContainer,
      link: this.linkContainer,
      'menu-item': this.menuItemContainer,
      'menu-link': this.menuLinkContainer,
    };

    const target = containerByVariant[this.variant];
    const node = this.slotNodes?.[0];

    // Só anexa se ambos existirem e o nó ainda não estiver no container
    if (target && node && !target.contains(node)) {
      target.appendChild(node);
    }
  }


  render() {
    // Tabela de renderização por variante
    const renderByVariant: Record<
      AlcHeaderAction['variant'],
      (() => any) | undefined
    > = {
      button: this.renderButton.bind(this),
      link: this.renderLink.bind(this),
      'menu-item': this.renderMenuItem.bind(this),
      'menu-link': this.renderMenuLink.bind(this),
    };

    // Executa o renderer correspondente (se existir)
    const VariantContent = renderByVariant[this.variant]?.();

    return (
      <Host>
        {/* Captura o <slot> apenas uma vez */}
        <slot ref={el => (this.slot = el as HTMLSlotElement)} />
        {VariantContent}
      </Host>
    );
  }

  renderButton() {

    return (
      <button
        class="alc-header-button"
        onClick={this.handleClickButton.bind(this)}
        onKeyDown={this.handleKeyDownButton.bind(this)}
        {...test('data-test-button')}
      >
        <alc-icon icon={this.iconName} label="" class="alc-header-button__icon" {...test('data-test-icon')}></alc-icon>
        <span
          class="alc-header-button__label"
          ref={el => this.buttonContainer = el}
          {...test('data-test-label')}
        >
        </span>

        {/* {this.slot} */}
      </button>
    );
  }

  renderLink() {

    return (
      <a
        href={this.url}
        class="alc-header-button"
        onClick={this.handleClickLink.bind(this)}
        onKeyDown={this.handleKeyDownLink.bind(this)}
        {...test('data-test-link')}
      >
        <alc-icon icon={this.iconName} label="" class="alc-header-button__icon" {...test('data-test-icon')}></alc-icon>
        <span
          class="alc-header-button__label"
          ref={el => this.linkContainer = el}
          {...test('data-test-label')}
        >
        </span>

        {/* {this.slot} */}
      </a>
    );
  }


  renderMenuItem() {
    return (
      <alc-menu-item
        onAlc-select={this.handleAlcSelect.bind(this)}
        {...test('data-test-menu-item')}
      >
        <alc-icon slot="prefix" icon={this.iconName} label="" {...test('data-test-icon')}></alc-icon>
        <span
          ref={el => this.menuItemContainer = el}
          {...test('data-test-label')}
        >
        </span>
        {/* {this.slot} */}
      </alc-menu-item>
    );
  }

  renderMenuLink() {
    return (
      <alc-menu-link
        onAlc-select={this.handleAlcSelect.bind(this)}
        {...test('data-test-menu-link')}
      >
        <a
          href={this.url}
          ref={el => this.menuLinkContainer = el}
          {...test('data-test-link')}
        >
          <alc-icon icon={this.iconName} label="" class="alc-header-action__menu-link-icon" {...test('data-test-icon')}></alc-icon>

          {/* {this.slot} */}
        </a>
      </alc-menu-link>
    );
  }
}
