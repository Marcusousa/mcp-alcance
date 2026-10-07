import { Component, Prop, h, Host, Element, Listen, Watch, Method, Event, EventEmitter } from '@stencil/core';
import { getFocusableElements } from '../utils/keydown';
import { getUniqueId } from '../utils/getUniqueId';
import logger from '../utils/logger';


/**
 * @slot - O conteúdo do dropdown.
 * @slot trigger - O disparador do dropdown, usualmente um botão.
 */
@Component({
  tag: 'alc-dropdown',
  styleUrl: 'alc-dropdown.css',
  shadow: false,
})
export class AlcDropdown {
  @Element() el: HTMLElement;
  private trigger: HTMLElement;
  private content: HTMLElement;
  private originalTriggerTabindex: number | null;
  private hideOnEventsMap: Map<string, EventListener> = new Map();

  /**
   * Indica se o dropdown esta aberto ou não. Pode-se usar essa propriedade em vez dos métodos show/hide.
   */
  @Prop({
    reflect: true,
    mutable: true
  }) open: boolean = false;

  @Watch('open')
  watchOpen() {
    if (this.trigger) {
      this.handleTriggerAriaExpanded();
      this.handleTriggerTabindex();
    }
  }

  /**
   * Nome do evento que, ao ocorrer no conteúdo do dropdown, vai fazer com que ele seja fechado.
   * Podem ser informados vários eventos, separados por um espaço em branco.
   */
  @Prop({
    reflect: true,
    mutable: false,
  }) hideOn: string = '';

  @Watch('hideOn')
  watchHideOn() {
    // Remove todos os eventos anteriores
    this.hideOnEventsMap.forEach((listener, eventName) => {
      this.content.removeEventListener(eventName, listener);
      this.hideOnEventsMap.delete(eventName);
    })

    // Adiciona todos os novos eventos
    this.addHideOnListeners();
  }

  @Listen('keydown')
  async handleKeydown(event: KeyboardEvent) {
    if (!this.open) return;
    
    if (event.key !== 'Escape') return;

    if (event.defaultPrevented) return;

    event.preventDefault();
    await this.hide();
    this.handleTriggerFocus();
  }

  /**
   * Evento disparado quando o dropdown vai abrir
   */
  @Event({
    eventName: 'alc-show',
    cancelable: true,
    bubbles: true,
  })
  alcShow: EventEmitter<null>;

  /**
   * Evento disparado quando o dropdown abriu
   */
  @Event({
    eventName: 'alc-after-show',
    cancelable: false,
    bubbles: true,
  })
  alcAfterShow: EventEmitter<null>;

  /**
   * Evento disparado quando o dropdown vai fechar
   */
  @Event({
    eventName: 'alc-hide',
    cancelable: true,
    bubbles: true,
  })
  alcHide: EventEmitter<null>;

  /**
   * Evento disparado quando o dropdown fechou
   */
  @Event({
    eventName: 'alc-after-hide',
    cancelable: false,
    bubbles: true,
  })
  alcAfterHide: EventEmitter<null>;

  /**
   * Método para abrir o dropdown.
   * @returns O valor retornado é `true` se o dropdown foi realmente exibido com essa chamada ao método.
   */
  @Method()
  async show(): Promise<boolean> {
    if (this.open) {
      return false;
    }

    const { defaultPrevented } = this.alcShow.emit();
    if (defaultPrevented) {
      return false;
    }

    this.open = true;
    this.alcAfterShow.emit();

    return true;
  }

  /**
   * Método para fechar o dropdown.
   * @returns O valor retornado é `true` se o dropdown foi realmente oculto com essa chamada ao método.
   */
  @Method()
  async hide(): Promise<boolean> {
    if (!this.open) {
      return false;
    }

    const { defaultPrevented } = this.alcHide.emit();
    if (defaultPrevented) {
      return false;
    }

    this.open = false;
    this.alcAfterHide.emit();

    return true;
  }

