const state = {
    id: 0
}

export const getUniqueId = (): string => {
    let uniqueId = '';

    // Cria o uniqueId, incrementa o id e verifica se ja existe esse uniqueId na página.
    // Se existe então tenta novamente com o novo id.
    do {
        uniqueId = `alc-id-${state.id}`;
        state.id++;
    } while (document.querySelector(`#${uniqueId}`));

    return uniqueId;
}