
let lockCount = 0;
let originalStyled = {
    overflow: '',
    paddingRight: ''
};

// O parametro `useScrollbarGutter` é usado para determinar se o estilo de scrollbar-gutter deve ser aplicado.
// No caso do drawer, por ficar a direta, ficaria um espaçamento ao usar scrollbar-gutter e por padrão fica sobreposto ao scrollbar.
export function lockBodyScroll(): void {
    // Não trata o bloqueio de scroll se estiver no Storybook
    if (window['__ALC_STORYBOOK__']) return;

    lockCount += 1;

    if (lockCount === 1) {
        // documentElement pega o elemento <html> do documento.
        const documentElement = document.documentElement;
        // Pega a largura da barra de rolagem do navegador.
        const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
        const body = document.body;

        // Salva os estilos originais do body para restaurar depois.
        originalStyled = {
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight
        }

        body.style.paddingRight = `${scrollbarWidth}px`;
        body.style.overflow = 'hidden';
    }
}



export function unlockBodyScroll(): void {
    // Não trata o bloqueio de scroll se estiver no Storybook
    if (window['__ALC_STORYBOOK__']) return;

    if (lockCount === 0) return; // proteção extra

    lockCount -= 1;

    if (lockCount === 0) {
        const body = document.body;

        body.style.overflow = originalStyled.overflow;
        body.style.paddingRight = originalStyled.paddingRight;
    }
}
