// Lista de classes que sempre estarão presentes na distribuição
// https://tailwindcss.com/docs/optimizing-for-production#safelisting-specific-classes

/*
  A ideia aqui é ter um ponto onde se possa colocar todas as classes do Tailwind
  que estarão disponíveis para os desenvolvedores usando o Alcance.
  Consideramos, portanto, que as classes do Alcance são um subconjunto das
  possíveis classes do Tailwind.
  Não podemos oferecer todas as classes do Tailwind pelos motivos principais de:
  - Criar, efetivamente, um Design System, e não somente uma lista enorme de
    classes com as quais se pode fazer praticamente tudo
  - Reduzir o tamanho do CSS oferecido pelo Alcance. Oferecer tudo o que o
  Tailwind oferece por padrão resulta em mais de 3MB de CSS - o que pode
  ser considerado excessivamente grande.

  21/9/2021:
  Essa é uma versão simples, um mero exemplo da ideia. Certamente, essa solução
  (a forma como a "safelist" é montada aqui) vai precisar evoluir para ser mais manutenível.

*/

const paddings = [
  'p-0',
  'p-1',
  'p-2',
];

const margins = [
  'm-0',
  'm-1',
  'm-2',
  'm-3',
  'm-4',
  'm-5',
  'm-6',
  'm-7',
  'm-8',
  'm-9',
];

const safelist = [
  ...paddings,
  ...margins,
];


module.exports = safelist;