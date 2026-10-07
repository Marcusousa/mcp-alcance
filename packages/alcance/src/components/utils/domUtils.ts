export function childText(element: HTMLElement): string {
    return element
      ? [].slice.call(element.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.nodeValue.trim())
        .join(' ')
      : '';
  }
  
  export function createIcon(name: string, label?: string): HTMLAlcIconElement {
    const icon = document.createElement('alc-icon');
    icon.setAttribute('name', name);
    icon.setAttribute('label', label ? label : '');
    return icon;
  }