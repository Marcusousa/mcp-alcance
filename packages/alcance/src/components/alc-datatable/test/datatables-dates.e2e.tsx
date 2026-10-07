import { describe, expect, it, render } from '@stencil/vitest';
import DataTable from '../datatables-setup';

const dateType = DataTable.type('br-data');
const detect = dateType.detect as (value: unknown) => string | null;
const timestamp = dateType.order.pre as (value: unknown) => unknown;

function localTimestamp(year: number, month: number, day: number, hour = 0, minute = 0, second = 0, millisecond = 0) {
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(hour, minute, second, millisecond);
  return date.valueOf();
}

describe('alc-datatable: datas brasileiras', () => {
  const dates = ['02/03/2024', '02/03/24', '2/3/2024', '2/3/24', '02/3/2024', '02/3/24', '2/03/2024', '2/03/24'];
  const times = [
    { suffix: '', hour: 0, minute: 0, second: 0, millisecond: 0 },
    { suffix: ' 12:34', hour: 12, minute: 34, second: 0, millisecond: 0 },
    { suffix: ' 12:34:56', hour: 12, minute: 34, second: 56, millisecond: 0 },
    { suffix: ' 12:34:56.1', hour: 12, minute: 34, second: 56, millisecond: 100 },
    { suffix: ' 12:34:56.12', hour: 12, minute: 34, second: 56, millisecond: 120 },
    { suffix: ' 12:34:56.123', hour: 12, minute: 34, second: 56, millisecond: 123 },
  ];

  it.each(dates.flatMap(date => times.map(time => ({ value: date + time.suffix, ...time }))))(
    'Detecta e ordena $value', ({ value, hour, minute, second, millisecond }) => {
      expect(detect(value)).toBe('br-data');
      expect(timestamp(value)).toBe(localTimestamp(2024, 3, 2, hour, minute, second, millisecond));
    },
  );

  it.each([
    ['29/02/2024', 2024, 2, 29],
    ['01/02/68', 2068, 2, 1],
    ['01/02/69', 1969, 2, 1],
    ['01/02/0000', 0, 2, 1],
    ['29/02/0000', 0, 2, 29],
    ['01/02/0099', 99, 2, 1],
    ['31/12/2024 24:00', 2025, 1, 1],
    ['31/12/2024 24:00:00', 2025, 1, 1],
    ['31/12/2024 24:00:00.0', 2025, 1, 1],
    ['31/12/2024 24:00:00.00', 2025, 1, 1],
    ['31/12/2024 24:00:00.000', 2025, 1, 1],
  ] as const)('Preserva a interpretação de %s', (value, year, month, day) => {
    expect(detect(value)).toBe('br-data');
    expect(timestamp(value)).toBe(localTimestamp(year, month, day));
  });

  it.each([
    '29/02/2023', '29/02/0100', '31/04/2024', '00/01/2024', '01/00/2024', '01/13/2024',
    '2024-03-02', '02-03-2024', ' 02/03/2024', '02/03/2024 ', 'texto',
    '02/03/2024 1:02', '02/03/2024 12:3', '02/03/2024 12:34:60',
    '02/03/2024 24:01', '02/03/2024 24:00:01', '02/03/2024 24:00:00.001',
    '02/03/2024 12:34:56.1234', null, undefined, 0, true,
  ])('Rejeita valor inválido sem modificar o retorno da ordenação: %s', value => {
    expect(detect(value)).toBeNull();
    expect(timestamp(value)).toBe(value);
  });

  it('Preserva células vazias e objetos Date', () => {
    expect(detect('')).toBe('br-data');
    expect(timestamp('')).toBe('');
    const date = new Date(2024, 2, 2, 12, 34, 56, 123);
    expect(detect(date)).toBe('br-data');
    expect(timestamp(date)).toBe(date.valueOf());
    const invalid = new Date(NaN);
    expect(detect(invalid)).toBeNull();
    expect(timestamp(invalid)).toBe(invalid);
  });

  it('Preserva a interpretação local em transições de horário de verão', () => {
    expect(detect('04/11/2018 00:30')).toBe('br-data');
    expect(timestamp('04/11/2018 00:30')).toBe(localTimestamp(2018, 11, 4, 0, 30));
  });

  it('Aceita objetos Date criados em outro contexto', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    try {
      const OtherDate = (frame.contentWindow as Window & typeof globalThis).Date;
      const date = new OtherDate(2024, 2, 2, 12, 34);
      expect(date instanceof Date).toBe(false);
      expect(detect(date)).toBe('br-data');
      expect(timestamp(date)).toBe(date.valueOf());
    } finally {
      frame.remove();
    }
  });

  it.each([
    new String('02/03/2024'),
    ['02/03/2024'],
    { toString: () => '02/03/2024' },
  ])('Preserva a conversão de valores em strings de data: %s', value => {
    expect(detect(value)).toBe('br-data');
    expect(timestamp(value)).toBe(localTimestamp(2024, 3, 2));
  });

  it.each(['inline', 'propriedades'])('Ordena cronologicamente sem alterar a exibição (%s)', async mode => {
    const values = ['01/01/2025', '02/03/2024 12:34:56.12', '31/12/2023', '02/03/2024 12:34:56.1'];
    const expected = [values[2], values[3], values[1], values[0]];
    const content = mode === 'inline'
      ? `<alc-datatable><table><thead><tr><th>Data</th></tr></thead><tbody>${values.map(value => `<tr><td>${value}</td></tr>`).join('')}</tbody></table></alc-datatable>`
      : `<alc-datatable data='${JSON.stringify(values.map(value => [value]))}' options='{"columns":[{"title":"Data"}]}'></alc-datatable>`;
    const { root, waitForChanges } = await render(content);
    const displayed = () => Array.from(root.querySelectorAll('tbody td')).map(cell => cell.textContent.trim());
    expect(displayed()).toEqual(expected);
    root.querySelector<HTMLElement>('thead th').click();
    await waitForChanges();
    expect(displayed()).toEqual([...expected].reverse());
  });
});
