import { Component, Element, Host, Listen, Method, Prop, State, h, Watch, Event, EventEmitter } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-autocomplete',
  styleUrl: 'alc-autocomplete.css',
  shadow: false,
})
export class AlcAutocomplete {
  @Element() el: HTMLElement;

  /** Itens que serão listado no componente */
  @Prop({ reflect: true }) items: Array<{ [key: string]: string }> = [];

  /** Indica os atributos dos dados que serão exibidos na lista */
  @Prop({ reflect: true }) displayKeys: string = '';

  /** Label do input */
  @Prop({ reflect: true }) label?: string = '';

  /** Mensagem de ajuda */
  @Prop({ reflect: true }) hint: string = '';

  /** Indica se o input é obrigatório */
  @Prop({ reflect: true }) required: boolean = false;

  /** Texto dentro do input */
  @Prop({ reflect: true }) placeholder?: string;

  /** Indica o tipo de visualização da lista */
  @Prop({ reflect: true }) listDirection: 'horizontal' | 'vertical' = 'vertical';

  /** Desabilita input */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Indica se os dados estão sendo carregados */
  @Prop({ reflect: true }) loading: boolean = false;

  /** Indica se houve um erro ao carregar os dados */
  @Prop({ reflect: true, mutable: true }) error: boolean = false;

  /**
    Mensagem de erro do input
   */
  @Prop({ reflect: true}) errorMsg: string = null;

  @State() filteredData: any[] = []; // Armazena os dados filtrados
  @State() itemSelected: boolean = false; // Indica se um item foi selecionado
  @State() selectedItemValue: HTMLElement | null = null; // Armazena o valor selecionado
  @State() emptyResult: boolean = false; // Indica se não foi encontrado nenhum resultado
  @State() active: boolean = false; // Indica se o popup está ativo
  @State() shown: boolean = false; // Indica se os resultados estão visíveis

  input: HTMLInputElement;
  grid: HTMLElement;
  activeRowIndex: number = -1;
  activeColIndex: number = 0;
  rowsCount: number = 0;
  colsCount: number = 0;
  gridFocused: boolean = false;
  selectionCol: number = 0;
  inputId: string;
  gridId: string;
  labelId: string;
  messageRowContainerId: string;
  loaded = false;

  /**
 * Evento emitido sempre que o item selecionado for alterado.
 * O valor emitido será o mesmo que pode ser obtido pelo método `getSelected()`.
 */
  @Event({
    eventName: 'alc-change',
  })
  alcChange: EventEmitter<any>;

  @Watch('selectedItemValue')
  selectedItemValueChanged(newValue: any) {
    // Sempre que o valor selecionado for alterado (via seleção na lista ou via setSelected),
    // emitimos o evento alc-change com o novo valor.
    this.alcChange.emit(newValue);
  }

  @Watch('loading')
  handleLoadingChange(newVal: boolean, oldVal: boolean) {
    if (oldVal === true && newVal === false && !this.disabled && this.input) {
      if (this.input === document.activeElement) {
        // Quando o carregamento terminar, atualiza os resultados com base no que já foi digitado.
        this.updateResults();
      }
    }
  }

  @Watch('shown')
  @Watch('loading')
  @Watch('error')
  @Watch('emptyResult')
  handleActiveChange() {
    if(document.activeElement === this.input) {
      this.active = this.shown || this.loading || this.error || (!this.error && this.emptyResult);
    } else {
      this.active = false;
    }
  }

  componentWillLoad() {
    this.inputId = getUniqueId();
    this.gridId = getUniqueId();
    this.labelId = getUniqueId();
    this.messageRowContainerId = getUniqueId();
  }

  componentDidLoad() {
    /* Não permite remover o atributo disabled pelo modo desenvolvedor no browser */
    const observer = new MutationObserver(() => {
      if (!this.input.hasAttribute('disabled')) {
        if (this.disabled) {
          this.input.setAttribute('disabled', 'true');
        }
      }
    });

    observer.observe(this.input, { attributes: true, attributeFilter: ['disabled'] });

    if (this.disabled) {
      this.input.setAttribute('disabled', 'true');
    }

    this.loaded = true;
  }

