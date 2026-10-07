import { Component, Element, Host, Listen, Prop, State, h, Event, EventEmitter } from '@stencil/core';
import { screens } from '../utils/tailwind';
import logger from '../utils/logger';
import { getUniqueId } from '../utils/getUniqueId';
import { throttle } from '../utils/throttle';
import test from '../utils/testAttributes';

// Pega o valor definido da configuração do tailwind e remove o 'px'
const MOBILE_BREAKPOINT = Number(screens.sm.split('px')[0]);
const TABLET_BREAKPOINT = Number(screens.md.split('px')[0]);

/**
 * @slot DEFAULT - Slot para skip-links, identificação do ambiente, etc.
 * @slot support - Slot para o conteúdo de apoio, como links de ajuda, contato etc.
 * @slot fixed - Slot para conteúdo fixo, como botões de ações rápidas.
 * @slot user - Slot para o menu de usuário.
 */
@Component({
  tag: 'alc-header',
  styleUrl: 'alc-header.css',
  scoped: false,
})
export class AlcHeader {

  private navPanel: HTMLAlcNavPanelElement;
  private navBar: HTMLAlcNavbarElement;
  private aboutModal: HTMLAlcModalElement;

  private slotSupport: HTMLSlotElement;
  private slotFixed: HTMLSlotElement;
  private slotUser: HTMLSlotElement;
  private supportItems: Element[] = [];
  private aboutHeaderAction: HTMLAlcHeaderActionElement;
  private userMenu: HTMLAlcUserMenuElement;
  private supportWrapper: HTMLElement;
  private support: HTMLElement;
  private supportFromSlot: HTMLElement;
  private menuSupport: HTMLElement;
  private wrapper: HTMLElement;
  private drawer: HTMLAlcDrawerElement;
  private observer: ResizeObserver;

  private availableWidth = 0;
  private requiredWidth = 0;

  private scrollTop = 0;
  private scrollDirection: 'up' | 'down' = null;

  private resizeThrottle = throttle(this.resize, 300);

  @Element() el!: HTMLElement;

  @State() isDrawer: boolean = false;
  @State() isSupportDropdown: boolean = false;
  @State() needSeparator: boolean = false;
  @State() isMenuCreated: boolean = false;


  /**
   * O nome do sistema.
   */
  @Prop({ reflect: true }) name!: string;

  /**
   * Descrição do sistema. Usualmente, o nome do sistema (se usada a sigla em "name"), descrição ou um complemento ao nome do sistema.
   */
  @Prop({ reflect: true }) description: string;

  /**
   * Versão do sistema. Não incluir a palavra "versão" para evitar a repetição do texto.
   */
  @Prop({ reflect: true }) version: string;

  /**
   * URL para a página inicial do sistema.
   */
  @Prop({ reflect: true }) homeUrl!: string;

  /**
   * Evento disparado quando o usuário aciona o link para a página inicial.
   * Executar `preventDefault()` evita que a navegação para a página inicial aconteça.
   */
  @Event({ eventName: 'alc-home' })
  alcHome: EventEmitter<null>;

  @Listen('scroll', { target: 'window' })
  handleScroll() {
    if( window.innerWidth >= TABLET_BREAKPOINT) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    let currentDirection = this.scrollDirection; 

    if (currentScroll > this.scrollTop && currentDirection !== 'down' && currentScroll > this.el.clientHeight/2) {
      // Scroll descendo, esconde
      this.wrapper.classList.add('alc-header--scroll-down');
      currentDirection = 'down'
    } 

    if (currentScroll < this.scrollTop && currentDirection !== 'up') {
      // Scroll subindo, mostra
      currentDirection = 'up'
      this.wrapper.classList.remove('alc-header--scroll-down');
    }

    this.scrollTop = currentScroll <= 0 ? 0 : currentScroll;
    this.scrollDirection = currentDirection;
  }

