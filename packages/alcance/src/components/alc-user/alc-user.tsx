import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import test from '../utils/testAttributes';

/**
 * @slot DEFAULT - Informação adicional do usuário, não estruturada pelo componente, pode ser colocada aqui. Será exibida imediatamente antes do link "Sair".
 */

@Component({
  tag: 'alc-user',
  styleUrl: 'alc-user.css',
  shadow: false,
})
export class AlcUser {
  /**
   * Nome do usuário.
   */
  @Prop({ reflect: true }) name: string = 'Usuário';
  /**
   * Número de matrícula ou ponto do usuário.
   */
  @Prop({ reflect: true }) registrationNumber: string = '';
  /**
   * URL que efetua o logout do usuário.
   */
  @Prop({ reflect: true }) logoutUrl: string = '#';
  /**
   * Imagem do usuário. Pode ser qualquer valor válido para o atributo `src` da tag `img` do HTML.
   */
  @Prop({ reflect: true }) imgSrc: string = '';


  /**
   * Evento disparado quando o link "Sair" é acionado. Se cancelado, não navegará para a URL de logout.
   */
  @Event({
    eventName: 'alc-logout',
  }) alcLogout: EventEmitter;

  async handleLogout(event: MouseEvent) {
    const allowLogout = this.alcLogout.emit();
    if (allowLogout.defaultPrevented) {
      event.preventDefault();
    }
  }

  render() {
    return (
      <div class="alc-user">
        {this.imgSrc ? (
          <img class="alc-user__image" src={this.imgSrc} alt="" />
        ) : (
          <alc-icon class="alc-user__image alc-user__image--icon" name="person-circle" label=""></alc-icon>
        )}
        <div>
          <div class="alc-user__name">{this.name}</div>
          <div>{this.registrationNumber}</div>
          <slot />
          <div>
            <alc-icon name="box-arrow-right" label=""></alc-icon>
            <a class="alc-link ml-2" href={this.logoutUrl} onClick={(event) => this.handleLogout(event)}  {...test('data-test-logout')}>
              Sair
            </a>
          </div>
        </div>
      </div>
    );
  }
}
