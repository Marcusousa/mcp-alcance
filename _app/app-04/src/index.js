// Incluindo CSS global do Alcance
import '@seuso/alcance/dist/alcance/alcance.css';

// Mesmo que não vá usar o setAssetPath, é preciso importar "components".
// Para o setMode funcionar (pegar o tema correto)
// import '@seuso/alcance/dist/components';

// Indica a localização dos assets
// Observe que deve ser informada uma URL absoluta
import { setAssetPath } from '@seuso/alcance/dist/components';
setAssetPath(`${location.origin}/_app/app-04/dist/`);

// Uma forma de fazer é importar o componente e usar
// customElements.define para registrá-lo na página
// Aqui temos o componente alc-alert
import { AlcAlert } from "@seuso/alcance/dist/components/alc-alert";
customElements.define('alc-alert', AlcAlert);

// Outra forma é importar a função defineCustomElement
// e simplesmente fazer a chamada a ela.
// Aqui temos o componente alc-icon
import { defineCustomElement } from "@seuso/alcance/dist/components/alc-icon";
defineCustomElement();

// import { defineCustomElements } from "@seuso/alcance/loader";
// defineCustomElements();