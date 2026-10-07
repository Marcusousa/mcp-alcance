import { Component, Host, h, Prop, getAssetPath, Event, EventEmitter } from '@stencil/core';
import test from '../utils/testAttributes';

/**
 * @internal
 */
@Component({
  tag: 'alc-header-id',
  styleUrl: 'alc-header-id.css',
  assetsDirs: ['../../src/assets/images'],
  shadow: false,
})
export class AlcHeaderId {
  /**
   * O nome do sistema. Será mostrado no cabeçalho, que deve estar presente em todas do sistema.
   */
  @Prop({ reflect: true }) name!: string;

  /**
 * Descrição do sistema. Usualmente, o nome do sistema (se usada a sigla em "name"), o nome de um módulo, ou um complemento ao nome do sistema.
 */
  @Prop({ reflect: true }) description: string;

  /**
   * URL para a página inicial do sistema. O nome do sistema será transformado em um link para essa URL.
   */
  @Prop({ reflect: true }) homeUrl!: string;

  /**
   * Evento disparado quando o usuário aciona o link para a página inicial.
   * Executar `preventDefault()` evita que a navegação para a página inicial aconteça.
   */
  @Event({
    eventName: 'alc-home',
    cancelable: true,
    bubbles: true
  })
  alcHome: EventEmitter<null>;

  async handleHome(event: MouseEvent) {
    const triggerEvent = this.alcHome.emit();
    if (triggerEvent.defaultPrevented) {
      event.preventDefault();
    }
  }

  render() {
    return (
      <Host>
        <div class="alc-header-id">
          <a
            href={this.homeUrl}
            onClick={event => this.handleHome(event)}
            class="alc-header-id__link"
            aria-label={`Página inicial do ${this.name}`}
            {...test('data-test-link')}
          >
            <img
              class="alc-header-id__logo"
              src={getAssetPath('assets/images/camara_logo.svg')}
              alt="Logo da Câmara dos Deputados"
              {...test('data-test-image')}
            />
            <div class="alc-header-id__info">
              <span class="alc-header-id__name" {...test('data-test-name')}>{this.name}</span>
              {this.description && (
                <span class="alc-header-id__description" {...test('data-test-description')}>
                  {this.description}
                </span>
              )}
            </div>
          </a>
        </div>
      </Host>
    );
  }
}
