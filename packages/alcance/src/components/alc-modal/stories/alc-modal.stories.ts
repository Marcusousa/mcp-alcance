// @ts-ignore
import { argTypes } from './alc-modal.args';
import { render as renderArgs } from '../../../stories/functions/components.renderArgs';
import getDefaultArgs from '../../../stories/functions/components.defaultArgs';
import { useArgs } from 'storybook/preview-api';

/*
  Monitora o evento de fechamento da modal para atualizar o arg 'open' na story.
 */
function updateArgsAfterHide(updateArgs, context: any) {
  context.canvasElement?.addEventListener('alc-after-hide', (event: Event) => {
    if (event.target instanceof HTMLElement && event.target.matches('alc-modal')) {
      updateArgs({ open: false });
    }
  });
}

export default {
  title: 'Componentes Alfa/Modal',
  name: 'Modal',
  component: 'alc-modal',
  tags: ['alfa'],
  parameters: {
    docs: {
      story: {
        // Para definir uma altura no espaço reservado ao exemplo,
        // já que o componente em si não tem uma altura inicial
        height: '26rem',
      },
    },
  },
  argTypes: argTypes,
};

const defaultArgs = getDefaultArgs(argTypes);

export const Basico = {
  name: 'Básico',
  args: {
    ...defaultArgs,
    'header-text': 'Lion-O',
    'open': true,
    // 'prevent-overlay-close': ,
    // 'size': ,
  },
  render: function Render(args, context) {
    const [_args, updateArgs] = useArgs();
    updateArgsAfterHide(updateArgs, context);

    return `
<alc-modal ${renderArgs(argTypes, args)}>
  <p>Lion-O, o líder corajoso e nobre dos ThunderCats, é um personagem complexo conhecido por sua coragem, sabedoria e determinação. Como o jovem príncipe de Thundera, Lion-O foi forçado a amadurecer rapidamente devido à destruição de seu planeta natal e à necessidade de liderar seu povo em um novo mundo.</p>
</alc-modal>`;
  }
};

export const Slot = {
  name: 'Usando os slots',
  args: {
    ...defaultArgs,
    // 'header-text': ,
    'open': true,
    // 'prevent-overlay-close': ,
    // 'size': ,
  },
  render: function Render(args, context) {
    const [_args, updateArgs] = useArgs();
    updateArgsAfterHide(updateArgs, context);

    return `
<alc-modal ${renderArgs(argTypes, args)}>
  <h2 slot="header">
    Chamado do <strong>Olho de Thundera</strong> <alc-icon name="eye-fill" label=""></alc-icon>
  </h2>

  <p>Olho de Thundera avistado nos céus do Terceiro Mundo.</p>
  <p>Deseja atender ao chamado?</p>

  <div slot="footer">
    <button class="alc-button" onclick="closeModal()">Atender</button>
    <button class="alc-button alc-button--secondary" onclick="closeModal()">Ignorar</button>
  </div>
</alc-modal>`
  }
};

export const Overlay = {
  name: 'Prevenir o fechamento pelo overlay',
  args: {
    ...defaultArgs,
    'header-text': 'Lion-O',
    'open': true,
    'prevent-overlay-close': true,
    // 'size': ,
  },
  render: function Render(args, context) {
    const [_args, updateArgs] = useArgs();
    updateArgsAfterHide(updateArgs, context);

    return `
<alc-modal ${renderArgs(argTypes, args)}>
  <p>Lion-O, o líder corajoso e nobre dos ThunderCats, é um personagem complexo conhecido por sua coragem, sabedoria e determinação. Como o jovem príncipe de Thundera, Lion-O foi forçado a amadurecer rapidamente devido à destruição de seu planeta natal e à necessidade de liderar seu povo em um novo mundo.</p>
</alc-modal>`;
  },
};

export const ModalInsideForm = {
  name: 'Modal com form: modal dentro de form',
  args: {
    ...defaultArgs,
    'header-text': 'Thundercats, go!',
    'open': true,
    // 'prevent-overlay-close': true,
    // 'size': ,
  },
  render: function Render(args, context) {
    const [_args, updateArgs] = useArgs();
    updateArgsAfterHide(updateArgs, context);

    return `
<form>
  <alc-modal ${renderArgs(argTypes, args)}>
    <alc-field label="Quem é seu Thundercat favorito?">
      <select name="favorite-character">
        <option value="lion-o">Lion-O</option>
        <option value="cheetara">Cheetara</option>
        <option value="panthro">Panthro</option>
        <option value="tygra">Tygra</option>
      </select>
    </alc-field>
    <alc-field label="Se tivesse a Espada Justiceira, qual seria seu primeiro comando?">
      <input type="text" name="sword">
    </alc-field>

    <div slot="footer">
      <!-- A aplicação tem que programar os botões para fechar a modal, conforme necessário -->
      <button type="submit" class="alc-button">Enviar</button>
      <button type="reset"  class="alc-button alc-button--secondary">Cancelar</button>
    </div>
  </alc-modal>
</form>
  `
  }
}

export const FormInsideModal = {
  name: 'Modal com form: form dentro de modal',
  args: {
    ...defaultArgs,
    'header-text': 'Thundercats, go!',
    'open': true,
    // 'prevent-overlay-close': true,
    // 'size': ,
  },
  render: function Render(args, context) {
    const [_args, updateArgs] = useArgs();
    updateArgsAfterHide(updateArgs, context);

    return `
<alc-modal ${renderArgs(argTypes, args)}>
  <form id="form-thundercats">
    <alc-field label="Quem é seu Thundercat favorito?">
      <select name="favorite-character">
        <option value="lion-o">Lion-O</option>
        <option value="cheetara">Cheetara</option>
        <option value="panthro">Panthro</option>
        <option value="tygra">Tygra</option>
      </select>
    </alc-field>
    <alc-field label="Se tivesse a Espada Justiceira, qual seria seu primeiro comando?">
      <input type="text" name="sword">
    </alc-field>
  </form>

  <div slot="footer">
    <!-- A aplicação tem que programar os botões para fechar a modal, conforme necessário -->
    <button type="submit" form="form-thundercats" class="alc-button">Enviar</button>
    <button type="reset"  form="form-thundercats" class="alc-button alc-button--secondary">Cancelar</button>
  </div>
</alc-modal>`
  }
};