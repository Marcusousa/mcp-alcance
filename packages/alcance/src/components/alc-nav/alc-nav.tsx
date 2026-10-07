import { Component, Element, Host, h, Method, Listen, Prop } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import logger from '../utils/logger';
import { childText, createIcon } from '../utils/domUtils';

/**
 * @slot DEFAULT - Slot para o conteúdo principal do nav. Tipicamente, os elementos de navegação pelas funcionalidades do sistema.
 * @slot footer - Slot nomeado para adicionar rodapé no nav. Tipicamente, os elementos de navegação acessórios e configurações, incluindo o seletor de tema.
 * @slot header - Slot nomeado para adicionar cabeçalho no nav. Tipicamente, a identificação do usuário logado no sistema.
 */
@Component({
  tag: 'alc-nav',
  styleUrl: 'alc-nav.css',
  scoped: false,
})
export class AlcNav {

  @Element() el: HTMLAlcNavElement;
  /**
   * @internal
   * Indica que esse nav faz parte de um navbar.
   * Essa é uma propriedade interna, usada pelo componente pai `alc-navbar`.
   */
  @Prop() isNavbar: boolean = false;

  private isMobile: boolean;

  menu: HTMLElement;
  panels: HTMLElement;

  header: HTMLElement;
  main: HTMLElement;
  footer: HTMLElement;

  // Lista de itens que podem receber foco no momento
  focusableItems: HTMLElement[];

  openPanel(panel: HTMLElement) {
    if (!panel) {
      return;
    }

    logger.debug('open', { panel });

    panel = panel.closest('.alc-nav__panel') as HTMLElement;

    // Identifica o painel que está aberto atualmente.
    const current = Array.from(this.panels.children).filter(panel => panel.matches('.is-open'))[0] as HTMLElement;

    // Mantém painel por cima enquanto está sendo fechado
    if (panel.matches('.alc-nav__panel--parent') && current) {
      current.classList.add('alc-nav__panel--highest');
    }

    const remove = ['is-open', 'mm-panel--parent'];
    const add = [];

    Array.from(this.panels.children)
      .filter(child => child.matches('.alc-nav__panel'))
      .forEach(p => {
        p.classList.add(...add);
        p.classList.remove(...remove);

        if (p !== current) {
          p.classList.remove('alc-nav__panel--highest');
        }

        if (p === panel) {
          p.removeAttribute('inert');
        } else {
          p.setAttribute('inert', 'true');
        }
      });

    // Abre novo painel.
    panel.classList.add('is-open');

    // Painel pai
    let parent: HTMLElement = this.panels.querySelector(`#${panel.dataset.alcParent}`);

    // Ajusta painéis pais como "parent"
    while (parent) {
      parent = parent.closest('.alc-nav__panel') as HTMLElement;
      parent.classList.add('alc-nav__panel--parent');

      parent = this.panels.querySelector(`#${parent.dataset.alcParent}`);
    }

    // Todos os links do painel aberto são considerados agora focáveis.
    this.focusableItems = Array.from(this.el.querySelectorAll('.alc-nav__panel.is-open .alc-nav__listview a'));
    // Coloca o primeiro link do painel aberto na sequência de tabulação
    this.focusableItems[0]?.focus();

    // Se estiver "voltando" de um painel em um nível abaixo na hierarquia,
    // coloca o foco no link que abriu esse painel.
    const listitems = Array.from(this.el.querySelectorAll('.alc-nav__panel.is-open .alc-nav__listitem'));
    listitems.forEach((item: HTMLElement) => {
      if (item.id === current?.dataset.alcParent) {
        logger.debug('focus on', item, item.id);
        item.querySelector('a').focus();
      }
    });
  }

  closePanel(panel: HTMLElement) {
    logger.debug('close', { panel });
  }

