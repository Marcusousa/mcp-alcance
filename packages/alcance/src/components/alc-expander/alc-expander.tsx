import {
  Component,
  Element,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Method,
  Watch,
  State,
} from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import logger from '../utils/logger';

/**
 * @slot label - Slot para rótulo do controle. Há opção de adicionar apenas texto por meio da propriedade `label`.
 * Use esse recurso caso seja necessário alguma personalização no HTML referente ao rótulo.
 * Não inclua headings (`h1`, `h2` etc.) nem elementos interativos (`a`, `button`, `input` etc.) nesse slot.
 * @slot DEFAULT  - Slot para o conteúdo do expander.
*/

/**
 * @internal
 */
@Component({
  tag: 'alc-expander',
  styleUrl: 'alc-expander.css',
  shadow: false,
})
export class AlcExpander {
  @Element() element!: HTMLElement;
  private expanderId: string = getUniqueId();

  /**
   * Rótulo do elemento que controla a abertura e o fechamento do expander.
   */
  @Prop({ reflect: true }) label!: string;

  /**
   * Define se o expander está aberto ou fechado.
   */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /**
   * Oculta o rótulo do controle, mantendo-o acessível para leitores de tela.
   */
  @Prop({ reflect: true }) hideLabel: boolean = false;

  @State() isOpen: boolean = this.open;

  /**
   * Evento disparado antes de abrir. Cancelável.
   */
  @Event({ eventName: 'alc-show', cancelable: true, bubbles: true })
  alcShow: EventEmitter<void>;

  /**
   * Evento disparado após abrir.
   */
  @Event({ eventName: 'alc-after-show', bubbles: true })
  alcAfterShow: EventEmitter<void>;

  /**
   * Evento disparado antes de fechar. Cancelável.
   */
  @Event({ eventName: 'alc-hide', cancelable: true, bubbles: true })
  alcHide: EventEmitter<void>;

  /**
   * Evento disparado após fechar.
   */
  @Event({ eventName: 'alc-after-hide', bubbles: true })
  alcAfterHide: EventEmitter<void>;

  @Watch('open')
  syncOpen(newValue: boolean) {
    this.isOpen = newValue;
  }

  componentWillLoad() {
    this.isOpen = this.open;
  }

  private toggleExpander = async (event: Event) => {
    event.preventDefault(); // previne comportamento nativo de abrir imediatamente

    if (!this.isOpen) {
      await this.show();
    } else {
      await this.hide();
    }
  };

  /**
   * Abre o expander programaticamente.
   */
  @Method()
  async show(): Promise<void> {
    if (!this.isOpen) {
      const showEvent = this.alcShow.emit();
      if (showEvent.defaultPrevented) return;
      this.isOpen = true;
      this.open = true;
      this.alcAfterShow.emit();
    }
  }

  /**
   * Fecha o expander programaticamente.
   */
  @Method()
  async hide(): Promise<void> {
    if (this.isOpen) {
      const hideEvent = this.alcHide.emit();
      if (hideEvent.defaultPrevented) return;
      this.isOpen = false;
      this.open = false;
      this.alcAfterHide.emit();
    }
  }

  private renderChevron() {
    const iconName = this.isOpen ? 'chevron-up' : 'chevron-down';
    return (
      <alc-icon
        name={iconName}
        label=""
        class="alc-expander__chevron"
      ></alc-icon>
    );
  }

  render() {
    this.label ?? logger.report('label', this.element.tagName.toLowerCase(), this.element);
    
    const labelContent = (
      <div
        class={{
          'alc-expander__label-container': true,
          'sr-only': this.hideLabel,
        }}
      >
        <slot name="label">{this.label}</slot>
      </div>
    );

    const summaryClasses = {
      'alc-expander__summary': true,
      'alc-expander__summary--center': this.hideLabel,
    };

    return (
      <Host>
        <details
          id={this.expanderId}
          class={{
            'alc-expander': true,
            'is-open': this.isOpen,
          }}
          open={this.isOpen}
        >
          <summary
            class={summaryClasses}
            onClick={this.toggleExpander}
          >
            {labelContent}
            {this.renderChevron()}
          </summary>
          <div class="alc-expander__content">
            <slot></slot>
          </div>
        </details>
      </Host>
    );
  }
}