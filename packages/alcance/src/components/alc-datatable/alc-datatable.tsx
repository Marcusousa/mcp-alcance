import { Component, Element, Event, EventEmitter, Host, Listen, Method, Prop, State, Watch, forceUpdate, h } from '@stencil/core';
import { setCssClasses } from '../functional/table';
import DataTable, { portugues, type DataTableFactory } from './datatables-setup';
import { OriginalEvent, addOriginalEventsListeners } from './datatables-original-events';
import { Config, Api, SearchInput } from 'datatables.net';
import logger from '../utils/logger';
import test from '../utils/testAttributes';
import { getUniqueId } from '../utils/getUniqueId';
import { AlcMenuItemCustomEvent } from '../../components';

// Obtém o tipo associado ao manipulador de eventos original do DataTables,
// que é de onde vem o Config.
type DtEventHandler = Config['on'][''];

@Component({
  tag: 'alc-datatable',
  styleUrl: 'alc-datatable.css',
  scoped: false,
})
export class AlcDatatable {

  @Element() el!: HTMLAlcDatatableElement;

  //===========================================================================
  //#region EVENTOS DO DATATABLES.NET

  // ----- Eventos do Core -----

  // 	'childRow'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'childRow',
    cancelable: false,
    detail: ['e', 'show', 'row'],
  })
  @Event({
    eventName: 'alc-child-row',
    cancelable: false,
  })
  childRowEvent: EventEmitter;

  // 	'column-sizing'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'column-sizing',
    cancelable: false,
    detail: ['e', 'settings'],
  })
  @Event({
    eventName: 'alc-column-sizing',
    cancelable: false,
  })
  columnSizingEvent: EventEmitter;

  // 	'column-visibility'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'column-visibility',
    cancelable: false,
    detail: ['e', 'settings', 'column', 'state', 'recalc'],
  })
  @Event({
    eventName: 'alc-column-visibility',
    cancelable: false,
  })
  columnVisibilityEvent: EventEmitter;

  // 	'destroy'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'destroy',
    cancelable: false,
    detail: ['e', 'settings'],
  })
  @Event({
    eventName: 'alc-destroy',
    cancelable: false,
  })
  destroyEvent: EventEmitter;

  // 	'draw'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'draw',
    cancelable: false,
    detail: ['e', 'settings'],
  })
  @Event({
    eventName: 'alc-draw',
    cancelable: false,
  })
  drawEvent: EventEmitter;

  // 	'dt-error'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'dt-error',
    cancelable: false,
    detail: ['e', 'settings', 'techNote', 'message'],
  })
  @Event({
    eventName: 'alc-dt-error',
    cancelable: false,
  })
  dtErrorEvent: EventEmitter;

  // 	'info'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'info',
    cancelable: false,
    detail: ['e', 'settings', 'el', 'str'],
  })
  @Event({
    eventName: 'alc-info',
    cancelable: false,
  })
  infoEvent: EventEmitter;

  // 	'init'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'init',
    cancelable: false,
    detail: ['e', 'settings', 'json'],
  })
  @Event({
    eventName: 'alc-init',
    cancelable: false,
  })
  initEvent: EventEmitter;

  // 	'length'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'length',
    cancelable: false,
    detail: ['e', 'settings', 'len'],
  })
  @Event({
    eventName: 'alc-length',
    cancelable: false,
  })
  lengthEvent: EventEmitter;

  // 	'options'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'options',
    cancelable: false,
    detail: ['e', 'options'],
  })
  @Event({
    eventName: 'alc-options',
    cancelable: false,
  })
  optionsEvent: EventEmitter;

  // 	'order'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'order',
    cancelable: false,
    detail: ['e', 'settings', 'ordArr'],
  })
  @Event({
    eventName: 'alc-order',
    cancelable: false,
  })
  orderEvent: EventEmitter;

  // 	'page'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'page',
    cancelable: false,
    detail: ['e', 'settings'],
  })
  @Event({
    eventName: 'alc-page',
    cancelable: false,
  })
  pageEvent: EventEmitter;

  // 	'preDraw'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'preDraw',
    cancelable: true,
    detail: ['e', 'settings'],
  })
  @Event({
    eventName: 'alc-pre-draw',
    cancelable: true,
  })
  preDrawEvent: EventEmitter;

  // 	'preInit'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'preInit',
    cancelable: false,
    detail: ['e', 'settings'],
  })
  @Event({
    eventName: 'alc-pre-init',
    cancelable: false,
  })
  preInitEvent: EventEmitter;

  // 	'preXhr'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'preXhr',
    cancelable: false,
    detail: ['e', 'settings', 'data', 'xhr'],
  })
  @Event({
    eventName: 'alc-pre-xhr',
    cancelable: false,
  })
  preXhrEvent: EventEmitter;

  // 	'processing'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'processing',
    cancelable: false,
    detail: ['e', 'settings', 'processing'],
  })
  @Event({
    eventName: 'alc-processing',
    cancelable: false,
  })
  processingEvent: EventEmitter;

  // 	'requestChild'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'requestChild',
    cancelable: false,
    detail: ['e', 'row'],
  })
  @Event({
    eventName: 'alc-request-child',
    cancelable: false,
  })
  requestChildEvent: EventEmitter;

  // 	'search'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'search',
    cancelable: false,
    detail: ['e', 'settings'],
  })
  @Event({
    eventName: 'alc-search',
    cancelable: false,
  })
  searchEvent: EventEmitter;

  // 	'stateLoaded'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'stateLoaded',
    cancelable: false,
    detail: ['e', 'settings', 'data'],
  })
  @Event({
    eventName: 'alc-state-loaded',
    cancelable: false,
  })
  stateLoadedEvent: EventEmitter;

  // 	'stateLoadParams'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'stateLoadParams',
    cancelable: false,
    detail: ['e', 'settings', 'data'],
  })
  @Event({
    eventName: 'alc-state-load-params',
    cancelable: false,
  })
  stateLoadParamsEvent: EventEmitter;


  // 	'stateSaveParams'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'stateSaveParams',
    cancelable: false,
    detail: ['e', 'settings', 'data'],
  })
  @Event({
    eventName: 'alc-state-save-params',
    cancelable: false,
  })
  stateSaveParamsEvent: EventEmitter;

  // 	'xhr'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'xhr',
    cancelable: false,
    detail: ['e', 'settings', 'json', 'xhr'],
  })
  @Event({
    eventName: 'alc-xhr',
    cancelable: false,
  })
  xhrEvent: EventEmitter;

  // ----- Eventos da extensão Select -----

  // 	'deselect'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'deselect',
    cancelable: false,
    detail: ['e', 'dt', 'type', 'indexes'],
  })
  @Event({
    eventName: 'alc-deselect',
    cancelable: false,
  })
  deselectEvent: EventEmitter;

  // 	'select'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'select',
    cancelable: false,
    detail: ['e', 'dt', 'type', 'indexes'],
  })
  @Event({
    eventName: 'alc-select',
    cancelable: false,
  })
  selectEvent: EventEmitter;

  // 	'select-blur'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'select-blur',
    cancelable: true,
    detail: ['e', 'dt', 'target', 'originalEvent'],
  })
  @Event({
    eventName: 'alc-select-blur',
    cancelable: true,
  })
  selectBlurEvent: EventEmitter;

  // 	'selectItems'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'selectItems',
    cancelable: false,
    detail: ['e', 'dt', 'items'],
  })
  @Event({
    eventName: 'alc-select-items',
    cancelable: false,
  })
  selectItemsEvent: EventEmitter;

  // 	'selectStyle'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'selectStyle',
    cancelable: false,
    detail: ['e', 'dt', 'style'],
  })
  @Event({
    eventName: 'alc-select-style',
    cancelable: false,
  })
  selectStyleEvent: EventEmitter;

  // 	'user-select'
  /**
   * Ver documentação do DataTables.net
   */
  @OriginalEvent({
    name: 'user-select',
    cancelable: true,
    detail: ['e', 'dt', 'type', 'cell', 'originalEvent'],
  })
  @Event({
    eventName: 'alc-user-select',
    cancelable: true,
  })
  userSelectEvent: EventEmitter;

  //#endregion EVENTOS DO DATATABLES.NET
  //===========================================================================

  // Indica que o método start já foi chamado (mesmo que ainda não tenha terminado ainda).
  private started: boolean = false;
  // Armazena informação das colunas da tabela
  private columns: Array<{textContent: string, th: HTMLElement}> = [];
  // O elemento que envolve a tabela e permite o controle do scroll horizontal.
  private tableWrapper: HTMLDivElement;
  // Vai para true quando é criado o elemento "wrapper" da tabela.
  private tableWrapperConfigured = false;
  // Visibilidade do alerta de reposicionamento na primeira página
  private alertVisibility: boolean = false;
  // Instância da API do DataTables.net
  private datatablesNetApi!: Api;
  // Dados da tabela em formato estruturado
  private parsedData: any[] = [];
  // O elemento da paginação
  private paginationElement: HTMLAlcPaginationElement;
  // O elemento indicador de processamento
  private processingElement: HTMLAlcLoadingElement = null;
  // Indica se o indicador de processamento deve ser mostrado.
  private showProcessing: boolean;

  // Vai para true com o disparo do evento "init" do DataTables.net
  @State() initCompleted = false;
  // Texto do campo de busca (filtro)
  @State() searchText = '';
  // O tamanho da página (quantidade de itens mostrados)
  // É um estado porque alterar esse tamanho exige uma nova renderização.
  @State() pageLength: number;
  // O número da página atual
  // É um estado porque navegar entre as páginas exige uma nova renderização.
  @State() currentPage = 1;
  // Indica o estado inicial do processamento
  private initialProcessing: 'none' | 'processing' | 'done' = 'none';

  /**
   * Os dados da tabela
   */
  @Prop({
    mutable: true,
    reflect: true
  }) data?: string | JSON;

  @Watch('data')
  dataWatcher(newValue: string | JSON) {
    if (this.currentPage > 1) {
      this.alertVisibility = true;
    }

    this.parsedData = ensureArray(ensureJson(newValue));
    this.datatablesNetApi.clear();
    this.datatablesNetApi.rows.add(this.parsedData);
    this.datatablesNetApi.draw();
  }

  /**
   * As opções da tabela
   */
  @Prop() options?: string | JSON;

  /**
   * Faz com que o componente aguarde a chamada ao método `start()` para iniciar o DataTable.
   */
  @Prop({
    mutable: false,
    reflect: true,
  })
  deferStart: boolean = false;

  /**
   * Define o atributo `id` para a tabela (tag `table`), quando ela é criada automaticamente pelo componente.
   * Se você não incluir a tag `table` e usar a opção `stateSave`, é necessário definir esse atributo.
   */
  @Prop({
    mutable: false,
    reflect: true,
  })
  tableId: string;

  /**
   * Retorna o objeto DataTable.
   * Por meio do objeto retornado é possível configurar extensões do DataTable.
   */
  @Method()
  // Foi necessário explicitar o tipo de retorno aqui para que o Stencil
  // conseguisse lidar corretamente com isso na geração do componente.
  async getDataTable(): Promise<DataTableFactory> {
    return DataTable;
  }

  /**
   * Retorna a API DataTable.
   */
  @Method()
  async getApi(): Promise<Api> {
    if (this.deferStart && !this.started) {
      logger.warn(`DataTable ainda não foi inicializado. Execute o método "start()" antes de chamar "getApi()".`);
      return;
    }

    await this.start(); // Garante que só avançará quando o start estiver concluído.
    return this.datatablesNetApi;
  }

  async componentWillLoad() {
    logger.debug('@@@ componentWillLoad - iniciando');

    if (!this.deferStart) {
      await this.start();
      logger.debug('@@@ componentWillLoad - depois de this.start()');
    }
  }

  /**
    Inicia o DataTable.
    Sempre que `defer-start` for `true`, esse método deve ser chamado para que o componente inicie seu funcionamento.
    @returns O valor retornado é `true` se o DataTable foi realmente iniciado com a chamada desse método.
   */
  @Method()
  async start(): Promise<boolean> {
    // Garante que o método só seja executado uma vez.
    if (this.started) {
      return false;
    }
    this.started = true;

    // O método "start" vai encerrar a execução quando o DataTable estiver pronto,
    // ou seja, no evento "init".
    return new Promise(async (resolve) => {

      let alcDt = this;
      const initialConfig = getInitialConfig(this.options);
      this.pageLength = initialConfig.pageLength;

      function toArray<T>(value: T | T[] | undefined | null): T[] {
        // Se não houver valor, retorna array vazio.
        if (value === undefined || value === null) {
          return [];
        }
        // Garante retornar um array
        return Array.isArray(value) ? value : [value];
      }

      /*
        Recebe uma lista de funções que é tratada como array
        e retorna esse array de funções (com tipo `any`)

        Por que foi criada essa função?
        O DataTables.net está preparado para lidar com funções ou com arrays de funções
        em sua configuração de manipuladores de evento. Veja a documentação em:
        https://datatables.net/reference/option/on#Examples


        EXEMPLO 1 (função em "draw")
        new DataTable('#example', {
          on: {
            draw: () => {
              console.log('Draw event');
            }
          }
        });

        EXEMPLO 2 (array de funções em "draw")
        new DataTable('#example', {
          on: {
            draw: [
              () => {
                // Listener 1
              },
              () => {
                // Listener 2
              }
            ]
          }
        });

        Entretanto, o tipo fornecido (em Config) não corresponde atualmente à
        implementação. Usando typescript, não é possível informar um
        array de funções sem provocar um erro na chegagem de tipo.

        Uma solução seria simplesmente passar o array de funções "forçando"
        o tipo para `any`. Entretanto, isso faria desconsiderar todo o restante
        da checagem de tipo.
        A função foi criada, então, para garantir que os elementos do array
        sejam funções no formato esperado.
        O retorno da função é do tipo `any` é para que o typescript aceite
        a função ser aceita para passar os handlers para a configuração.
       */
      function handlers(...fns: DtEventHandler[]): any {
        return fns;
      }

      let dataTablesConfig: Config = {
        ...initialConfig,
        on: {
          preInit: handlers(
            function() {
              logger.debug('@@@ preInit handler');
              const api = alcDt.datatablesNetApi || new DataTable.Api(this);
              const table = api.table().node();
              setCssClasses(table, 'alc-datatable');
              resolve(true);
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.preInit),
          ),
          init: handlers(
            function() {
              if (!this || !(this instanceof HTMLTableElement)) {
                logger.error('Evento init do DataTable foi disparado, mas "this" não é um HTMLTableElement', this);
                resolve(false);
                return;
              }

              // Neste ponto do código, é preciso obter a API do DataTables.net desta forma,
              let api = new DataTable.Api(this);

              saveColumnsInfo(api, alcDt.columns);
              setOrderableIcons(api);
              logger.debug('@@@ init handler');
            },
            // Executa as funções configuradas pela aplicação
            ...toArray<DtEventHandler>(initialConfig?.on?.init),
            // Parte final da inicialização
            function() {
              alcDt.initCompleted = true;
            },
          ),
          length: handlers(
            function(_e, _settings, len: number) {
            // Sempre que houver mudança no tamanho da página, pageLength tem que estar com o valor correspondente.
              alcDt.pageLength = len;
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.length),
          ),
          order: handlers(
            function(_e, _settings, ordArr) {
              alcDt.columns.forEach((column, index) => {
                let header = column.th;
                const icon = header.querySelector('alc-sort-indicator');
                if (icon) {
                  let col = -1;
                  let dir = '';

                  // Se há ordenação definida.
                  if (ordArr?.length) {
                    col = ordArr[0].col;
                    dir = ordArr[0].dir;
                  }
                  const sorting = getSorting(col, index, dir);
                  icon.setAttribute('sorting', sorting);
                }
              })
              forceUpdate(alcDt);
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.order),
          ),
          search: handlers(
            function() {
              const api = alcDt.datatablesNetApi || new DataTable.Api(this);
              // Obtém o texto da busca, que pode ser uma string ou uma expressão regular.
              // SearchInput<any> pode ser também uma função; esse caso não é tratado aqui.
              function getSearchString(search: SearchInput<any>): string {
                return (
                  typeof search === 'string'
                  ? search
                  : search instanceof RegExp
                    ? search.source
                    : ''
                );
              }

              // Sempre que houver uma busca, searchText tem que estar com o valor correspondente.
              alcDt.searchText = getSearchString(api.search());
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.search)
          ),
          stateLoaded: handlers(
            function (_e, _settings, data) {
              const { search, length, start } = data;

              alcDt.pageLength = length;
              alcDt.searchText = search?.search || '';
              alcDt.currentPage = (start / length) + 1;
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.stateLoaded)
          ),
          draw: handlers(
            function (e) {
              logger.debug('@@@ draw handler', alcDt.initCompleted);
              if (e.currentTarget instanceof HTMLTableElement) {
                // Sempre que a tabela é redesenhada no DOM, as classes CSS
                // devem ser incluídas para correta renderização.
                setCssClasses(e.currentTarget, 'alc-datatable');
              }
              // Somente depois da inicialização
              if (alcDt.initCompleted) {
                alcDt.currentPage = alcDt.datatablesNetApi.page() + 1;
                forceUpdate(alcDt);
              }
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.draw),
          ),
          processing: handlers(
            function(e, settings, processing) {

              if (!initialConfig.processing) {
                // Nada a fazer se a opção não foi setada
                // Mesmo que o método processing(true) seja chamado, não faz nada
                // se a opção não foi setada. Isso está consistente com a
                // documentação do Datatables.net
                // https://datatables.net/reference/api/processing()
                return;
              }

              logger.debug("@@@ processing handler", settings, processing);

              const api = alcDt.datatablesNetApi || new DataTable.Api(this);
              const table = api.table().node();

              // Cria o processingElement se não existir ainda - uma única vez.
              if (alcDt.processingElement === null) {
                alcDt.processingElement = document.createElement('alc-loading');
                alcDt.processingElement.setAttribute('variant', 'container');
                alcDt.processingElement.setAttribute('label', portugues.processing);
                table.parentElement.append(alcDt.processingElement);
              }

              alcDt.showProcessing = processing;

              if (processing) {
                // Se estiver iniciando o processamento pela primeira vez,
                // mostra o indicador imediatamente.
                if (alcDt.initialProcessing === 'none') {
                  alcDt.initialProcessing = 'processing';
                  alcDt.processingElement.setAttribute('active', 'true');
                }
                // Para processamentos subsequentes, aguarda 500ms antes de mostrar o indicador.
                else {
                  setTimeout(() => {
                    // Apenas se ainda estiver em processamento depois do timeout.
                    if (alcDt.showProcessing) {
                      alcDt.processingElement.setAttribute('active', 'true');
                    }
                  }, 500);
                }
              }
              // Se o processamento terminou, remove o indicador imediatamente.
              else {
                alcDt.processingElement.setAttribute('active', 'false');
                alcDt.initialProcessing = 'done';
              }
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.processing),
          ),
          'column-visibility': handlers(
            function(e, _settings, _column, state) {
              logger.debug('@@@ columnVisibility handler', state);

              if (state && e.currentTarget instanceof HTMLTableElement) {
                // Sempre que a coluna é mostrada novamente no DOM (state=true),
                // as classes CSS devem ser incluídas para correta renderização.
                setCssClasses(e.currentTarget, 'alc-datatable');
              }
            },
            ...toArray<DtEventHandler>(initialConfig?.on?.['column-visibility']),
          )

          // Ao incluir um handler de um novo evento aqui, o seguinte formato
          // deve ser adotado:
          // 1. A função a ser executada deve ser passada como parâmetro para
          //    a função handlers.
          // 2. O que estiver contido na configuração (que vem da aplicação)
          //    deve ser incluído depois.
          // Tudo isso é necessário para que o código definido pelo componente
          // seja executado primeiro, e que a configuração feita pela aplica
          // não seja perdida, mas seja executada depois.
          // ----------

          //
          //  NOME_DO_EVENTO: handlers (
          //    function() {
          //      // Código que se deseja executar
          //    },
          //    ...toArray<DtEventHandler>(initialConfig?.on?.NOME_DO_EVENTO),
          //  ),
        },
      }

      let domTable = this.el.querySelector('table');

      // Cria a tabela, se ela não existir no DOM.
      if (!domTable) {
        this.reportEmptyTableProps();
        domTable = document.createElement('table');
        // Adiciona o id caso tenha definido pela propriedade tableId;
        this.tableId && domTable.setAttribute('id', this.tableId);
        this.el.insertAdjacentElement('beforeend', domTable);
      }

      // Cria um id único para a tabela, se ele não tiver sido definido.
      if (!domTable.id) {
        domTable.setAttribute('id', getUniqueId());
      }

      // Se data for informado, passa para o DataTables, que vai ignorar o que houver no DOM.
      if (this.data) {
        // Transforma atributo data em json.
        this.parsedData = ensureArray(this.data);
        dataTablesConfig.data = this.parsedData;
      }

      // Se a opção select for true, carrega o módulo de seleção
      if (dataTablesConfig.select) {
        const Select = await import('datatables.net-select');
        DataTable.use(Select);
      }

      // Configura o componente para disparar os mesmos eventos do DataTables.net
      addOriginalEventsListeners(DataTable, domTable, alcDt);
      // Inicializa o DataTables.net
      this.datatablesNetApi = new DataTable(`#${domTable.id}`, dataTablesConfig);

      logger.debug('Datatables.net iniciado');
    });
  }

  reportEmptyTableProps() {
    if (!this.data) {
      logger.report('data', this.el.tagName.toLowerCase(), this.el);
    }

    if (!this.options) {
      logger.report('options', this.el.tagName.toLowerCase(), this.el);
    }
  }

  render() {
    if (this.initialProcessing === 'processing') {
      logger.debug('@@@ render - initWithProcessing ativo, não renderiza tabela');
      return this.renderTable(false);
    }
    if (!this.initCompleted) {
      return this.renderTable(false);
    }
    logger.debug('@@@ render - chamando renderTable()');
    return this.renderTable(true);
  }

  componentDidRender() {
    // Não faz nada se o DataTables.net não tiver sido iniciado.
    if (!this.initCompleted) {
      return;
    }
    // Não repete a configuração do wrapper - faz somente uma vez.
    if (!this.tableWrapperConfigured) {
      this.configureTableWrapper();
      this.tableWrapperConfigured = true;
    }
  }

  private renderTable(started: boolean) {
    const { ordering, paging, searching, info } = started
      ? this.datatablesNetApi?.init()
      : getInitialConfig();

    return (
      <Host>
        {started && this.renderAlert()}
        {started && this.renderTopRegion(ordering, searching)}
        {this.renderTableSlot(started)}
        {started && this.renderBottomRegion(info, paging)}
      </Host>
    )
  }

  disconnectedCallback() {
    if (!this.tableWrapper) {
      return;
    }
    this.tableWrapper.removeEventListener('scroll', this.handleScrollEvent);
  }

  private configureTableWrapper() {
    const table = this.datatablesNetApi.table().node();
    this.tableWrapper = table.closest('.dt-layout-full');

    if (!this.tableWrapper) {
      return;
    }

    this.tableWrapper.classList.add('alc-datatable__wrapper');
    this.tableWrapper.addEventListener('scroll', () => this.handleScrollEvent());
    this.tableWrapper.classList.toggle('has-scroll-end', this.tableWrapper.scrollWidth > this.tableWrapper.clientWidth);
  }

  @Listen('resize', { target: 'window' })
  private handleResize() {
    if (!this.tableWrapper) {
      return;
    }

    if (this.tableWrapper.scrollWidth > this.tableWrapper.clientWidth) {
      this.tableWrapper.classList.add('has-scroll-end');
    } else {
      this.tableWrapper.classList.remove('has-scroll-start');
      this.tableWrapper.classList.remove('has-scroll-end');
    }
  }

  private handleScrollEvent() {
    if (!this.tableWrapper) {
      return;
    }
    this.tableWrapper.classList.toggle('has-scroll-start', this.tableWrapper.scrollLeft > 0);
    this.tableWrapper.classList.toggle('has-scroll-end', Math.ceil(this.tableWrapper.offsetWidth + this.tableWrapper.scrollLeft) < this.tableWrapper.scrollWidth);
  }

  /*
    Renderiza o seletor de tamanho de página
  */
  private renderPageLength = () => {
    let options = null;
    const { language, lengthChange, lengthMenu, paging } = this.datatablesNetApi.init();

    if (lengthChange === false || paging === false) {
      return null;
    }

    // Type guard: verifica se é array de arrays
    // Se retornar true, o TS entende que lengthMenu é do tipo (string | number)[][]
    // Note o uso de "is" no retorno
    type LengthMenu = (string | number)[] | (string | number)[][]
    function isArrayOfArrays(
      value: LengthMenu
    ): value is (string | number)[][] {
      return Array.isArray(value[0]);
    }

    if (isArrayOfArrays(lengthMenu)) {
      // lengthMenu[0] tem um array de tamanhos, lengthMenu[1] tem um array de rótulos
      options = createOptions(lengthMenu[0], lengthMenu[1], this.pageLength)
      }
    else {
      // lengthMenu é um array com tamanhos, usado também como rótulos
      options = createOptions(lengthMenu, lengthMenu, this.pageLength);
    }

    let selectElement: HTMLSelectElement;
    // Obtém os textos antes e depois de _MENU_ no texto configurado para lengthMenu
    const [textBerfore, textAfter] = language.lengthMenu.split('_MENU_').map(text => text.trim());

    const pageLengthField = (
      <alc-field {...test('data-test-length-field')}>
        <label>
          {textBerfore}
          <select
            ref={el => selectElement = el}
            class="alc-datatable__select-length"
            onChange={() => {
              // Obtém length selecionado e atualiza nos pontos necessários.
              const length = parseInt(selectElement.value);
              this.datatablesNetApi.page.len(length).draw();
              this.pageLength = length;
            }}
          >
            {options}
          </select>
          {textAfter}.
        </label>
      </alc-field>
    );

    return (
      <div>
        {pageLengthField}
      </div>
    );

    function createOptions (values: Array<string | number>, labels: Array<string | number>, selectedValue: number) {
      const options = values.map((value: number, i: number) => {
        return (
          <option
            value={value.toString()}
            selected={selectedValue === value}
          >
            {labels[i]}
          </option>
        )
      });
      return options;
    }
  };

  /*
    Renderiza a paginação
   */
  private renderPagination = () => {
    // Função executada no disparo de alc-change do pagination
    const changePage = (e: CustomEvent) => {
      const to = e.detail.to - 1;
      this.currentPage = e.detail.to;
      this.datatablesNetApi.page(to).draw(false);
      forceUpdate(this.el);
    };

    const info = this.datatablesNetApi.page.info();

    // Não renderiza em qualquer das condições abaixo:
    // - [A] se está mostrando todos os registros
    // - [B] se o total de itens na tabela for menor que a quantidade de itens por página
    // - [C] se não houver registros para mostrar na tabela
    if (
      info.length === -1 || // A
      info.recordsTotal <= info.length || // B
      info.recordsDisplay === 0 // C
    ) {
      return null;
    }

    return (
      <div class="alc-datatable__pagination">
        <alc-pagination
          ref={el => (this.paginationElement = el)}
          currentPage={this.currentPage}
          totalPages={info.pages}
          onAlc-change={changePage}
          {...test('data-test-pagination')}
        >
        </alc-pagination>
      </div>
    );
  };

  /*
    Renderiza a informação da página
    (número de itens mostrados, total de itens, etc.)
   */
  private renderPageInfo = (): HTMLElement => {
    const info = this.datatablesNetApi.page.info();

    // Nenhum item mostrado (a informação vai na própria tabela)
    if (info.recordsDisplay === 0) {
      return null;
    }

    // Um único item no total
    if (info.recordsTotal === 1) {
      return (
        <div>1 item listado.</div>
      );
    }

    // Uma única página
    if (info.pages === 1) {
      // Número de itens exibidos é igual ao total de itens
      if (info.recordsDisplay === info.recordsTotal) {
        return (
          <div>{info.recordsTotal} itens listados.</div>
        );
      }

      // Número de itens exibidos é diferente do total de itens
      return (
        <div {...test('data-test-page-info')}>
          {info.recordsDisplay} itens - de um total de {info.recordsTotal} itens.
        </div>
      );
    }

    // Várias páginas
    const start = info.start + 1;
    const range = start === info.end ? info.end : `De ${start} até ${info.end}`;

    const total = info.recordsDisplay !== info.recordsTotal ? ` - de um total de ${info.recordsTotal} itens` : '';

    return (
      <div {...test('data-test-page-info')}>
        {range} de {info.recordsDisplay} itens{total}.
      </div>
    );
  };

  /*
    Renderiza os controles de ordenação
   */
  private renderOrderControls = (headers: Array<String>) => {

    // Função usada somente pelos controles de ordenação aqui gerados
    const changeOrder = (e: AlcMenuItemCustomEvent<any>) => {
      const order = e.target.value;

      if (this.currentPage > 1) {
        this.alertVisibility = true;
      }
      this.datatablesNetApi.order(order).draw();
      forceUpdate(this.el);
    };

    const order = normalizeOrderOption(this.datatablesNetApi.order());

    const items = headers.map((header, index) => {
      const asc = {idx: index, dir: 'asc'};
      const desc = {idx: index, dir: 'desc'};

      if (isColumnOrderable(index, this.datatablesNetApi)) {
        const orderAsc = order && order[0] === index && order[1] === 'asc';
        const orderDesc = order && order[0] === index && order[1] === 'desc';

        return [
          <alc-menu-item value={asc} type="radio" checked={orderAsc ? true : null}>
            {header}
            <alc-sort-indicator sorting="asc" aria-label="ascendente" class="ml-1"></alc-sort-indicator>
          </alc-menu-item>,
          <alc-menu-item value={desc} type="radio" checked={orderDesc ? true : null}>
            {header}
            <alc-sort-indicator sorting="desc" aria-label="descendente" class="ml-1"></alc-sort-indicator>
          </alc-menu-item>,
        ];
      }
      return;
    });

    return (
      <alc-dropdown {...test('data-test-dropdown-order')}>
        <button slot="trigger" class="alc-button alc-button--secondary">
          <alc-sort-indicator sorting="none" class="mr-1"></alc-sort-indicator>
          Ordenação <alc-icon name="chevron-down" label=""></alc-icon>
        </button>
        <alc-menu onAlc-select={changeOrder}>
          {items}
        </alc-menu>
      </alc-dropdown>
    );
  };

  /*
    Renderiza o alerta de reposicionamento na primeira página
   */
  private renderAlert = () => {
    return (
      <alc-alert type="warning" visible={this.alertVisibility} onAlc-hide={() => (this.alertVisibility = false)}>
        Tabela reposicionada na primeira página
      </alc-alert>
    );
  }

  /*
    Renderiza a região superior da tabela, que contém os controles de
    ordenação, exibição de colunas, tamanho de página e busca.
   */
  private renderTopRegion = (ordering: Config['ordering'], searching: Config['searching']) => {
    return (
      <div class="alc-datatable__controls" key="top-region">
        <div class="alc-datatable__controls-order">
          {!!ordering ? this.renderOrderControls(this.columns.map(c => c.textContent)) : null}
          {this.renderShowColumnsControls(this.columns.map(c => c.textContent))}
          {this.renderPageLength()}
        </div>

        {!!searching ? this.renderSearchControl() : null}
      </div>
    );
  }

  /*
    Renderiza o slot da tabela
   */
  private renderTableSlot = (started: boolean) => {
    // Sempre renderiza o slot, mesmo que o DataTable ainda não tenha sido iniciado.
    // Entretanto, o slot é escondido até que o DataTable seja iniciado,
    // para evitar que a tabela seja mostrada antes de ser inicializada.
    return (
      <div hidden={!started} key="table-slot">
        <slot></slot>
      </div>
    );
  }

  /*
    Renderiza a região inferior da tabela, que contém a informação da página e a paginação.
   */
  private renderBottomRegion = (info: Config['info'], paging: Config['paging']) => {
    const needBottomRegion = info || paging;

    if (!needBottomRegion) {
      return null;
    }

    return (
      <div class="alc-datatable__bottom-region" key="bottom-region">
        {info && this.renderPageInfo()}
        {paging && this.renderPagination()}
      </div>
    );
  }

  private onSearch = (e: InputEvent | Event) => {
    const input = e.target as HTMLInputElement;

    if (this.currentPage > 1) {
      const info = this.datatablesNetApi.page.info();

      this.currentPage = 1;
      // Atualiza a paginação
      this.paginationElement.totalPages = info.pages;
      this.paginationElement.currentPage = this.currentPage;

      this.alertVisibility = true;
    }

    this.datatablesNetApi.search(input.value).draw();
    forceUpdate(this.el);
  };

  /*
    Renderiza os controles de exibição de colunas
   */
  private renderShowColumnsControls = (headers: Array<String>) => {

    // Função usada somente pelos controles de exibição de colunas aqui gerados
    const changeVisibility = (e: AlcMenuItemCustomEvent<any>) => {
      logger.debug('@@@ changeVisibility', e.target.value);
      const col = parseInt(e.target.value);
      // Nâo é preciso chamar 'draw' para que a alteração tenha efeito.
      this.datatablesNetApi.column(col).visible(!this.datatablesNetApi.column(col).visible());
      forceUpdate(this.el);
      this.handleScrollEvent();
    };

    const items = headers.map((header, i) => {
      return (
        <alc-menu-item value={`${i}`} type="checkbox" checked={this.datatablesNetApi.column(i).visible() ? true : null}>
          {header}
        </alc-menu-item>
      );
    });

    return (
      <alc-dropdown {...test('data-test-dropdown-columns')}>
        <button slot="trigger" class="alc-button alc-button--secondary">
          <alc-icon name="table" label="" class="mr-1 -rotate-90"></alc-icon>
          Colunas <alc-icon name="chevron-down" label=""></alc-icon>
        </button>

        <alc-menu onAlc-select={changeVisibility}>
          {items}
        </alc-menu>
      </alc-dropdown>
    );
  };

  /*
    Renderiza os controles de busca (filtro)
   */
  private renderSearchControl = () => {
    return (
      <div class="alc-datatable__controls-search">
        <alc-field
          label="Pesquisar por:"
          {...test('data-test-search-field')}
        >
          <input
            type="search"
            onInput={this.onSearch}
            value={this.searchText}
            autocomplete="off"
            {...test('data-test-input-search')}
          />
        </alc-field>
      </div>
    );
  };

}


