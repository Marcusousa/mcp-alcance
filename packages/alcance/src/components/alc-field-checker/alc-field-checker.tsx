import { Component, h, State, Element, Prop } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId'
@Component({
  tag: 'alc-field-checker',
  styleUrl: 'alc-field-checker.css',
  shadow: false,
})
export class AlcFieldChecker {
  private idAlert = null;
  @Element() hostElement: HTMLElement;
  @State() errorFields: { id: string; label: string; errorMsg: string }[] = [];
   /**
   * Verifica o formulário quando houver submissão.
  */
  @Prop({ reflect: true }) checkOnSubmit = false;
  observer: MutationObserver;

  componentWillLoad() {
    this.idAlert = getUniqueId();
  }
  componentDidLoad() {
    // Se true, o componente só irá verificar os campos caso haja uma submissão de formulário
    if (!this.checkOnSubmit) {
      this.checkAlcFields();
      this.observer = new MutationObserver(() => this.checkAlcFields());
      const alcFields = this.hostElement.querySelectorAll('alc-field, alc-fieldset, alc-checkbox, alc-radio');
      // Observa apenas os componentes alc-field que estão dentro do alc-field-checker, permitindo o uso de mais de um formulário por página
      alcFields.forEach((field) => this.observer.observe(field, { attributes: true, childList: true, subtree: true }));
    } else {
      const formElement = this.hostElement.querySelector('form');
      if (formElement) {
        formElement.addEventListener('submit', this.handleFormSubmit);
      }
    }
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  getFieldId(field: Element): string {
    // Obtém o ID do element filho (input, select e etc que estão dentro do alc-field) para criar a âncora quando houver erro
    const inputElement = field.querySelector('input, textarea, select');
    return inputElement ? inputElement.getAttribute('id') : '';
  }

  isChildOfFieldset(element: Element): boolean {
    // Verifica se o alc-checkbox e alc-radio são filhos de um alc-fieldset
    return element.closest('alc-fieldset') !== null;
  }

  getLabelText(field: Element): string {
    // Obtém o texto dos componentes alc-checkbox e alc-radio, já que não possuem a propriedade label
    const labelElement = field.querySelector('label');
    return labelElement ? labelElement.textContent.trim() : '';
  }

  checkAlcFields() {
    const alcFields = Array.from(this.hostElement.querySelectorAll('alc-field, alc-fieldset, alc-checkbox, alc-radio'))
    .filter((field) => {
      // Se os componentes alc-checkbox e alc-radio forem filhos de um alc-fieldset, o atributo error-msg deles serão ignorados
      if (field.tagName.toLowerCase() === 'alc-checkbox' || field.tagName.toLowerCase() === 'alc-radio') {
        return !this.isChildOfFieldset(field);
      }
      return true;
    });
    this.errorFields = alcFields
      // Apenas os alc-field que possuem a propriedade erro-msg com alguma mensagem, são enviados para o mapa de erros
      .filter((field) => field.hasAttribute('error-msg') && field.getAttribute('error-msg') !== '')
      .map((field) => {
        const isCheckboxOrRadioButton = field.tagName.toLowerCase() === 'alc-checkbox' || field.tagName.toLowerCase() === 'alc-radio';
        const isFieldset = field.tagName.toLowerCase() === 'alc-fieldset';
        return {
          id: this.getFieldId(field),
          label: isCheckboxOrRadioButton ? this.getLabelText(field) : isFieldset ? field.getAttribute('legend') : field.getAttribute('label'),
          errorMsg: field.getAttribute('error-msg'),
        };
      });
  }

  handleFormSubmit = (e: Event) => {
    this.checkAlcFields();
    if (this.errorFields.length > 0) {
      e.preventDefault();
    }
  };

  render() {
    return (
      <div class="alc-field-checker">
        {this.errorFields.length > 0 && (
          <alc-alert id={this.idAlert} type="warning" dismissible={false}>
            <span class='alc-alert__summary'>Atenção: Seu formulário contém {this.errorFields.length} {this.errorFields.length > 1 ? "erros" : "erro"}</span>
            <ul>
              {this.errorFields.map((field) => (
                <li>
                  <a href={`#${field.id}`} class="alc-link alc-link--color-text">
                    <strong>{field.label}:</strong> {field.errorMsg}
                  </a>
                </li>
              ))}
            </ul>
          </alc-alert>
        )}
        <slot></slot>
      </div>
    );
  }
}
