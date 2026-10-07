import { Component, Host, h, State } from '@stencil/core';
import logger from '../utils/logger';
import { getAppliedTheme, setAppliedTheme, loadUserPreference, saveUserPreference, removeUserPreference } from '../utils/theme';
import { getUniqueId } from '../utils/getUniqueId';
import testAttributes from '../utils/testAttributes';

const NO_THEME = 0;
const LIGHT_THEME = 1;
const DARK_THEME = 2;

@Component({
  tag: 'alc-theme',
  styleUrl: 'alc-theme.css',
  scoped: false
})
export class AlcTheme {

  themeLink: HTMLLinkElement;
  selectId: string;

  @State() selectedTheme: number;

  private change(theme: number) {

    logger.log('changed to', theme);
    switch (theme) {
      case LIGHT_THEME:
        setAppliedTheme('light');
        saveUserPreference('light');
        break;
        case DARK_THEME:
        setAppliedTheme('dark');
        saveUserPreference('dark');
        break;
      default:
        setAppliedTheme(getAppliedTheme('system'));
        removeUserPreference();
        break;
    }
    this.selectedTheme = theme;
  }

  private getSelectedValue(select: HTMLSelectElement): number {
    return parseInt(select.selectedOptions[0].value);
  }

  componentWillLoad() {

    const userPreference = loadUserPreference();
    if (userPreference === 'light') {
      this.selectedTheme = LIGHT_THEME;
    }
    else if (userPreference === 'dark') {
      this.selectedTheme = DARK_THEME;
    }
    else {
      this.selectedTheme = NO_THEME;
    }
    this.selectId = getUniqueId();
  }

  render() {

    return (
      <Host>
        <alc-field>
          {/* Label colocado como slot para poder ter seu visual personalizado (sr-only) */}
          <label
            htmlFor={this.selectId}
            slot="label"
            class="alc-theme__label"
            {...testAttributes('data-test-label')}
          >
            Tema
          </label>
          <div>
            <select
              onChange={(e) => this.change(this.getSelectedValue(e.target as HTMLSelectElement))}
              class="alc-theme__select"
              id={this.selectId}
              {...testAttributes('data-test-select')}
            >
              <option value={NO_THEME} selected={this.selectedTheme === NO_THEME}>
                Do Sistema
                {this.selectedTheme === NO_THEME ? ' ✔' : ''}
              </option>
              <option value={LIGHT_THEME} selected={this.selectedTheme === LIGHT_THEME}>
                Claro
                {this.selectedTheme === LIGHT_THEME ? ' ✔' : ''}
              </option>
              <option value={DARK_THEME} selected={this.selectedTheme === DARK_THEME}>
                Escuro
                {this.selectedTheme === DARK_THEME ? ' ✔' : ''}
              </option>
            </select>
          </div>
        </alc-field>
      </Host>
    );
  }

}
