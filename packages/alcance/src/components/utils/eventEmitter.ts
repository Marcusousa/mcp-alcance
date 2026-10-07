import { ComponentInterface } from '@stencil/core';

/**
 * Chama `emit` em eventos de componentes duas vezes.
 * Um para o evento legado camel-case e outra para o novo kebab-case.
 * Ex: para o evento `alcChange` irá executar `instance.alcChange.emit()` and `instance.alcChangeLegacy.emit()`.
 * Ele espera que ambas as propriedades decoradas por eventos `alcChange` e `alcChangeLegacy` existam no componente.
 *
 * @param instance {ComponentInterface} - A instância do componente, também conhecida como `this`
 * @param eventKey {string} - A propriedade do evento, por exemplo `alcChange`
 * @param detail {any} - O evento custom `detail`
 * @returns {CustomEvent[]} - O evento emitido
 */
export function emitEvent(instance: ComponentInterface, eventKey: string, detail?: any): CustomEvent[] {
  const legacyKey = eventKey + 'Legacy';
  const emitted = [];
  if (typeof instance[legacyKey] !== 'undefined') {
    // Emite o evento legado camel-case, ex: `alcChange`
    emitted.push(instance[legacyKey].emit(detail));
  }
  // Emite novo padrão de eventos kebab-case, ex: `alc-close`
  emitted.push(instance[eventKey].emit(detail));
  // Retorna ambos
  return emitted;
}
