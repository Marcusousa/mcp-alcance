// Define os tamanhos de tela seguindo o padrão do Bootstrap 5
const screens = {
  'mobile': '430px',
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

// Larguras de borda adicionais utilizadas pelo projeto
const borderWidth = {
  '1': '1px',
  '2': '2px',
  '3': '3px',
  '4': '4px',
  '5': '5px',
  '6': '6px',
  '7': '7px',
  '8': '8px',
};

// Escala de radius do Design System (--alc-radius-*)
const borderRadius = {
  none: '0px',
  DEFAULT: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

// Escala de peso de fonte do Design System (--font-weight-*)
const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Exporta as constantes para que possam ser importadas em outros arquivos
export { borderRadius, borderWidth, fontSize, fontWeight, screens };

