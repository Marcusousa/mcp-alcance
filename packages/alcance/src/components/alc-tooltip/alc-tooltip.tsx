import { Component, Host, Prop, h, Method, Event, EventEmitter, Watch, Listen } from '@stencil/core';
import { PopupPlacement } from '../alc-popup/alc-popup';
import { getUniqueId } from '../utils/getUniqueId';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-tooltip',
  styleUrl: 'alc-tooltip.css',
  shadow: false
})
export class AlcTooltip {
  contentId: string = null;
  anchorSlot: HTMLSlotElement;
  anchorEl: HTMLElement;
  hasClickedOrFocused: boolean = false;

  /**
  * Indica se o tooltip esta ativo ou não. Pode-se usar essa propriedade em vez dos métodos show/hide.
  */
  @Prop({ reflect: true, mutable: true }) active: boolean = false;

  /**
  * Indica o conteudo textual do tooltip. Pode-se usar o slot em vez dessa propriedade.
  */
  @Prop({ reflect: true }) content: string = null;

  /**
  * Define o posicionamento do tooltip.
  */
  @Prop({ reflect: true }) placement: PopupPlacement = 'top';

  /**
  * Define como o tooltip vai ser ativado. Pode ser: `click` , `hover` , `focus` e/ou `manual`. Pode adicionar mais de um, separando por espaço. Ex.: 'hover focus'.
  */
  @Prop({ reflect: true }) trigger: string = 'hover focus';

  /**
  * Define o posicionamento do tooltip.
  */
  @Prop({ reflect: true }) strategy: 'absolute' | 'fixed' = 'absolute';

  /**
   * Exibe o tooltip.
   * @returns O valor retornado é `true` se o tooltip foi realmente exibido com essa chamada ao método.
   */
  @Method()
  async show(): Promise<boolean> {
    if (this.active) return false;

    this.active = true;
    return true;
  }

  /**
  * Fecha o tooltip.
  * @returns O valor retornado é `true` se o tooltip foi realmente dispensado com essa chamada ao método.
  */
  @Method()
  async hide(): Promise<boolean> {
    if (!this.active) return false;
    
    this.active = false;
    return true;
  }

  /**
  * Evento disparado quando o tooltip vai abrir
  */
  @Event({
    eventName: 'alc-show',
    cancelable: true,
    bubbles: true,
  })
  alcShow: EventEmitter<{
    from: 'click' | 'hover' | 'focus';
  }>;;

  /**
  * Evento disparado quando o tooltip abriu
  */
  @Event({
    eventName: 'alc-after-show',
    cancelable: false,
    bubbles: true,
  })
  alcAfterShow: EventEmitter<null>;

  /**
  * Evento disparado quando o tooltip vai fechar.
  */
  @Event({
    eventName: 'alc-hide',
    cancelable: true,
    bubbles: true,
  })
  alcHide: EventEmitter<{
    from: 'click' | 'hover' | 'focus' | 'keyboard';
  }>;

  /**
  * Evento disparado quando o tooltip fechou.
  */
  @Event({
    eventName: 'alc-after-hide',
    cancelable: true,
    bubbles: true,
  })
  alcAfterHide: EventEmitter<null>;

  @Watch('active')
  watchActive(active: boolean) {
    if (active) {
      // Show
      this.alcAfterShow.emit();
    } else {
      // Hide
      this.alcAfterHide.emit();
    }
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if(event.key === 'Escape') {
      event.preventDefault();
      this.anchorEl?.focus();
      this.handleHide('keyboard');
    }
  }

  @Listen('focus', { capture: true })
  handleFocus() {
    if (!this.hasTrigger('focus')) return;

    const opened = this.handleShow('focus');
    if (opened) this.hasClickedOrFocused = true;
  }

  @Listen('blur', { capture: true })
  handleBlur() {
    if (!this.hasTrigger('focus')) return;

    const closed = this.handleHide('focus');
    if (closed) this.hasClickedOrFocused = false;
  }

  @Listen('mouseover')
  handleMouseOver() {
    if(!this.hasTrigger('hover')) return;
    this.handleShow('hover');
  }

  @Listen('mouseout')
  handleMouseOut() {
    if(!this.hasTrigger('hover')) return;

    // Verifica se ja foi aberto por click ou foco para não fechar com hover
    if (this.hasClickedOrFocused) return;
    
    this.handleHide('hover');
  }

  @Listen('click')
  handleClick() {
    if(!this.hasTrigger('click')) return;

    if(this.active) {
      // Hide
      const closed = this.handleHide('click');
      if (closed) this.hasClickedOrFocused = false;
    } else {
      // Show
      const opened = this.handleShow('click');
      if (opened) this.hasClickedOrFocused = true;
    }
  }

  componentWillLoad() {
    this.contentId = getUniqueId();
  }

  componentDidLoad() {
    if(this.anchorSlot) {
      const el = this.anchorSlot.assignedElements()[0];
      if (el instanceof HTMLElement) {
        this.anchorEl = el;
        this.anchorEl.setAttribute('aria-describedby', this.contentId);
        this.anchorEl.setAttribute('tabindex', '0');
      }
    }
  }

  async handleHide(type: 'click' | 'hover' | 'focus' | 'keyboard') {
    const { defaultPrevented } = this.alcHide.emit({from: type});
    let closed = false;

    if(!defaultPrevented) {
      closed = await this.hide();
    }

    return closed;
  }

  async handleShow(type: 'click' | 'hover' | 'focus' ) {
    const { defaultPrevented } = this.alcShow.emit({from: type});
    let opened = false;

    if(!defaultPrevented) {
      opened = await this.show();
    }
    
    return opened;
  }

  hasTrigger(triggerType: string) {
    const triggers = this.trigger.split(' ');
    return triggers.includes(triggerType);
  }

  render() {
    return (
      <Host>
        <alc-popup
          active={this.active}
          placement={this.placement}
          shift
          flip
          distance={8}
          arrow
          role="tooltip"
          strategy={this.strategy}
        >
          <div slot="anchor" {...test('data-test-trigger')}>
            <slot name="trigger" ref={(el: HTMLSlotElement) => this.anchorSlot = el}/>
          </div>

          <div class="alc-tooltip__content" id={this.contentId} {...test('data-test-content')}>
            <slot>{this.content}</slot>
          </div>
        </alc-popup>
      </Host>
    );
  }
}
