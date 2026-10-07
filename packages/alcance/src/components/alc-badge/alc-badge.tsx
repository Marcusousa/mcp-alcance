import { Component, Prop, h, Host } from '@stencil/core';
import test from '../utils/testAttributes';

@Component({
  tag: 'alc-badge',
  styleUrl: 'alc-badge.css',
  shadow: false,
})
export class AlcBadge {
  /**
   * O texto a ser exibido dentro do badge (ex: "99+" ou "Novo").
   */
  @Prop() label?: string;

  /**
   * Define se o badge deve ser exibido como um contador.
   */
  @Prop() count?: boolean = false;

  /**
   * Define a cor do badge. Pode ser 'primary', 'secondary', 'success', 'warning', 'error', 'info' ou 'neutral'.
   */
  @Prop() color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'primary';

  /**
   * Define se o badge deve ser exibido como um ponto (dot) sem conteúdo.
   */
  @Prop() dot: boolean = false;

  /**
   * Define se o badge deve ser exibido ou não.
   */
  @Prop() hidden: boolean = false;

  /**
   * Define se o badge deve aparecer com um contorno ao invés de ser preenchido.
   */
  @Prop() outlined: boolean = false;

  /**
   * Define a posição do badge: 'default', 'floating' ou 'inline'.
   */
  @Prop() position: 'default' | 'floating' | 'inline' = 'default';

  /**
   * Define se o badge deve ter animação de pulsação.
   */
  @Prop() pulsate: boolean = false;

  render() {
    if (this.hidden) {
      return null;
    }

    return (
      <Host class="alc-badge-wrapper">
        <slot></slot>
        {(this.dot || this.label) && (
          <span
            {...test('data-test-badge-span')}
            class={
              `alc-badge alc-badge--${this.color} 
              ${this.dot ? 'alc-badge--dot' : ''} 
              ${this.count ? 'alc-badge--count' : ''}
              ${this.outlined ? 'alc-badge--outlined' : ''} alc-badge--${this.position}
              ${this.pulsate ? 'alc-badge--pulsate' : ''}`}
          >
            {!this.dot && this.label}
          </span>
        )}
      </Host>
    );
  }
}