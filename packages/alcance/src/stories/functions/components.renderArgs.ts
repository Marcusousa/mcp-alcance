import getDefaultArgs from './components.defaultArgs';

export const render = (argTypes: any, args: any) => {
  const defaultArgs = getDefaultArgs(argTypes);

  return Object.keys(argTypes)
    // Cada entrada (chave) em argTypes é o nome de um atributo (argName)
    .map(argName => {
      const defaultValue = defaultArgs[argName];
      const value = args[argName];

      // Não renderiza nada se não possuir valor informado para o story
      if (value === undefined) {
        return '';
      }

      // Se o valor default for igual ao valor associado não inclui o atributo
      if (value === defaultValue) {
        return '';
      }

      // Regra geral, inclui o atributo com seu valor
      return `${argName}='${value}'`;
    })
    .join(' ')
    .trim();
  };
