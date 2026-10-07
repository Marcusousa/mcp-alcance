import { Build, Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import logger from '../utils/logger';
import { getSvgContent, alciconContent } from './request';
import { /* getName , */ getUrl, inheritAttributes } from './utils';

@Component({
  tag: 'alc-icon',
  styleUrl: 'alc-icon.css',
  assetsDirs: ['../../src/assets/icons'],
  scoped: false,
})
export class AlcIcon {
  private io?: IntersectionObserver;
  private iconName: string | null = null;
  private inheritedAttributes: { [k: string]: any } = {};
  private role: 'img' | 'presentation' = 'img';

  @Element() el!: HTMLElement;

  @State() private svgContent?: string;
  @State() private isVisible = false;
  @State() private ariaLabel?: string;

  /**
   * Equivalente textual do ícone. Seu uso é semelhante ao atributo `alt` de uma imagem.
   * Esse texto será lido por software leitor de tela, e utilizado no lugar do ícone se por qualquer motivo a imagem não puder ser carregada no navegador.
   */
  @Prop({ reflect: true }) label!: string;

  /**
   * Define se o ícone deve ser espelhado horizontalmente quando `dir` for `"rtl"`.
   */
  @Prop({ reflect: true }) flipRtl?: boolean = false;

  /**
   * Nome do ícone que será mostrado. Deve ser um dos nomes de ícone da biblioteca.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * Especifica o `src` de um arquivo SVG a ser usado como ícone.
   */
  @Prop({ reflect: true }) src?: string;

  /**
   * Uma combinação de `name` e `src`.
   * Se o valor for entendido como a URL de um `src`, ele definirá a propriedade `src`.
   * Caso contrário, assume-se como o nome de ícone da biblioteca, e define a propriedade `name`.
   */
  @Prop({ reflect: true }) icon?: string;

  /**
   * Se ativado, a carga do ícone ocorrerá somente quando o componente estiver visível na _viewport_.
   */
  @Prop({ reflect: true }) lazy = false;

  /**
   * Quando definido como `true`, o conteúdo SVG obtido via HTTP passará por uma limpeza.
   * Conteúdo que contenha algum elemento `<script>` ou atributo que comece com `on`, como `onclick`, será descartado.
   * Sendo descartado, a imagem não será mostrada.
   * @default false
   */
  @Prop({ reflect: true }) sanitize = false;

  componentWillLoad() {
    this.inheritedAttributes = inheritAttributes(this.el, ['aria-label']);
  }

  connectedCallback() {
    // purposely do not return the promise here because loading
    // the svg file should not hold up loading the app
    // only load the svg if it's visible
    this.waitUntilVisible(this.el, '50px', () => {
      this.isVisible = true;
      this.loadIcon();
    });
  }

  disconnectedCallback() {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  private waitUntilVisible(el: HTMLElement, rootMargin: string, cb: () => void) {
    if (Build.isBrowser && this.lazy && typeof window !== 'undefined' && (window as any).IntersectionObserver) {
      const io = (this.io = new (window as any).IntersectionObserver(
        (data: IntersectionObserverEntry[]) => {
          if (data[0].isIntersecting) {
            io.disconnect();
            this.io = undefined;
            cb();
          }
        },
        { rootMargin },
      ));

      io.observe(el);
    } else {
      // browser doesn't support IntersectionObserver
      // so just fallback to always show it
      cb();
    }
  }
  
  private hasAriaHidden = () => {
    const { el } = this;
    
    return el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true';
  }

  @Watch('label')
  @Watch('name')
  @Watch('src')
  @Watch('icon')
  loadIcon() {
    if (Build.isBrowser && this.isVisible) {
      const url = getUrl(this);
      if (url) {
        if (alciconContent.has(url)) {
          // sync if it's already loaded
          this.svgContent = alciconContent.get(url);
          logger.log(this.svgContent);
        } else {
          // async if it hasn't been loaded
          getSvgContent(url, this.sanitize).then(() => (this.svgContent = alciconContent.get(url)));
        }
      }
    }

    // Se label estiver preenchido
    if (this.label) {
      this.ariaLabel = this.label;
      this.role = 'img';
    }
    // Se label for um string vazio
    else if (this.label === '') {
      this.ariaLabel = undefined;
      this.role = 'presentation';
    }
  }


  render() {
    this.label ?? logger.report('label', this.el.tagName.toLowerCase(), this.el)
    const { label, iconName, ariaLabel, inheritedAttributes, role } = this;
    const flipRtl =
      this.flipRtl ||
      (iconName &&
        (iconName.indexOf('arrow') > -1 || iconName.indexOf('chevron') > -1) &&
        this.flipRtl !== false);

    /**
     * Only set the aria-label if a) we have generated
     * one for the icon and if aria-hidden is not set to "true".
     * If developer wants to set their own aria-label, then
     * inheritedAttributes down below will override whatever
     * default label we have set.
     */
    return (
      <Host
        label={label}
        aria-label={ariaLabel !== undefined && !this.hasAriaHidden() ? ariaLabel : null}
        role={role}
        class={{
          'flip-rtl': !!flipRtl && (this.el.ownerDocument as Document).dir === 'rtl',
        }}
        {...inheritedAttributes}
      >
        {Build.isBrowser && this.svgContent ? (
          <span class="icon-inner" innerHTML={this.svgContent}></span>
        ) : (
          <span class="icon-inner">{label}</span>
        )}
      </Host>
    );
  }
}