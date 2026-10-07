import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State } from '@stencil/core';
import { screens } from '../utils/tailwind';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

// Pega o valor definido da configuração do tailwind e remove o 'px'
const MOBILE_BREAKPOINT = Number(screens.md.split('px')[0]);
const DEFAULT_STATE = {
  visible: true
};

/**
 * @slot DEFAULT - Slot para o conteúdo do sidepanel.
 */

@Component({
  tag: 'alc-sidepanel',
  styleUrl: 'alc-sidepanel.css',
  scoped: false,
})
export class AlcSidepanel {
  @Element() el: HTMLAlcSidepanelElement;

  @State() isMobile: boolean = false;

  drawer: HTMLAlcDrawerElement = null;
  slotContainer: HTMLElement = null;
  mobileSlot: HTMLElement = null;
  desktopSlot: HTMLElement = null;
  slotContent: HTMLElement = null;

  ro: ResizeObserver;

  state: {
    visible: boolean,
  } = DEFAULT_STATE;

  /**
   * Indica se o sidepanel está visível.
   */
  @Prop({
    reflect: true,
    mutable: true
  })
  visible: boolean = true;

  /**
   * Abre o sidepanel.
   * @returns O valor retornado é `true` se o painel foi exibido com a chamada do método.
   */
  @Method()
  async show(): Promise<boolean> {
    this.visible = true;
    this.state.visible = this.visible;
    if (this.isMobile) {
      return this.drawer.show();
    }
    else {
      this.alcStateChange.emit({state: this.state});
    }
    return;
  }

  /**
   * Fecha o sidepanel
   * @returns O valor retornado é `true` se o painel foi dispensado com a chamada do método.
   */
  @Method()
  async hide(): Promise<boolean> {
    this.visible = false;
    this.state.visible = this.visible;
    if (this.isMobile) {
      return this.drawer.hide();
    }
    else {
      this.alcStateChange.emit({state: this.state});
    }
    return;
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  }

  /**
   * Evento disparado quando o estado do sidepanel é alterado.
   */
  @Event({
    eventName: 'alc-state-change',
    cancelable: false,
    bubbles: true
  }) alcStateChange: EventEmitter<{state: {visible: boolean}}>;

  /**
   * Evento disparado quando o sidepanel precisa recuperar o estado.
   */
  @Event({
    eventName: 'alc-state-request',
    cancelable: false,
    bubbles: true
  }) alcStateRequest: EventEmitter<{state: {visible: boolean}}>;

  componentWillLoad() {
    let detail = {
      state: this.state
    };

    this.handleResize();
    this.state.visible = this.visible;
    this.alcStateRequest.emit(detail);
    // Garante que o objeto this.state tenha as chaves esperadas, independente do valor de detail.state
    this.state = {...DEFAULT_STATE, ...detail.state};
    this.visible = this.state.visible;
  }

  componentDidRender() {
    if (this.slotContainer.children?.length) {
      // @TODO Melhorar isso, pois pressupõe que tem somente um children
      this.slotContent = this.slotContainer.children[0] as HTMLElement;
    }

    if (this.isMobile) {
      this.mobileSlot.appendChild(this.slotContent);
    }
    else {
      this.desktopSlot.appendChild(this.slotContent);
    }

    this.setOffset();

    const top: HTMLElement = document.querySelector('[data-alc-top]');

    this.ro?.disconnect();
    this.ro = new ResizeObserver(() => {
      this.setOffset();
    });
    this.ro.observe(top);

  }

  disconnectedCallback() {
    this.ro?.disconnect();
  }

  renderMobile = () => (
    [
      <button
        class="alc-button alc-button-rounded absolute right-2 -mt-[3.25rem] text-white"
        onClick={() => this.drawer.show()}
        {...test('data-test-sidepanel-mobile-close-button')}
        data-alc-sidepanel-drawer-button
      >
        <alc-icon name="list" label="Abrir"></alc-icon>
      </button>,
      <alc-drawer
        onSl-show={() => this.visible = true}
        onSl-hide={() => this.visible = false}
        ref={el => this.drawer = el}
      >
        <div ref={el => this.mobileSlot = el}></div>
      </alc-drawer>
    ]
  )

  render() {
    console.debug('render menu container');

    if (!this.isMobile && this.visible) {
      document.querySelector('html').classList.add('alc-sidepanel-visible');
    }
    else {
      document.querySelector('html').classList.remove('alc-sidepanel-visible');
    }

    return (
      <Host
        class="alc-sidepanel"
      >
        <div ref={el => this.slotContainer = el}>
          <slot></slot>
        </div>
        <div
          class={{
            'alc-sidepanel__mobile-container': true,
          }}
        >
          {this.renderMobile()}
        </div>
        <div
          class={{
            'alc-sidepanel__desktop-container': true,
          }}
        >
          <button
            type="button"
            class="alc-button alc-button-rounded fixed left-2 -mt-[3.75rem] text-white z-[1020] focus-visible:outline-2 focus-visible:outline-white"
            onClick={() => this.visible ? this.hide() : this.show()}
            aria-pressed={this.visible ? 'true' : 'false'}
            {...test('data-test-sidepanel-desktop-close-button')}
            data-alc-sidepanel-button
          >
            <alc-icon name="list" label="Exibir navegação"></alc-icon>
          </button>
          <div
            ref={el => this.desktopSlot = el}
            class={{
              'alc-sidepanel__desktop-slot': true,
              'is-open': this.visible,
            }}
          >
          </div>
        </div>
      </Host>
    );
  }

  setOffset() {
    const top: HTMLElement = document.querySelector('[data-alc-top]');
    logger.debug(top.offsetHeight);
    this.el.style.setProperty('--offset', top.offsetHeight.toString());
  }
}