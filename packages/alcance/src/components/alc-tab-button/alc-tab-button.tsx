import { Component, Host, h, Event, EventEmitter, Prop, Element, Watch } from '@stencil/core';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-tab-button',
  styleUrl: 'alc-tab-button.css',
  scoped: false,
})
export class AlcTabButton {
  private button: HTMLElement;

  @Element() el!: HTMLAlcTabButtonElement;

  /**
   * Um identificador da tab deve ser fornecido para cada `alc-tab`.
   * Isso é usado internamente para referenciar a tab selecionada.
   */
  @Prop({ reflect: true }) tab!: string;

  /**
   * Indica que a tab está selecionada.
   */
  @Prop({ mutable: true, reflect: true }) selected: boolean;
  @Watch('selected')
  selectedChanged(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      if (newValue) {

        this.button.setAttribute('tabindex', '0');
      }
      else {

        this.button.setAttribute('tabindex', '-1');
      }
    }
  }

  /**
   * Evento disparado ao clicar em alc-tab-button
   */
  @Event({ eventName: 'alc-click' }) alcClick: EventEmitter<{
    tab: string
  }>;
  /**
   * Evento disparado para indicar que o alc-tab-button seguinte deve ser selecionado
   */
  @Event({ eventName: 'alc-next' }) alcNext: EventEmitter<null>;
  /**
   * Evento disparado para indicar que o alc-tab-button anterior deve ser selecionado
   */
  @Event({ eventName: 'alc-previous' }) alcPrevious: EventEmitter<null>;
  /**
   * Evento disparado para indicar que o primeiro alc-tab-button deve ser selecionado
   */
  @Event({ eventName: 'alc-first' }) alcFirst: EventEmitter<null>;
  /**
   * Evento disparado para indicar que o último alc-tab-button deve ser selecionado
   */
  @Event({ eventName: 'alc-last' }) alcLast: EventEmitter<null>;

  private selectTab(e: Event) {

    if (this.tab !== undefined) {
      this.alcClick.emit({
        tab: this.tab
      });
      e.preventDefault();
    }
  }

  // Inspirado na implementação do WAI - função onKeyDown().
  // https://www.w3.org/WAI/content-assets/wai-aria-practices/patterns/tabs/examples/js/tabs-automatic.js
  private keyDownHandler(e: KeyboardEvent) {
    let handled = false;
    switch(e.key) {
      case 'ArrowRight':
        this.alcNext.emit();
        handled = true;
        break;
      case 'ArrowLeft':
        this.alcPrevious.emit();
        handled = true;
        break;
      case 'Home':
        this.alcFirst.emit();
        handled = true;
        break;
      case 'End':
        this.alcLast.emit();
        handled = true;
        break;
    }
    if (handled) {
      e.preventDefault();
    }
  }

  componentWillLoad() {
  }

  render() {
    this.tab ?? logger.report('tab', this.el.tagName.toLowerCase(), this.el);
    const getId = (): string => {

      let id: string;
      if (this.el.id) {
        id = this.el.id;
      }
      else {
        id = `alc-button_${this.el.tab}`;
      }

      return id;
    }


    return (
      <Host>
        <button
          onClick={this.selectTab.bind(this)}
          onKeyDown={this.keyDownHandler.bind(this)}
          role='tab'
          aria-selected={this.selected ? 'true' : 'false'}
          tabindex='-1'
          id={getId()} // Precisa ter id (para acessibilidade)
          class={{
            'alc-tabs__button': true,
            active: this.selected
          }}
          ref={el => this.button = el}
          {...test('data-test-button')}
        >
          <slot />
        </button>
      </Host>
    );
  }
}