const getInitialConfig = (options?: string | JSON): Config => {
  const optionsDefaults: Config = {
    language: portugues,
    autoWidth: false,
    ordering: true,
    paging: true,
    info: true,
    columnDefs: [
      {
        orderable: true,
        targets: [],
      },
    ],
    searching: true,
    lengthChange: true,
    lengthMenu: [10, 25, 50, 100],
    pageLength: 10,
    // Desabilita features padrão do DataTables.
    // Na versão 1.x.x do DataTables, fizemos isso usando a opção `dom`.
    layout: {
      topStart: null, // Desabilita feature pageLength
      topEnd: null, // Desabilita feature search
      bottomStart: null, // Desabilita feature info
      bottomEnd: null, // Desabilita feature paging
    }
  };

  const parsedOptions = options ? ensureJson(options) : {};

  return {
    ...optionsDefaults,
    ...parsedOptions
  }

}

const ensureJson = (input: string | JSON): JSON => {
  return typeof input === 'object' ? input : JSON.parse(input);
}

const ensureArray = (input: string | JSON): any[] => {

  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === 'string') {

    try {
      const parsedInput = JSON.parse(input);

      if (Array.isArray(parsedInput)) {
        return parsedInput;
      }

      // Se o Parse for bem-sucedido, mas não for um Array (ex: {a: 1}), retorne um Array vazio
      logger.error('A string informada em "data" não resultou em um array.');
      return [];

    } catch (e) {
      // O Parse falhou (a string não era um JSON válido)
      logger.error('Falha ao analisar a string informada em "data" como JSON.', e);
      return [];
    }
  }

  logger.error('Verifique o valor informado em "data". Deve ser um array ou uma string JSON que represente um array.');
  return [];
}

