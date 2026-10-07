import { Component, h, Prop, State, Event, EventEmitter, Host, Element, Method } from '@stencil/core';
import logger from '../utils/logger';
import { getUniqueId } from '../utils/getUniqueId';
import test from '../utils/testAttributes';

export interface AlcFileWithContent {
  file: File;
  content: ArrayBuffer;
}

export interface AlcFileSelectedEvent {
  files: AlcFileWithContent[];
}

@Component({
  tag: 'alc-input-file',
  styleUrl: 'alc-input-file.css',
  shadow: false,
})
export class AlcInputFile {
  private idInputFilePolite: string = null;
  private textInputElement: HTMLInputElement;
  private resizeObserver: ResizeObserver;
  private idLabel: string = null;
  private idDropzoneText: string = null;

  /**
   * Altera o funcionamento para aceitar vários arquivos.
   */
  @Prop({ reflect: true })
  multiple: boolean = false;

  /**
   * Obrigatório. ID do input.
   */
  @Prop({ reflect: true })
  idInput!: string;

  /**
   * Define tipos de arquivos específicos para envio. Padrão: Todos.
   * @default '*\/*'
   */
  @Prop({ reflect: true })
  accept?: string = '*/*';

  /**
   * Desativa o componente.
   */
  @Prop({ reflect: true })
  disabled: boolean = false;

  /**
   * Indica se é obrigatório.
   */
  @Prop({ reflect: true })
  required: boolean = false;

  /**
   * Define o tipo de botão que vai ser renderizado.
   */
  @Prop({ reflect: true })
  buttonType?: 'secondary' | undefined = undefined;

  /**
   * Ícone a ser exibido no início do input.
   */
  @Prop({ reflect: true })
  iconName?: string;

  /**
   * Modo de visualização do componente.
   * Pode ser 'button', 'input' ou 'dropzone'.
   */
  @Prop({ reflect: true })
  mode: 'button' | 'input' | 'dropzone' = 'button';


  /**
   * Evento disparado quando um ou mais arquivos são selecionados ou são removidos da seleção.
   */
  @Event({ eventName: 'alc-file-selected' })
  alcFileSelected: EventEmitter<AlcFileSelectedEvent>;

  @Element() el!: HTMLElement;

  @State()
  files: File[] = [];

  @State()
  maxInputTextLength: number = 50; // Valor inicial arbitrário

  /**
   * Retorna array de arquivos selecionados com seus blobs.
   * @returns Lista de arquivos com conteúdo.
   */
  @Method()
  async getFiles(): Promise<AlcFileWithContent[]> {
    const inputFileElement = this.el.querySelector('#' + this.idInput) as HTMLInputElement;
    const files = Array.from(inputFileElement.files || []);

    const filesWithContent = await Promise.all(files.map(async (file) => {
      const content = await file.arrayBuffer();
      return { file, content };
    }));

    return filesWithContent;
  }

  /**
   * Limpa os dados do input e a lista de arquivos.
   */
  @Method()
  async clear(): Promise<void> {
    this.files = [];
    const inputFileElement = this.el.querySelector('#' + this.idInput) as HTMLInputElement;
    inputFileElement.value = '';
  }

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.files = files;

