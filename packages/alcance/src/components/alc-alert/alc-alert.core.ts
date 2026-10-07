import { AnyFunction, Type } from './index';
import logger from '../utils/logger';

const noop: AnyFunction = () => {};

const setup = (value, domain = [], defaultValue) => {

  if (value === undefined) {
    return defaultValue;
  }

  if (!domain.includes(value)) {
    logger.warn(`"${value}" não é um valor válido; usando o valor padrão "${defaultValue}"`);
    return defaultValue;
  }

  return value;
}

const domains = {
  type: ['info', 'warning', 'error', 'success'],
  dismissible: [true, false],
  visible: [true, false]
}

const defaults = {
  type: 'info' as Type,
  dismissible: true,
  visible: true
}

const setupType = value => setup(value, domains.type, defaults.type);
const setupDismissible = value => setup(value, domains.dismissible, defaults.dismissible)
const setupVisible = value => setup(value, domains.visible, defaults.visible);

class AlertCore {

  // Tipo do alert
  type: Type = 'info';
  // Indica se o alert pode ou não ser dispensado
  dismissible = true;
  // Indica se o alerta está ou não visível
  visible = true;
  // Ajusta a visibilidade do alert
  setVisible: AnyFunction = noop;
  // Dispara o evento alc-hide
  dispatchHide: AnyFunction = noop;
  // Dispara o evento alc-after-hide
  dispatchAfterHide: AnyFunction = noop;

  constructor({
    type = defaults.type,
    dismissible = defaults.dismissible,
    visible = defaults.visible,
    dispatchHide = noop,
    dispatchAfterHide = noop,
    setVisible = noop
  }) {

    this.type = setupType(type);
    this.dismissible = setupDismissible(dismissible);
    this.dispatchAfterHide = dispatchAfterHide;
    this.dispatchHide = dispatchHide;

    this.setVisible = visible => {
      this.visible = visible;
      setVisible(visible);
    }
    this.setVisible(setupVisible(visible));
  };

  hide = () => {
    if (!this.visible) {
      return false;
    }
    const { defaultPrevented } = this.dispatchHide();
    if (defaultPrevented) {
      return false;
    }

    this.setVisible(false);
    this.dispatchAfterHide();
    return true;
  };

  show = () => {
    if (!this.visible) {
      this.setVisible(true);
      return true;
    }
    return false;
  }
}

export { AlertCore, defaults };
