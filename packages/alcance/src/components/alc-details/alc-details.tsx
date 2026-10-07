// @ts-nocheck
import { h, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, Listen } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import logger from '../utils/logger';

@Component({
  tag: 'alc-details',
  styleUrl: 'alc-details.css',
  shadow: false,
})
export class AlcDetails {
  @Element()
  element: HTMLElement;
  detailsElement: HTMLElement;
  summaryElement: HTMLElement;
  contentElement: HTMLElement;
  private idDetails = null;
  private ro: ResizeObserver;

  /**
   * Insere o summary do details.
   */
  @Prop({ reflect: true }) summary!: string;

  /**
   * Desativa o componente.
   */
  @Prop({ reflect: true }) disabled: boolean;

  /**
   * Mantém aberto.
   */
  @Prop({
    mutable: true,
  })
  opened: boolean = false;

  @State() maxHeight: number = null;

  /**
   * Evento disparado quando a details abrir
   */
  @Event({
    eventName: 'alc-show',
    cancelable: true,
    bubbles: true,
  })
  alcShow: EventEmitter<null>;

  /**
   * Evento disparado quando a details fechar
   */
  @Event({
    eventName: 'alc-close',
    cancelable: false,
    bubbles: true,
  })
  alcClose: EventEmitter<null>;

  private showDetails = (e: Event) => {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    this.opened = this.detailsElement.open;
    if (this.opened) {
      this.alcShow.emit();
    } else {
      this.alcClose.emit();
    }
  };

  private renderIcon() {
    return (
      <alc-icon
        name="chevron-right"
        label="Expandir"
        class={{
          'alc-details__icon': true,
          'is-open': this.opened,
        }}
      ></alc-icon>
    );
  }

  componentWillLoad() {
    // Antes do componente carregar, cria um id para o details.
    this.idDetails = getUniqueId();
  }

  componentDidLoad() {
    // Aguarda carga do componente para inserir o listener do evento
    this.detailsElement.addEventListener('toggle', this.showDetails);

  }


  // Configuração de altura para animação removida até ajustar para que funcione details dentro do tabs
  // componentDidRender() {
  //   this.summaryElement = this.detailsElement.querySelector('.alc-details__summary');
  //   this.contentElement = this.detailsElement.querySelector('.alc-details__content');

  //   // Por meio do ResizeObserver, redefine o valor de altura máxima, deixando a altura do conteúdo
  //   // dentro do details dinâmico
  //   const target = this.contentElement;
  //   const modifierElement = this.detailsElement;
  //   const minHeight = this.summaryElement.offsetHeight;

  //   function observerCallback() {
  //     const targetHeight = target.scrollHeight;
  //     const height = targetHeight + minHeight + 1;
  //     modifierElement.style.setProperty('--min-height', minHeight + 'px');
  //     modifierElement.style.setProperty('--max-height', height + 'px');
  //   }

  //   this.ro = new ResizeObserver(observerCallback);
  //   this.ro.observe(target);

  //   // Inicia com um cálculo de altura necessário para animação.
  //   // Não interfere na dinâmica do conteúdo.
  //   if (modifierElement) {
  //     const minHeight = this.summaryElement.offsetHeight;
  //     const maxHeight = this.contentElement.offsetHeight;

  //     modifierElement.style.setProperty('--min-height', minHeight + 'px');
  //     modifierElement.style.setProperty('--content-height', maxHeight + 'px');
  //   }

  // }

  render() {
    this.summary ?? logger.report('summary', this.element.tagName.toLowerCase(), this.element)
    return (
      <Host>
        <details
          id={this.idDetails}
          open={this.opened}
          class={{
            'alc-details': true,
            'is-disabled': this.disabled,
            'is-open': this.opened,
          }}
          ref={el => (this.detailsElement = el)}
        >
          <summary
            class={{
              'alc-details__summary': true,
              'is-disabled': this.disabled,
              'is-open': this.opened
            }}
          >
            {this.renderIcon()}
            {this.summary}
          </summary>
          <div class="alc-details__content">
            <slot></slot>
          </div>
        </details>
      </Host>
    );
  }
}
