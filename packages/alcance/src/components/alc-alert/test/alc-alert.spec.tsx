import { render, h, describe, it, expect } from '@stencil/vitest';
import { AlertCore } from '../alc-alert.core';

// yarn stencil-test --project spec alc-alert.spec.tsx

describe('alc-alert', () => {

  it('Pode ser fechado uma e somente uma vez', async () => {
    let hide: boolean;

    const { root } = await render<HTMLAlcAlertElement>(
      <alc-alert></alc-alert>
    );

    // Chama o método hide() e espera que o retorno seja true
    hide = await root.hide();
    expect(hide).toBe(true);

    // Chama o método hide() e espera que o retorno seja false
    // pois essa é a segunda chamada do método.
    hide = await root.hide();
    expect(hide).toBe(false);
  });

  /* @OBS Apesar de isso ser considerado teste de unidade, há uma zona cinza aqui.
   * Porque estamos indo até o DOM (ainda que seja um DOM "fake") para verificar
   * a existência de um botão.
   * A ideia de separar em camadas (uma camada para o core do componente, e outra
   * que manipula o DOM) é justamente ter testes de unidade mais "puros".
   */
  it('Não possui o botão para dispensar', async () => {
    const { root } = await render<HTMLAlcAlertElement>(
      <alc-alert dismissible={false}></alc-alert>
    );

    // Procura por button.dismiss dentro do componente.
    // Será true se houver um (ou mais!)
    const hasDismissButton = root.querySelectorAll('[data-test-dismiss]').length > 0;

    // O esperado é que o alert não tenha esse botão
    expect(hasDismissButton).toBe(false);
  });

  it('Dispara os eventos alc-hide e alc-after-hide ao trocar o valor de visible', async () => {
    const { spyOnEvent, setProps } = await render<HTMLAlcAlertElement>(
      <alc-alert>Mensagem</alc-alert>
    );

    const hideHandler = spyOnEvent('alc-hide');
    const afterHideHandler = spyOnEvent('alc-after-hide');

    await setProps({ visible: false });

    expect(hideHandler).toHaveReceivedEvent();
    expect(afterHideHandler).toHaveReceivedEvent();
  });

});

/* @OBS Esse teste é um teste de unidade mais "puro", que utiliza o core
 * do componente, e não o componente em si.
 * É possível ver que não há nada de DOM aqui, mas é possível testar
 * até mesmo se o código que controla o disparo do evento é chamado.
 */
describe('alc-alert-core', () => {

  it('Pode ser dispensado uma e somente uma vez', () => {
    let hide = false,
        hideEmited = false,
        visible = true;

    // Instancia o AlertCore
    const alert = new AlertCore({
      dispatchAfterHide: () => {
        hideEmited = true;
      },
      dispatchHide: () => {
        return {
          defaultPrevented: false
        };
      },
      setVisible: (newVisible) => {
        visible = newVisible;
      }
    });

    // Teste de um estado. No caso, visible
    expect(visible).toBe(true);

    // Chama o método hide para verificar...
    hide = alert.hide();
    expect(hide).toBe(true); // ... o retorno do método
    expect(hideEmited).toBe(true); // ... o disparo do evento
    expect(visible).toBe(false); // ... o estado da instância

    // Prepara e chama novamente o método
    hideEmited = false;
    hide = alert.hide();
    expect(hide).toBe(false);
    expect(hideEmited).toBe(false);
  });
});
