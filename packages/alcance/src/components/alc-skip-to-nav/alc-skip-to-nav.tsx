import { Component, Host, h } from '@stencil/core';
import { focusFirstElement, getFocusableElements } from '../utils/keydown';
import { screens } from '../utils/tailwind';
import logger from '../utils/logger';
import testAttributes from '../utils/testAttributes';

const MD_BREAKPOINT = Number(screens.md.split('px')[0]);

@Component({
  tag: 'alc-skip-to-nav',
  styleUrl: 'alc-skip-to-nav.css',
  scoped: false
})
export class AlcSkipToNav {
  handleClick = (event: MouseEvent) => {
    event.preventDefault();

    // Abaixo do breakpoint md, é renderizado o drawer.
    if (window.innerWidth < MD_BREAKPOINT) {
      // Procura pelo botão que abre o drawer: ou o gerado pelo alc-header(-v2), ou o gerado pelo sidepanel.
      const drawerButton = document.querySelector('[data-alc-header-drawer-button], [data-alc-sidepanel-drawer-button]');

      if (!drawerButton) {
        logger.warn('O componente <alc-skip-to-nav> necessita de <alc-header> ou <alc-sidepanel> para funcionar corretamente no modo mobile.');
        return;
      }

      if (drawerButton instanceof HTMLButtonElement) {
        drawerButton.focus();
      }

      return;
    }

    // Lógica para não mobile

    let skipped = false;

    // Cenário 1 - alc-nav-panel
    const navpanel = document.querySelector('alc-nav-panel');
    if (navpanel) {
      if (navpanel.open) {
        const nav = navpanel.querySelector('alc-nav');
        if (nav) {
          focusFirstElement(getFocusableElements(nav));
          skipped = true;
        }
        else {
          logger.warn('Ao usar o <alc-nav-panel>, é necessário <alc-nav> dentro dele para <alc-skip-top-nav> funcionar corretamente.');
          return; // Aqui, não há mais nada a fazer.
        }
      }
      else { // navpanel fechado
        const navButton = document.querySelector('[data-alc-navpanel-button]');
        if (navButton instanceof HTMLButtonElement) {
          navButton.focus();
          skipped = true;
        }
      }
    }

    if (skipped) {
      return;
    }

    // Cenário 2 - alc-navbar
    const navbar = document.querySelector('alc-navbar');
    if (navbar) {
      const nav = navbar.querySelector('nav');
      if (nav) {
        focusFirstElement(getFocusableElements(nav));
        skipped = true;
      }
      else {
        logger.warn('O componente <alc-skip-to-nav> localizou o <alc-navbar> mas encontrou algo inesperado na estrutura. Verifique a documentação dos componentes.');
        return; // Aqui, não há mais nada a fazer.
      }
    }

    if (skipped) {
      return;
    }

    // Cenário 3 - alc-sidepanel (legado)
    const sidepanel = document.querySelector('alc-sidepanel');
    if (sidepanel) {
      if (sidepanel.visible) {
        const nav = sidepanel.querySelector('alc-nav');
        if (nav) {
          focusFirstElement(getFocusableElements(nav));
          skipped = true;
        }
        else {
          logger.warn('Ao usar o <alc-sidepanel>, é necessário <alc-nav> dentro dele para <alc-skip-top-nav> funcionar corretamente.');
          return; // Aqui, não há mais nada a fazer.
        }
      }
      else { // sidepanel fechado
        const navButton = document.querySelector('[data-alc-sidepanel-button]');
        if (navButton instanceof HTMLButtonElement) {
          navButton.focus();
          skipped = true;
        }
      }
    }

    if (skipped) {
      return;
    }

    // Cenário 4 - alc-nav sem nenhum dos painéis (genérico)
    const nav = document.querySelector('alc-nav');
    if (nav) {
      focusFirstElement(getFocusableElements(nav));
      skipped = true;
    }

    if (!skipped) {
      logger.warn('O componente <alc-skip-to-nav> não localizou os elementos necessários para funcionar corretamente. Verifique a documentação do componente.');
    }
  }

  render() {
    return (
      <Host {...testAttributes('data-test-skip-to-nav-component')}>
        <a
          class='alc-link text-center'
          href='#'
          onClick={this.handleClick}
          {...testAttributes('data-test-skip-to-nav-link')}
        >
          Ir para navegação
        </a>
      </Host>
    );
  }
}
