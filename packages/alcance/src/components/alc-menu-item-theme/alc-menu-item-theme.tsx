import { Component, Host, Listen, State, h, Event, EventEmitter } from '@stencil/core';
import { getAppliedTheme, setAppliedTheme, loadUserPreference, saveUserPreference } from '../utils/theme';

/**
 * @internal
 */
@Component({
  tag: 'alc-menu-item-theme',
  styleUrl: 'alc-menu-item-theme.css',
  shadow: false,
})
export class AlcMenuItemTheme {
  // Estado para controlar se o tema escuro está ativado
  @State() checked: boolean = false;

  @Event({ eventName: 'alc-select', bubbles: true, cancelable: false })
  alcSelect: EventEmitter<{
    originalEvent: MouseEvent | KeyboardEvent;
    theme: string
  }>;

  // Constantes para os temas
  private readonly DARK_THEME = 'dark';
  private readonly LIGHT_THEME = 'light';

  // Referência ao elemento alc-menu-item filho
  private menuItemRef: HTMLAlcMenuItemElement;

  // Listener para o evento 'alc-select', alterna o tema entre claro e escuro.
  @Listen('alc-select')
  handleClick(e: CustomEvent): void {
    // Verifica se o evento vem do alc-menu-item filho específico usando ref
    if (e.target === this.menuItemRef) {
      e.stopPropagation(); // Impede que o evento se propague para outros componentes
      const theme = this.toggleTheme();
      // Dispara o mesmo evento 'alc-select' com o tema atualizado,
      // para que outros componentes possam reagir à mudança de tema
      this.alcSelect.emit({ ...e.detail, theme });
    }
  }

  // Alterna o tema entre claro e escuro.
  private toggleTheme(): string {
    this.checked = !this.checked;
    const theme = this.checked ? this.DARK_THEME : this.LIGHT_THEME;
    setAppliedTheme(theme);
    saveUserPreference(theme);
    return theme;
  }

  // Define o estado inicial do tema com base na preferência do usuário ou no tema do sistema.
  componentWillLoad(): void {
    const userPreference = loadUserPreference();

    switch (userPreference) {
      case this.LIGHT_THEME:
        this.checked = false;
        break;
      case this.DARK_THEME:
        this.checked = true;
        break;
      default:
        // Se o tema do sistema for dark, então checked 'true' se não 'false'.
        this.checked = getAppliedTheme('system') === this.DARK_THEME;
        break;
    }
  }

  render() {
    return (
      <Host>
        <alc-menu-item type="checkbox" checked={this.checked} ref={el => this.menuItemRef = el}>
          <alc-icon icon="moon" label="" slot="prefix"></alc-icon>
          Ver no tema escuro
        </alc-menu-item>
      </Host>
    );
  }
}
