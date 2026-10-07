import { validateContent } from './validate';

export const alciconContent = new Map<string, string>();
const requests = new Map<string, Promise<any>>();

/*
 * Originalmente, a função validateContent (importada acima) inseria uma classe
 * no elemento svg obtido. Precisávamos de outra classe (do Alcance, não o ionic),
 * e que essa classe fosse inserida sempre, independentemente de validação.
 * Por isso foi criada essa função aqui. Desse modo, o svg obtido já fica com
 * a classe devida antes de ir para o cache.
 *
 * Obs.: A inclusão da classe dentro da função de validação (como feito originalmente
 * pela equipe do ionic) parece ser um desvio do objetivo da função.
 */
const addSvgClass = (svgContent: string, className: string): string => {
  // Cria container temporário para o svg
  const div = document.createElement('div');
  div.innerHTML = svgContent;
  // Adiciona a classe necessária no svg
  div.querySelector('svg').classList.add(className);
  // Atualiza string HTML do svg.
  return div.innerHTML;
}

export const getSvgContent = (url: string, sanitize: boolean) => {
  // see if we already have a request for this url
  let req = requests.get(url);

  if (!req) {
    if (typeof fetch !== 'undefined' && typeof document !== 'undefined') {
      // we don't already have a request
      req = fetch(url).then((rsp) => {
        if (rsp.ok) {
          return rsp.text().then((svgContent) => {
            if (svgContent && sanitize !== false) {
              svgContent = validateContent(svgContent);
            }
            if (svgContent) {
              svgContent = addSvgClass(svgContent, 'alc-icon__image');
            }
            alciconContent.set(url, svgContent || '');
          });
        }
        alciconContent.set(url, '');
      })
      .catch(() => {
        // Ambiente sem rede (ex: testes node) — define vazio e resolve
        alciconContent.set(url, '');
      });

      // cache for the same requests
      requests.set(url, req);
    } else {
      // set to empty for ssr scenarios and resolve promise
      alciconContent.set(url, '');
      return Promise.resolve();
    }
  }

  return req;
};