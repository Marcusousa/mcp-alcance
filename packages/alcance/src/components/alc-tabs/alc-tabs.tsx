import { Component, Host, h, Element, Prop, Listen, Watch, State, Event, EventEmitter, Method, forceUpdate } from '@stencil/core';

import { TabButtonClickEventDetail } from '../alc-tab-button/alc-tab-button-interface';
import logger from '../utils/logger';

export interface AlcTabsDidChangeEventTypes {
  tab: string
}

@Component({
  tag: 'alc-tabs',
  styleUrl: 'alc-tabs.css',
  scoped: false
})
export class AlcTabs {

  private hasButtonSlot: boolean;

  private selectedTabButton?: HTMLAlcTabButtonElement = null;

  private tabList: HTMLDivElement = null;

  private mo: MutationObserver;

  /**
   * O identificador da tab atualmente selecionada
   */
  @Prop({ mutable: true, reflect: true }) selected: string;

  @Watch('selected')
  selectedChange(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.select(newValue);
    }
  }

  @Element() el!: HTMLAlcTabsElement;

  @State() selectedTab?: HTMLAlcTabElement = null;

  @State() hasScroll = false;

  /**
   * Disparado quando houve uma mudança de tab
   */
  @Event({
    eventName: 'alc-change'
  }) alcChange!: EventEmitter<{
    tab: string
  }>;

  /**
   * Seleciona uma tab pelo valor de sua propriedade `tab` ou pela referência do elemento.
   *
   * @param tab A tab a ser selecionada. Se passada como string, deve ser o valor da propriedade `tab` da tab.
   */
  @Method()
  async select(tab: string | HTMLAlcTabElement): Promise<boolean> {
    const selectedTab = getTab(this.tabs, tab);
    if (!this.shouldSwitch(selectedTab)) {
      return false;
    }
    const selectedTabButton = getTabButton(this.tabButtons, selectedTab.getAttribute('tab'));
    this.tabSwitch(selectedTab, selectedTabButton);

    this.selected = selectedTab.getAttribute('tab');
    return true;
  }

  private tabSwitch(selectedTab: HTMLAlcTabElement, selectedTabButton: HTMLAlcTabButtonElement) {
    const leavingTab = this.selectedTab;
    const leavingTabButton = this.selectedTabButton;
    this.selectedTab = selectedTab;
    this.selectedTabButton = selectedTabButton;

    selectedTab.selected = true;
    selectedTabButton.selected = true;

    if (leavingTab !== selectedTab) {
      if (leavingTab) {
        leavingTab.selected = false;
        this.alcChange.emit({ tab: selectedTab.tab });
      }
      if (leavingTabButton) {
        leavingTabButton.selected = false;
      }
    }
  }

  // Evento disparado por alc-tab-button
  @Listen('alc-click')
  selectedHandler(e: CustomEvent) {
    this.select(e.detail.tab);
  }

  @Listen('alc-next')
  selectedNextButton(e: CustomEvent) {
    this.onTabButtonNext(e)
  }

  @Listen('alc-previous')
  selectedPreviousButton(e: CustomEvent) {
    this.onTabButtonPrevious(e)
  }

  @Listen('alc-first')
  selectedFirstButton(e: CustomEvent) {
    this.onTabButtonFirst(e);
  }

  @Listen('alc-last')
  selectedLastButton(e: CustomEvent) {
    this.onTabButtonLast(e);
  }

  private shouldSwitch(selectedTab: HTMLAlcTabElement | undefined): selectedTab is HTMLAlcTabElement {
    const leavingTab = this.selectedTab;
    return selectedTab !== undefined && selectedTab !== leavingTab;
  }

  private get tabs() {
    let tabs = Array.from(this.el.querySelectorAll('alc-tab'));
    tabs = tabs.filter(t => t.closest('alc-tabs') === this.el);
    logger.log('my tabs are', tabs, this.el);
    return tabs;
  }

  private get tabButtons() {
    let tabButtons = Array.from(this.el.querySelectorAll('alc-tab-button'));
    tabButtons = tabButtons.filter(b => b.closest('alc-tabs') === this.el)
    return tabButtons;
  }

  private getNextButton(button: HTMLAlcTabButtonElement ) {

    let nextIndex: number;
    const buttonIndex = this.tabButtons.findIndex(b => b === button);

    // Último -> primeiro
    if (buttonIndex === this.tabButtons.length - 1) {
      nextIndex = 0;
    }
    else {
      nextIndex = buttonIndex + 1;
    }

    return this.tabButtons[nextIndex];
  }

  private getPreviousButton(button: HTMLAlcTabButtonElement ) {

    let previousIndex: number;
    const buttonIndex = this.tabButtons.findIndex(b => b === button);


    // Primeiro -> último
    if (buttonIndex <= 0) {
      previousIndex = this.tabButtons.length - 1;
    }
    else {
      previousIndex = buttonIndex - 1;
    }

    return this.tabButtons[previousIndex];
  }

  private handleScroll() {
    let scrollWidth = 0;
    let width = this.tabList.offsetWidth;
    let overflowX = this.tabList.style.overflowX;

    this.tabList.style.overflowX = 'auto';
    scrollWidth = this.tabList.scrollWidth;
    this.tabList.style.overflowX = overflowX;

    logger.log('width', width, scrollWidth);

    this.hasScroll = scrollWidth > width;
  }

  @Listen('themeLoaded', {
    target: 'window'
  })
  themeLoadedHandler() {
    this.handleScroll();
  }

  async componentDidLoad() {
    // Se selected não tiver sido indicado, a primeira será a inicial
    const initialTab = this.selected || this.tabs[0]?.tab;

    await this.select(initialTab);

    let slotButton = Array.from(this.el.querySelectorAll('[slot="button"]'));
    this.hasButtonSlot = slotButton.some(s => s.closest('alc-tabs') === this.el);
  }

  private onTabClicked = (e: CustomEvent<TabButtonClickEventDetail>) => {
    this.select(e.detail.tab);
  }

  private async onTabButtonNext (e: CustomEvent) {
    if(!this.isValidTabButton(e)) return;
    
    const target = e.target as HTMLAlcTabButtonElement;

    const nextButton = this.getNextButton(target);
    this.handleSelectTabButton(nextButton);
  }

  private async onTabButtonPrevious (e: CustomEvent) {
    if(!this.isValidTabButton(e)) return;

    const target = e.target as HTMLAlcTabButtonElement;

    const previousButton = this.getPreviousButton(target);
    this.handleSelectTabButton(previousButton);
  }

  private async onTabButtonFirst (e: CustomEvent) {
    if(!this.isValidTabButton(e)) return;

    const firstButton = this.tabButtons[0];
    this.handleSelectTabButton(firstButton);
  }

  private async onTabButtonLast (e: CustomEvent) {
    if(!this.isValidTabButton(e)) return;

    const lastButton = this.tabButtons[this.tabButtons.length - 1];
    this.handleSelectTabButton(lastButton);
  }

  private async handleSelectTabButton(tab: HTMLAlcTabButtonElement) {
    const changed = await this.select(tab.tab);
    if (changed) {
      tab.querySelector('button').focus();
    }
  }

  private isValidTabButton(e: CustomEvent) {
    const target = e.target as HTMLAlcTabButtonElement;
    return Array.from(this.tabButtons).includes(target);
  }

  componentDidRender() {

    /*
     O trecho abaixo permite que o componente seja atualizado
     sempre que houver mudanças no conteúdo (como a inclusão de "fihos").
     Isso foi feito para permitir, por exemplo, que uma tab seja
     adicionada pela simples manipulação do DOM.
     */
    this.mo?.disconnect();
    this.mo = new MutationObserver(() => {
      forceUpdate(this.el);
    });
    this.mo.observe(this.el, {childList: true});
    this.mo.observe(this.el.querySelector('.alc-tabs'), {childList: true});


    this.tabs.map((tab, i) => {
      const tabpanel = tab.querySelector('[role="tabpanel"]');

      if (this.tabButtons.length <= i) {
        return;
      }

      const button = this.tabButtons[i].querySelector('button');

      if (!tabpanel.hasAttribute('id')) {
        tabpanel.setAttribute('id', `tab_${i}`);
      }
      if (!button.hasAttribute('id')) {
        button.setAttribute('id', `button_${i}`);
      }

      tabpanel.setAttribute('aria-labelledby', button.getAttribute('id'));
      button.setAttribute('aria-controls', tabpanel.getAttribute('id'));
    });

    // this.handleScroll();
  }

  disconnectedCallback() {
    this.mo?.disconnect();
  }

  render() {

    let tabList: Array<HTMLElement>;

    if (!this.hasButtonSlot) {
      tabList = this.tabs.map((tab) => {
        // Não parece ser um boa ideia criar esses elementos dinamicamente, dessa forma
        // Fazendo assim, a inclusão de uma nova tab no DOM, por exemplo, não
        // reflete automaticamente aqui, porque não ocorre o "render".
        return (
          <alc-tab-button tab={tab.tab}>
            {tab.label}
          </alc-tab-button>
        );
      });
    }

    logger.log('rendering', this.el, tabList);

    return (
      <Host
        onAlcTabButtonClick={this.onTabClicked}
        onAlcTabButtonNext={this.onTabButtonNext.bind(this)}
        onAlcTabButtonPrevious={this.onTabButtonPrevious.bind(this)}
      >
        <div class="alc-tabs">

          <alc-scroll-panel hasFocus={false} scrollToElement={this.selectedTabButton} >
            <div role="tablist" ref={el => this.tabList = el} class="alc-tabs__tab-list">
              <slot name="button" />
              {tabList}
            </div>
          </alc-scroll-panel>

          <slot />
        </div>

      </Host>
    );
  }

}

const getTab = (tabs: HTMLAlcTabElement[], tab: string | HTMLAlcTabElement): HTMLAlcTabElement | undefined => {
  const tabEl = (typeof tab === 'string')
    ? tabs.find(t => t.tab === tab)
    : tab;

  if (!tabEl) {
    logger.error(`tab with id: "${tabEl}" does not exist`);
  }
  return tabEl;
};

const getTabButton = (buttons: HTMLAlcTabButtonElement[], tab: string): HTMLAlcTabButtonElement | undefined => {

  const buttonEl = buttons.find(b => b.tab === tab);

  if (!buttonEl) {
    logger.error(`tab button with id: "${buttonEl}" does not exist`);
  }
  return buttonEl;
};

