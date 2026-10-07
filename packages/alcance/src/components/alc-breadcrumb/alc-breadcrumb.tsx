import { Component, Host, h, Element } from '@stencil/core';
import test from '../utils/testAttributes';

/**
 * @slot - Slot para adicionar os `alc-breadcrumb-item`
*/

@Component({
  tag: 'alc-breadcrumb',
  styleUrl: 'alc-breadcrumb.css',
  shadow: false,
})
export class AlcBreadcrumb {
  @Element() el: HTMLElement;

  private checkCurrentPage = () => {
    const items = this.el.querySelectorAll('alc-breadcrumb-item');
    items.forEach((item, index) => {
      // O ultimo breadcrumb-item é a pagina atual
      item.current = index === items.length - 1;
    })

  }

  componentWillLoad() {
    this.checkCurrentPage();
  }

  render() {
    return (
      <Host>
        <nav aria-label="Breadcrumb" class="alc-breadcrumb" {...test('data-test-nav')}>
          <div class="alc-breadcrumb__list" role="list" {...test('data-test-list')}>
            <slot></slot>
          </div>
        </nav>
      </Host>
    );
  }

}
