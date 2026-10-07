import { Component, Host, h, Event, EventEmitter, Method } from '@stencil/core';
import logger from '../utils/logger';

export interface AlcChangeEventTypes {
  from: number;
  to: number;
}
/**
 * @internal
 */
@Component({
  tag: 'alc-event-lab',
  styleUrl: 'alc-event-lab.css',
})
export class AlcEventLab {

  b1: HTMLButtonElement;
  b2: HTMLButtonElement;

  underlined: number = 1;

  @Event({
    eventName: 'alc-change',
    cancelable: true
  })
  alcChange: EventEmitter<AlcChangeEventTypes>;

  @Event({
    eventName: 'alc-after-change',
    cancelable: false
  })
  alcAfterChange: EventEmitter<AlcChangeEventTypes>;

  @Method()
  async changePage(pageNumber: number) {
    this.requestChangeTo(pageNumber);
  }

  requestChangeTo(newButton: number) {

    const currentButton = this.underlined;

    logger.debug('RequestChangeTo', newButton);

    // Regra interna do componente, que não faz nada se o botão clicado
    // for o que já está sublinhado
    if (newButton === currentButton) {
      logger.debug('Botão já estava sublinhado');
      return;
    }

    // Dispara o evento buttonWillChange.
    const event = this.alcChange.emit({
      from: currentButton,
      to: newButton
    });

    // Verifica se foi prevenido externamente.
    // Se foi, não faz mais nada.
    if (event.defaultPrevented) {
      logger.debug('defaultPrevented')
      return;
    }

    // Registra a alteração solicitada
    if (newButton === 1) {
      this.b2.classList.remove('underline');
      this.b1.classList.add('underline');
    }
    else if (newButton === 2) {
      this.b1.classList.remove('underline');
      this.b2.classList.add('underline');
    }
    this.underlined = newButton;


    // Dispara o evento buttonDidChange.
    this.alcAfterChange.emit({
      from: currentButton,
      to: newButton
    });

  }

  render() {

    this.alcAfterChange.emit({
      from: undefined,
      to: 1
    });

    return (
      <Host>

        <button
          class="button underline"
          ref={el => this.b1 = el}
          onClick={() => this.requestChangeTo(1)}
        >
          1
        </button>

        <button
          class="button"
          ref={el => this.b2 = el}
          onClick={() =>this.requestChangeTo(2)}
        >
          2
        </button>

        <slot></slot>
      </Host>
    );
  }

}
