// @ts-ignore
import { argTypes } from './alc-nav.args';
import { render } from '../../../stories/functions/components.renderArgs';

export default {
  title: 'Componentes/Nav',
  component: 'alc-nav',
  name: 'Nav',
  parameters: {},
  argTypes: argTypes,
};

const renderArgs = render;

export const Basico = {
  name: 'Básico',
  args: {},
  render: args => `<alc-nav ${renderArgs(argTypes, args)}>
  <span data-alc-label>
    Lista de itens no nível 1
  </span>
  <ul>
    <li>
      <a href="#">Opção nível 1 - A</a>
    </li>
    <li>
      <span>Opção nível 1 - B (tem submenu)</span>
      <div data-alc-panel>
        <ul>
          <li><a href="#">Opção nível 2 - Ba</a></li>
          <li><a href="#">Opção nível 2 - Bb</a></li>
        </ul>

        <span data-alc-label>
          Lista de itens no nível 2
        </span>
        <ul>
          <li><a href="#">Opção nível 2 - Bc</a></li>
          <li><a href="#">Opção nível 2 - Bd</a></li>
        </ul>
      </div>
    </li>
    <li>
      <a href="#">Opção nível 1 - C</a>
    </li>
  </ul>


  <span data-alc-label>
    Outra lista de itens no nível 1
  </span>
  <ul>
    <li>
      <a href="#">Opção nível 1 - D</a>
    </li>
    <li>
      <a href="#">Opção nível 1 - E</a>
    </li>
  </ul>

</alc-nav>`,
};

export const Slots = {
  name: 'Slot',
  args: {},
  render: args => `
  <alc-nav ${renderArgs(argTypes, args)}>
  <div slot="header">
    <alc-user name="Willy Kit"></alc-user>
  </div>
  <ul>
    <li>
      <a href="#">Temporadas</a>
    </li>
    <li>
      <a href="#">Personagens</a>
    </li>
    <li>
      <a href="#">Ambientação</a>
    </li>
  </ul>
  <div slot="footer">
    <ul>
      <li>
        <a href="#">Ajuda</a>
      </li>
    </ul>
    <div class="mx-5 mt-5">
      <label>Tema</label>
      <alc-theme></alc-theme>
    </div>
  </div>
</alc-nav>`,
};

export const Grupos = {
  name: 'Grupos',
  args: {},
  render: args => `
  <alc-nav ${renderArgs(argTypes, args)}>
  <span data-alc-label>Principais Thundercats</span>
  <ul>
    <li>
      <a href="#">Lion-O</a>
    </li>
    <li>
      <a href="#">Panthro</a>
    </li>
    <li>
      <a href="#">Tygra</a>
    </li>
    <li>
      <a href="#">Cheetara</a>
    </li>
  </ul>

  <span data-alc-label>Principais vilões</span>
  <ul>
    <li>
      <a href="#">Mumm-Ra</a>
    </li>
    <li>
      <a href="#">Escamoso</a>
    </li>
    <li>
      <a href="#">Abutre</a>
    </li>
    <li>
      <a href="#">Simiano</a>
    </li>
    <li>
      <a href="#">Chacal</a>
    </li>
  </ul>
</alc-nav>`,
};

export const Paineis = {
  name: 'Painéis',
  args: {},
  render: args => `
  <alc-nav ${renderArgs(argTypes, args)}>
  <ul>
    <li>
      <a href="#">Relatório do veículo</a>
    </li>
    <li>
      <span>Configurar recursos</span>
      <div data-alc-panel>
        <ul>
          <li>
            <a href="#">Canhões</a>
          </li>
          <li>
            <a href="#">Mandíbulas</a>
          </li>
          <li>
            <a href="#">Broca frontal</a>
          </li>
          <li>
            <a href="#">Garras móveis</a>
          </li>
          <li>
            <a href="#">Modo aquático</a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</alc-nav>`,
};

