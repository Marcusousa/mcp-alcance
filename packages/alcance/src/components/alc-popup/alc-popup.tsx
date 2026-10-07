import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { computePosition, flip, shift, autoUpdate, size, offset, arrow } from '@floating-ui/dom';
import test from '../utils/testAttributes';

export type PopupPlacement =
  'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

/**
 * @slot DEFAULT - Slot para o elemento principal do popup.
 *
 * @slot anchor - Slot que serve como âncora e aciona a abertura do popup.
*/

@Component({
  tag: 'alc-popup',
  styleUrl: 'alc-popup.css',
  shadow: false,
})
export class AlcPopup {
  private popupEl: HTMLElement;
  private anchorEl: HTMLElement;
  private cleanup: ReturnType<typeof autoUpdate> | undefined;
  private padding = 8;
  private arrowEl: HTMLElement;

  /**
  * Aciona a abertura do popup.
  */
  @Prop({ reflect: true, mutable: true }) active: boolean = false;

  /**
  * Define o posicionamento do popup.
  */
  @Prop({ reflect: true }) placement: PopupPlacement = 'bottom';

  /**
  * Quando definido como `true`, troca o posicionamento (placement) do popup para mantê-lo visível.
  */
  @Prop({ reflect: true }) flip: boolean = false;

  /**
  * Quando definido como `true`, desloca o popup ao longo do eixo para mantê-lo visível quando cortado.
  */
  @Prop({ reflect: true }) shift: boolean = false;

  /**
  * Determina como o pop-up é posicionado. A estratégia `absoluta` funciona bem na maioria dos casos.
  * Se o overflow cortar o popup, usar a posição `fixed` muitas vezes pode contornar isso.
  */
  @Prop({ reflect: true }) strategy: 'absolute' | 'fixed' = 'absolute';

  /**
  * Define a distância entre o popup e âncora.
  */
  @Prop({ reflect: true }) distance: number = 0;

  /** Syncs the popup's width or height to that of the anchor element. */
  @Prop({ reflect: true }) sync: 'width' | 'height' | 'both' = null;

  /**
  *  Adiciona arrow no popup.
  */
  @Prop({ reflect: true }) arrow: boolean = false;

  @Watch('active')
  watchActive(newValue: boolean) {
    if (newValue) {
      // Ao ativar, start;
      this.start();
    }
    else {
      // Ao desativar, cleanup
      if (this.cleanup) {
        this.cleanup();
      }
    }
  }

  componentDidLoad() {
    if (this.active) {
      this.start();
    }
  }

  disconnectedCallback() {
    if (this.cleanup) {
      this.cleanup();
    }
  }

  start() {
    if (!this.anchorEl || !this.popupEl) {
      return;
    }

    // autoUpdate retorna uma função para limpar os event listeners
    this.cleanup = autoUpdate(this.anchorEl, this.popupEl, () => {
      this.reposition();
    });
  }

  reposition() {
    const middleware = this.resolveMiddleware();

    computePosition(this.anchorEl, this.popupEl, {
      placement: this.placement,
      middleware,
      strategy: this.strategy,
    }).then(({ x, y, middlewareData, placement }) => {
      // Descobri que aqui da para colocar o 'transform: translate()';
      Object.assign(this.popupEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[placement.split('-')[0]]!;

      if (middlewareData.arrow) {
        const {x, y, centerOffset} = middlewareData.arrow;
        const rotate = { top: 225, right: 315, bottom: 45, left: 135 };

        let top = '';
        let left = '';
        
        const incValue = Math.sign(centerOffset) * -3;

        if (placement === 'bottom' || placement === 'top') {
          left = `${x + incValue}px`
        } else {
          top = `${y + incValue}px`
        }

        // Reseta os valores de top e bottom antes de atribuir o valor a um deles, se não fica os dois valores e buga a posição do arrow.
        Object.assign(this.arrowEl.style, {
          bottom: '',
          right: '',
          top,
          left,
          [staticSide]: `${-this.arrowEl.offsetWidth/2}px`,
          transform: `rotate(${rotate[staticSide]}deg)`
        });
      }

    });
  }

  resolveMiddleware(): Array<any> {
    const padding = this.padding;

    const middleware = [
      offset({ mainAxis: this.distance })
    ];

    // Aqui temos as funções prontas do floating-ui mas podemos customizar e/ou criar se for necessário.
    if (this.flip) {
      middleware.push(
        flip({
          padding: padding,
        })
      )
    }

    // middleware.push(
    //   size({
    //     apply({rects, availableWidth, availableHeight, elements}) {
    //       Object.assign(elements.floating.style, {
    //         maxWidth: `${availableWidth - padding}px`,
    //         maxHeight: `${availableHeight - padding}px`,
    //         width: `${rects.reference.width}px`,
    //       });
    //     },
    //   }),
    // );


    middleware.push(
      size({
        apply: ({rects, availableWidth, availableHeight, elements}) => {

          if (this.sync) {
            const syncWidth = this.sync === 'width' || this.sync === 'both';
            const syncHeight = this.sync === 'height' || this.sync === 'both';

            Object.assign(elements.floating.style, {
              width: syncWidth ? `${rects.reference.width}px` : '',
              height: syncHeight ? `${rects.reference.width}px` : '',
            });

          } else {
            Object.assign(elements.floating.style, {
              width: '',
              height: '',
            });
          }
          
          // Object.assign(elements.floating.style, {
          //   maxWidth: `${availableWidth - padding}px`,
          //   maxHeight: `${availableHeight - padding}px`,
          // });
          
        }
      })
    );


    if (this.shift) {
      middleware.push(shift({padding: padding}))
    }

    if (this.arrow) {
      middleware.push(arrow({element: this.arrowEl}))
    }

    return middleware;
  }


  render() {
    return (
      <Host>
        <div ref={(el: HTMLElement) => this.anchorEl = el} {...test('data-test-popup-anchor')}  >
          <slot name="anchor"></slot>
        </div>
        <div
          class={{
            'alc-popup__content': true,
            'alc-popup__content--active': this.active,
            'alc-popup__content--fixed': this.strategy === 'fixed',
          }}
          ref={(el: HTMLElement) => this.popupEl = el}
          {...test('data-test-popup-content')}
        >
          <slot></slot>
          <div 
            ref={(el: HTMLElement) => this.arrowEl = el} 
            class={this.arrow ? 'alc-popup__arrow' : ''} 
            {...test('data-test-popup-arrow')}  
          >
          </div>
        </div>
      </Host>
    );
  }
}

