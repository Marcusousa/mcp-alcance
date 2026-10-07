import { Component, Host, h, Element } from '@stencil/core';
import Table from '../functional/table';

@Component({
  tag: 'alc-table',
  styleUrl: 'alc-table.css',
  scoped: false,
})
export class AlcTable {

  @Element() el: HTMLAlcTableElement;

  render() {

    let table = this.el.querySelector('table');

    return (
      <Host>
        <Table
          target={table}
        >
        </Table>
      </Host>
    );
  }

}
