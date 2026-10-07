import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from 'alcance/loader';
import "alcance/dist/alcance/alcance.css"

const defaultOptions = {
  resourcesUrl: `${window.location.origin}/`
}

export const ComponentLibrary: Plugin = {

  /*
    Chamada a partir de Vue.use(ComponentLibrary, {
      resourcesURL: 'http://localhost:8080/'
    });
  */
  async install(app, userOptions) {

    // Sobrescreve as opções padrão pelo que foi informado pelo usuário
    let options = {...defaultOptions, ...userOptions};

    applyPolyfills().then(() => {
      defineCustomElements(window, {
        resourcesUrl: options.resourcesUrl
      });
    });
  },
};