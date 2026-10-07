import { Component, Host, h, Prop, Method, Listen, Event, EventEmitter, Watch } from '@stencil/core';
import { getFocusableElements, focusFirstElement, handleKeyDown } from '../utils/keydown';
import test from '../utils/testAttributes';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLockManager';
@Component({
  tag: 'alc-drawer',
  styleUrl: 'alc-drawer.css',
  scoped: false,
})
export class AlcDrawer {
  private drawerRef?: HTMLElement;
  private triggerElement = null;

  /**
  * Elemento ou ID do elemento que será focado quando o drawer fechar.
  */
  @Prop() elementToFocus?: HTMLElement | string = null;

  /**
  * Define se o drawer está aberto ou fechado.
  */
  @Prop({ mutable: true, reflect: true }) isVisible?: boolean = false;

  @Watch('isVisible')
  watchIsVisible(isVisible: boolean) {
    if (isVisible) {
      lockBodyScroll();
      this.triggerElement = document.activeElement as HTMLElement;
      this.show();
      return isVisible;
    }

    unlockBodyScroll();
    this.hide();
    return isVisible;
  }

  /**
   * Evento disparado quando o drawer vai abrir
   */
  @Event({
    eventName: 'alc-show',
    cancelable: true,
    bubbles: true
  }) alcShow: EventEmitter<null>;

  /**
   * Evento disparado quando o drawer abriu
   */
  @Event({
    eventName: 'alc-after-show',
    cancelable: false,
    bubbles: true
  }) alcAfterShow: EventEmitter<null>;

  /**
  * Evento disparado quando o drawer vai fechar
  */
  @Event({
    eventName: 'alc-hide',
    cancelable: true,
    bubbles: true
  }) alcHide: EventEmitter<null>;

  /**
   * Evento disparado quando o drawer fechou
   */
  @Event({
    eventName: 'alc-after-hide',
    cancelable: false,
    bubbles: true
  }) alcAfterHide: EventEmitter<null>;

  /**
  * Método para abrir o drawer.
  */
  @Method()
  async show(): Promise<boolean> {
    if (this.isVisible) {
      return false;
    }

    const { defaultPrevented } = this.alcShow.emit();
    if (defaultPrevented) {
      return false;
    }

    this.isVisible = true;
    this.alcAfterShow.emit();

    return true;
  }

  /**
  * Método para fechar o drawer.
  */
  @Method()
  async hide(): Promise<boolean> {
    if (!this.isVisible) {
      return false;
    }

    const { defaultPrevented } = this.alcHide.emit();
    if (defaultPrevented) {
      return false;
    }

    this.isVisible = false;
    this.alcAfterHide.emit();

    this.handleFocusWhenCloseDrawer();

    return true;
  }

  /**
  * Foco fica dentro do drawer quando aberta.
  */
  @Listen('keydown', { target: 'document' })
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isVisible) {
      return;
    };

    if (event.defaultPrevented) {
      return;
    }

    if(event.key === 'Escape') {
      event.preventDefault();
      this.hide();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusableElements = getFocusableElements(this.drawerRef);
    handleKeyDown(event, focusableElements);
  }

  componentDidRender() {
    // Pega os elementos focáveis a cada renderização (Pode haver mudanças no drawer).
    const focusableElements = getFocusableElements(this.drawerRef);

    // Após o componente renderizar e estiver aberto, então ja coloca foco dentro do drawer.
    if (this.isVisible) {
      focusFirstElement(focusableElements);
    }

  }

  connectedCallback() {
    if (this.isVisible) {
      lockBodyScroll();
    }
  }

  disconnectedCallback() {
    if (this.isVisible) {
      unlockBodyScroll();
    }
  }

  private getDrawerRef = (element) => this.drawerRef = element as HTMLElement;

  private handleFocusWhenCloseDrawer = () => {
    if(!!this.elementToFocus) {
      let element = this.elementToFocus;
      if(typeof element === 'string') {
        element = document.getElementById(element);
      }
      return !!element ? element.focus() : null;
    }

    const defaultFocus = ['BODY', 'DOCUMENT'];
    const hasTriggerElement = !!this.triggerElement && document.body.contains(this.triggerElement);

    if(hasTriggerElement && !defaultFocus.includes(this.triggerElement.tagName)){
      this.triggerElement.focus();
      return;
    }

    return;
  }

  render() {
    return (
      <Host style={{ display: this.isVisible ? 'block' : 'none' }}>
        <div class="alc-drawer__overlay">
          <div
            class="alc-drawer__content bg-white dark:bg-black"
            role="dialog"
            aria-modal="true"
            ref={this.getDrawerRef}
            {...test('data-test-content')}
          >
            <div class="alc-drawer__header">
              <button
                class="alc-button alc-button-rounded"
                onClick={() => this.hide()}
                {...test('data-test-close-button')}
              >
                <alc-icon name="x-lg" label="Fechar Drawer" {...test('data-test-close-icon')} />
              </button>
            </div>
            <div>
              <slot></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
