// @ts-nocheck
import { Build } from '@stencil/core';

const PREFIX = [
  '%cAlcance',
  'color: white;background:#40807e; font-size:10px; padding:2px 4px; border-radius: 2px',
];

const noop = () => {};
const forceDebug = (typeof localStorage !== 'undefined' && localStorage.getItem('alc-debug') === 'true');

// log somente vai pra console se estiver em desenvolvimento
const logFn = () => {
  if (Build.isDev || forceDebug) {
    return console.log.bind(this, ...PREFIX);
  }
  return noop;
}

// debug somente vai pra console se estiver em desenvolvimento
const debugFn = () => {
  if (Build.isDev || forceDebug) {
    return console.debug.bind(this, ...PREFIX);
  }
  return noop;
}

type reportFunction = (attributeName: string, compName: string, ...additionalInfo: any[]) => any

export default {
  log: logFn(),
  debug: debugFn(),
  warn: console.warn.bind(this, ...PREFIX),
  error: console.error.bind(this, ...PREFIX),
  report: console.error.bind(this, ...[
    `${PREFIX[0]}%c A propriedade obrigatória "%s" não foi informada. Componente: %s`, // Mensagem completa de log
    PREFIX[1], // Estilo para o prefixo
    'color:unset; background:unset; font-size:unset; padding:unset; border-radius:unset' // Estilo para a mensagem
  ]) as reportFunction,
}
