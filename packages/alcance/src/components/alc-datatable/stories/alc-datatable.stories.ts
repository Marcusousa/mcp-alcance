// @ts-ignore
import { argTypes } from './alc-datatable.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';

export default {
  title: 'Componentes/Datatable',
  name: 'Datatable',
  component: 'alc-datatable',
  parameters: {},
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'options': '{"pageLength": 3}',
  },
  render: (args) => (`
<alc-datatable ${renderArgs(argTypes, args)}>
  <table>
    <thead>
      <tr>
        <th>Ordem</th>
        <th>Nome</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Lion-O</td>
        <td>
          É o líder dos ThunderCats, que moram no terceiro mundo e lutam pela ordem e justiça.
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>Panthro</td>
        <td>
          É um integrante dos ThunderCats, representando uma pantera negra na linhagem Thunderiana.
        </td>
      </tr>
      <tr>
        <td>3</td>
        <td>Tygra</td>
        <td>
          Pertencendo à linhagem dos tigres de Thundera, é um dos mais poderosos e versáteis Thundercats.
        </td>
      </tr>
      <tr>
        <td>4</td>
        <td>Cheetara</td>
        <td>
          Representando a chita, é uma guerreira destemida. Forte e decidida, não hesita em entrar em ação para combater os vilões.
        </td>
      </tr>
      <tr>
        <td>5</td>
        <td>Jaga</td>
        <td>
          É o mentor e guerreiro mestre de todos os Thundercats e, como seu nome sugere, é representado pelo jaguar.
        </td>
      </tr>
    </tbody>
  </table>
</alc-datatable>
  `)
};

export const Inline = {
  name: 'Básico inline',
  args: {
    ...defaultArgs,
    'options': '{"columns": [{"title": "Nome"}, {"title": "Arma"}]}',
    'data': '[["Panthro", "Nunchaku"], ["Lion-O", "Espada Justiceira"], ["Cheetara", "Bastão"], ["Tygra", "chicote retrátil"]]'
  },
  render: (args) => (`
<alc-datatable ${renderArgs(argTypes, args)}></alc-datatable>
  `)
};

export const OrdenacaoData = {
  name: 'Ordenação por datas',
  args: {
    ...defaultArgs,
    'data': '[["Panthro", "Nunchaku", "12/10/2022"], ["Lion-O", "Espada Justiceira", "16/12/2022"], ["Cheetara", "Bastão", "20/04/2022"], ["Tygra", "Chicote Retrátil", "05/02/2022"]]',
    'options': '{"columns": [{"title": "Nome"}, {"title": "Arma"}, {"title": "Data"}], "columnDefs": [{"type": "br-data", "targets": [2]}]}'
  },
  render: (args) => (`
<alc-datatable ${renderArgs(argTypes, args)}></alc-datatable>
  `)
};

export const OrdenacaoDataHora = {
  name: 'Ordenação por datas e horas',
  args: {
    ...defaultArgs,
    'data': '[["Panthro", "Nunchaku", "12/10/2022 12:09:23"], ["Lion-O", "Espada Justiceira", "12/10/2022 14:09:23"], ["Cheetara", "Bastão", "12/10/2022 17:09:23"], ["Tygra", "Chicote Retrátil", "12/10/2022 12:09:24"]]',
    'options': '{"columns": [{"title": "Nome"}, {"title": "Arma"}, {"title": "Data & Hora"}], "columnDefs": [{"type": "br-data", "targets": [2]}]}'
  },
  render: (args) => (`
<alc-datatable ${renderArgs(argTypes, args)}></alc-datatable>
  `)
};

export const ApiPublica = {
  name: 'Usando dados recebidos de uma API pública',
  args: {
    ...defaultArgs,
    'data': '[]',
    'options': '{"columns": [{"data": "nome",  "title": "Nome"},{"data": "uf", "title": "Unidade da Federação"}, {"data": "email", "title": "E-mail"}]}'
  },
  render: (args) => (`
<alc-datatable id="api-deputados" ${renderArgs(argTypes, args)}></alc-datatable>
<alc-alert id="reload-alert">Recarregue a página para visualizar os dados.</alc-alert>

<script>
// Buscar 20 deputados das UFs: RJ, DF e SP, ordenados por nome
  const API_URL = 'https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=RJ&siglaUf=DF&siglaUf=SP&itens=20&ordem=ASC&ordenarPor=nome';

  async function getData(url) {
    return await fetch(url)
      .then(response => response.json())
      .then(deputados => {

        const UF = { "SP": "São Paulo", "DF": "Distrito Federal", "RJ": "Rio de janeiro" };

        // Mapeia os dados para mostrar da forma desejada
        // - nome da UF em vez da sigla
        // - mantendo apenas as chaves que quero exibir na tabela (nome, uf e email)
        let mappedData = deputados.dados.map(deputado => {
          return {
            nome: deputado.nome,
            uf: UF[deputado.siglaUf],
            email: deputado.email
          };
        });

        return mappedData;
      });
  }

  // Obtém os dados
  getData(API_URL).then(data => {
    // Obtém referência ao componente alc-datatable
    const alcDatatable = document.querySelector('#api-deputados');
    // Seta o valor do atributo "data"
    alcDatatable.data = data;
  });

  // Fecha mensagem
  // Isso não tem relação direta com o exemplo do Datatable.
  // A recarga é necessária pela forma como o Storybook lida com scripts nos stories.
  // Futuramente, vamos buscar uma forma de evitar que isso seja necessário.
  document.querySelector('#reload-alert').hide();

</script>
  `)
};
