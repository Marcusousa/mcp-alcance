import { Component, Host, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';
import logger from '../utils/logger';
import testAttributes from '../utils/testAttributes';

/*
  TODO: Avaliar possibilidade de "abrir" para modificar rótulo do botão
  Nessa versão, não será possível alterar o rótulo do botão.
  Há uma certa dificuldade para lidar com slot, possível html dentro do slot,
  e a extração do texto correspondente para criar os elementos audíveis.
*/
const BUTTON_LABEL = "Notificações";
const MAX_COUNTER = 99;

@Component({
  tag: 'alc-header-notifications',
  styleUrl: 'alc-header-notifications.css',
  scoped: false,
})
export class AlcHeaderNotifications {

  private overflow = false;
  private notificationsLabel = "";
  private notificationsAudible = "";

  /**
   * Número de notificações a serem exibidas no botão.
   */
  @Prop({
    reflect: true,
    mutable: false,
  })
  notifications: number = 0;

  /**
   * Define o tipo de elemento a ser renderizado. Pode ser um button ou um link.
   */
  @Prop({
    reflect: true
  })
  variant: 'button' | 'link' = 'button';

  /**
   * URL para a página de notificações. Usado quando a propriedade `variant` é `link`.
   * Se o `variant` for `button`, esse atributo será ignorado.
   */
  @Prop({ reflect: true }) url: string = '';

  @Watch('notifications')
  watchNotifications(newValue: number) {

    if (Number.isNaN(newValue)) {
      logger.warn('O valor do atributo "notifications" deve ser numérico. Assumindo o valor padrão 0.');
      newValue = 0;
    }

    if (newValue === 0) {
      this.notificationsLabel = "";
      this.notificationsAudible = "";
      this.overflow = false;
    }
    else if (newValue > MAX_COUNTER) {
      this.notificationsLabel = `${MAX_COUNTER}+`;
      this.notificationsAudible = `Mais de ${MAX_COUNTER} ${BUTTON_LABEL}`;
      this.overflow = true;
    }
    else {
      this.notificationsLabel = newValue.toString();
      this.notificationsAudible = `${newValue.toString()} ${BUTTON_LABEL}`;
      this.overflow = false;
    }
  }

  /**
   * Evento disparado quando o usuário clica nas notificações. Pode ser cancelado.
   */
  @Event({
    eventName: 'alc-click',
    bubbles: true,
    cancelable: true
  })
  alcClick: EventEmitter<null>;

  async handleClick(event: MouseEvent) {
    const { defaultPrevented } = this.alcClick.emit();
    if (defaultPrevented) {
      event.preventDefault();
    }
  }

  componentWillLoad() {
    this.watchNotifications(this.notifications);
  }

  render() {
    const commonProps = {
      class: "alc-header-button",
      "aria-label": this.overflow ? `${this.notificationsAudible}` : null,
      onClick: (event: MouseEvent) => this.handleClick(event),
    };

    return (
      <Host>
        <span class="alc-header-notifications">
          
          {this.variant === 'button' ? (
            <button {...commonProps} {...testAttributes('data-test-button')}>
              {this.renderContent()}
            </button>
          ) : (
            <a href={this.url} {...commonProps} {...testAttributes('data-test-link')}>
              {this.renderContent()}
            </a>
          )}

          {/* aria live container */}
          <span
            role="status"
            aria-live="polite"
            aria-atomic="true"
            class="alc-header-notifications__aria-live"
            {...testAttributes('data-test-aria-live')}
          >
            { this.notifications
              ?
                `${this.notificationsAudible}`
              :
                null
            }
          </span>
        </span>
      </Host>
    );
  }

  renderContent() {
    const badge = (
      <alc-badge
        color="warning"
        count={true}
        label={this.notificationsLabel}
        {...testAttributes('data-test-badge')}
      >
        <alc-icon
          name="bell"
          label=""
          class="alc-header-button__icon"
          {...testAttributes('data-test-icon')}
        ></alc-icon>
      </alc-badge>
    )

    const label = (
      <span
        class="alc-header-button__label"
        {...testAttributes('data-test-label')}
      >
        {BUTTON_LABEL}
      </span>
    )

    return [
      badge,
      label
    ]
  }

}
