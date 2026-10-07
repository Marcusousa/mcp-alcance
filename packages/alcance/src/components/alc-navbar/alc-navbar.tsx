

import { Component, Host, h, Element, State, Listen, Watch } from '@stencil/core';
import { screens } from '../utils/tailwind';
import logger from '../utils/logger';
import { getAllFocusableElements } from '../utils/keydown';


const TABLET_BREAKPOINT = Number(screens.md.split('px')[0]);

@Component({
  tag: 'alc-navbar',
  styleUrl: 'alc-navbar.css',
  scoped: false,
})
export class AlcNavbar {
  @Element() el: HTMLElement;

  originalElement: Node;
  navBarRendered: Node;
  navRendered: Node;
  resizeObserver: ResizeObserver;
  
  @State() isMobile: boolean = false;


  @Listen('resize', { target: 'window' })
  handleResize() {
    const wasMobile = this.isMobile;
    this.checkIsMobile();

    // Só re-renderiza se o estado (mobile/desktop) mudou para evitar processamento desnecessário
    if (wasMobile !== this.isMobile) {
      this.renderView();
    }
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    // Tratamento para navegação dentro do alc-dropdown quando está no primeiro ou último elemento focável (O alc-dropdown fecha e o foco some)
    if(event.key !== 'Tab') return;

    const target = event.target;
    if(target instanceof HTMLElement === false) return;

    const dropdown = target.closest('alc-dropdown');
    if (!dropdown) return;

    const currentPanel = target.closest('[data-alc-panel]');
    if(currentPanel instanceof HTMLElement === false) return;

    // Lista de focáveis do painel atual
    const focusableElements = getAllFocusableElements(currentPanel);
    if(focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length -1];

    let elementToFocus: HTMLElement | null = null;

    if(event.shiftKey) {
      // Shift + Tab
      if(target !== firstElement) return;

      // Verifica o elemento "li" anterior ao dropdown
      const previousElement = dropdown.closest('li')?.previousElementSibling;
      if(previousElement instanceof HTMLElement) {
        elementToFocus = previousElement;
      }
      
    } else {
      // Tab
      if(target !== lastElement) return;

      // Verifica o elemento "li" seguinte ao dropdown
      const nextElement = dropdown.closest('li')?.nextElementSibling;

      if(nextElement instanceof HTMLElement) {
        elementToFocus = nextElement;
      }
    }

    if(elementToFocus) {
      this.focusElement(elementToFocus);
    } else {
      dropdown.hide();
      this.focusElement(dropdown);
    }
  }

  componentWillLoad() {
    const list = this.el.querySelector('ul, ol');
    if (list) {
      this.originalElement = list.cloneNode(true);
    } else {
      logger.error('Nenhuma lista (ul/ol) encontrada no alc-navbar.');
      return;
    }

    this.checkIsMobile();
    this.renderView();
  }

