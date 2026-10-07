import logger from '../utils/logger';

const noop = () => {};

const setup = (value, domain = [], defaultValue) => {

  return domain.includes(value) ? value : defaultValue;
}

const domains = {
  type: ['info', 'warning', 'error', 'success'],
  dismissible: [true, false]
}

const defaults = {
  type: 'info',
  dismissible: true
}

const setupType = value => setup(value, domains.type, defaults.type);
const setupDismissible = value => setup(value, domains.dismissible, defaults.dismissible)

class AlertCore {
  visible = true;

  constructor({
    type,
    dismissible,
    dispatchDismiss = noop,
    setVisible = noop
  }) {

    this.type = setupType(type);
    this.dismissible = setupDismissible(dismissible);
    this.dispatchDismiss = dispatchDismiss;
    this.setVisible = visible => {
      logger.debug('setVisible', visible);
      this.visible = visible;
      setVisible(visible);
    }

    this.setVisible(true);
  };

  dismiss = () => {
    if (this.visible) {
      this.setVisible(false);
      this.dispatchDismiss();
      return true;
    }
    return false;
  }
}

export { AlertCore };