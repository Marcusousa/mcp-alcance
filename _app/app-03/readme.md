# App-03

Um exemplo de aplicação em que:
- Instalamos o ALC via NPM.
- Usamos o rollup para gerar uma distribuição (ver o arquivo de configuração do rollup nessa pasta).
- Os bundles gerados pelo rollup vão para uma pasta `dist`
- O arquivo `index.html` faz referência à pasta `dist`.

Diferente dos outros exemplos, não há necessidade de fazer referência a `node_modules` no html.

Diferente dos outros exemplos, aqui perdeu-se o "lazy loading" do Stencil,
já que o bundle já traz em um só arquivo todos os componentes.
