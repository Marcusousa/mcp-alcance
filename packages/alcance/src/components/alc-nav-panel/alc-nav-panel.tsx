import { Component, Host, Prop, h, Method, Event, EventEmitter, Element, State, Listen, Watch } from '@stencil/core';
import { getFocusableElements, handleKeyDown } from '../utils/keydown';
import { screens } from '../utils/tailwind';
import test from '../utils/testAttributes';

export interface AlcStateEventTypes {
  state: {
    open: boolean;
  }
}

const DEFAULT_STATE = {
  open: true
};

// Pega o valor definido da configuração do tailwind e remove o 'px'
const TABLET_BREAKPOINT = Number(screens.md.split('px')[0]);
const DESKTOP_BREAKPOINT = Number(screens.lg.split('px')[0]);

/**
 * @slot DEFAULT - Slot para o conteúdo do nav-panel.
 */

@Component({
  tag: 'alc-nav-panel',
  styleUrl: 'alc-nav-panel.css',
  shadow: false
})
export class AlcNavPanel {
  @Element() el: HTMLAlcNavPanelElement;

  private content: HTMLDivElement;
  private button: HTMLButtonElement;
  private state: {
    open: boolean,
  } = DEFAULT_STATE;
  private display: 'mobile' | 'tablet' | 'desktop' = this.getDisplay();
  private observer: MutationObserver;
  private offsetTop: number = 0;

  /**
   * Indica se o nav-panel está visível. O valor inicial desse atributo será definido dinamicamente pelo próprio nav-panel.
   */
  @Prop({
    reflect: true,
    mutable: true
  })
  open: boolean;

  /**
   * Evento disparado quando o estado do nav-panel é alterado.
   */
  @Event({
    eventName: 'alc-state-change',
    cancelable: false,
    bubbles: true
  }) alcStateChange: EventEmitter<AlcStateEventTypes>;

  /**
   * Evento disparado quando o nav-panel precisa recuperar o estado.
   */
  @Event({
    eventName: 'alc-state-request',
    cancelable: false,
    bubbles: true
  }) alcStateRequest: EventEmitter<AlcStateEventTypes>;

  /**
   * Abre o nav-panel.
   * @returns O valor retornado é `true` se o nav-panel foi exibido com a chamada do método.
   */
  @Method()
  async show(): Promise<boolean> {
    this.updateState(true);
    return true;
  }

  /**
   * Fecha o nav-panel.
   * @returns O valor retornado é `true` se o nav-panel foi fechado com a chamada do método.
   */
  @Method()
  async hide(): Promise<boolean> {
    this.updateState(false);
    return true;
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    // Atualiza o display se teve mudanças
    const newDisplay = this.getDisplay();
    if (newDisplay !== this.display) {
      this.display = newDisplay;
    }

    // Essa classe é utilizada para aplicar padding e margins nas classes de container
    // ATENÇÃO: Caso ocorra alteração no tamanho do botão ou da margin lateral, deve atualizar o tamanho dos paddings e margins
    // na classe localizada em "global/styles/c-layout.scss"
    const htmlElementClassList = document.querySelector('html').classList;

    // Controle de CSS da tag html
    if (newDisplay === 'mobile') {
      // Se estiver no modo mobile e ter a classe alc-navpanel, remove a classe
      htmlElementClassList.contains('alc-navpanel') ? htmlElementClassList.remove('alc-navpanel') : null;
    } else {
      // Se estiver no modo tablet ou desktop e NÃO ter a classe alc-navpanel, adiciona a classe
      htmlElementClassList.contains('alc-navpanel') ? null : htmlElementClassList.add('alc-navpanel');
    }

    // Controle de exibição (open)
    // Se estiver indo para desktop, o estado salvo define o valor de open
    if (newDisplay === 'desktop') {
      this.open = this.state.open;
    }
    // Senão, sempre estará oculto.
    else {
      this.open = false;
    }

    // Verifica se teve mudanças nos valores de offsetTop
    // e atualiza as variáveis CSS
    if (this.el.offsetTop !== this.offsetTop) {
      this.setOffset(this.el.offsetTop);
    }

  }

  @Listen('click', { target: 'body' })
  handleClick(event: MouseEvent) {
    // Se estiver fechado, não faz nada
    if (!this.open) return;

    // Se o elemento clicado é dentro do nav-panel ou um de seus filhos, não faz nada
    const targetElement = event.target as HTMLElement;
    if (this.el.contains(targetElement)) return;

    // Se o breakpoint for desktop, não faz nada
    if (this.display === 'desktop') return;

    // Se o breakpoint for tamanho tablet ou menor, fecha o nav-panel ao clicar fora
    this.hide();
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    // Se estiver fechado, não faz nada
    if (!this.open || event.defaultPrevented) return;

    switch (event.key) {
      // Se apertar "Escape", fecha o nav-panel
      case 'Escape':
        event.preventDefault();
        this.hide();
        this.button.focus();
        break;
      // Se o breakpoint for tamanho tablet ou menor, controla o foco dentro do nav-panel
      case 'Tab':
        if (this.display !== 'desktop') {
          handleKeyDown(event, getFocusableElements(this.el));
        }
        break;
    }
  }