/**
 * Testa se uma coluna é ordenável.
 *
 * Essa função parte do pressuposto que, por padrão, todas as colunas são ordenáveis.
 * Ou seja, que para não ser ordenável, deve haver uma configuração que diga isso.
 *
 * @param colIndex Índice a coluna da tabela
 * @returns true se a coluna for ordenável
 */
const isColumnOrderable = (index: number, api: Api): boolean => {
  return api.column(index).orderable();
};

const getSorting = (colIndex: number, index: number, dir: string) => {
  let sorting = 'none';

  if (colIndex === index) {
    sorting = dir;
  }

  return sorting;
};


const includeOrderableIconOnColumn = (header: HTMLElement, index: number, api: Api) => {
  if (!isColumnOrderable(index, api)) {
    return;
  }

  let orderColIndex= -1;
  let orderColDir = '';

  const order = api.order();
  // Se há ordenação definida.
  if (order?.length) {
    orderColIndex = order[0][0];
    orderColDir = order[0][1];
  }

  const orderButton = header.querySelector('.dt-column-order');

  if (orderButton) {
    const icon = document.createElement('alc-sort-indicator');
    icon.classList.add('alc-datatable__sort-icon');
    icon.setAttribute('sorting', getSorting(orderColIndex, index, orderColDir));
    orderButton.appendChild(icon);
    orderButton.classList.add('alc-datatable__column-order');
    Object.entries(test('data-test-order-button')).forEach(([key, value]) => {
      orderButton.setAttribute(key, String(value));
    });
  }

  return header;
}

const setOrderableIcons = (dt: Api) => {
  dt.columns().header().each((header: HTMLElement, index: number) => {
    includeOrderableIconOnColumn(header, index, dt);
  });
  // dt.columns().header().
}

const saveColumnsInfo = (dt: Api, columns: any) => {
  dt.columns().header().each((header: HTMLElement, index: number) => {
    columns.push({
      textContent: header.textContent,
      th: header,
    });
  });
}

  /*
    Obtém o retorno de `order()` da api do DataTables.net e:
    - Retorna null se não houver ordenação especificada (representado por [])
    - Retorna a primeira posição do array de ordenação, que é a que nos interessa,
      quando houver ordenação especificada.
    [] --> null
    [[a, b]] --> [a, b]
    [[a, b], [y, x], ...] --> [a, b]
   */
  const normalizeOrderOption = (order: Array<any>): [number, string] => {
    if (!order.length) {
      return null;
    }
    return order[0];
  }
