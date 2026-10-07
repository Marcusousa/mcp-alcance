import React from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';

/*
  Para ser usado na introdução de cada documento de componente ou de estilo.
  Dá um destaque visual para o parágrafo introdutório.
 */
export const IntroDoc = ({ children }) => {
  return (
    <Unstyled>
      <div style={{marginBottom: '1.5em'}}>
        {children}
      </div>
    </Unstyled>
  );
};
