import { Component, Host, h, Prop, Method, Listen, Event, EventEmitter, Watch } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import { getFocusableElements, focusFirstElement, handleKeyDown } from '../utils/keydown';
import test from '../utils/testAttributes';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLockManager';

type hideFromType = 'header-button' | 'footer-button' | 'keyboard' | 'overlay';
export interface AlcModalHideEventDetail {
  from: hideFromType;
}

/**
 * @slot - O conteúdo da modal.
 * @slot header - O conteúdo do cabeçalho da modal.
 * @slot footer - O conteúdo do rodapé da modal.
 */

@Component({
  tag: 'alc-modal',
  styleUrl: 'alc-modal.css',
  scoped: false,
})
export class AlcModal {
  private idModalTitle = null;
  private modalRef?: HTMLElement;
  private triggerElement = null;
  private overlayRef!: HTMLElement;

  /**
   * Define se a modal está aberta ou fechada.
   */
  @Prop({ mutable: true }) open?: boolean = false;

  /**
   * Título da modal
   */
  @Prop({ reflect: true }) headerText: string = '';

  /**
   * Tamanho da modal
   */
  @Prop({ mutable: true,  reflect: true  }) size?: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  /**
   * Previne a modal de fechar ao clicar no overlay.
   */
  @Prop({ reflect: true, mutable: false }) preventOverlayClose: boolean = false;

  @Watch('open')
  watchOpen(open: boolean) {
    if (open) {
      // Show
      this.alcAfterShow.emit();
      this.triggerElement = document.activeElement as HTMLElement;
      lockBodyScroll();
    } else {
      // Hide
      this.alcAfterHide.emit();

      const { defaultPrevented: defaultPreventedFocus } = this.alcFocusAfterHide.emit();
      if (!defaultPreventedFocus) {
        this.handleFocusWhenCloseModal();
        unlockBodyScroll();
      }

    }
  }

  /**
   * Evento disparado quando a modal abriu
   */
  @Event({
    eventName: 'alc-after-show',
    cancelable: false,
    bubbles: true,
  })
  alcAfterShow: EventEmitter<null>;

  /**
   * Evento disparado quando a modal vai fechar
   */
  @Event({
    eventName: 'alc-hide',
    cancelable: true,
    bubbles: true,
  })
  alcHide: EventEmitter<{
    from: 'header-button' | 'footer-button' | 'keyboard' | 'overlay';
  }>;

  /**
   * Evento disparado quando a modal fechou
   */
  @Event({
    eventName: 'alc-after-hide',
    cancelable: false,
    bubbles: true,
  })
  alcAfterHide: EventEmitter<null>;

  /**
   * Evento disparado quando a modal fechou e esta pronto para lidar com foco.
   */
  @Event({
    eventName: 'alc-focus-after-hide',
    cancelable: true,
    bubbles: true,
  })
  alcFocusAfterHide: EventEmitter<null>;

  /**
   * Método para abrir modal.
   * @returns O valor retornado é `true` se a modal foi realmente exibida com essa chamada ao método.
   */
  @Method()
  async show(): Promise<boolean> {
    if (this.open) {
      return false;
    }

    this.open = true;
    return true;
  }

  /**
   * Método para fechar modal.
   * @returns O valor retornado é `true` se a modal foi realmente oculta com essa chamada ao método.
   */
  @Method()
  async hide(): Promise<boolean> {
    if (!this.open) {
      return false;
    }
    
    this.open = false;
    return true;
  }

  /**
   * Foco fica dentro da modal quando aberta.
   */
  @Listen('keydown', { target: 'document' })
  handleKeyDown(event: KeyboardEvent) {
    if (!this.open) {
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.handleHideByUser('keyboard');
      return;
    }

    if (event.key !== 'Tab') return;
    const focusableElements = getFocusableElements(this.modalRef);
    handleKeyDown(event, focusableElements);
  }

  componentWillLoad() {
    // Antes do componente carregar, cria um id para o titulo da modal (Acessibilidade).
    this.idModalTitle = getUniqueId();

  }

  componentDidRender() {
    // Pega os elementos focáveis a cada renderização (Pode haver mudanças na modal).
    const focusableElements = getFocusableElements(this.modalRef);

    // Após o componente renderizar e estiver aberto, então ja coloca foco dentro da modal.
    if (this.open) {
      focusFirstElement(focusableElements);
    }
  }

  connectedCallback() {
    if (this.open) {
      lockBodyScroll();
    }
  }

  disconnectedCallback() {
    if (this.open) {
      unlockBodyScroll();
    }
  }

  private getModalRef = element => (this.modalRef = element as HTMLElement);

  private handleFocusWhenCloseModal = () => {
    const defaultFocus = ['BODY', 'DOCUMENT'];
    const hasTriggerElement = !!this.triggerElement && document.body.contains(this.triggerElement);

    if (hasTriggerElement && !defaultFocus.includes(this.triggerElement.tagName)) {
      this.triggerElement.focus();
    }

  };

  private handleOutsideClick(event: MouseEvent) {
    const isClickedOutside = event.target === this.overlayRef;

    if (isClickedOutside) {
      this.handleHideByUser('overlay');
    }
  }

  private handleHideByUser(hideFrom: hideFromType) {
    // Se o usuário clicar no overlay e estiver impedido de fechar, não faz nada.
    if (hideFrom === 'overlay' && this.preventOverlayClose) return;

    const { defaultPrevented } = this.alcHide.emit({from: hideFrom});
    if (!defaultPrevented) {
      this.open = false;
    }
  }

  render() {
    return (
      <Host style={{ display: this.open ? 'block' : 'none' }}>
        <div class="alc-modal__base">
          <div
            class="alc-modal__overlay"
            onClick={(e) => this.handleOutsideClick(e)}
            {...test('data-test-overlay')}
            ref={el => this.overlayRef = el}
          >
          </div>
          <div
            class={{
              'alc-modal__card': true,
              'alc-modal__card--sm':   this.size === "sm",
              'alc-modal__card--md':   this.size === "md",
              'alc-modal__card--lg':   this.size === "lg",
              'alc-modal__card--xl':   this.size === "xl",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={this.idModalTitle}
            ref={this.getModalRef}
            {...test('data-test-modal-card')}
          >
            <div class="alc-modal__header">
              {this.headerText ? (
                <h2 id={this.idModalTitle} class="alc-modal__title" {...test('data-test-modal-title')}>
                  {this.headerText}
                </h2>
              ) : (
                <slot name="header"></slot>
              )}
              <button type="button" class="alc-button alc-button-rounded" onClick={() => this.handleHideByUser('header-button')} {...test('data-test-close-button')}>
                <alc-icon name="x-lg" label="Fechar Modal" {...test('data-test-close-icon')} />
              </button>
            </div>
            <div class="alc-modal__content">
              <slot></slot>
            </div>
            <div class="alc-modal__footer">
              <slot name="footer">
                <button type="button" class="alc-button alc-button-primary" onClick={() => this.handleHideByUser('footer-button')} {...test('data-test-footer-close-button')}>
                  Fechar
                </button>
              </slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
