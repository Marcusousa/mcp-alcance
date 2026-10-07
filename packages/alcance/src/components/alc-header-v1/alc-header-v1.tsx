import { Component, getAssetPath, Host, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-header-v1',
  styleUrl: 'alc-header-v1.css',
  assetsDirs: ['../../src/assets/images'],
  scoped: false,
})
export class AlcHeaderV1 {
  @Element() el: HTMLAlcHeaderV1Element;

  /**
   * O nome do sistema. Será mostrado no cabeçalho, que deve estar presente em todas do sistema.
   */
  @Prop({ reflect: true }) name: string;

  /**
   * URL para a página inicial do sistema. O nome do sistema será transformado em um link para essa URL.
   */
  @Prop({ reflect: true }) homeUrl: string;

  /**
   * Evento disparado quando o usuário aciona o link para a página inicial.
   * Executar `preventDefault()` evita que a navegação para a página inicial aconteça.
   */
  @Event({
    eventName: 'alc-home',
  })
  alcHome: EventEmitter<null>;

  async handleHome(event: MouseEvent) {
    const triggerEvent = this.alcHome.emit();
    if (triggerEvent.defaultPrevented) {
      event.preventDefault();
    }
  }

  private renderLink(): string {
    if (this.homeUrl !== undefined) {
      return (
        <a href={this.homeUrl} onClick={event => this.handleHome(event)} {...test('data-test-link')}>
          {this.name}
        </a>
      );
    }

    return this.name;
  }

  render() {
    return (
      <Host class="alc-header-v1" data-alc-top>

        <header>
          <slot></slot>
          <div class="alc-header-v1__container">
            <img src={getAssetPath('assets/images/logo_camara_peq.png')} alt="Câmara dos Deputados" class="alc-header-v1__logo" />
            <div class="alc-header-v1__logo-full">
              <img src={getAssetPath('assets/images/logo_camara.png')} alt="Câmara dos Deputados" />
            </div>
            <span class="alc-header-v1__title" {...test('data-test-title')}>
              {this.name !== undefined ? (
                this.renderLink()
              ) : (
                <slot name="link"></slot>
              )}
            </span>
          </div>
        </header>
      </Host>
    );
  }
}
