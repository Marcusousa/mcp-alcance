import React from 'react';

/*
  Para ser usado em imagens dentro das página de documentação,
  quando for necessário distinguí-las do restante do conteúdo.
  Proporciona uma separação visual para imagens.
 */
export const ImageCard = ({ children }) => {
  return (
    <div style={{
      border: '1px solid var(--alc-color-border)',
      borderRadius: 'var(--alc-radius-default)',
      padding: 'var(--alc-spacing-05)',
      display: 'flex',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  );
};