  private handleAnchorClick = (event: MouseEvent) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    // Se o click foi no trigger (ou dentro dele)
    if (this.trigger?.contains(event.target)) {
      this.toggleDropdown();
    }
  }

  toggleDropdown = async () => {
    this.open ? this.hide() : this.show();
  }

  handleTriggerFocus() {
    this.trigger?.focus();
  }

  handleContentFocus() {
    const contentFirstFocusable = getFocusableElements(this.content)[0];

    if(!contentFirstFocusable) return;

    if(contentFirstFocusable instanceof HTMLElement) {
      contentFirstFocusable.focus();
    }
  }

  private setTriggerAccessibility() {
    if (this.trigger.getAttribute('role') === null) {
      this.trigger.setAttribute('role', "button");
    }

    const contentElementChild = this.content.firstElementChild;

    if (this.trigger.getAttribute('aria-haspopup') === null) {
      const ariaHaspopup = contentElementChild?.role === "menu" ? "menu" : "dialog";
      this.trigger.setAttribute('aria-haspopup', ariaHaspopup);
    }

    let id = contentElementChild?.id ? contentElementChild.id : getUniqueId();

    // Se não ter conteudo dentro, o id vai no alc-dropdown__content se não vai no conteudo
    if(!contentElementChild) {
      this.content.id = id;
    } else {
      contentElementChild.id = id;
    }

    this.trigger.setAttribute('aria-controls', id);
  }

  private handleTriggerAriaExpanded() {
    this.trigger.ariaExpanded = `${this.open}`;
  }

  private handleTriggerTabindex() {
    this.trigger.tabIndex = this.open ? -1 : this.originalTriggerTabindex;
  }

  private async handleFocusOut(e: FocusEvent) {
    const { relatedTarget } = e;
    const isNode = relatedTarget instanceof Node;

    /*
      OBSERVAÇÃO:
      Para que um clique qualquer dentro de content, mesmo se for um elemento não focalizável,
      não resulte em relatedTarget null, foi definido tabindex=-1 para o content.
      Se não fosse assim, um clique em um elemento não focalizável dentro de content
      resultaria no fechamento indesejado do dropdown.
    */
    if (isNode && this.el.contains(relatedTarget)) {
      return;
    }

    await this.hide();
  }

  private handleCloseOn(e: Event) {
    if (e.defaultPrevented) {
      return;
    }
    this.open = false;
  }

  private addHideOnListeners() {
    const hideOn = this.hideOn.trim();
    // Nada a fazer se for um string vazia.
    if (!hideOn) {
      return;
    }

    const eventNames = hideOn.split(/\s+/);

    eventNames.forEach(eventName => {
      const listener = (e: Event) => this.handleCloseOn(e);
      this.hideOnEventsMap.set(eventName, listener);
      this.content.addEventListener(eventName, listener);
    });
  }

  componentDidUpdate() {
    if(this.open) {
      // Quando o trigger for acionado por teclado para abrir o foco deve ir para o primeiro elemento focalizável dentro do conteúdo
      // Foi adicionado para tratar no componentDidUpdate pois no handleKeydown o dropdown ainda esta fechado, logo o 'elemento.focus()' não funciona
      // Aqui o componente ja foi renderizado com o novo estado.
      this.handleContentFocus();
    }
  }

  getTrigger(): HTMLElement {
    let slot: HTMLElement = null;
    let trigger: HTMLElement = null;

    slot = this.el.querySelector('[slot="trigger"]');
    if (slot) {
      if (slot.tagName === 'BUTTON' || slot.getAttribute('role') === 'button') {
        // Trigger é o próprio slot se ele mesmo for o botão
        trigger = slot;
      }
      else {
        // Trigger é o primeiro botão encontrado dentro do slot (se existir)
        trigger = slot.querySelector('button, [role="button"]');
      }
    }

    if (trigger === null) {
      logger.warn(this.el, 'alc-dropdown não localizou um trigger válido. Slot deve ser ou conter um botão. Veja a documentação para mais detalhes.');
    }
    return trigger;
  }

  componentDidLoad() {

    this.trigger = this.getTrigger();

    if (this.trigger) {
      this.setTriggerAccessibility();
      this.handleTriggerAriaExpanded();
      this.originalTriggerTabindex = this.trigger.tabIndex;
    }

    // Adiciona close-on listeners
    this.addHideOnListeners();
  }

  render() {
    return (
      <Host>
        <alc-popup
          active={this.open}
          placement="bottom-start"
          flip
          shift
          strategy="fixed"
          onFocusout={this.handleFocusOut.bind(this)}
          distance={2}
        >
          <div slot="anchor" onClick={this.handleAnchorClick}>
            <slot name="trigger" />
          </div>

          <div class="alc-dropdown__content" ref={(el) => this.content = el} tabindex='-1'>
            <slot></slot>
          </div>
        </alc-popup>
      </Host>
    );
  }
}

