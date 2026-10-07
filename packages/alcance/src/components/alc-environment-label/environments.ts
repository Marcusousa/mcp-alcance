// Utilizado para não ter erro de escrita e/ou caso seja necessário mudar o valor dos ambientes
export enum Environments {
  Prototype = 'prototype',
  Development = 'development',
  Testing = 'testing',
  Homologation = 'homologation',
  Production = 'production'
}

export type EnvType = 'prototype' | 'development' | 'testing' | 'homologation' | 'production' ;