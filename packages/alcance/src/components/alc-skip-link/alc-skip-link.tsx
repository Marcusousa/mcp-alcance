import { Component, Host, Prop, h } from '@stencil/core';
import test from '../utils/testAttributes';
import logger from '../utils/logger';

/**
* @slot DEFAULT - Slot para inserção do texto que indica para onde o usuário vai saltar na página. A parte inicial é fixa: "Ir para". O texto no slot é concatenado a ele. Por exemplo: "Ir para _conteúdo_."
*/
@Component({
  tag: 'alc-skip-link',
  styleUrl: 'alc-skip-link.css',
  scoped: false
})
export class AlcSkipLink {
  /**
   * Valor do `id` do elemento para onde o usuário navegará ao acionar o link.
   */
  @Prop({ reflect: true }) anchor!: string;

  private target: HTMLElement;

  handleClick = (event: MouseEvent) => {

    if (!this.target) return;

    event.preventDefault();

    const header = document.querySelector('alc-header, alc-header-v1');
    const headerHeight = (header instanceof HTMLElement) ? header.offsetHeight : 0; // Obtém a altura do cabeçalho
    const targetTop = this.target.offsetTop; // Obtém a posição do target em relação ao topo

    // Calcula a posição de rolagem ajustada
    const scrollPosition = targetTop - headerHeight - 16; // 16px de margem extra

    this.target.setAttribute('tabindex', '-1');
    this.target.focus({preventScroll: true});

    // Preferência do usuário por movimento/animação reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: scrollPosition,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    });

  }

  componentDidRender() {
    this.target = document.getElementById(this.anchor);
    if (!this.target) {
      logger.warn(`O valor do atributo "anchor" (${this.anchor}) deve corresponder ao id de algum elemento na página.`);
    }
  }

  render() {
    return (
      <Host>
        <a
          class='alc-link text-center'
          href={`#${this.anchor}`}
          {...test('data-test-link')}
          onClick={this.handleClick}
        >
          Ir para <slot></slot>
        </a>
      </Host>
    );
  }
}