  @Watch('open')
  handleOpen() {
    if (this.open && this.content) {
      // Remove o atributo "hidden" quando o nav-panel é aberto
      this.content.hidden = false;
    }
  }

  componentWillLoad() {
    // Monta objeto para o evento - Nesse momento, com o valor padrão.
    const detail = {
      state: DEFAULT_STATE
    };
    // Requisita o estado gravado
    this.alcStateRequest.emit(detail); // Emite o evento para solicitar o estado
    // Garante que o objeto this.state tenha as chaves esperadas, independente do valor de detail.state
    // Grava o estado em memória
    // O estado é sempre salvo, independentemente do valor de `display`, porque `display` pode
    // mudar dinamicamente, e o estado pode passar a ser necessário.
    this.state = { ...DEFAULT_STATE, ...detail.state };

    if (this.display === 'desktop') {
      // "open" para desktop será inicialmente o estado salvo
      this.open = this.state.open;
    }
    else {
      // "open" para outros cenários (não desktop) inicialmente será false.
      this.open = false;
    }
  }

  componentDidLoad() {
    this.setOffset(this.el.offsetTop);

    // Esconde o conteúdo quando o nav-panel é fechado após a transição
    // A animação não funciona quando adiciona hidden no CSS
    this.content.addEventListener("transitionend", this.handleTransitionEnd.bind(this));

    if (this.getDisplay() !== 'mobile') {
      // Essa classe é utilizada para aplicar padding e margins nas classes de container
      document.querySelector('html').classList.add('alc-navpanel');
    }

    this.observer = new MutationObserver(() => {
      const newOffsetTop = this.el.offsetTop;
      if (newOffsetTop !== this.offsetTop) {
        this.setOffset(newOffsetTop);
      }
    });

    // Observa mudanças no body inteiro, pois mudanças acima no DOM podem afetar o offsetTop
    this.observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });


  }

  disconnectedCallback() {
    this.content.removeEventListener("transitionend", this.handleTransitionEnd.bind(this));

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private handleTransitionEnd() {
    if (!this.open) {
      this.content.hidden = true;
    }
  }

  private getDisplay(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;

    if (width >= DESKTOP_BREAKPOINT) return 'desktop';
    if (width >= TABLET_BREAKPOINT) return 'tablet';
    return 'mobile';
  }

  private updateState(open: boolean) {
    this.open = open;

    if (this.getDisplay() === 'desktop') {
      this.state.open = open;
      this.alcStateChange.emit({ state: this.state });
    }
  }

  private setOffset(offsetTop?: number) {
    this.offsetTop = offsetTop;
    // Altura esta o elemento em relação ao topo da tela)
    this.el.style.setProperty('--offset-top', this.el.offsetTop.toString());
  }
  // Utilizando "svg" diretamente em vez de uma tag <img> para permitir a personalização da cor do SVG no modo dark
  private renderButtonSVG() {
    return (
      <svg width="24" height="62" viewBox="0 0 24 62" fill="none" xmlns="http://www.w3.org/2000/svg" class="alc-nav-panel__button-svg-container" >
        <path d="M7 7C1.4 7 0 2.33333 0 0C0 20.6667 6.69364e-06 41.3333 0 62C0 59.6667 1.4 55 7 55H20C22.2091 55 24 53.2091 24 51V11C24 8.79086 22.2091 7 20 7H7Z" fill="#e0f7f6" class="alc-nav-panel__button-svg" />
      </svg>
    )
  }

  render() {

    return (
      <Host
        class={{
          'alc-nav-panel': true,
          'alc-nav-panel--opened': this.open
        }}
      >
        <div class="alc-nav-panel__container">
          <div class="alc-nav-panel__button-container">
            <button
              class="alc-nav-panel__button"
              onClick={() => this.open ? this.hide() : this.show()}
              aria-pressed={this.open ? 'true' : 'false'}
              aria-label="Exibir navegação"
              ref={el => this.button = el}
              data-alc-navpanel-button
              {...test('data-test-button')}
            >
              {this.renderButtonSVG()}
              <alc-icon
                class="alc-nav-panel__button-icon"
                name={this.open ? 'x-lg' : 'list'}
                label=""
              ></alc-icon>
            </button>
          </div>
          <div
            class={{
              'alc-nav-panel__content': true,
              'alc-nav-panel__content--opened': this.open
            }}
            ref={el => this.content = el}
            {...test('data-test-content')}
          >
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