  @Listen('alc-nav-content', { target: 'window' })
  handleNavContent(event: CustomEvent<{ navEl: HTMLAlcNavElement; isMobile: boolean }>) {
    const { navEl, isMobile } = event.detail;

    // pega o drawer se ainda não pegou
    const drawer = this.drawer ?? this.el.querySelector('alc-drawer');
    if (!drawer) return;

    // PROCURA O BODY DO DRAWER, OU USA O PRÓPRIO drawer COMO BACKUP
    const drawerBody = drawer.querySelector('.alc-drawer__header + div') || drawer;

    // pega o nav-panel ou navbar se ainda não pegou
    const navPanelElement = this.navPanel ?? document.querySelector('alc-nav-panel');
    const navBarElement = this.navBar ?? document.querySelector('alc-navbar');


    let navContent: Element = null;

    if(navBarElement) {
      navContent = navBarElement;
    } else if(navPanelElement) {
      navContent = navPanelElement.querySelector('.alc-nav-panel__content');
    }

    // Se não achou nenhum dos dois, não há conteúdo para mover
    if (!navContent) {
      return;
    }

    

    if(navPanelElement) {
      if (isMobile) {
        // MODO MOBILE
        if (navContent.contains(navEl)) {
          navContent.removeChild(navEl);
        }
        if (!drawerBody.contains(navEl)) {
          drawerBody.appendChild(navEl);
        }
        navPanelElement.classList.add('alc-nav-panel--hidden');
      } else {
        // MODO DESKTOP
        if (drawerBody.contains(navEl)) {
          drawerBody.removeChild(navEl);
        }
        if (!navContent.contains(navEl)) {
          navContent.appendChild(navEl);
        }
        navPanelElement.classList.remove('alc-nav-panel--hidden');
      }

      return;
    }

    if(navBarElement) {
      if (isMobile) {
        // MODO MOBILE
        if (!drawerBody.contains(navEl)) {
          drawerBody.appendChild(navEl);
        }

      } else {
        // MODO DESKTOP
        if (drawerBody.contains(navEl)) {
          drawerBody.removeChild(navEl);
        }
      }

      return;
    }

  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.resizeThrottle();
  }

  private resize() {
    // Se o drawer estiver aberto e a tela for maior que o breakpoint, fecha o drawer.
    if( window.innerWidth >= TABLET_BREAKPOINT && this.drawer?.isVisible) {
      this.drawer.hide();
    }
  }

  private handleAlcHome(event: CustomEvent) {
    event.stopPropagation();

    const homeEvent = this.alcHome.emit();
    if (homeEvent.defaultPrevented) {
      event.preventDefault();
    };
  }

  // Obtém os elementos do slot support, populando supportItems uma única vez.
  private getSupportItems = () => {
    if (!this.supportItems.length) {
      const assignedElementsSlotSupport = this.slotSupport.assignedElements();
      if (assignedElementsSlotSupport.length > 0) {
        Array.from(assignedElementsSlotSupport[0].children).forEach(item => {
          this.supportItems.push(item);
        });
      }
      logger.debug('Header - Itens de suporte encontrados:', this.supportItems);
    }
  }

  private showAboutModal() {
    this.aboutModal?.show();
  }