  componentDidLoad() {
    this.setupTopObserver();
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private setupTopObserver() {
    const top = document.querySelector('[data-alc-top]');
    
    if (!top) {
      // Se não encontrar, define o top como 0
      this.updateNavbarPosition(0);
      return;
    }

    // Define a posição inicial imediatamente
    this.updateNavbarPosition(top.getBoundingClientRect().height);

    // Monitorar mudanças de altura do elemento de topo
    this.resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const height = entry.contentRect.height;
        this.updateNavbarPosition(height);
      }
    });

    this.resizeObserver.observe(top);
  }

  private updateNavbarPosition(height: number) {
    this.el.style.top = `${height}px`;
  }

  private renderView() {
    if (!this.originalElement) return;

    const freshList = this.originalElement.cloneNode(true);

    // Limpa o componente atual e insere a lista "pura" temporariamente para manipulação
    this.el.replaceChildren(freshList);

    const listElements = this.el.querySelectorAll('ul > li:not(alc-nav li)');
    const currentList = this.el.querySelector('ul, ol');

    if (this.isMobile) {
      this.renderMobileMode(listElements, currentList);
    } else {
      this.renderDesktopMode(listElements, currentList);
    }
  }

  private renderMobileMode(listElements: NodeListOf<Element>, ul: Element) {
    listElements.forEach(li => {
      const alcNav = li.querySelector('alc-nav');
      if (!alcNav) return;

      const nav = this.createNavAlcPanel(alcNav);
      li.replaceChild(nav, alcNav);
    });

    const navWrapper = document.createElement('alc-nav');

    // Remove a lista do this.el para colocar dentro do wrapper
    ul.remove();
    navWrapper.appendChild(ul);

    this.el.replaceChildren(navWrapper);
  }

  private renderDesktopMode(listElements: NodeListOf<Element>, ul: Element) {
    listElements.forEach(li => {
      const alcNav = li.querySelector('alc-nav');
      if (!alcNav) {
        // Verificação de segurança para li.children[0]
        if (li.children.length > 0) {
          li.children[0].classList.add('alc-navbar__item');
        }
        return;
      }

      alcNav.setAttribute('is-navbar', "true");
      const span = li.querySelector('span');

      const dropdown = this.createDropdown(span, alcNav, li);
      li.replaceChildren(dropdown);
    });

    const navWrapper = document.createElement('nav');
    navWrapper.classList.add('alc-navbar__nav');
    ul.classList.add('alc-navbar__list');

    // Remove a lista do this.el para colocar dentro do wrapper
    ul.remove();
    navWrapper.appendChild(ul);

    this.el.replaceChildren(navWrapper);
  }

  private createDropdown(span: HTMLSpanElement, alcNav: HTMLAlcNavElement, li: Element) {
    const button = document.createElement('button');
    button.setAttribute('slot', 'trigger');
    button.setAttribute('type', 'button');
    button.classList.add('alc-navbar__item');

    const icon = document.createElement('alc-icon');
    icon.setAttribute('name', 'chevron-down');
    icon.setAttribute('label', '');

    button.appendChild(span);
    button.appendChild(icon);

    const dropdown = document.createElement('alc-dropdown');
    dropdown.appendChild(button);
    dropdown.appendChild(alcNav);

    dropdown.addEventListener('alc-hide', e => {
      icon.setAttribute('name', 'chevron-down')

      // Usa o método togglePanel do alc-nav para ir ao primeiro painel
      const firstPanel = alcNav.querySelector('[data-alc-panel]:not([data-alc-parent])');
      if (firstPanel && firstPanel instanceof HTMLElement) {
        alcNav.togglePanel(firstPanel);
      }

    });
    dropdown.addEventListener('alc-show', e => icon.setAttribute('name', 'chevron-up'));
    return dropdown;
  }

  private createNavAlcPanel(alcNav: HTMLAlcNavElement) {
    const div = document.createElement('div');
    div.setAttribute('data-alc-panel', '');
    const alcNavList = alcNav.querySelector('ul, ol');
    div.appendChild(alcNavList);
    return div;
  }

  private checkIsMobile() {
    if (window.innerWidth < TABLET_BREAKPOINT) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  private focusElement(element: HTMLElement) {
    const focusableElement = element.querySelector('a, button');

    if(focusableElement instanceof HTMLElement) {
      window.requestAnimationFrame(() => {
        focusableElement.focus();
      });
    }
  }

  render() {
    // Na versão 4.41.0 do StencilJS houve uma mudança no tratamento dos slot non-shadow.
    // Como estamos manipulando totalmente a estrutura interna do componente, não devemos usar
    // um slot aqui. A manipulação do DOM (como elemento contido no componente é retirado e
    // depois recolocado) faz com que o StencilJS considere que ele é um elemento que
    // não tem um slot para onde ir.
    // Para que possamos seguir usado o slot, uma forma seria fazer uma manipulação mais
    // restrita do DOM, pegando o conteúdo de dentro do slot talvez, como é feito atualmente
    // no componente alc-header-action, usando this.slot.assignedNodes().
    // Veja a partir da linha 1232 no arquivo alterado:
    // https://github.com/stenciljs/core/commit/cdcd873a03de2534715320e6c758a808cab08ce1#diff-4828a657f521302051295a582e81299dde7354857095b41f6ae9b062d835670fL1226
    return (
      <Host>
      </Host>
    );
  }
}
