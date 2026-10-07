import { Component, Element, Host, h, Prop, State, Watch} from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import logger from '../utils/logger';

/**
 * @slot - Slot para o controle de formulário.
 * Pode ser um `input` (text, number, password, email etc.), `select` ou `textarea`.
 *
 * @slot label - Slot para o elemento label do campo. Há opção de adicionar apenas o texto por meio da propriedade `label`.
 * Use esse recurso case seja necessário alguma personalização no HTML referente ao label.
 *
 * @cssClass alc-field__label - Aplicada ao elemento `label`.
 * @cssClass alc-field__core - Aplicada ao elemento que agrupa o controle de formulário, mensagem de erro e texto de ajuda.
*/

@Component({
  tag: 'alc-field',
  styleUrl: 'alc-field.css',
  scoped: false,
})
export class AlcField {

  describedBy = new Map();
  errorId = '';
  hintId = '';

  @Element() el: HTMLAlcFieldElement;

  @State() input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  @State() inputId: string;
  @State() slottedElement: HTMLElement;

  /**
   * Texto do label do input.
  */
  @Prop({ reflect: true }) label?: string;

  /**
   * Texto de ajuda.
  */
  @Prop({ reflect: true }) hint: string = '';

  /**
   * Indica se o input é obrigatório.
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
    logger.debug('watchErrorMsg', newValue, this.input);

    if (newValue) {
      if (this.slottedElement.tagName === 'ALC-INPUT-FILE') {
        const mode = this.slottedElement.getAttribute('mode');
        if (mode === 'dropzone') {
          const dropzoneElement = this.slottedElement.querySelector('.alc-input-file__dropzone');
          if (dropzoneElement) {
            dropzoneElement.classList.add('alc-field__input--error');
          }
        } else if (mode === 'input') {
          const textInputElement = this.slottedElement.querySelector('.alc-input-file__text-input');
          if (textInputElement) {
            textInputElement.classList.add('alc-field__input--error');
          }
        } else if (mode === 'button') {
          const buttonElement = this.slottedElement.querySelector('button.alc-button');
          if (buttonElement) {
            buttonElement.classList.add('alc-field__input--error');
          }
        }
      } else {
        // É um elemento nativo
        this.input.classList.add('alc-field__input--error');
      }
    } else {
      if (this.slottedElement.tagName === 'ALC-INPUT-FILE') {
        const mode = this.slottedElement.getAttribute('mode');
        if (mode === 'dropzone') {
          const dropzoneElement = this.slottedElement.querySelector('.alc-input-file__dropzone');
          if (dropzoneElement) {
            dropzoneElement.classList.remove('alc-field__input--error');
          }
        } else if (mode === 'input') {
          const textInputElement = this.slottedElement.querySelector('.alc-input-file__text-input');
          if (textInputElement) {
            textInputElement.classList.remove('alc-field__input--error');
          }
        } else if (mode === 'button') {
          const buttonElement = this.slottedElement.querySelector('button.alc-button');
          if (buttonElement) {
            buttonElement.classList.remove('alc-field__input--error');
          }
        }
      } else {
        // É um elemento nativo
        this.input.classList.remove('alc-field__input--error');
      }
    }
  }
  
  // Função recursiva para encontrar o <input>
  private findInputElement(element: Element): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
    if (!element) return null;

    const tagName = element.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
      return element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    }

    for (let i = 0; i < element.children.length; i++) {
      const found = this.findInputElement(element.children[i]);
      if (found) {
        return found;
      }
    }

    return null;
  }

  async componentDidLoad() {
    // Reserva IDs para os elementos de erro e dica
    this.errorId = getUniqueId();
    this.hintId = getUniqueId();

    // Seleciona o elemento slotted
    this.slottedElement = this.el.querySelector('input, select, textarea, alc-input-file');

    if (this.slottedElement) {
      // Procura o elemento <input> dentro do componente slotted
      this.input = this.findInputElement(this.slottedElement);

      if (this.input) {
        this.input.id = this.input.id || getUniqueId();
        this.input.setAttribute('aria-required', this.required ? 'true' : 'false');
        this.input.classList.add('alc-field__input');
        this.inputId = this.input.getAttribute('id');
        this.watchErrorMsg(this.errorMsg);
        this.describedBy.set('original', this.input.getAttribute('aria-describedby') || '');
      }
    }

    // Configura o label se não estiver usando o slot "label"
    if (!this.label) {
      const labelEl = this.el.querySelector('[slot="label"] label');
      labelEl?.classList.add('alc-field__label');
      if (labelEl && this.required) {
        const small = document.createElement('small');
        small.setAttribute('aria-hidden', 'true');
        small.innerText = ' (obrigatório)';
        labelEl.appendChild(small);
      }
    }

    // Atualiza os atributos de acessibilidade
    this.updateAriaDescribedBy();
  }
  componentWillRender() {
    this.updateAriaDescribedBy();
  }


  private updateAriaDescribedBy() {
    if (this.errorMsg) {
      this.describedBy.set('error', this.errorId);
    } else {
      this.describedBy.delete('error');
    }

    if (this.hint) {
      this.describedBy.set('hint', this.hintId);
    } else {
      this.describedBy.delete('hint');
    }

    let currentDescribedBy = '';

    currentDescribedBy += ` ${this.describedBy.get('original') || ''}`;
    currentDescribedBy += ` ${this.describedBy.get('error') || ''}`;
    currentDescribedBy += ` ${this.describedBy.get('hint') || ''}`;

    if (this.input) this.input.setAttribute('aria-describedby', currentDescribedBy.trim());
  }

  render() {

    return (
      <Host
        class={{
          'alc-field': true,
        }}
      >
        {
          this.label
            ?
            <div> {/* Essa div faz o label desvincular-se da estrutura do flex, permitindo que seja mostrado inline, que é o natural */}
              <label
                class="alc-field__label"
                htmlFor={this.inputId}
              >
                {this.label}
                {this.required
                ?
                  // aria-hidden porque o "required" do input já é suficiente para informar.
                  <small aria-hidden="true"> (obrigatório)</small>
                :
                  null
                }
              </label>
            </div>
            :
            <slot name="label"></slot>
        }
        <div class="alc-field__core">
          <slot></slot>
          { this.errorMsg
            ?
              <small
                class="alc-field__text alc-field__text--error"
                id={this.errorId}
              >
                {this.errorMsg}
              </small>
            :
              null
          }
          { this.hint
            ?
              <small
                class="alc-field__text"
                id={this.hintId}
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