    // Ler o conteúdo dos arquivos e emitir o evento
    this.readFilesAndEmitEvent(files);
  }

  private async readFilesAndEmitEvent(files: File[]) {
    const filesWithContent = await Promise.all(files.map(async (file) => {
      const content = await file.arrayBuffer();
      return { file, content };
    }));

    this.alcFileSelected.emit({ files: filesWithContent });
  }

  private formatFileSize(sizeInBytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size = size / 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  private renderFiles = () => {
    return this.files.map(file => (
      <div class="alc-input-file__file" {...test('data-test-file')}>
        <span>
          {file.name} ({this.formatFileSize(file.size)})
        </span>
        <button
          class="alc-button alc-button-rounded"
          onClick={() => this.handleRemove(file)}
          aria-label={`Remover arquivo ${file.name}`}
          {...test('data-test-delete-file-button')}
        >
          <alc-icon name="x" label="Apagar"></alc-icon>
        </button>
      </div>
    ));
  };

  private renderFileInfo = () => {
    const totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
    const totalSizeFormatted = this.formatFileSize(totalSize);
    const fileCount = this.files.length;
    const fileText = fileCount === 1 ? 'arquivo' : 'arquivos';

    return (
      <span {...test('data-test-file-info')}>
        {`${fileCount} ${fileText} (${totalSizeFormatted} no total)`}
      </span>
    );
  };

  private renderPolite = () => {
    let politeText = 'Nenhum arquivo selecionado.';

    if (this.files.length === 1) {
      politeText = 'Arquivo selecionado: ' + this.files[0].name;
    }

    if (this.files.length > 1) {
      const fileNames = this.files.map(file => file.name).join('; ');
      politeText = this.files.length + ' arquivos selecionados: ' + fileNames;
    }

    return (
      <span aria-live="polite" class="sr-only" id={this.idInputFilePolite} role="status">
        {politeText}
      </span>
    );
  };

  private invokeFileInput = () => {
    const inputClick = this.el.querySelector('#' + this.idInput) as HTMLElement;
    inputClick.click();
  };

  private handleRemove = (file: File) => {
    this.files = this.files.filter(currentFile => currentFile !== file);
    // Atualiza os arquivos do input
    const dataTransfer = new DataTransfer();
    this.files.forEach(f => dataTransfer.items.add(f));
    const inputFileElement = this.el.querySelector('#' + this.idInput) as HTMLInputElement;
    inputFileElement.files = dataTransfer.files;

    // Ler o conteúdo dos arquivos restantes e emitir o evento
    this.readFilesAndEmitEvent(this.files);
  };

  private handleRemoveAll = () => {
    this.files = [];
    const inputFileElement = this.el.querySelector('#' + this.idInput) as HTMLInputElement;
    inputFileElement.value = '';
    this.alcFileSelected.emit({ files: [] });
  };

  private handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const filesArray = Array.from(droppedFiles);
      if (this.multiple) {
        this.files = [...this.files, ...filesArray];
      } else {
        this.files = [filesArray[0]];
      }

      // Atualiza os arquivos do input
      const dataTransfer = new DataTransfer();
      this.files.forEach(f => dataTransfer.items.add(f));
      const inputFileElement = this.el.querySelector('#' + this.idInput) as HTMLInputElement;
      inputFileElement.files = dataTransfer.files;

      // Ler o conteúdo dos arquivos e emitir o evento
      this.readFilesAndEmitEvent(this.files);
    }
  };

  private handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  private handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;
    const dropzone = e.currentTarget as HTMLElement;
    dropzone.classList.add('alc-input-file__dropzone--dragover');
  };

  private handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;
    const dropzone = e.currentTarget as HTMLElement;
    dropzone.classList.remove('alc-input-file__dropzone--dragover');
  };

  componentWillLoad() {
    // Antes do componente carregar, cria um id para o controle de aria-live
    this.idInputFilePolite = getUniqueId();
    this.idLabel = getUniqueId();
    this.idDropzoneText = getUniqueId();
  }

  componentDidLoad() {
    if (this.mode === 'input') {
      this.textInputElement = this.el.querySelector('.alc-input-file__text-input') as HTMLInputElement;
      this.updateMaxInputTextLength();
      this.initializeResizeObserver();
  
      // Observa mudanças no número de arquivos para atualizar o tamanho disponível
      new MutationObserver(() => {
        this.updateMaxInputTextLength();
      }).observe(this.el, { childList: true, subtree: true });
    }
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initializeResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateMaxInputTextLength();
    });
    this.resizeObserver.observe(this.textInputElement);
  }

  private updateMaxInputTextLength() {
    if (!this.textInputElement) return;
  
    // Obtém a largura total do input
    const inputWidth = this.textInputElement.offsetWidth;
  
    // Largura do botão de remover (close button)
    const closeButtonWidth = this.files.length > 0 ? 28 : 0; // 28px se o botão estiver presente, 0 se não
  
    // Padding esquerdo
    let paddingLeft = 12; // Padding padrão quando não há ícone (em pixels)
    if (this.iconName) {
      paddingLeft = 40; // Padding maior quando há ícone (corresponde a pl-10)
    }
  
    // Padding direito (para o botão de remover ou padding padrão)
    const paddingRight = closeButtonWidth > 0 ? 40 : 12; // 40px se o botão estiver presente, 12px se não
  
    // Espaçamento total (padding esquerdo + padding direito)
    const totalPadding = paddingLeft + paddingRight;
  
    // Calcula a largura disponível
    const availableWidth = inputWidth - totalPadding;
  
    // Estima o número de caracteres que cabem no espaço disponível
    const characterWidth = 7.8; // Largura média de um caractere em pixels
    const maxChars = Math.floor(availableWidth / characterWidth);
  
    // Atualizar o estado
    this.maxInputTextLength = maxChars > 0 ? maxChars : 10; // Define um mínimo de 10 caracteres
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  render() {
    this.idInput ?? logger.report('id-input', this.el.tagName.toLowerCase(), this.el);

    const inputAttributes = {
      type: 'file',
      id: this.idInput,
      class: 'alc-input-file__input',
      multiple: this.multiple,
      accept: this.accept,
      disabled: this.disabled,
      onChange: (e: Event) => this.handleFileChange(e),
      required: this.required // A obrigatoriedade fica no file input real
    };

    const fileInput = <input {...inputAttributes} {...test('data-test-file-input')}/>;

    // Obtém os nomes dos arquivos
    const fileNames = this.files.map(file => file.name);

    // Junta os nomes dos arquivos e trunca o texto se necessário
    const inputTextValue = this.truncateText(fileNames.join(', '), this.maxInputTextLength);

    // Define o atributo title para mostrar os nomes completos ao passar o mouse
    const inputTitle = fileNames.join(', ');

    return (
      <Host>
        <slot />
        {this.renderPolite()}

        {this.mode === 'button' && (
          <div class="alc-input-file__field">
            <button
              class={`alc-button ${this.buttonType === 'secondary' ? 'alc-button--secondary' : ''}`}
              onClick={this.invokeFileInput}
              disabled={this.disabled}
              {...test('data-test-button')}
            >
              <span class="alc-input-file__text-button">
                {this.iconName && <alc-icon name={this.iconName} label=""></alc-icon>}  
                {this.multiple ? 'Escolher arquivos' : 'Escolher arquivo'}
              </span>
            </button>

            <div class="alc-input-file__content" aria-controls={this.idInputFilePolite} {...test('data-test-file-content')}>
              {this.files.length > 0 ? (
                this.renderFiles()
              ) : (
                <small class="alc-input-file__text">Nenhum arquivo selecionado</small>
              )}
            </div>

            
          </div>
        )}

        {this.mode === 'input' && (
          <div class="alc-input-file__field">
            <div class="alc-input-file__input-container">
              <div class={`alc-input-file__input-wrapper ${this.iconName ? 'alc-input-file__input-wrapper--with-icon' : ''}`}>
                {this.iconName && (
                  <alc-icon class="alc-input-file__icon" name={this.iconName} label=""></alc-icon>
                )}
                <input
                  type="text"
                  class="alc-input-file__text-input"
                  readOnly
                  value={inputTextValue}
                  aria-labelledby={this.idLabel}
                  placeholder="Selecione um arquivo"
                  onClick={this.invokeFileInput}
                  onKeyDown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      this.invokeFileInput();
                    }
                  }}
                  aria-description={inputTitle}
                  {...test('data-test-input')}
                />
                {this.files.length > 0 && (
                  <button
                    class="alc-input-file__remove-button"
                    onClick={this.handleRemoveAll}
                    aria-label="Remover arquivos selecionados"
                    {...test('data-test-delete-file-button')}
                  >
                    <alc-icon name="x" label="Apagar"></alc-icon>
                  </button>
                )}
              </div>
            </div>

            <div class="alc-input-file__info">
              {this.files.length > 0 ? this.renderFileInfo() : ''}
            </div>
          </div>
        )}

        {this.mode === 'dropzone' && (
          <div class="alc-input-file__field">
            <div
              class={`alc-input-file__dropzone ${this.disabled ? 'alc-input-file__dropzone--disabled' : ''}`}
              onDrop={this.handleDrop}
              onDragOver={this.handleDragOver}
              onDragEnter={this.handleDragEnter}
              onDragLeave={this.handleDragLeave}
              role="button"
              tabIndex={0}
              aria-labelledby={this.idLabel}
              aria-describedby={this.idDropzoneText}
              onClick={this.invokeFileInput}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.invokeFileInput();
                }
              }}
              {...test('data-test-dropzone')}
            >
              {this.iconName && <alc-icon name={this.iconName} label=""></alc-icon>}
              <span class="alc-input-file__dropzone-text" id={this.idDropzoneText}>
                Arraste e solte arquivos aqui ou clique para selecionar
              </span>
            </div>

            <div class="alc-input-file__content" aria-controls={this.idInputFilePolite}>
              {this.files.length > 0 ? (
                this.renderFiles()
              ) : (
                ''
              )}
            </div>
          </div>
        )}
        {fileInput}
      </Host>
    );
  }
}