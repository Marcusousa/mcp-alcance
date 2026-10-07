import { Component, Host, h, Prop, EventEmitter, Event, State, Watch } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId';
import logger from '../utils/logger';
import test from '../utils/testAttributes';

type PageChangeType = 'isFirst' | 'isPrev' | 'isLast' | 'isNext' | 'isSelect';

export interface PageChangeEventProps {
  from: number;
  to: number;
  using: PageChangeType;
}

interface PaginationItem {
  [using: string]: {
    icon: string;
    label: string;
  }
}

@Component({
  tag: 'alc-pagination',
  styleUrl: 'alc-pagination.css',
})
export class Pagination {
  private idSelectPagination = null;
  private disabledSelect: boolean = false;

  /**
   * Número total de páginas.
   */
  @Prop({
    reflect: true,
    mutable: true
  }) totalPages: number = 1;
  @Watch('totalPages')
  watchPropTotalPages(newValue: number , oldValue: number) {

    if (newValue < this.currentPage) {
      this.totalPages = oldValue;
      logger.warn(`"total-pages" não pode ser menor do que "current-page". Foi mantido o valor ${oldValue}`);
      return;
    }
    this.pageList = [...new Array(newValue)].map((_, index) => index + 1);
  }

  /**
   * Número da página atual
   */
  @Prop({ mutable: true, reflect: true }) currentPage: number = 1;

  /**
  * @type Array<number>
  * @default []
  *
  * Lista de páginas
  */
  @State() pageList: Array<number> = [];

  /**
   * Disparado quando ocorre a mudança de uma página para outra.
   */
  @Event({
    eventName: 'alc-change',
    cancelable: false,
  })
  alcChange: EventEmitter<{
    from: number;
    to: number;
    using: 'isFirst' | 'isPrev' | 'isLast' | 'isNext' | 'isSelect'
  }>;

  componentWillLoad() {
    this.pageList = [...new Array(this.totalPages)].map((_, index) => index + 1);
    this.idSelectPagination = getUniqueId();
  }

  private paginationItem: PaginationItem = {
    'isFirst': {
      icon: 'chevron-double-left',
      label: 'Ir para primeira página',
    },
    'isLast': {
      icon: 'chevron-double-right',
      label: 'Ir para última página',
    },
    'isPrev': {
      icon: 'chevron-left',
      label: 'Ir para página anterior',
    },
    'isNext': {
      icon: 'chevron-right',
      label: 'Ir para próxima página',
    },
  }

  private checkPage = (using: PageChangeType) => {
    const leftPaginationItems = ['isFirst', 'isPrev'];
    const rightPaginationItems = ['isLast', 'isNext'];

    if (leftPaginationItems.includes(using)) {
      return this.currentPage !== 1
    }

    if (rightPaginationItems.includes(using)) {
      return this.currentPage !== this.pageList.length
    }

    return true;
  }

  private handleSelectedPage = (event: any) => {
    this.handleChangePage(parseInt(event.target.value), 'isSelect')
  }

  private handleChangePage(pageNumber: number, using: PageChangeType) {
    if (!this.checkPage(using)) {
      return;
    }

    const newChange =
      this.alcChange.emit({
        from: this.currentPage,
        to: pageNumber,
        using: using,
      });

    this.pageChangeHandler(newChange);

  }

  private pageChangeHandler(event: CustomEvent<PageChangeEventProps>) {
    const { using, to } = event.detail;

    switch (using) {
      case 'isFirst':
        this.currentPage = 1;
        break;
      case 'isPrev':
        this.currentPage = this.currentPage - 1;
        break;
      case 'isNext':
        this.currentPage = this.currentPage + 1;
        break;
      case 'isLast':
        this.currentPage = this.totalPages;
        break;
      default:
        this.currentPage = to;
        break;
    }
  }

  private renderPaginationItem = (pageNumber: number, using: PageChangeType) => {
    const paginationItemIsDisabled = !this.checkPage(using);
    const paginationItemLabel = (!paginationItemIsDisabled && using !== 'isFirst') ? `, Ir para página ${pageNumber}` : '';

    return (
      <li>
        <button
          onClick={() => this.handleChangePage(pageNumber, using)}
          class={{
            'alc-button alc-button-rounded': true,
            'alc-pagination__button--first': using === 'isFirst',
            'alc-pagination__button--last': using === 'isLast',
          }}
          aria-label={this.paginationItem[using].label + paginationItemLabel}
          aria-disabled={paginationItemIsDisabled}
          disabled={paginationItemIsDisabled}
          {...test('data-test-pagination-button')}
        >
          <alc-icon
            name={this.paginationItem[using].icon}
            label=""
          />
        </button>
      </li>
    )
  }

  render() {
    return (
      <Host>
        <nav role="navigation" aria-label="Navegação paginada" class="alc-pagination">
          <ul class="alc-pagination__content">

            {this.renderPaginationItem(1, 'isFirst')}
            {this.renderPaginationItem(this.currentPage - 1, 'isPrev')}

            <li class="alc-pagination__item">
              <label htmlFor={this.idSelectPagination}>Página</label>
              <select onChange={this.handleSelectedPage} class="alc-pagination__select" id={this.idSelectPagination} disabled={this.disabledSelect}>
                {this.pageList.map(page => (
                  <option value={page} selected={page === this.currentPage} aria-label={`Página ${page}`}>
                    {page}
                  </option>
                ))}
              </select>
              de {this.totalPages}
            </li>

            {this.renderPaginationItem(this.currentPage + 1, 'isNext')}
            {this.renderPaginationItem(this.pageList.length, 'isLast')}

          </ul>
        </nav>
      </Host>
    );
  }
}