  componentDidRender() {
    // Tabelas de conversão de variante
    const toMenuVariant: Record<string | null, 'menu-link' | 'menu-item'> = {
      link:        'menu-link',
      'menu-link': 'menu-link',
      button:      'menu-item',
      'menu-item': 'menu-item',
      null:        'menu-item',
    };

    const toInlineVariant: Record<string | null, 'link' | 'button'> = {
      link:        'link',
      'menu-link': 'link',
      button:      'button',
      'menu-item': 'button',
      null:        'button',
    };

    const createSupportMenuSeparator = () => {
      const separator = document.createElement('div');
      // @TODO: Estruturar isso depois dentro de alc-menu (ou componentes relacionados)
      separator.className = "alc-header__menu-separator";
      separator.role = "separator";
      separator.innerText = "Menu de apoio";
      separator.id = getUniqueId();

      return separator;
    };

    this.getSupportItems();

    if (!this.userMenu) {
      this.userMenu = this.slotUser.assignedElements()[0].firstElementChild as HTMLAlcUserMenuElement;
    }

    if (!this.menuSupport) {
      this.menuSupport = document.createElement('div');
    }

    // logger.debug('header componentDidRender', this.supportItems, this.slotSupport.assignedElements());

    // Remove filhos de menuSupport
    this.menuSupport?.replaceChildren();

    const menu = this.userMenu.querySelector('alc-menu');

    /*
      Dois casos em que o menu de apoio estará "junto" ao menu de usuário:
      1. Quando não houver espaço para os itens de apoio lado a lado no header (isSupportDropdown)
      2. Quando a navegação estiver contida no drawer - padrão para as telas menores (isDrawer)
    */
    if (this.isSupportDropdown || this.isDrawer) {

      // Se tiver itens de suporte (criados pela aplicação)
      // ou tiver o item "Sobre" (criado pelo próprio componente)
      if (this.supportItems.length > 0 || this.aboutHeaderAction) {
        // Cria um grupo e um separador dentro dele. O separador dá nome ao grupo.
        const supportGroup = document.createElement('div');
        supportGroup.role = "group"

        const separator = createSupportMenuSeparator();
        supportGroup.appendChild(separator);
        supportGroup.setAttribute('aria-labelledby', separator.id);

        // Inclui cada item de suporte dentro do grupo,
        // ajustando devidamente a variante.
        Array.from(this.supportItems).forEach(item => {
          // @ts-ignore
          item.variant = toMenuVariant[item.variant];
          // @ts-ignore
          supportGroup.appendChild(item);
        });

        // Inclui o item "Sobre" no grupo, ajustando a variante.
        if (this.aboutHeaderAction) {
          this.aboutHeaderAction.variant = toMenuVariant[this.aboutHeaderAction.variant];
          supportGroup.appendChild(this.aboutHeaderAction);
        }

        logger.debug('header insertElement menu', this.supportItems, supportGroup);

        this.menuSupport.appendChild(supportGroup);
        menu?.addMenuItem(this.menuSupport);
      }
    }
    else {
      menu?.removeMenuItem(this.menuSupport);
      // "Devolve" cada item de suporte para o local original (slot support),
      // ajustando devidamente a variante.
      Array.from(this.supportItems).forEach(item => {
        // @ts-ignore
        item.variant = toInlineVariant[item.variant];
        // @ts-ignore
        this.supportFromSlot.appendChild(item);
      });
      // Devolve o item "Sobre" para o local original, ajustando a variante.
      if (this.aboutHeaderAction) {
        this.aboutHeaderAction.variant = toInlineVariant[this.aboutHeaderAction.variant];
        this.el.querySelector('.alc-header__support-about')?.appendChild(this.aboutHeaderAction);
      }
    }

    if (this.isDrawer) {
      this.userMenu.variation = 'mobile';
      this.drawer?.insertAdjacentElement('beforeend', this.userMenu);
      // @TODO: Aqui criou-se uma dependência da estrutura interna do dropdown
      // a necessidade especificar a classe alc-drawer__header.
      // Isso é um ponto de atenção e que merecer ser revisto para uma solução mais robusta.
      this.drawer?.querySelector('.alc-drawer__header + div')?.insertAdjacentElement('afterbegin', this.userMenu);
    }
    else {
      this.userMenu.variation = 'desktop';
      this.slotUser.assignedElements()[0]?.insertAdjacentElement('beforeend', this.userMenu);
    }

    // logger.debug(this.supportItems);
  }

  componentDidLoad() {

    // ref ao drawer já existente no template
    this.drawer = this.el.querySelector('alc-drawer')!;
    // nav-panel está em outro lugar do DOM
    this.navPanel = document.querySelector('alc-nav-panel');
    this.navBar = document.querySelector('alc-navbar');

    this.observer = new ResizeObserver(() => {
      this.checkLayout();
    });

    // @TODO: Encontrar solução mais robusta do que um timeout.
    setTimeout(() => {
      this.calcRequiredWidth();
      this.observer.observe(this.el);
    }, 100);

  }

