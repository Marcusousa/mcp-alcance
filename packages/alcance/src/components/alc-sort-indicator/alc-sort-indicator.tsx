import { Component, Host, h, Prop } from '@stencil/core';


const iconMap = new Map();

iconMap.set('asc', {
  name: 'chevron-down'
});
iconMap.set('desc', {
  name: 'chevron-up'
});
iconMap.set('none', {
  name: 'chevron-expand'
});


@Component({
  tag: 'alc-sort-indicator',
  scoped: false,
})
export class AlcSortIndicator {
  /**
  * Define indicação do sort.
  */
  @Prop({
    reflect: true
  }) sorting: 'asc' | 'desc' | 'none' = 'none';

  render() {
    return (
      <Host>
        <span class="alc-sort-indicator">
          <alc-icon name={iconMap.get(this.sorting).name} class="alc-sort-indicator__icon" label=""></alc-icon>
        </span>
      </Host>
    );
  }

}
