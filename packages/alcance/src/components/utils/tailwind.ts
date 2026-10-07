/*
  Esse arquivo é uma cópia de
  packages/alcance/src/utils/tailwind.js (mesmo conteúdo, mas com extensão .ts)
  Ele foi criado para que os testes automatizados (spec) funcionem corretamente,
  já que dava erro usando o arquivo mencionado acima.
  Não é a solução ideal, mas não vamos investir tempo refatorando isso agora.
  @TODO: Evitar essa duplicação ao atualizar o Tailwind.
 */

// -- ABAIXO DESSA LINHA, CONTEÚDO DE packages/alcance/src/utils/tailwind.js --

// Define os tamanhos de tela seguindo o padrão do Bootstrap 5
const screens = {
    'sm': '576px',
    'md': '768px',
    'lg': '992px',
    'xl': '1200px',
    '2xl': '1400px',
};

// Define os tamanhos de texto
const fontSize = {
    'xs': ['0.75rem', '1rem'],    // 12/16
    'sm': ['0.875rem', '1rem'],   // 14/16
    'base': ['1rem', '1.5rem'],   // 16/24
    'lg': ['1.125rem', '1.5rem'], // 18/24
    'xl': ['1.25rem', '1.5rem'],  // 20/24
    '2xl': ['1.375rem', '2rem'],  // 22/32
    '3xl': ['1.625rem', '2rem'],   // 26/32
    '4xl': ['2rem', '2.5rem'],    // 32/40
    '5xl': ['2.5rem', '3rem'],    // 40/48
    '6xl': ['3rem', '3.5rem'],    // 48/56
};

// Exporta as constantes para que possam ser importadas em outros arquivos
export { screens, fontSize };
