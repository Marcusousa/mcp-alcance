# Alcance

Alcance é o Design System acessível da Câmara dos Deputados. Este repositório contém a biblioteca de Web Components em Stencil e os pacotes wrapper para Vue e React, gerados a partir dela.

## Estrutura do repositório

- `packages/alcance`: biblioteca de Web Components em Stencil. Fonte de verdade dos componentes.
- `packages/alcance-vue`: wrappers Vue. Gerado automaticamente pelo build de `alcance`.
- `packages/alcance-react`: wrappers React. Gerado automaticamente pelo build de `alcance`.

Qualquer alteração de componente é feita em `packages/alcance`. Os pacotes Vue e React são saída do build, não devem ser editados diretamente nos arquivos gerados.

## Pré-requisitos

- Node.js 22 ou superior
- Yarn como gerenciador de pacotes
- Acesso à rede da Câmara dos Deputados: o projeto utiliza o registry interno de pacotes configurado em `.yarnrc` (`https://hub.camara.gov.br/repository/npm-camara/`)

## Instalação

Após clonar o repositório, todos os comandos devem ser executados dentro de `packages/alcance`:

```bash
cd packages/alcance
yarn install
```

## Ambiente de desenvolvimento

Inicia o servidor de desenvolvimento do Stencil em <http://localhost:4444>:

```bash
yarn start
```

## Storybook

Inicia o Storybook em <http://localhost:6006>:

```bash
yarn storybook
```

## Build

Gera os artefatos de distribuição da biblioteca e regenera os wrappers Vue e React nos pacotes irmãos:

```bash
yarn build
```
