import { applyPolyfills, defineCustomElements } from "alcance/loader";
import "alcance/dist/alcance/alcance.css";

interface InitOptions {
  resourcesUrl?: string;
}

const defaultOptions: InitOptions = {
  resourcesUrl: `${window.location.origin}/`,
};

export function ComponentLibrary(userOptions: InitOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };

  applyPolyfills().then(() => {
    defineCustomElements(window, {
      resourcesUrl: options.resourcesUrl,
    });
  });
}
