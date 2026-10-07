export function isClickOutside(event: MouseEvent, host: HTMLElement) {
    let target = event.target as Node;
    const hasShadow = (target as HTMLElement).shadowRoot != null;
    const composedPath = hasShadow ? event.composedPath() : [];
    do {
      if (target === host) {
        return false;
      }
      if (hasShadow) {
        // @ts-ignore
        target = composedPath.shift();
      } else {
        target = target.parentNode;
      }
    } while (target);
    return true;
  }