  /**
   * Abre ou fecha o painel especificado pelo parâmetro.
   */
  @Method()
  async togglePanel(panel: HTMLElement) {
    const listItem = panel.parentElement;

    if(!listItem) {
      return;
    }

    if (listItem.classList.contains('is-open')) {
      logger.debug('will close', panel);
      this.closePanel(panel);
    } else {
      logger.debug('will open', panel);
      this.openPanel(panel);
    }
  }

  /**
   * Seleciona o item passado pelo parâmetro. Se nenhum valor for passado, apenas remove o item atualmente selecionado.
   */
  @Method()
  async setSelectedItem(listItem?: HTMLElement) {
    // Remove a classe 'is-selected' e a propriedade 'data-alc-selected' de qualquer item
    this.el.querySelectorAll('.alc-nav__listitem.is-selected').forEach(item => {
      item.classList.remove('is-selected');
      item.removeAttribute('data-alc-selected');
    });

    if (listItem) {
      // Adiciona a classe 'is-selected' e a propriedade 'data-alc-selected' ao item passado como parâmetro
      listItem.classList.add('is-selected');
      listItem.setAttribute('data-alc-selected', 'true');
    }
  }

  setSelected(listitem: HTMLElement) {
    this.menu.querySelectorAll('.alc-nav__listitem--selected').forEach(li => {
      li.classList.remove('alc-nav__listitem--selected');
    });

    listitem.classList.add('alc-nav__listitem--selected');
  }

  initMenu() {
    this.menu.id = this.menu.id || getUniqueId();

    const panels = Array.from((this.menu.children)).filter(child => child.matches('[data-alc-panel]')) as HTMLElement[];

    logger.debug({ panels });

    this.panels = document.createElement('div');
    this.panels.classList.add('alc-nav__panels');
    this.menu.append(this.panels);

    panels.forEach(panel => {
      this.initPanel(panel);
    });
  }

  initPanels() {
    this.menu.addEventListener('click', e => {
      const href = (e.target as HTMLElement)?.closest('a[href]')?.getAttribute('href') || '';

      if (href.slice(0, 1) === '#') {
        try {
          const panel = this.el.querySelector(href) as HTMLElement;

          if (panel) {
            e.preventDefault();
            this.togglePanel(panel);
          }
        } catch (err) {}
      }
    }, {
      capture: true
    });
  }

  initPanel(panel: HTMLElement): HTMLElement {
    if (panel.matches('.alc-nav__panel')) {
      return;
    }

    logger.debug({ panel });

    panel.id = panel.id || getUniqueId();

    panel.classList.add('alc-nav__panel');

    this.panels.append(panel);

    this.initNavbar(panel);

    Array.from(panel.children)
      .filter(element => element.matches('ol, ul'))
      .forEach((listview: HTMLElement) => {
        this.initListview(listview);
      });

    Array.from(this.main.children)
      .filter(element => element.matches('ol, ul'))
      .forEach((listview: HTMLElement) => {
        this.initListview(listview);
      });

    if(this.header?.children) {
      Array.from(this.header.children)
      .filter(element => element.matches('ol, ul'))
      .forEach((listview: HTMLElement) => {
        this.initListview(listview);
      });
    }

    if(this.footer?.children) {
      Array.from(this.footer.children)
      .filter(element => element.matches('ol, ul'))
      .forEach((listview: HTMLElement) => {
        this.initListview(listview);
      });
    }

    return panel;
  }

