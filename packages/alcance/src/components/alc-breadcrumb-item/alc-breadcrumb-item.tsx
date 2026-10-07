import { Component, Host, h, Prop } from '@stencil/core';
import test from '../utils/testAttributes';

/**
 * @slot - Slot para adicionar elemento de navegação. Pode ser tanto a tag `<a>` quanto um `<routerlink>` no caso de uso com Vue. Também pode-se usar a propriedade url.
*/

@Component({
  tag: 'alc-breadcrumb-item',
  styleUrl: 'alc-breadcrumb-item.css',
  shadow: false,
})
export class AlcBreadcrumbItem {

  /** Indica a url do link, pode-se usar o slot default para adicionar o elemento de navegação */
  @Prop({ reflect: true }) url: string = null;

  /** Indica a label do breadcrumb */
  @Prop({ reflect: true }) label: string = null;

  /** Indica o nome do icone a ser renderizado */
  @Prop({ reflect: true }) iconName: string = null;

  /** Indica que o item representa a página atual. O `alc-breadcrumb` define essa propriedade no último item da trilha. */
  @Prop({ reflect: true }) current: boolean = false;

  render() {
    return (
      <Host role="listitem">
        <div class='alc-breadcrumb-item'>
          <div 
            class={{
              'alc-breadcrumb-item__link': true,
              'alc-link': !this.current
            }}
            aria-current={this.current ? 'page' : null}
            {...test('data-test-content')}
          >
            {/* Renderiza icone se ter */}
            {this.iconName && (
              <alc-icon label="" name={this.iconName} class="alc-breadcrumb-item__icon" aria-hidden="true" {...test('data-test-icon')}></alc-icon>
            )}
            {/* Renderiza link ou slot */}
            {this.url ? (
              <a href={this.url} {...test('data-test-link')}>{this.label}</a>
            ) : (
              <slot></slot>
            )
            }
          </div>
          {/*  Renderiza separador */}
          {!this.current && (
            <span class='alc-breadcrumb-item__separator'>/</span>
          )}
        </div>
      </Host>
    );
  }

}
