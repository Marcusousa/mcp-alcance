import React from 'react';

export const TypographyDemo = ({ rows, theme }) => {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const CellTag = cell.heading ? 'th' : 'td';
              const cellStyle = cell.heading
                ? {
                  // Estilos para headings
                    fontSize: 'var(--alc-font-size-sm)',
                    lineHeight: 'var(--alc-font-line-height-sm)',
                    padding: 'var(--alc-spacing-03) var(--alc-spacing-05)',
                    textAlign: 'left',
                  }
                : {
                  // Estilos para células de dados
                    padding: 'var(--alc-spacing-03) var(--alc-spacing-05)',
                    fontSize: 'var(--alc-font-size-lg)',
                    lineHeight: 'var(--alc-font-line-height-lg)',
                    color: `var(${cell.textColor})`,
                    backgroundColor: `var(${cell.backgroundColor})`,
                    border: '1px solid var(--alc-color-border)'
                  };

              return (
                <CellTag
                  key={cellIndex}
                  style={cellStyle}
                  // Não aplica o tema nos headings
                  data-alc-theme={cell.heading ? null : (theme ? theme : "light")}
                >
                  <div>
                    <span>{cell.text ?? 'Thundercats'}</span>
                  </div>
                </CellTag>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
