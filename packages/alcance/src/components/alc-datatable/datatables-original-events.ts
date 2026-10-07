import { AlcDatatable } from "./alc-datatable";

const dtEvents = [];

// Decorator @OriginalEvent
// Inclui o evento em dtEvents com os valores informados no decorator
function OriginalEvent(value: {
  name: string,
  cancelable?: boolean,
  detail: Array<string>
} = {
  name: '',
  cancelable: true,
  detail: []
}) {
  // Função decoradora:
  // Inclui em dtEvents um objeto que é o objeto passado como
  // parâmetro (value) acrescido da chave `emitterName`.
  function addEvent (_componentPrototype: any, emitterName: string) {
    dtEvents.push({...value, emitterName: emitterName});
  };
  return addEvent;
}

// Essa função registra os listeners para todos os eventos listados em dtEvents.
// Quando um evento de dtEvent é capturado (disparado pelo DataTables.net),
// ele dispara o evento equivalente usando eventos próprios do nosso componente.
// Esquema simplificado: on('draw.dt') --> draw.emit()
function addOriginalEventsListeners(DataTable, domTable: HTMLTableElement, component: AlcDatatable) {
  dtEvents.forEach(eventData => {
    // Registra o listener para o evento disparado pelo DataTables.net
    // `args` são específicos de cada evento
    DataTable.$(domTable).on(`${eventData.name}.dt`, (...receivedParams) => {
      // Os eventos do DataTables.net sempre contém o jQueryEvent no primeiro parâmetro
      const jQueryEvent = receivedParams[0];
      const emitterName = eventData.emitterName;

      // Cria o objeto detail com as chaves definidas em event.detail
      // e os parâmetros recebidos
      const detailWithParams = {};
      eventData.detail.forEach((key: string, index: number) => {
        detailWithParams[key] = receivedParams[index];
      });

      // Emite o evento do Alcance
      // Por exemplo, se `emitterName` = `draw`, vai disparar esse evento,
      // informando os detalhes obtidos:
      //   component['draw'].emit({e, settings})
      const { defaultPrevented } = component[emitterName].emit(detailWithParams);
      // Se foi cancelado e pode ser cancelado, cancela o evento original.
      if (defaultPrevented && eventData.cancelable) {
        jQueryEvent?.preventDefault();
      }
    });
  });
}

export { OriginalEvent, addOriginalEventsListeners };