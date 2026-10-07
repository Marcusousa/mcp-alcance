import {
  Component,
  Prop,
  State,
  Event,
  EventEmitter,
  h,
  Element,
  Listen,
  Host
} from '@stencil/core';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-user-menu',
  styleUrl: 'alc-user-menu.css',
  scoped: false,
})
export class AlcUserMenu {
  @Element() host!: HTMLElement;
  /**
   * Define a variação do menu de usuário. Geralmente, não é recomendado alterar esse valor.
   */
  @Prop({ reflect: true }) variation: 'mobile' | 'desktop' = 'desktop';

  /**
   * Nome do usuário.
   */
  @Prop({ reflect: true }) name = 'Usuário';

  /**
   * Número de matrícula ou ponto do usuário.
   */
  @Prop({ reflect: true }) registrationNumber = '';

  /**
   * URL que efetua o logout do usuário. O link "Sair" navegará para essa URL.
   */
  @Prop({ reflect: true }) logoutUrl!: string;

  /**
   * URL da imagem do usuário. Se não for fornecida, será exibido um ícone padrão.
   */
  @Prop({ reflect: true }) imgSrc = '';

  /**
   * Evento disparado quando o link "Sair" é acionado. Se cancelado, não navegará para a URL de logout.
   */
  @Event({ eventName: 'alc-logout', cancelable: true, bubbles: true })
  alcLogout: EventEmitter;

  /**
   * Evento disparado quando o tema é alterado.
   */
  @Event({ eventName: 'alc-theme-change', bubbles: true, cancelable: false })
  alcThemeChange: EventEmitter<{ theme: string }>

  @State() dropdownOpen = false;

  // referências aos containers de “info”
  private externalContainer!: HTMLElement;
  private internalContainer!: HTMLElement;

  // referências aos actions do menu (slot="actions")
  private desktopMenuContainer: HTMLElement;
  private mobileMenuContainer: HTMLElement;
  private menu: HTMLAlcMenuElement;

  // referências ao slot default
  private defaultSlot: HTMLDivElement;
  private desktopSlotContainer: HTMLDivElement;
  private mobileSlotContainer: HTMLDivElement;

  componentDidLoad() {
    if (this.variation === 'desktop') {
      this.externalContainer = this.host.querySelector('.alc-user-menu__info--external')!;
      this.internalContainer = this.host.querySelector('.alc-user-menu__info--internal')!;
      this.moveInfo();
    }
    this.moveActionsToMenu();
  }

  /**
   * Move os elementos do slot "actions" para dentro do menu usando a API do alc-menu.
   */
  private moveActionsToMenu() {
    // Não usa ':scope > [slot="actions"]' porque o mock-doc dos testes não suporta :scope
    const actions = Array.from(this.host.children).filter((el): el is HTMLElement => el.getAttribute('slot') === 'actions');
    actions.forEach(el => {
      this.menu.addMenuItem(el, 'start');
    });
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    if (this.variation === 'desktop') {
      this.moveInfo();
    }
  }

  private moveInfo() {
    const largura = window.innerWidth;

    // < 1200px é compacto, >= 1200px é expandido
    if (largura < 1200) {
      if (this.externalContainer && this.internalContainer && this.internalContainer.children.length === 0) {
        while (this.externalContainer.firstChild) {
          this.internalContainer.appendChild(this.externalContainer.firstChild);
          this.internalContainer.classList.add('alc-user-menu__info--separator');
        }
      }
    } else {
      if (this.externalContainer && this.internalContainer && this.externalContainer.children.length === 0) {
        while (this.internalContainer.firstChild) {
          this.externalContainer.appendChild(this.internalContainer.firstChild);
          this.internalContainer.classList.remove('alc-user-menu__info--separator');
        }
      }
    }
  }

  private handleLogout = (e: MouseEvent) => {
    const { defaultPrevented } = this.alcLogout.emit();
    if (defaultPrevented) {
      e.preventDefault();
    }
  };

  @Listen('alc-select')
  handleThemeChange(e: CustomEvent<{ theme?: string }>) {
    // Verifica se o evento contém a propriedade 'theme' no detail.
    // A ideia de tratar a existência de 'theme' é para garantir que estamos reagindo
    // ao evento específico de mudança de tema, e não a outros eventos 'alc-select'
    // que possam ser disparados por outros itens do menu.
    if (e.detail && 'theme' in e.detail && typeof e.detail.theme === 'string') {
      this.alcThemeChange.emit({ theme: e.detail.theme });
    }
  }

