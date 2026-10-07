import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { getUniqueId } from '../utils/getUniqueId'
@Component({
  tag: 'alc-view-more',
  styleUrl: 'alc-view-more.css'
})
export class AlcViewMore {
  @Element() el!: HTMLElement;
  /**
   * Nome da ação para revelar o conteúdo.
   */
  @Prop({ reflect: true }) toggleTextOpen: string = 'Veja mais...';
  /**
   * Nome da ação para esconder o conteúdo.
   */
  @Prop({ reflect: true }) toggleTextClose: string = 'Fechar';
  /**
   * Alinhamento do botão de ação.
   */
  @Prop({ reflect: true }) togglePosition: string = 'center';
  /**
   * Classes CSS para serem aplicadas ao texto da ação.
   */
  @Prop({ reflect: true }) textClass: string = '';
  /**
   * Tamanho mínimo do conteúdo a ser exibido.
   * Pode ser em px, rem ou em: 200px; 20rem; 10em;
   */
  @Prop({ reflect: true }) minHeight: string = '8em';

  /**
   * Nome da variável CSS correspondente à cor de fundo em que o componente está inserido.
   * Aplica-se ao degradê do corte do texto.
   */
  @Prop({ reflect: true }) bgColorVar: string = '--alc-color-surface-primary';

  @State() contentExpanded: boolean;

  private contentId = getUniqueId();

  toggle(e: Event) {
    e.preventDefault();
    this.contentExpanded = !this.contentExpanded;
  }

  setPosition() {
    if (this.togglePosition === 'right') {
      return 'justify-end';
    }
    if (this.togglePosition === 'left') {
      return 'justify-start';
    }

    return 'justify-center';
  }

  getContentCssClasses() {
    let classes = `alc-view-more__content ${this.textClass}`;

    if (this.contentExpanded) {
      classes = `${classes} alc-view-more__content--opened`;
    }
    return classes;
  }

  componentWillLoad() {
    this.contentExpanded = false;
  }

  componentDidRender() {
    let content = this.el.querySelector('.alc-view-more__content') as HTMLElement;
    let maxH = content.scrollHeight;
    content.style.setProperty('--min-height', this.minHeight);
    content.style.setProperty('--max-height', maxH + 'px');
    content.style.setProperty('--bg-color', `var(${this.bgColorVar})`);
  }

  render() {
    return (
      <Host>
        <div
          id={this.contentId}
          class={this.getContentCssClasses()}
        >
          <slot></slot>
        </div>
        <div class={'alc-view-more__toggle ' + (this.setPosition())}>
          <a href={'#'+this.contentId} onClick={e => {this.toggle(e)}} aria-expanded={this.contentExpanded.toString()} aria-controls={this.contentId} role="button">
            {this.contentExpanded ? this.toggleTextClose : this.toggleTextOpen}
          </a>
        </div>
      </Host>
    );
  }
}
