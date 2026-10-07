import { Component, Host, Method, Prop, Watch, State, Element, h } from '@stencil/core';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-loading',
  styleUrl: 'alc-loading.css',
  shadow: false,
})
export class AlcLoading {
  @Element() el: HTMLElement;
  /**
   * Define se o indicador de carregamento aparece na tela. Quando o valor é `true` mostra o componente e quando o valor é `false` oculta.
   */
  @Prop({ mutable: true, reflect: true }) active: boolean = false;

  /**
  * Texto mostrado na tela enquanto estiver carregando e também anunciado no leitor de tela quando o estado mudar para `active=true`.
  */
  @Prop({reflect: true}) label: string = 'Carregando...';

  /**
  * Texto anunciado ao leitor de tela quando mudar o estado para `active=false`.
  */
  @Prop({reflect: true}) endMsg: string = 'Finalizado.';

  /**
   * Define a variação visual do componente:
   * - `'full-screen'`: ocupa a tela inteira.
   * - `'container'`: ocupa o elemento pai.
   * - `'inline'`: utilizado dentro de textos.
   * - `'button'`: utilizado dentro de botões.
   */
  @Prop({ reflect: true }) variant: 'full-screen' | 'container' | 'inline' | 'button' = 'full-screen';

  /**
   * Mensagem interna para a região aria-live.
   */
  private ariaMessage: string = '';

  private parentButton: HTMLButtonElement | null = null;

  /**
   * Exibe o loading.
   * @returns O valor retornado é `true` se o loading foi realmente exibido com essa chamada ao método.
   */
  @Method()
  async show(): Promise<boolean> {
    if (this.active) {
      return false;
    }
    this.active = true;
    return true;
  }

  /**
   * Esconde o loading.
   * @returns O valor retornado é `true` se o loading foi realmente oculto com essa chamada ao método.
   */
  @Method()
  async hide(): Promise<boolean> {
    if (!this.active) {
      return false;
    }
    this.active = false;
    return true;
  }

  @Watch('active')
  onActiveChange(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      this.updateAriaMessage();
      if (this.variant === 'button') {
        this.updateParentButtonAttributes();
      }
    }
  }

  componentWillLoad() {
    this.updateAriaMessage();
  }

  componentDidLoad() {
    if (this.variant === 'button') {
      this.findParentButton();
      this.updateParentButtonAttributes();
    }
  }

  private updateAriaMessage() {
    this.ariaMessage = this.active ? this.label : this.endMsg;
  }

  private findParentButton() {
    this.parentButton = this.el.closest('button');
    if (!this.parentButton) {
      logger.warn('alc-loading[variant="button"] deve estar dentro de um elemento <button>.');
    }
  }

  private updateParentButtonAttributes() {
    if (this.parentButton) {
      if (this.active) {
        this.parentButton.setAttribute('aria-label', this.label);
      } else {
        this.parentButton.removeAttribute('aria-label');  
      }
    }
  }

  render() {
    const shouldRenderAriaLive = this.variant !== 'button';
  
    return (
      <Host>
        {this.renderLoadingVisuals()}
        {shouldRenderAriaLive && (
          <div class="sr-only" aria-live="polite" role="status" {...test('data-test-acessibility')}>
            {this.ariaMessage}
          </div>
        )}
      </Host>
    );
  }

  private renderLoadingVisuals() {
    switch (this.variant) {
      case 'full-screen':
        return this.renderFullScreen();
      case 'container':
        return this.renderContainer();
      case 'inline':
        return this.renderInline();
      case 'button':
        return this.renderButton();
      default:
        return null;
    }
  }

  private renderFullScreen() {
    if (!this.active) return null;
    return (
      <div class="alc-loading__overlay" aria-hidden="true">
        <div class="alc-loading__card">
          <p>{this.label}</p>
        </div>
      </div>
    );
  }

  private renderContainer() {
    if (!this.active) return null;
    return (
      <div class="alc-loading__overlay-container" aria-hidden="true">
        <div class="alc-loading__card-container">
          <div class="alc-loading__spinner-container"></div>
          <p>{this.label}</p>
        </div>
      </div>
    );
  }

  private renderInline() {
    if (!this.active) return null;
    return (
      <div class="alc-loading__inline" aria-hidden="true">
        <div class="alc-loading__spinner-inline"></div>
        <span class="alc-loading__label">{this.label}</span>
      </div>
    );
  }

  private renderButton() {
    if (!this.active) return null;
    return (
      <div class="alc-loading__button" aria-hidden="true">
        <span class="alc-loading__button-wrapper">
          <div class="alc-loading__spinner-button"></div>
        </span>
      </div>
    );
  }
}