  componentDidRender() {

    if (this.variation === 'mobile') {
      this.mobileMenuContainer.insertAdjacentElement('beforeend', this.menu);
      this.mobileSlotContainer.insertAdjacentElement('beforeend', this.defaultSlot);
    }
    else {
      this.desktopMenuContainer.insertAdjacentElement('beforeend', this.menu);
      this.desktopSlotContainer.insertAdjacentElement('beforeend', this.defaultSlot);
    }
  }

  private renderDesktop() {
    return (
      <div class={{
          "alc-user-menu--desktop": true,
          'hidden': this.variation === 'mobile'
        }}
        {...test('data-test-desktop')}
      >
        <div class="alc-user-menu__info--external">
          {/* conteúdo transitório: será movido */}
          <div>
            <div class="alc-user-menu__primary">
              <span class="alc-user-menu__name" {...test('data-test-name')}>{this.name}</span>
              {this.registrationNumber && <span class="alc-user-menu__reg" {...test('data-test-registration-number')}>({this.registrationNumber})</span>}
            </div>
            <div class="alc-user-menu__secondary" ref={el => this.desktopSlotContainer = el}>
            </div>
          </div>
        </div>

        <alc-dropdown class="alc-user-menu__dropdown" {...test('data-test-dropdown')}>
          <button
            slot="trigger"
            class="alc-user-menu__trigger"
            aria-label="Abrir menu do usuário"
            {...test('data-test-dropdown-button')}
          >
            {this.imgSrc ? (
              <img
                class="alc-user-menu__image"
                src={this.imgSrc}
                alt={this.name}
                {...test('data-test-image')}
              />
            ) : (
              <alc-icon
                class="alc-user-menu__image alc-user-menu__icon"
                name="person-fill"
                label={this.name}
                {...test('data-test-icon')}
              />
            )}
            <alc-icon icon="chevron-down" label="" />
          </button>
          <div class="alc-user-menu__info--internal"></div>
          <div ref={el => this.desktopMenuContainer = el}></div>
        </alc-dropdown>
      </div>
    );
  }

  private renderMobile() {
    return (
      <div class={{
          "alc-user-menu--mobile": true,
          'hidden': this.variation === 'desktop'
        }}
        {...test('data-test-mobile')}
      >
      {/* HEADER: foto + bloco de info (nome + slot) */}
      <div class="alc-user-menu--mobile__header">
        {this.imgSrc ? (
          <img
            class="alc-user-menu__image"
            src={this.imgSrc}
            alt={this.name}
            {...test('data-test-image')}
          />
        ) : (
          <alc-icon
            class="alc-user-menu__image alc-user-menu__icon"
            name="person-fill"
            label={this.name}
            {...test('data-test-icon')}
          />
        )}
        <div class="alc-user-menu--mobile__info">
          <div class="alc-user-menu__name" {...test('data-test-name')}>{this.name}
          {this.registrationNumber && <span class="alc-user-menu--mobile__reg" {...test('data-test-registration-number')}>({this.registrationNumber})</span>}
          </div>
          <div class="alc-user-menu__secondary" ref={el => this.mobileSlotContainer = el}>
          </div>
        </div>
      </div>
        {/* expander para ações */}
        <alc-expander label="Menu do usuário" open={false} hide-label="true" {...test('data-test-expander')}>
          <div>
            <div ref={el => this.mobileMenuContainer = el}></div>
          </div>
        </alc-expander>
      </div>
    );
  }

  render() {
    this.logoutUrl ?? logger.report('logoutUrl', this.host.tagName.toLowerCase(), this.host);

    return (
      <Host>
        {/*
          Slot actions fica nessa posição para não ser afetado pela manipulação do DOM feita em componentDidRender.
          O conteúdo do slot será movido para dentro do alc-menu, mas se o slot for colocado já diretamente dentro do alc-menu,
          o runtime de slots do Stencil não consegue rastrear o conteúdo e ele fica escondido (atributo hidden).
        */}
        <slot name="actions"></slot>
        <alc-menu ref={el => this.menu = el} {...test('data-test-menu')}>
          <alc-menu-item-theme {...test('data-test-menu-item-theme')} />
          <alc-menu-link>
            <a href={this.logoutUrl} onClick={this.handleLogout} {...test('data-test-logout')}>
              <alc-icon name="box-arrow-right" label="" class="alc-user-menu__logout-icon"></alc-icon>
              Sair
            </a>
          </alc-menu-link>
        </alc-menu>

        <div ref={el => this.defaultSlot = el} {...test('data-test-slot')}>
          <slot></slot>
        </div>

        {/* Renderiza sempre os dois modelos, escondendo um ou outro */}
        {
          [
            this.renderMobile(),
            this.renderDesktop()
          ]
        }
      </Host>
    );
  }
}