  // Listen para fechar a lista de itens quando clicar fora do elemento
  @Listen('click', { target: 'body' })
  handleBodyClick(evt: MouseEvent) {
    // Se não tiver sido carregado, interrompe a execução.
    // É importante porque o 'click' no body pode acontecer antes da execução do código do componente.
    // Se os resultados não estiverem visíveis, interrompe a execução (não há o que ocultar).
    if (!this.loaded || !this.shown) return;

    const target = evt.target;

    // Não fecha se clicar no input ou na lista de resultados
    const clickedOnInput = target === this.input;
    const clickedOnResults = (target instanceof Node) ? this.grid?.contains(target) : false;

    if (clickedOnInput || clickedOnResults) return;

    this.hideResults();
  }

  @Listen('keyup')
  handleInputKeyUp(evt: KeyboardEvent) {
    const target = evt.target;
    if (!(target instanceof Node) || !this.input.contains(target)) {
      return;
    }

    const key = evt.key;

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Escape':
      case 'Enter':
        evt.preventDefault();
        return;
      case 'ArrowLeft':
      case 'ArrowRight':
        if (this.gridFocused) {
          evt.preventDefault();
          return;
        }
        break;
      default:
        this.updateResults(); // Atualiza os resultados de busca
    }
  }

  @Listen('keydown')
  handleInputKeyDown(evt: KeyboardEvent) {
    const key = evt.key; // Recomenda-se usar evt.key ao invés de keyCode
    let activeRowIndex = this.activeRowIndex;
    let activeColIndex = this.activeColIndex;

    const target = evt.target;

    // Verifique se evt.target é um Node
    if (!(target instanceof Node) || !this.input.contains(target)) {
      return;
    }

    if (key === 'Escape') { // ESC
      evt.preventDefault();
      if (this.gridFocused) {
        this.gridFocused = false;
        this.removeFocusCell(this.activeRowIndex, this.activeColIndex);
        this.activeRowIndex = -1;
        this.activeColIndex = 0;
        this.input.setAttribute('aria-activedescendant', '');
      } else {
        if (!this.shown) {
          setTimeout(() => {
            this.input.value = '';
          }, 1);
        }
      }
      if (this.shown) {
        this.hideResults();
      }
      // Remover botão de fechar quando clicar na tecla Esc
      this.itemSelected = false;
      this.emptyResult = false;
      this.error = false;
      return;
    }

    if (this.rowsCount < 1) {
      return;
    }

    const prevActive = this.getItemAt(activeRowIndex, this.selectionCol);
    let activeItem: HTMLElement | null;

    switch (key) {
      case 'ArrowUp':
        this.gridFocused = true;
        activeRowIndex = this.getRowIndex('ArrowUp');
        evt.preventDefault();
        break;
      case 'ArrowDown':
        this.gridFocused = true;
        activeRowIndex = this.getRowIndex('ArrowDown');
        evt.preventDefault();
        break;
      case 'ArrowLeft':
        if (activeColIndex <= 0) {
          activeColIndex = this.colsCount - 1;
          activeRowIndex = this.getRowIndex('ArrowLeft');
        } else {
          activeColIndex--;
        }
        if (this.gridFocused) {
          evt.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (activeColIndex === -1 || activeColIndex >= this.colsCount - 1) {
          activeColIndex = 0;
          activeRowIndex = this.getRowIndex('ArrowRight');
        } else {
          activeColIndex++;
        }
        if (this.gridFocused) {
          evt.preventDefault();
        }
        break;
      case 'Enter': // ENTER
        evt.preventDefault(); // Prevenir submissão do formulário
        if (this.gridFocused) {
          activeItem = this.getItemAt(activeRowIndex, this.selectionCol);
          this.selectItem(activeItem, evt);
          this.gridFocused = false;
        } else {
          // Opcional: ações adicionais quando Enter é pressionado fora da lista
          this.hideResults();
        }
        return;
      case 'Tab': // TAB
        this.hideResults();
        return;
      default:
        return;
    }

    if (prevActive) {
      this.removeFocusCell(this.activeRowIndex, this.activeColIndex);
    }

    activeItem = this.getItemAt(activeRowIndex, activeColIndex);
    this.activeRowIndex = activeRowIndex;
    this.activeColIndex = activeColIndex;

    if (activeItem) {
      this.input.setAttribute(
        'aria-activedescendant',
        'result-item-' + activeRowIndex + 'x' + activeColIndex
      );
      this.focusCell(activeRowIndex, activeColIndex);
    } else {
      this.input.setAttribute('aria-activedescendant', '');
    }
  }

  @Listen('click')
  handleGridClick(evt: MouseEvent) {
    const targetElement = evt.target as HTMLElement;

    if (!targetElement || !this.grid.contains(targetElement)) {
      return;
    }

    let row: HTMLElement | null = targetElement.closest('li');

    if (!row) {
      return;
    }

    const selectItem = row.querySelector('.alc-autocomplete__result-cell') as HTMLElement;
    this.selectItem(selectItem, evt);
  }

  isElementInView(element: HTMLElement): boolean {
    const bounding = element.getBoundingClientRect();

    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  updateResults() {
    const searchString = this.input.value;
    this.emptyResult = false;

    // Se estiver carregando, não filtra, apenas mantém o que foi digitado.
    if (this.loading) {
      this.hideResults();
      return;
    }

    // Verifique se a string de pesquisa tem pelo menos 2 caracteres
    if (searchString.length < 2) {
      this.hideResults();
      this.emptyResult = false;
      return;
    }

    this.filteredData = this.searchDataService(searchString);

    this.hideResults();

    if (this.filteredData.length > 0) {
      const maxItems = 10;
      const resultsToShow = this.filteredData.slice(0, maxItems);

      if (resultsToShow.length) {
        for (let row = 0; row < resultsToShow.length; row++) {
          const resultRow = document.createElement('li');
          resultRow.className = `alc-autocomplete__result-row alc-autocomplete__result-row--${this.listDirection}`;
          resultRow.setAttribute('role', 'option');
          resultRow.setAttribute('id', 'result-row-' + row);
          resultRow.setAttribute('data-index', row.toString());

          this.displayKeys.split(',').forEach((atributo, col) => {
            const resultCell = document.createElement('span');
            resultCell.className = 'alc-autocomplete__result-cell';
            resultCell.setAttribute('role', 'presentation');
            resultCell.setAttribute('id', 'result-item-' + row + 'x' + col);
            resultCell.innerText = resultsToShow[row][atributo.trim()];
            resultRow.appendChild(resultCell);
          });

          this.grid.appendChild(resultRow);
        }
        this.grid.classList.remove('is-hidden');
        this.input.setAttribute('aria-expanded', 'true');
        this.rowsCount = resultsToShow.length;
        this.colsCount = this.displayKeys.split(',').length;
        this.shown = true;
      }

      if (this.filteredData.length > maxItems) {
        this.showMessageRow("Mais de 10 itens encontrados. Refine seus critérios de pesquisa.");
      }
    } else {
      this.emptyResult = true;
    }
  }

  getRowIndex(key: string): number {
    let activeRowIndex = this.activeRowIndex;

    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        if (activeRowIndex <= 0) {
          activeRowIndex = this.rowsCount - 1;
        } else {
          activeRowIndex--;
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        if (activeRowIndex === -1 || activeRowIndex >= this.rowsCount - 1) {
          activeRowIndex = 0;
        } else {
          activeRowIndex++;
        }
    }

    return activeRowIndex;
  }

  getItemAt(rowIndex: number, colIndex: number): HTMLElement | null {
    return document.getElementById('result-item-' + rowIndex + 'x' + colIndex) as HTMLElement | null;
  }

  selectItem(item: HTMLElement | null, event?: Event) {
    if (event) event.preventDefault();
    if (item) {
      const row = item.closest('li');
      const index = row?.getAttribute('data-index');
      if (index !== null && index !== undefined) {
        const selectedData = this.filteredData[parseInt(index, 10)];
        this.input.value = item.innerText;
        this.selectedItemValue = selectedData;
        this.hideResults();
        this.input.setAttribute('aria-expanded', 'false');
        this.itemSelected = true;

        this.emptyResult = false;
        this.input.focus();
      }
    }
  }

  handleInput() {
    this.itemSelected = this.input?.value.length > 0;
  }

  handleFocus() {
    // Quando o input ganhar foco novamente, se já existir algum valor digitado,
    // e o valor for maior ou igual a 2 caracteres, tentar exibir novamente os resultados.
    const searchString = this.input.value || '';
    if (searchString.length >= 2) {
      this.updateResults();
    }
  }

  // Esconde as mensagens de loading, error ou resultados não encontrados
  // quando o focus do input sai.
  handleFocusOut() {
    if(this.loading || this.error || this.emptyResult) {
      this.active = false;
    }
  }

  clearSelection(event: Event) {
    event.preventDefault(); // Prevenir comportamento padrão de submit
    this.clearSelected();
    this.input.focus();
  }

  hideResults() {
    if (!this.shown) {
      return;
    }
  
    this.gridFocused = false;
    this.shown = false;
    this.activeRowIndex = -1;
    this.activeColIndex = 0;
    this.grid.innerHTML = '';
    this.grid.classList.add('is-hidden');
    this.input.setAttribute('aria-expanded', 'false');
    this.rowsCount = 0;
    this.colsCount = 0;
    this.input.setAttribute('aria-activedescendant', '');
  
    const messageRowContainer = this.el.querySelector(`#${this.messageRowContainerId}`);
    if (messageRowContainer) {
      messageRowContainer.innerHTML = '';
    }
  
    if (!this.isElementInView(this.input)) {
      this.input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  removeFocusCell(rowIndex: number, colIndex: number) {
    const row = document.getElementById('result-row-' + rowIndex);
    if(row) {
      row.classList.remove('is-focused');
      row.ariaSelected = "false";
    }
    const cell = this.getItemAt(rowIndex, colIndex);
    if (cell) cell.classList.remove('is-focused');
  }

  focusCell(rowIndex: number, colIndex: number) {
    const row = document.getElementById('result-row-' + rowIndex);

    if (row) {
      row.classList.add('is-focused');
      row.ariaSelected = "true";
    }

    const cell = this.getItemAt(rowIndex, colIndex);
    if (cell) {
      cell.classList.add('is-focused');

      if (this.listDirection === 'vertical') {
        this.ensureCellInView(cell);
      } else {
        if (!this.isElementInView(cell)) {
          cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }

  /* Mantém o elemento focável dentro do scroll */
  ensureCellInView(element: HTMLElement) {
    const gridContainer = this.grid;
    const elementTop = element.offsetTop;

    gridContainer.scrollTop = elementTop;
  }

  /* Mostra pesquisa com e sem acentos */
  searchDataService(searchString: string): any[] {
    const normalizeString = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const normalizedSearchString = normalizeString(searchString);

    const results = [];

    for (const item of this.items) {
      for (const atributo of this.displayKeys.split(',')) {
        const normalizedItem = normalizeString(item[atributo.trim()] || '');
        if (normalizedItem.includes(normalizedSearchString)) {
          results.push(item);
          break;
        }
      }
    }

    return results;
  }

  showMessageRow(message: string) {
    const messageRowContainer = this.el.querySelector(`#${this.messageRowContainerId} `) as HTMLElement;
    const existingMessageRow = messageRowContainer.querySelector('.alc-autocomplete__message-row');

    if (!existingMessageRow) {
      const messageRow = document.createElement('div');
      messageRow.className = `alc-autocomplete__message-row`;
      messageRow.innerText = message;
      if (messageRowContainer) {
        messageRowContainer.appendChild(messageRow);
      }
    }
  }

  /** Retorna o valor selecionado */
  @Method()
  async getSelected(): Promise<any> {
    return this.selectedItemValue || null;
  }

  /** Define o valor selecionado */
  @Method()
  async setSelected(item: any): Promise<void> {
    if (item) {
      this.selectedItemValue = item;
      const firstKey = this.displayKeys.split(',')[0].trim();
      const displayText = item[firstKey];

      this.input.value = displayText;
      this.itemSelected = true;
      this.emptyResult = false;
    }
  }

  /** Limpa o valor selecionado */
  @Method()
  async clearSelected(): Promise<void> {
    this.input.value = '';
    this.selectedItemValue = null;
    this.itemSelected = false;
    this.hideResults();
    this.emptyResult = false;
    this.error = false;
  }

  render() {
    const listClass = this.listDirection === 'vertical'
      ? 'alc-autocomplete__grid alc-autocomplete__grid--vertical is-hidden alc-field__text'
      : 'alc-autocomplete__grid is-hidden alc-field__text';

    return (
      <Host>
        <alc-field
          id={this.labelId}
          label={this.label}
          hint={this.hint}
          required={this.required}
          class="alc-autocomplete__field"
        >

          <alc-popup shift flip strategy="fixed" active={this.active} distance={2} placement="bottom-start" sync='width' {...test('data-test-autocomplete-popup')}>
            <div slot="anchor">
              <alc-icon name="search" label="Pesquisar" class="alc-autocomplete__icon"></alc-icon>
              <input
                ref={el => this.input = el}
                placeholder={this.placeholder}
                class="alc-autocomplete__input"
                type="text"
                role="combobox"
                aria-haspopup="grid"
                aria-expanded="false"
                aria-autocomplete="list"
                aria-controls={this.gridId}
                id={this.inputId}
                disabled={this.disabled}
                onInput={() => this.handleInput()}
                onFocus={() => this.handleFocus()}
                onFocusout={() => this.handleFocusOut()}
                {...test('data-test-autocomplete-input')}
              />

              {this.itemSelected && this.input?.value && (
                <button
                  type="button" // Adicionado para evitar submissão do formulário
                  class="alc-button alc-button-rounded alc-autocomplete__clear-button"
                  onClick={(event) => this.clearSelection(event)}
                  {...test('data-test-autocomplete-clear-button')}
                  >
                  <alc-icon name="x-lg" label="Limpar"></alc-icon>
                </button>
              )}
            </div>

            <div class="alc-autocomplete__container-results">
              {this.loading ? (
                <div class="alc-autocomplete__loading-indicator">
                  <alc-icon name="arrow-clockwise" label="Carregando" class="alc-autocomplete__loading-icon"></alc-icon> Carregando...
                </div>
              ) : null
              }
              {this.error ? (
                <div class="alc-autocomplete__has-an-error-indicator">
                  <alc-icon name="exclamation-triangle" label="Erro" class="mr-1"></alc-icon> Serviço indisponível. Volte mais tarde!
                </div>
              ) : null
              }
              {!this.error && this.emptyResult ? (
                <div class="alc-autocomplete__has-an-error-indicator">
                  <alc-icon name="exclamation-triangle" label="Erro" class="mr-1"></alc-icon> Nenhum resultado encontrado. Refine seus critérios de pesquisa.
                </div>
              ) : null
              }

              <div class="alc-autocomplete__results" {...test('data-test-autocomplete-results')}>
                <ul
                  aria-labelledby={this.labelId}
                  role="listbox"
                  id={this.gridId}
                  class={listClass}
                  ref={el => this.grid = el}
                ></ul>
                <div id={this.messageRowContainerId} class="alc-autocomplete__message-row-container"></div>
              </div>
            </div>

          </alc-popup>

        </alc-field>
      </Host>
    );
  }
}
