export const styles = {
  inlineField: `
  /*
  Neste exemplo estamos utilizando media queries
  para que o field na versão mobile seja no formato padrão
  e em outros tamanho de tela seja no formato inline
  */

  @media (min-width: 576px) {
    /* Estilo de alc-field para esse exemplo específico */
    .inline-field-example alc-field {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }
    /* Estilo da classe definida pela aplicação */
    .inline-field-example__label {
      display: block;
      text-align: right;
      padding-top: 0.5rem;
      width: 10rem;
    }
    /* Estilo de .alc-field__core (definida pelo componente)
       para esse exemplo especifico */
    .inline-field-example .alc-field__core {
      flex-grow: 1;
    }
  }
  `,
  labelIcon: `
  .inline-field-example__icon {
    margin-right: 0.5rem;
  }
  `
}

