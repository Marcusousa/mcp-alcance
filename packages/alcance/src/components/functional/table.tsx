import { FunctionalComponent } from '@stencil/core';

const DEFAULT_BASE_CLASS_NAME = 'alc-table'

function setCssClasses(table: HTMLTableElement, baseClassName = DEFAULT_BASE_CLASS_NAME) {
  let headerRows = table.querySelectorAll('thead tr');
  let headerCells = table.querySelectorAll('thead th');
  let rows = table.querySelectorAll('tbody tr');
  let bodyCells = table.querySelectorAll('table tbody td');
  table.classList.add(`${baseClassName}`);
  headerRows.forEach(row => {
    row.classList.add(`${baseClassName}__header-row`);
  });
  headerCells.forEach(cell => {
    cell.classList.add(`${baseClassName}__header-cell`);
  });
  rows.forEach(row => {
    row.classList.add(`${baseClassName}__row`);
  });
  bodyCells.forEach(cell => {
    cell.classList.add(`${baseClassName}__cell`);
  });
}

function inlineHeaders(table: HTMLTableElement, baseClassName = DEFAULT_BASE_CLASS_NAME): Array<HTMLDivElement> {
  let headers = table.querySelectorAll('thead th');
  let headerClones: Array<HTMLDivElement> = [];

  headers.forEach((header) => {
    let attrs:NamedNodeMap = header.attributes;
    let clone = document.createElement('div');

    Array.from(attrs).forEach(attr => {
      clone.setAttribute(attr.name, attr.value);
    });
    clone.classList.add(`${baseClassName}__inline-header`);

    // clone.setAttribute('aria-hidden', 'true');
    header.childNodes.forEach(childNode => {
      clone.appendChild(childNode.cloneNode(true));
    });
    headerClones.push(clone);
  });

  return headerClones;
}

function wrapAll (target, wrapper = document.createElement('div')) {
  [ ...target.childNodes ].forEach(child => wrapper.appendChild(child));
  target.appendChild(wrapper);
  return wrapper;
}

function setInlineHeaders(table: HTMLTableElement, baseClassName = DEFAULT_BASE_CLASS_NAME) {
  let headers = inlineHeaders(table);
  let rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    let cells = row.querySelectorAll('td');
    cells.forEach((cell, index) => {

      // Evita que seja feito o mesmo processo duas vezes na célula
      if (cell.dataset.alcInlineHeader === 'true') {
        return;
      }
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add(`${baseClassName}__cell-content`);
      wrapAll(cell, contentWrapper);

      let inlineHeader = headers[index].cloneNode(true);
      cell.insertBefore(inlineHeader, cell.firstChild);

      cell.dataset.alcInlineHeader = 'true';
    });
  });
}

interface TableProps {
  target: HTMLTableElement
}

const Table: FunctionalComponent<TableProps> = ({target}) => {
  setCssClasses(target);
  setInlineHeaders(target);

  return null;
}

export default Table;
export { setInlineHeaders, setCssClasses };