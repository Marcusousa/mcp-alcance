export const getFocusableElements = (element: HTMLElement) => {
    const focusableElements = getAllFocusableElements(element);
    // Retorna somente elementos visíveis
    // Valida se o elemento possui tabindex de qualquer valor negativo e adiciona à lista de filtrados
    return focusableElements.filter(element => {
        const el = element as HTMLElement;
        return el.offsetParent !== null && !(el.hasAttribute('tabindex') && parseInt(el.getAttribute('tabindex') || '0') < 0);
    });
}

// Pega todos os elementos focaveis, inclusive invisíveis e com tabindex negativo 
// Pegar elementos invisíveis são úteis quando estão dentro de componentes que não foram renderizados, como a modal fechada.
// E tabindex negativo é usado para controlar o foco manualmente e, para isso, queremos pegar esses elementos.
export const getAllFocusableElements = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex], [contenteditable]:not([contenteditable="false"])',
    );

    // Converte NodeList para Array
    return Array.from(focusableElements);
}

export const focusFirstElement = (focusableElements: Element[]) => {
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement.focus();
    }
}

export const handleKeyDown = (event: KeyboardEvent, focusableElements: Element[]) => {
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (focusableElements.length === 1) {
            firstElement.focus();
            return event.preventDefault();
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            return event.preventDefault();
        }

        if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            return event.preventDefault();
        }

    }
}