export const GruposPaineis = {
  name: 'Grupos e Painéis',
  agrs: {},
  render: args => `
  <alc-nav ${renderArgs(argTypes, args)}>
  <span data-alc-label>Thundercats</span>
  <ul>
    <li>
      <a href="#">Lion-O</a>
    </li>
    <li>
      <a href="#">Panthro</a>
    </li>
    <li>
      <a href="#">Tygra</a>
    </li>
    <li>
      <a href="#">Cheetara</a>
    </li>
    <li>
      <span>Secundários</span>
      <div data-alc-panel>
        <span data-alc-label>Femininos</span>
        <ul>
          <li>
            <a href="#">Willy Kit</a>
          </li>
          <li>
            <a href="#">Pumrya</a>
          </li>
        </ul>

        <span data-alc-label>Masculinos</span>
        <ul>
          <li>
            <a href="#">Willy Kat</a>
          </li>
          <li>
            <a href="#">Lynx-O</a>
          </li>
          <li>
            <a href="#">Bengali</a>
          </li>
          <li>
            <a href="#">Jaga</a>
          </li>
          <li>
            <a href="#">Snarf</a>
          </li>
        </ul>

      </div>
    </li>
  </ul>

  <span data-alc-label>Vilões</span>
  <ul>
    <li>
      <a href="#">Mumm-Ra</a>
    </li>
    <li>
      <a href="#">Escamoso</a>
    </li>
    <li>
      <a href="#">Abutre</a>
    </li>
    <li>
      <a href="#">Simiano</a>
    </li>
    <li>
      <a href="#">Chacal</a>
    </li>
    <li>
      <span>Secundários</span>
      <div data-alc-panel>
        <ul>
          <li>
            <a href="#">Ratáro</a>
          </li>
          <li>
            <a href="#">Grune</a>
          </li>
          <li>
            <a href="#">Lunatacs</a>
          </li>
          <li>
            <a href="#">Berserkers</a>
          </li>
          <li>
            <a href="#">Broca</a>
          </li>
        </ul>

      </div>
    </li>

  </ul>
</alc-nav>`,
};

export const ItemSelecionado = {
  name: 'Item selecionado',
  args: {},
  render: args => `
 <alc-nav ${renderArgs(argTypes, args)} id="nav-selected-item">
  <span data-alc-label>Principais Thundercats</span>
  <ul>
    <li>
      <a href="#">Lion-O</a>
    </li>
    <li>
      <a href="#">Panthro</a>
    </li>
    <li>
      <a href="#">Tygra</a>
    </li>
    <li>
      <a href="#">Cheetara</a>
    </li>
  </ul>

  <span data-alc-label>Principais vilões</span>
  <ul>
    <li>
      <a href="#">Mumm-Ra</a>
    </li>
    <li>
      <a href="#">Escamoso</a>
    </li>
    <li>
      <a href="#">Abutre</a>
    </li>
    <li>
      <a href="#">Simiano</a>
    </li>
    <li>
      <a href="#">Chacal</a>
    </li>
  </ul>
</alc-nav>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const alcNav = document.querySelector('#nav-selected-item');
    const itens = alcNav.querySelectorAll('li');

    // Coloca o primeiro item como selecionado
    alcNav.setSelectedItem(itens[0]);

    itens.forEach(item => {
      item.addEventListener('click', (e) => {
        // O preventDefault é apenas para não recarregar a página de exemplo
        e.preventDefault();
        alcNav.setSelectedItem(item);
      });
    });
  });
</script>
    `,
};

export const Completo = {
  name: 'Completo',
  args: {},
  render: args => `
  <alc-nav ${renderArgs(argTypes, args)}>
  <div slot="header">
    <alc-user
      name="Willy Kit"
      registration-number="P_123456"
    ></alc-user>
  </div>
  <ul>
    <li>
      <a href="#">Espada Justiceira</a>
    </li>
    <li>
      <a href="#">Olho de Thundera</a>
    </li>
  </ul>

  <span data-alc-label>Veículos</span>
  <ul>
    <li>
      <span>ThunderTank</span>
      <div data-alc-panel>
        <ul>
          <li>
            <a href="#">Canhões</a>
          </li>
          <li>
            <a href="#">Mandíbulas</a>
          </li>
          <li>
            <a href="#">Broca frontal</a>
          </li>
          <li>
            <a href="#">Garras móveis</a>
          </li>
        </ul>
        <span data-alc-label>Locomoção</span>
        <ul>
          <li>
            <a href="#">Escavação</a>
          </li>
          <li>
            <a href="#">Esqui de neve</a>
          </li>
          <li>
            <a href="#">Modo aquático</a>
          </li>
        </ul>
      </div>
    </li>
    <li>
      <span>HoverCat</span>
      <div data-alc-panel>
        <ul>
          <li>
            <a href="#">Canhão frontal</a>
          </li>
          <li>
            <a href="#">Abas ajustáveis</a>
          </li>
          <li>
            <a href="#">Ajustes do piloto</a>
          </li>
        </ul>
      </div>

    </li>
  </ul>

  <span data-alc-label>Localizações</span>
  <ul>
    <li>
      <a href="#">Bosque da Meia-Noite</a>
    </li>
    <li>
      <a href="#">Castelo Plunn-Dar</a>
    </li>
    <li>
      <a href="#">Estrela de Thundera</a>
    </li>
    <li>
      <a href="#">Grande Esfinge</a>
    </li>
  </ul>
  <div slot="footer">
    <ul>
      <li>
        <a href="#">Ajuda</a>
      </li>
    </ul>
    <div class="mx-5 mt-5">
      <label>Tema</label>
      <alc-theme></alc-theme>
    </div>
    <div class="mx-5 mt-5">
      ThunderSys 2023 - v15.0.1
    </div>
  </div>
</alc-nav>`,
};
