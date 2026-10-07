import { Component, Prop, h, Host, Event, EventEmitter, Element, Listen } from '@stencil/core';
import classNames from 'classnames';
export interface AlcMenuItemSelectEventDetail {
  originalEvent: MouseEvent | KeyboardEvent;
}

const ROLES = {
  normal: 'menuitem',
  checkbox: 'menuitemcheckbox',
  radio: 'menuitemradio',
}

/**
 * @slot - O rótulo do menu-item.
 *
 * @slot prefix - Prefixo do rótulo do menu-item.
 * Geralmente, utilizado para um ícone associado à opção de menu.
 *
 * @slot suffix - Sufixo do rótulo do menu-item.
 * Geralmente, utilizado para um ícone associado à opção de menu.
 */

@Component({
  tag: 'alc-menu-item',
  styleUrl: 'alc-menu-item.css',
  shadow: false,
})
export class AlcMenuItem {
  @Element() hostElement: HTMLElement;

  /** Tipo do menu-item. */
  @Prop({ reflect: true })
  type?: 'normal' | 'checkbox' | 'radio' = 'normal';
  /** Indica se o menu-item está ou não marcado. Usado quando `type=checkbox` ou `type=radio`. */
  @Prop({ reflect: true, mutable: true })
  checked?: boolean = false;
  /** Indica se o menu-item está desabilitado. */
  @Prop({ reflect: true })
  disabled?:boolean = false;
  /** Valor do menu-item, que pode ser utilizado para identificar que item foi selecionado. */
  @Prop({ reflect: true })
  value?: any;

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (' ' === event.key || 'Enter' === event.key) {
      event.preventDefault();
      this.triggerEvent({ originalEvent: event });
    }
  }

  @Listen('click')
  handleClick(event: MouseEvent) {
    if (!this.disabled) {
      event.preventDefault();
      this.triggerEvent({ originalEvent: event });
    }
  }

  /** Evento disparado quando o menu-item é selecionado. */
  @Event({ eventName: 'alc-select' })
  alcSelect: EventEmitter<{
    originalEvent: MouseEvent | KeyboardEvent;
  }>;

  triggerEvent(detail: AlcMenuItemSelectEventDetail) {
    if (this.disabled) {
      return;
    }
    this.alcSelect.emit(detail);
  }

  getCssClassMap() {
    return classNames(
      'alc-menu-item',
      this.disabled && 'alc-menu-item--disabled',
      this.type !== null && 'alc-menu-item--checkable',
    );
  }

  render() {
    const checked = this.checked ? 'true' : 'false';
    const role = ROLES[this.type];

    return (
      <Host
        role={role}
        aria-checked={this.type === 'normal' ? null : checked}
        aria-disabled={this.disabled ? 'true' : null}
        class={this.getCssClassMap()}
        tabindex={-1}
      >
        <span class="alc-menu-item__check">
          {this.type === 'checkbox' && this.checked
            ? <alc-icon label="" name="check"></alc-icon>
            : this.type === 'radio' && this.checked
              ? <alc-icon label="" name="record-circle" class="text-sm"></alc-icon>
              : null
          }
        </span>

        <span class="alc-menu-item__prefix">
          <slot name="prefix" />
        </span>

        <span class="alc-menu-item__label">
          <slot />
        </span>

        <span class="alc-menu-item__suffix">
          <slot name="suffix" />
        </span>
      </Host>
    );
  }
}
