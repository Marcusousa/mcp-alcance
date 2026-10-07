import { Component, Host, h, Prop, Element, State } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import test from '../utils/testAttributes';

/**
 * @slot DEFAULT - Slot para o elemento input do tipo checkbox.
 *
 * @slot label - Slot para o elemento label do checkbox. Há opção de adicionar apenas o texto por meio da propriedade `label`.
*/

@Component({
  tag: 'alc-checkbox',
  styleUrl: 'alc-checkbox.css',
  scoped: false,
})
export class AlcCheckbox {

  describedBy = new Map();
  errorId = '';
  hintId = '';
  input: HTMLInputElement;

  @Element() el: HTMLAlcCheckboxElement;

  @State() inputId: string;

  /**
   * Texto de ajuda.
  */
  @Prop({ reflect: true }) hint?: string = '';

  /**
   * Texto do label do input. Há opção de adicionar o elemento label pelo slot "label".
  */
  @Prop({ reflect: true }) label: string = '';

  /**
   * Texto de mensagem de erro.
  */
  @Prop({ mutable: true, reflect: true}) errorMsg: string = '';

  componentWillLoad() {

    // Independentemente de qualquer coisa, reserva ids para esses elementos.
    this.errorId = getUniqueId();
    this.hintId = getUniqueId();

    this.input = this.el.querySelector('input[type="checkbox"]');
    const labelElement = this.el.querySelector('label');

    this.inputId = this.input.id;

    if(!this.inputId) {
      this.inputId = getUniqueId();
      this.input.setAttribute('id', this.inputId);
    }

    if(labelElement && !labelElement.getAttribute('for')){
      labelElement.setAttribute('for', this.inputId);
    }

    this.describedBy.set('original', this.input.getAttribute('aria-describedby') || '');
  }

  componentWillRender() {

    if (this.errorMsg) {
      this.describedBy.set('error', this.errorId);
    }
    else {
      this.describedBy.delete('error');
    }

    if (this.hint) {
      this.describedBy.set('hint', this.hintId);
    }
    else {
      this.describedBy.delete('hint');
    }

    let currentDescribedBy = '';

    currentDescribedBy += ` ${this.describedBy.get('original') || ''}` ;
    currentDescribedBy += ` ${this.describedBy.get('error') || ''}` ;
    currentDescribedBy += ` ${this.describedBy.get('hint') || ''}` ;

    this.input.setAttribute('aria-describedby', currentDescribedBy.trim());
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <div class="alc-checkbox__label">
          {/* Essa div faz o label desvincular-se da estrutura do flex, permitindo que seja mostrado inline, que é o natural */}
          <div>
            { this.label
              ?
                <label
                  htmlFor={this.inputId}
                  {...test('data-test-label')}
                >
                  {this.label}
                </label>
              :
                <slot name="label"></slot>
            }
          </div>
          { this.errorMsg
            ?
              <small
                class="alc-checkbox__text alc-checkbox__text--error"
                id={this.errorId}
                {...test('data-test-error')}
              >
                {this.errorMsg}
              </small>
            :
              null
          }
          { this.hint
            ?
              <small
                class="alc-checkbox__text"
                id={this.hintId}
                {...test('data-test-hint')}
              >
                {this.hint}
              </small>
            :
              null
          }
        </div>
      </Host>
    );
  }
}