  initNavbar(panel: HTMLElement) {
    if (Array.from(panel.children).some(child => child.matches('.alc-nav__navbar'))) {
      return;
    }

    let parentListitem: HTMLElement = null;

    let parentPanel: HTMLElement = null;

    if (panel.dataset.alcParent) {
      parentListitem = this.panels.querySelector(`#${panel.dataset.alcParent}`);
      parentPanel = parentListitem.closest('.alc-nav__panel');

      while (parentPanel.closest('.alc-nav__listitem')) {
        parentPanel = parentPanel.parentElement.closest('.alc-nav__panel');
      }
    }

    const navbar = document.createElement('div');
    navbar.classList.add('alc-nav__navbar');

    if (parentPanel) {
      const prev = document.createElement('a');

      prev.classList.add(
        'alc-nav__button',
        'alc-nav__button--prev',
      );

      const parentLabel = childText(parentPanel.querySelector('.alc-nav__navbar-title'));
      const labelText = parentLabel ? `Voltar para ${parentLabel}` : 'Voltar para navegação principal';

      const icon = createIcon('arrow-left-short', labelText);
      icon.classList.add('alc-nav__icon--prev');

      prev.href = `#${parentPanel.id}`;

      prev.append(icon);
      navbar.append(prev);
    } else {
      return;
    }

    let opener: HTMLElement = null;

    if (parentListitem) {
      opener = Array.from(parentListitem.children).filter(child => child.matches('.alc-nav__text'))[0] as HTMLElement;
    } else if (parentPanel) {
      opener = parentPanel.querySelector(`a[href=#${panel.id}]`);
    }

    const title = document.createElement('span');
    title.classList.add('alc-nav__navbar-title');
    title.innerHTML = childText(opener) || '';

    panel.prepend(navbar);
    navbar.append(title);
  }

  initListview(listview: HTMLElement) {
    if (listview.matches('.alc-nav__listview')) {
      return;
    }

    listview.classList.add('alc-nav__listview');

    const previous = listview.previousElementSibling as HTMLElement;
    const hasLabel = previous ? 'alcLabel' in previous.dataset : false;
    if (hasLabel) {
      listview.classList.add('alc-nav__listview--labelled');

      const wrapper = document.createElement('div');
      wrapper.classList.add('alc-nav__label-wrapper');
      listview.parentElement.insertBefore(wrapper, previous);
      wrapper.insertBefore(previous, null);

      previous.classList.add('alc-nav__label');
      previous.id = previous.id || getUniqueId();
      listview.setAttribute('aria-labelledby', previous.id);
    }

    Array.from(listview.children).forEach((listitem: HTMLElement) => {
      this.initListitem(listitem);
    });
  }

  initListitem(listitem: HTMLElement) {
    if (listitem.matches('.alc-nav__listitem')) {
      return;
    }

    listitem.classList.add('alc-nav__listitem');

    if (listitem.hasAttribute('data-alc-selected')) {
      listitem.classList.add('is-selected');
    }

    Array.from(listitem.children)
      .filter(element => element.matches('a, span'))
      .forEach(text => text.classList.add('alc-nav__text'));

    Array.from(listitem.children)
      .filter(element => element.matches('[data-alc-panel]'))
      .forEach((subpanel: HTMLElement) => this.initSubPanel(subpanel));
  }

  initSubPanel(subpanel: HTMLElement) {
    if (subpanel.matches('.alc-nav__panel')) {
      return;
    }

    const listitem = subpanel.parentElement;

    listitem.id = listitem.id || getUniqueId();
    subpanel.id = subpanel.id || getUniqueId();

    listitem.dataset.alcChild = subpanel.id;
    subpanel.dataset.alcParent = listitem.id;

    subpanel.role = "dialog";
    subpanel.setAttribute('aria-labelledby', listitem.id);
    subpanel.classList.add('alc-nav__panel--subpanel');

    let button = Array.from(listitem.children).filter(child => child.matches('.alc-nav__button'))[0] as HTMLAnchorElement;

    if (!button) {
      button = document.createElement('a');
      button.classList.add('alc-nav__button', 'alc-nav__button--next');
      button.setAttribute('aria-expanded', 'false');
    }

    const icon = createIcon('chevron-right');
    icon.setAttribute('aria-hidden', 'true');
    icon.classList.add('alc-nav__icon--next');

    Array.from(listitem.children)
      .filter(child => child.matches('a, span'))
      .forEach(text => {
        if (text.matches('span')) {
          button.classList.add('alc-nav__text');
          button.innerHTML = text.innerHTML;
          listitem.insertBefore(button, text.nextElementSibling);
          text.remove();
        } else {
          listitem.insertBefore(button, text.nextElementSibling);
        }
      });

    button.href = `#${subpanel.id}`;
    button.append(icon);

    this.initPanel(subpanel);
  }

