import DataTableDefault from 'datatables.net';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import portugues from 'datatables.net-plugins/i18n/pt-BR.mjs';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// Retorna todos os formatos de data considerados válidos.
function getAllDateFormats(): Array<string> {
  const dateFormats = ["DD/MM/YYYY", "DD/MM/YY", "D/M/YYYY", "D/M/YY", "DD/M/YYYY", "DD/M/YY", "D/MM/YYYY", "D/MM/YY"];

  const timeFormats = dateFormats.reduce( (array, dateFormat) => {
    return [...array, `${dateFormat} HH:mm:ss`, `${dateFormat} HH:mm`, `${dateFormat} HH:mm:ss.S`, `${dateFormat} HH:mm:ss.SS`, `${dateFormat} HH:mm:ss.SSS`]
  }, []);

  return [...dateFormats, ...timeFormats];
}

// Preserva os formatos e a interpretação local que o tipo br-data já aceitava.
function parseDate(data: unknown, formats: Array<string>) {
  if (Object.prototype.toString.call(data) === '[object Date]') {
    return dayjs(data as Date);
  }

  // O parsing estrito do Day.js faz round-trip por format(), que só suporta SSS.
  let normalized = String(data).replace(/(\d{2}:\d{2}:\d{2})\.(\d{1,2})$/, (_, time, fraction) => `${time}.${fraction.padEnd(3, '0')}`);
  const nextDay = / 24:00(?::00(?:\.000)?)?$/.test(normalized);
  if (nextDay) {
    normalized = normalized.replace(' 24:', ' 00:');
  }

  // Evita a conversão nativa de anos 0–99 em 1900–1999, mantendo anos bissextos.
  const earlyYear = normalized.match(/^\d{1,2}\/\d{1,2}\/(00\d{2})(?= |$)/);
  if (earlyYear) {
    normalized = normalized.replace(/\/00\d{2}(?= |$)/, `/${String(Number(earlyYear[1]) + 400).padStart(4, '0')}`);
  }

  for (const format of formats) {
    // Valida o calendário em UTC para não rejeitar transições de horário de verão.
    // Usa um formato por vez: customParseFormat não preserva UTC ao receber arrays.
    let parsed = dayjs.utc(normalized, format, true);
    if (parsed.isValid()) {
      if (nextDay) {
        parsed = parsed.add(1, 'day');
      }
      const local = new Date(0);
      local.setFullYear(earlyYear ? Number(earlyYear[1]) : parsed.year(), parsed.month(), parsed.date());
      local.setHours(parsed.hour(), parsed.minute(), parsed.second(), parsed.millisecond());
      return dayjs(local);
    }
  }
  return dayjs(NaN);
}

function configureI18nAria() {
  portugues.aria = {
    ...portugues.aria,
    orderableReverse: ': Inverter a ordenação',
    orderableRemove: ': Remover a ordenação',
    orderable: ': Ativar a ordenação'
  };
}

function customizeI18n() {

  const custom = {
    lengthMenu: 'Exibir _MENU_ por página',
    info: 'De _START_ a _END_ de _TOTAL_ itens',
    infoFiltered: '(filtrando _MAX_ itens).',
    infoEmpty: 'Nenhum item'
  };
  // Sobrescreve valores existentes nas chaves correspondentes.
  Object.entries(custom).forEach(([key, value])=> {
    portugues[key] = value;
  });
}

// Configura o tipo 'br-data' no DataTables
// Isso permite que o datatable lide com datas no formato brasileiro.
function configureDateType() {

  const formats = getAllDateFormats();

  // Define o tipo 'br-data' no DataTables
  // https://datatables.net/reference/type/DataTables.Type
  DataTableDefault.type('br-data', {
    // Função de detecção do tipo 'br-data'
    detect: function (data: any) {
      if (data === '') {
        return 'br-data';
      }
      if (parseDate(data, formats).isValid()) {
        return 'br-data';
      }
      return null;
    },
    // Função de ordenação do tipo 'br-data'
    order: {
      pre: function (data: any) {
        // Se o formato é válido, retorna um inteiro (timestamp) para ordenação
        const date = parseDate(data, formats);
        if (date.isValid()) {
          return date.valueOf();
        }
        return data;
      }
    }
  });
}

// Chame as configurações globais aqui
configureI18nAria();
customizeI18n();
configureDateType();

// Obtém o tipo associado ao DataTable.
// Isso será usado em pontos do código (como em métodos públicos)
// em que seja necessário indicar o tipo de DataTable.
type DataTableFactory = typeof DataTableDefault;
// Faz a exportação do DataTable como default.
// Esse módulo faz um import "default" do datatables.net para obter o DataTable.
// Para manter a consistência, faz também o export default desse valor.
export default DataTableDefault;
export { portugues, type DataTableFactory };
