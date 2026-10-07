import { Component, Host, h, Prop, Element } from '@stencil/core';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-tab',
  styleUrl: 'alc-tab.css',
  scoped: false,
})
export class AlcTab {
  /**
   * Rótulo da tab.
   */
  @Prop({ reflect: true }) label: string = '';
  /**
   * Identificador único da tab.
   */
  @Prop({ reflect: true }) tab!: string;

  /**
   * Indica se a tab está ou não selecionada.
   */
  @Prop({ reflect: true }) selected: boolean;

  /**
   * Se, dentro da tab, o primeiro elemento com conteúdo significativo for focalizável, deve ser definido como `true`.
   * Caso contrário, deve ser mantido o valor padrão (`false`).
   */
  @Prop({ reflect: true }) contentFocus?: boolean = false;


  @Element() el: HTMLAlcTabElement;


  render() {
    this.tab ?? logger.report('tab', this.el.tagName.toLowerCase(), this.el)
    const getId = (): string => {

      let id: string;
      if (this.el.id) {
        id = this.el.id;
      }
      else {
        id = `alc-tab_${this.el.tab}`;
      }

      return id;
    }

    return (
      <Host>
        <div
          hidden={!this.selected}
          role='tabpanel'
          id={getId()} // Precisa ter id (para acessibilidade)
          tabindex={this.contentFocus ? null : '0'}
          class='alc-tabs__tab'
          {...test('data-test-tab')}
        >
          <div class='alc-tabs__tab--content'>
            <slot />
          </div>
        </div>
      </Host>
    );
  }

}
