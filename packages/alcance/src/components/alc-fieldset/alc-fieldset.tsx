import { Component, Element, Host, h, Prop, Watch } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

/**
 * @slot DEFAULT - Slot para o conteúdo do fieldset.
*/

@Component({
  tag: 'alc-fieldset',
  styleUrl: 'alc-fieldset.css',
  shadow: false,
})
export class AlcFieldset {

  describedBy = new Map();
  errorId = '';
  hintId = '';

  @Element() el: HTMLAlcFieldsetElement;

  /**
   * Texto da legenda do fieldset.
  */
  @Prop({ reflect: true }) legend!: string;

  /**
   * Texto de ajuda.
  */
  @Prop({ reflect: true }) hint: string = '';

  /**
   * Indica se o fieldset é obrigatório.
  */
  @Prop({ reflect: true }) required: boolean = false;


  /**
   * Texto de mensagem de erro.
   */
  @Prop({
    mutable: true,
    reflect: true,
  }) errorMsg: string = '';
  @Watch('errorMsg')
  watchErrorMsg(newValue: string) {

    logger.debug('watchErrorMsg', newValue);

    if (newValue) {
      this.el.classList.add('alc-form__input--error');
    }
    else {
      this.el.classList.remove('alc-form__input--error');
    }
  }

  componentWillLoad() {

    // Independentemente de qualquer coisa, reserva ids para esses elementos.
    this.errorId = getUniqueId();
    this.hintId = getUniqueId();

    if (this.el) {
      this.watchErrorMsg(this.errorMsg);
    }

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

  }

  render() {


    return (
      <Host>
        <fieldset
          class="alc-fieldset"
          aria-describedby={mapToString(this.describedBy)}
          {...test('data-test-fieldset')}
        >
          <legend
            class="alc-fieldset__legend"
            {...test('data-test-legend')}
          >
            {this.legend}
            {this.required
              ?
              // aria-hidden porque o "required" do input já é suficiente para informar.
              <small aria-hidden="true"> (obrigatório)</small>
              :
              null
            }
          </legend>
          <slot></slot>
          <div class="alc-fieldset__text-container">
            {this.errorMsg
              ?
              <small
                class="alc-fieldset__text alc-fieldset__text--error"
                id={this.errorId}
                {...test('data-test-error')}
              >
                {this.errorMsg}
              </small>
              :
              null
            }
            {this.hint
              ?
              <small
                class="alc-fieldset__text"
                id={this.hintId}
                {...test('data-test-hint')}
              >
                {this.hint}
              </small>
              :
              null
            }
          </div>
        </fieldset>
      </Host>
    );
  }

}

// get Map and transform in a string with the values separated by spaces. return null if Map is empty.
function mapToString(map: Map<string, string>) {
  if (map.size > 0) {
    return Array.from(map.values()).join(' ');
  }
  else {
    return null;
  }
}
