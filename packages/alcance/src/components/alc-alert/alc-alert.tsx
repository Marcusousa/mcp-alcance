import { Component, Element, Prop, Event, EventEmitter, h, Method, Watch, Host } from '@stencil/core';
import { AlertCore } from './alc-alert.core';
import { Type } from './index';
import ALC from '../../core/alc';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

// @TODO Ver se é possível deixar os códigos SVG separados em outros arquivos,
//       mas sem que crie problemas com importação de assets quando for distribuído.
const iconMap = new Map();

iconMap.set('info', {
  label: 'Informação:',
  name: 'info-circle'
});
iconMap.set('error', {
  label: 'Erro:',
  name: 'x-circle'
});
iconMap.set('warning', {
  label: 'Alerta:',
  name: 'exclamation-circle'
});
iconMap.set('success', {
  label: 'Sucesso:',
  name: 'check-circle'
});

// Comentários sobre o comentário (jsdoc-like) abaixo:
//
// 1- O texto livre inicial é colocado na chave `docs` do json.
//
// 2- @slot é uma tag definida pelo StencilJS. É colocado na chave:
//   slots: [
//     {
//       "name": "default",
//       "docs": "Slot para o conteúdo do alert"
//     }
//   ]
//
// 3- @picWidget é um exemplo de tag customizada. É colocado na chave:
//   docsTags: [
//     {
//       "name": "picWidget",
//       "text": "pic-alert"
//     }
//   ]
/**
 * Vamos lá testar.
 * Ver se isso vai funcionar.
 * ^^^^^ [1]
 *
 * @slot - Slot para o conteúdo do alert.
 * @slot summary - Slot para o summary do alert.
 * @picWidget pic-alert
 */

@Component({
  tag: 'alc-alert',
  styleUrl: 'alc-alert.css',
  scoped: false,
})

export class Alert {

  // The alert core
  private core: AlertCore;

  @Element() el: HTMLAlcAlertElement;

  /**
   * Indica se o alert está visível. Pode-se usar essa propriedade em vez dos métodos show/hide.
    */
  @Prop({ mutable: true, reflect: true }) visible: boolean = true;

  @Watch('visible')
  watchPropVisible(newValue: boolean) {
    newValue === true ? this.core.show() : this.core.hide();
  }

  /**
   * O tipo do alert, de acordo com a natureza da mensagem nele contido.
   */
  // @TODO O ideal seria buscar o valor default do core, mas não fica legal a documentação
  @Prop({ reflect: true }) type: Type = 'info';

  @Watch('type')
  watchType(newValue: Type) {
    this.core.type = newValue;
  }

  /**
   * Define se o alert pode ser dispensado pelo usuário.
   */
  // @TODO O ideal seria buscar o valor default do core, mas não fica legal a documentação
  @Prop({ reflect: true }) dismissible: boolean = true;

  @Watch('dismissible')
  watchDismissible(newValue: boolean) {
    this.core.dismissible = newValue;
  }

  /**
   * Evento disparado quando o alert é dispensado.
   */
  @Event({
    eventName: 'alc-hide',
    cancelable: true,
    bubbles: true

  }) alcHide: EventEmitter<null>;
  /**
   * Evento disparado quando o alert é dispensado.
   */
  @Event({
    eventName: 'alc-after-hide',
    cancelable: false,
    bubbles: true
  }) alcAfterHide: EventEmitter<null>;

  connectedCallback() {
    this.core = new AlertCore({
      type: this.type,
      dismissible: this.dismissible,
      visible: this.visible,
      dispatchHide: () => this.emitHide(),
      dispatchAfterHide: () => this.emitAfterHide(),
      setVisible: this.setVisible
    });
  }

  /**
   * Fecha o alert.
   * @returns O valor retornado é `true` se o alert foi realmente dispensado com essa chamada ao método.
   */
  @Method()
  async hide(): Promise<boolean> {
    return this.core.hide();
  }

  /**
   * Exibe o alert.
   * @returns O valor retornado é `true` se o alert foi realmente exibido com esa chamada ao método.
   */
  @Method()
  async show(): Promise<boolean> {
    return this.core.show();
  }

  /*
   * Dispara o evento will dismiss
   */
  private emitHide(): CustomEvent {
    return this.alcHide.emit();
  }

  /*
   * Dispara o evento did dismiss
   */
  private emitAfterHide(): CustomEvent {
    return this.alcAfterHide.emit();
  }


  /*
   * Renderiza o ícone de acordo com o type
   */
  private renderIcon(): string {
    let icon = iconMap.get(this.core.type);
    return <alc-icon name={icon.name} label={icon.label}></alc-icon>
  }

  /*
   * Renderiza o botão "dispensar" se for o caso.
   */
  private renderDismissButton(): string {
    // Will not have a button if !dismissible
    if (!this.core.dismissible) {
      return null;
    }

    return (
      <div class="alc-alert__dismiss" {...test('data-test-dismiss')}>
        <button
          class={`alc-button alc-button-rounded alc-button-rounded--${this.core.type}`}
          onClick={() => this.hide()}
        >
          <alc-icon name="x-lg" label="Dispensar"></alc-icon>
        </button>
      </div>
    );
  }

  private setVisible = (visible: boolean) => {
    this.visible = visible;
  }

  componentDidRender() {
    this.el.querySelectorAll('a').forEach(link => {
      link.classList.add('alc-link--color-text');
    });
  }

  /**
   * StencilJS render
   */

  render() {

    logger.debug('render alc-alert', ALC);

    return (
      <Host
        style={{display: this.visible ? null : 'none'}}
      >
        <div class={"alc-alert alc-alert--" + this.core.type}>
          {this.renderIcon()}
          <div class='alc-alert__content'>
            <div class="alc-alert__summary">
              <slot name="summary"></slot>
            </div>
            <slot />
          </div>

          {this.renderDismissButton()}
        </div>
      </Host>
    );
  }
}