  render() {
      this.name ?? logger.report('name', this.el.tagName.toLowerCase(), this.el);
      this.homeUrl ?? logger.report('homeUrl', this.el.tagName.toLowerCase(), this.el);

    return (
      <Host data-alc-top>

        <div class="alc-header" ref={(el: HTMLElement) => this.wrapper = el} {...test('data-test-wrapper')}>
          <header class="alc-header__header">

          <slot></slot>
          <slot name="support" ref={(el: HTMLSlotElement) => this.slotSupport = el} ></slot>

            <div class="alc-header__container">

              <div class="alc-header__id">
                <alc-header-id
                  name={this.name} 
                  description={this.description} 
                  homeUrl={this.homeUrl}
                  onAlc-home={this.handleAlcHome.bind(this)}
                  {...test('data-test-header-id')}
                >
                </alc-header-id>
              </div>

              <div class="alc-header__panel">

                <div
                  class="alc-header__support-wrapper"
                  ref={el => this.supportWrapper = el}
                >
                  <div
                    class="alc-header__support"
                    ref={el => this.support = el}
                    {...test('data-test-support')}
                  >

                    <span
                      class="alc-header__support-from-slot"
                      ref={el => this.supportFromSlot = el}
                    ></span>

                    {this.version && (
                      <span
                        class="alc-header__support-about"
                      >
                        <alc-header-action
                          icon-name="info-circle"
                          variant="button"
                          ref={(el: HTMLAlcHeaderActionElement) => {this.aboutHeaderAction = el}}
                          onAlc-select={() => this.showAboutModal()}
                        >
                          Sobre
                        </alc-header-action>
                      </span>
                    )}
                  </div>
                </div>

                <div class="alc-header__fixed" {...test('data-test-fixed')}>
                  <slot name="fixed" ref={(el: HTMLSlotElement) => this.slotFixed = el}></slot>
                </div>

                {/* Mostrado por padrão em telas pequenas, onde se usa o drawer */}
                <div class="alc-header__drawer-nav">
                  <button
                    class="alc-header-button"
                    onClick={() => this.drawer.show()}
                    data-alc-header-drawer-button
                    {...test('data-test-drawer-button')}
                    >
                    <alc-icon icon="list" label="Abrir navegação" class="alc-header-button__icon"></alc-icon>
                  </button>

                  <alc-drawer ref={(el: HTMLAlcDrawerElement) => this.drawer = el} {...test('data-test-drawer')}>
                  </alc-drawer>

                </div>

                {/* Mostrado em telas maiores, onde se usa o dropdown de usuário */}
                <div 
                  class={{
                    'alc-header__user': true,
                    'alc-header__user--separator': this.needSeparator
                  }}
                >
                  <slot name="user" ref={(el: HTMLSlotElement) => this.slotUser = el} ></slot>
                </div>
              </div>
            </div>
          </header>
        </div>

        {this.version && (
          <alc-modal
            ref={(el: HTMLAlcModalElement) => { this.aboutModal = el }}
            header-text="Sobre o sistema"
            size="sm"
          >
            <p>{this.name}</p>
            <p>{this.description}</p>
            <p>{'Versão: ' + this.version}</p>
          </alc-modal>
        )}

      </Host>
    );
  }

  private calcRequiredWidth() {

    // Altera overflow-y para "hidden" para fazer a medição
    this.supportWrapper.style.overflowY = 'hidden';
    this.supportWrapper.style.overflowX = 'clip';

    this.requiredWidth = this.support.scrollWidth;

    this.supportWrapper.style.removeProperty('overflow-x');
    this.supportWrapper.style.removeProperty('overflow-y');
  }

  private checkLayout() {

    // Altera overflow-y para "hidden" para fazer a medição
    this.supportWrapper.style.overflowY = 'hidden';
    this.supportWrapper.style.overflowX = 'clip';

    this.availableWidth = this.supportWrapper.offsetWidth;
    this.isSupportDropdown = (this.requiredWidth > this.availableWidth) || (window.innerWidth < MOBILE_BREAKPOINT);

    this.supportWrapper.style.removeProperty('overflow-x');
    this.supportWrapper.style.removeProperty('overflow-y');

    this.isDrawer = window.innerWidth < TABLET_BREAKPOINT;

    this.needSeparator = this.fixedElementsVisible() || (this.requiredWidth > 0 && !this.isSupportDropdown);
  }

  private fixedElementsVisible(): boolean {
    const slotElement = this.slotFixed.assignedElements()[0];
    // O slot foi usado
    if (slotElement instanceof HTMLElement) {
      // True se está ocupando alguma largura (ou seja, se tem algo visível)
      return (slotElement.offsetWidth > 0);
    }
    return false;
  }
}