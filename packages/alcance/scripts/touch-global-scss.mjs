import touch from 'touch';

// Equivalente a salvar o arquivo
// Isso faz com que, em tempo de desenvolvimento,
// os scripts do Stencil atuem como se esse arquivo
// tivesse sido atualizado.
// Esse script é parte da solução que permite que
// alterações nos arquivos importados pelo
// global.scss resultem na atualização da folha de estilo
// entregue ao navegador.
touch("./src/global/global.scss");