import { Component, Prop, h, Host, Event, EventEmitter, Element, Watch } from '@stencil/core';
import classNames from 'classnames';

export interface AlcMenuLinkSelectEventDetail {
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * @slot - A tag para navegação. Pode ser tanto a tag `<a>` quanto um `<routerlink>` no caso de uso com Vue.
 **/

@Component({
  tag: 'alc-menu-link',
  styleUrl: 'alc-menu-link.css',
  shadow: false,
})
export class AlcMenuLink {
  @Element() hostElement: HTMLElement;

  /** Indica se o menu-link está desabilitado. */
  @Prop({ reflect: true, mutable: true })
  disabled?: boolean = false;

  /** Valor do menu-link, que pode ser utilizado para identificar que link foi selecionado. */
  @Prop({ reflect: true })
  value?: any;

  /** Evento disparado quando o menu-link é selecionado. */
  @Event({ eventName: 'alc-select' })
  alcSelect: EventEmitter<{
    originalEvent: MouseEvent | KeyboardEvent;
  }>;

  private originalHref: string | null = null;
  private spaceKeyEvent: KeyboardEvent = null;

  @Watch('disabled')
  handleDisabledChange(newValue: boolean) {
    this.updateLinkState(newValue);
  }

  triggerEvent(detail: AlcMenuLinkSelectEventDetail) {
    if (this.disabled) {
      return;
    }
    this.alcSelect.emit(detail);
  }

  updateLinkState(disabled: boolean) {
    const anchor = this.hostElement.querySelector('a');
    if (anchor) {
      if (disabled) {
        this.originalHref = anchor.getAttribute('href');
        anchor.setAttribute('aria-disabled', 'true');
        anchor.classList.add('alc-menu-link--disabled');
        anchor.setAttribute('tabindex', '-1');
        anchor.removeAttribute('href');
        anchor.setAttribute('role', 'menuitem');
      } else {
        if (this.originalHref) {
          anchor.setAttribute('href', this.originalHref);
        }
        anchor.removeAttribute('aria-disabled');
        anchor.classList.remove('alc-menu-link--disabled');
        anchor.setAttribute('tabindex', '0');
        anchor.setAttribute('role', 'menuitem');
      }
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.disabled && event.key === ' ') {
      event.preventDefault();
      const anchor = this.hostElement.querySelector('a');
      if (anchor) {
        this.spaceKeyEvent = event;
        anchor.click();
      }
    }
  }

  handleClick(event: MouseEvent) {
    const originalEvent = this.spaceKeyEvent ?? event;
    this.spaceKeyEvent = null; // Despreza esse evento para os próximos disparos.
    if (this.disabled) {
      event.preventDefault();
    } else {
      this.triggerEvent({ originalEvent: originalEvent });
    }
  }

  componentWillLoad() {
    this.updateLinkState(this.disabled);
  }

  getCssClassMap() {
    return classNames(
      'alc-menu-link',
      this.disabled && 'alc-menu-link--disabled',
    );
  }

  render() {
    return (
      <Host
      class={this.getCssClassMap()}
      aria-disabled={this.disabled ? 'true' : null}
      onClick={this.handleClick.bind(this)}
      onKeyDown={this.handleKeyDown.bind(this)}
      >
          <slot />
      </Host>
    );
  }
}