  initOpened() {
    const listitem: HTMLElement = this.panels.querySelector('.alc-nav__listitem--selected');
    let panel: HTMLElement = this.panels.querySelector('.alc-nav__panel');

    if (listitem) {
      this.setSelected(listitem);
      panel = listitem.closest('.alc-nav__panel');
    }

    // Verificar se há um item com o atributo data-alc-selected
    const selectedListItem = this.el.querySelector('.alc-nav__listitem[data-alc-selected]') as HTMLElement;
    if (selectedListItem) {
      this.setSelectedItem(selectedListItem);
    }

    this.openPanel(panel);
  }

  observeNavLinks() {
    // Seleciona os links que estão dentro de uma listview
    const links = Array.from(
      this.el.querySelectorAll('.alc-nav__listview a, .alc-nav__listview router-link')
    );
  
    links.forEach(link => {
      // Cria um observer para monitorar mudanças no atributo 'class'
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === 'class') {
            // Se a classe 'alc-nav__text' não estiver presente, adiciona novamente
            if (!link.classList.contains('alc-nav__text')) {
              link.classList.add('alc-nav__text');
            }
          }
        });
      });
  
      observer.observe(link, {
        attributes: true,
        attributeFilter: ['class'],
      });
    });
  }

  componentDidLoad() {
    // dispara uma vez no carregamento
    this.isMobile = window.innerWidth < 768;
    this.emitNavContent(this.isMobile);
  }

  componentDidRender() {
    this.initMenu();
    this.initPanels();
    this.initOpened();

    this.focusableItems = Array.from(this.el.querySelectorAll('.alc-nav__panel.is-open .alc-nav__listview a'));

    // Força a classe 'alc-nav__text' nos links mesmo após alterações
    this.observeNavLinks();
  }

  componentWillLoad() {
    this.header = this.el.querySelector("[slot='header']");
    this.footer = this.el.querySelector("[slot='footer']");
  }

  @Listen('resize', { target: 'window' })
  handleWindowResize() {
    const nowMobile = window.innerWidth < 768;
    if (nowMobile !== this.isMobile) {
      this.isMobile = nowMobile;
      this.emitNavContent(this.isMobile);
    }
  }

  private emitNavContent(isMobile: boolean) {
    this.el.dispatchEvent(new CustomEvent('alc-nav-content', {
      detail: { navEl: this.el, isMobile },
      bubbles: true,
      composed: true
    }));
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    const currentPanel = Array.from(this.panels.children).filter(panel => panel.matches('.is-open'))[0] as HTMLElement;
    const isSubPanel = currentPanel?.hasAttribute('data-alc-parent');
    if (event.key === 'Escape' && isSubPanel) {
      const backButton = currentPanel.querySelector('.alc-nav__button--prev') as HTMLElement;
      if (backButton) {
        backButton.click();
      }
      event.preventDefault();
    }
  }

  renderContent() {
    return (
      <div data-alc-panel>
        {this.header ? (
          <div class="alc-nav__header">
            <slot name="header"></slot>
          </div>
        ) : null}
        <div class={{
          "alc-nav__main": true,
          "alc-nav__main--navbar": this.isNavbar,
         }}
          ref={el => this.main = el}>
          <slot></slot>
        </div>
        {this.footer ? (
          <div class="alc-nav__footer">
            <slot name="footer"></slot>
          </div>
        ) : null}
      </div>
    )
  }

  render() {
    return (
      <Host class={{ 'alc-nav': true, 'alc-nav__wrapper': true }}>
        {this.isNavbar ? (
          <div ref={el => this.menu = el} class="alc-nav__menu">
            {this.renderContent()}
          </div>
        ) : (
          <nav ref={el => this.menu = el} class="alc-nav__menu">
            {this.renderContent()}
          </nav>
        )}
      </Host>
    );
  }
}