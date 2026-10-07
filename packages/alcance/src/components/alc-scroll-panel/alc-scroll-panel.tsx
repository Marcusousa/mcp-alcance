import { Component, Host, h, Listen, State, Element, forceUpdate, Prop, Watch } from '@stencil/core';
import logger from '../utils/logger';
import { throttle } from '../utils/throttle';
import test from '../utils/testAttributes';

const SCROLL_STEP = 20;

@Component({
  tag: 'alc-scroll-panel',
  styleUrl: 'alc-scroll-panel.css',
  scoped: false,
})
export class AlcScrollPanel {

  @Element() el: HTMLAlcScrollPanelElement;

  @State() hasScroll: boolean = false;
  @State() canScrollRight: boolean = false;
  @State() canScrollLeft: boolean = false;
  /**
  * Define se há foco.
  */
  @Prop({ reflect: true }) hasFocus: boolean = true;
  /**
  * Define para qual elemento o scroll vai.
  */
  @Prop({ reflect: true }) scrollToElement: HTMLElement;

  private content: HTMLDivElement;
  private scrollWidth: number = 0;
  private scrolling: number = 0;
  private mo: MutationObserver;
  private resizeThrottle = throttle(this.resize, 200);
  private scrollThrottle = throttle(this.handleScroll, 300);

  @Listen('themeLoaded', {
    target: 'window'
  })
  themeLoadedHandler() {
    this.handleScroll();
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.resizeThrottle();
  }

  @Watch('scrollToElement')
  handleScrollToElement(element: HTMLElement) {
    if(!!element){
      element.scrollIntoView({ inline: "center", block: 'nearest' });
    }
  }

  private resize() {
    this.handleScroll();
    this.handleScrollToElement(this.scrollToElement);
  }

  private handleScroll() {
    this.scrollWidth = this.content.scrollWidth;
    this.hasScroll = this.scrollWidth > this.content.offsetWidth;
    this.setCanScroll();
  }

  private scrollRight() { // Pra frente >>>
    this.content.scrollLeft += SCROLL_STEP;
    this.setCanScroll();
  }

  private scrollLeft() { // Pra trás <<<
    this.content.scrollLeft = this.content.scrollLeft - SCROLL_STEP;
    this.setCanScroll();
  }

  private startScrolling(button: HTMLButtonElement, scroll: Function) {
    if (this.scrolling) return;

    this.scrolling = window.setInterval(() => {
      if (button.disabled) {
        this.stopScrolling();
        return;
      }

      scroll.apply(this);
    }, 200);
  }

  private startScrollingRight(e: MouseEvent) {
    const button = e.currentTarget;

    if(button instanceof HTMLButtonElement) {
      this.startScrolling(button, this.scrollRight);
    }
  }

  private startScrollingLeft(e: MouseEvent) {
    const button = e.currentTarget;

    if(button instanceof HTMLButtonElement) {
      this.startScrolling(button, this.scrollLeft);
    }
  }

  private stopScrolling() {
    window.clearInterval(this.scrolling);
    this.scrolling = 0;
  }

  private setCanScroll() {
    // Math.ceil foi necessário ao verificar funcionamento em um dispositivo móvel real,
    // onde scrollLeft apresenta números fracionários.
    this.canScrollRight = Math.ceil(this.content.offsetWidth + this.content.scrollLeft) < this.scrollWidth;
    this.canScrollLeft = this.content.scrollLeft > 0;
  }

  componentDidRender() {
    /*
     O trecho abaixo permite que o componente seja atualizado
     sempre que houver mudanças no conteúdo (como a inclusão de "fihos").
     Isso foi feito para permitir, por exemplo, que o conteúdo do panel
     seja atualizado dinamicamente com a manipulação do DOM.
     */
    this.mo?.disconnect();
    this.mo = new MutationObserver(() => {
      logger.debug('forceUpdate scroll-panel');
      forceUpdate(this.el);
    });
    this.mo.observe(this.el, {
      childList: true,
      subtree: true
    });

    this.handleScroll();
  }

  disconnectedCallback() {
    this.mo?.disconnect();
    this.resizeThrottle.cancel();
    this.scrollThrottle.cancel();
  }

  render() {
    return (
      <Host>
        <div class="alc-scroll-panel">
          {
            this.hasScroll
            ? <div
                key="left-button"
              >
                <button
                  onClick={this.scrollLeft.bind(this)}
                  onMouseDown={this.startScrollingLeft.bind(this)}
                  onMouseUp={this.stopScrolling.bind(this)}
                  onTouchStart={this.startScrollingLeft.bind(this)}
                  onTouchEnd={this.stopScrolling.bind(this)}
                  onTouchCancel={this.stopScrolling.bind(this)}
                  class="alc-scroll-panel__button"
                  disabled={!this.canScrollLeft}
                  aria-label="Ir para esquerda"
                  tabindex={this.hasFocus ? '0' : '-1'}
                >
                  <alc-icon name="chevron-left" label=''></alc-icon>
                </button>
              </div>
            : null
          }
          <div
            class={{
              "alc-scroll-panel__wrapper-content": true,
              "alc-scroll-panel__has-scroll-left": this.canScrollLeft,
              "alc-scroll-panel__has-scroll-right": this.canScrollRight
            }}
            key="content"
          >
            <div
              class="alc-scroll-panel__content"
              ref={el => this.content = el}
              onScroll={() => this.scrollThrottle()}
              {...test('data-test-content')}
            >
              <slot />
            </div>
          </div>
          {
            this.hasScroll
            ? <div
                key="right-button"
              >
                <button
                  onClick={this.scrollRight.bind(this)}
                  onMouseDown={this.startScrollingRight.bind(this)}
                  onMouseUp={this.stopScrolling.bind(this)}
                  onTouchStart={this.startScrollingRight.bind(this)}
                  onTouchEnd={this.stopScrolling.bind(this)}
                  onTouchCancel={this.stopScrolling.bind(this)}
                  class="alc-scroll-panel__button"
                  disabled={!this.canScrollRight}
                  aria-label="Ir para direita"
                  tabindex={this.hasFocus ? '0' : '-1'}
                >
                  <alc-icon name="chevron-right" label=''></alc-icon>
                </button>
              </div>
            : null
          }
        </div>
      </Host>
    );
  }
}