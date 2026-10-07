# Alcance

O Alcance é um design system que permite a construção de aplicações web acessíveis e mobile-first.

**Atenção:** As linhas de comando desse documento devem ser executados a partir desse diretório (onde estão os códigos-fonte do Alcance).

## Instalando os pacotes

O primeiro passo é fazer a instalação das dependências do Alcance, conforme indicações a seguir.
### Instalando pacotes via Yarn (recomendado)

    yarn install
### Instalando pacotes via NPM

    npm install

## Executando o ambiente de desenvolvimento

    yarn start

Esse comando vai subir um servidor de desenvolvimento em [http://localhost:4444](). Será possível acessar uma única página, correspondente ao arquivo [src/index.html]().

Você pode alterar esse arquivo HTML e os códigos dos componentes e ver imediatamente o resultado.

## Executando testes automatizados
    yarn test


## Publicando pacote NPM

Verifique se as pastas `dist` e `loader` estão presentes, caso positivo, apague as mesmas e gere a build de publicação:

    yarn build

Agora rode a publicação NPM:

    yarn publish
