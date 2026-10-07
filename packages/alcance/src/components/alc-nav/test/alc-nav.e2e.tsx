import { render, h, describe, it, expect, assert } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// yarn stencil-test --project browser alc-nav.e2e.tsx

const componentContent = (
<alc-nav>
  <span data-alc-label>Menu</span>
  <ul>
    <li><a href="#">Institucional</a></li>
    <li data-test-submenu>
      <span>Aplicações</span>
      <div data-alc-panel>
        <ul>
          <li><a href="#">Gabinete Digital</a></li>
          <li><a href="#">Liderança Digital</a></li>
          <li><a href="#">Processo Legislativo Digital</a></li>
        </ul>
      </div>
    </li>
  </ul>
</alc-nav>
);


describe('alc-nav', () => {
  it('Deve renderizar corretamente', async () => {
    const { root, waitForChanges } = await render<HTMLAlcNavElement>(
      componentContent
    );
    await waitForChanges();

    const label = root.querySelector('[data-alc-label]');
    assert.exists(label, 'Label não encontrado');

    const panels = root.querySelectorAll('[data-alc-panel]');
    assert.exists(panels, 'Painéis não encontrados');

    expect(root).toHaveClass('hydrated');
    expect(label.textContent).toBe('Menu');
    expect(panels[0]).toBeVisible();
    expect(panels[1]).not.toBeVisible();
  });

  it('Deve abrir o submenu corretamente', async () => {
    const { root, waitForChanges } = await render<HTMLAlcNavElement>(
      componentContent
    );
    await waitForChanges();

    const panels = root.querySelectorAll('[data-alc-panel]');
    assert.exists(panels, 'Painéis não encontrados');

    const itemSubmenu = root.querySelector<HTMLElement>('[data-test-submenu]');
    assert.exists(itemSubmenu, 'Item de submenu não encontrado');

    const linkSubMenu = itemSubmenu.querySelector<HTMLElement>('a');
    assert.exists(linkSubMenu, 'Link do submenu não encontrado');

    await userEvent.click(linkSubMenu);
    await waitForChanges();

    expect(panels[0].checkVisibility()).toBeFalsy();
    expect(panels[1].checkVisibility()).toBeTruthy();
  });

  it('Deve voltar para o menu corretamente', async () => {
    const { root, waitForChanges } = await render<HTMLAlcNavElement>(
      componentContent
    );
    await waitForChanges();

    const panels = root.querySelectorAll('[data-alc-panel]');
    assert.exists(panels, 'Painéis não encontrados');

    const itemSubmenu = root.querySelector<HTMLElement>('[data-test-submenu]');
    assert.exists(itemSubmenu, 'Item de submenu não encontrado');

    const linkSubMenu = itemSubmenu.querySelector<HTMLElement>('a');
    assert.exists(linkSubMenu, 'Link do submenu não encontrado');

    await userEvent.click(linkSubMenu);
    await waitForChanges();

    const backButton = panels[1].querySelector<HTMLElement>('.alc-nav__button--prev');
    assert.exists(backButton, 'Botão de voltar não encontrado');

    await userEvent.click(backButton);
    await waitForChanges();

    expect(panels[0].checkVisibility()).toBeTruthy();
    expect(panels[1].checkVisibility()).toBeFalsy();
  });

  it('Deve incluir o título do subpainel pai no botão voltar', async () => {
    const { root, waitForChanges } = await render<HTMLAlcNavElement>(
      <alc-nav>
        <ul>
          <li>
            <span>Painel 2</span>
            <div data-alc-panel>
              <ul>
                <li>
                  <span>Painel 3</span>
                  <div data-alc-panel>
                    Esse é o painel 3
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </alc-nav>
    );
    await waitForChanges();

    const panels = root.querySelectorAll('[data-alc-panel]');
    assert.exists(panels, 'Painéis não encontrados');

    const icon1 = panels[1].querySelector('.alc-nav__button--prev alc-icon');
    assert.exists(icon1, 'Ícone de voltar não encontrado');
    expect(icon1.getAttribute('aria-label')).toContain('navegação principal');

    const icon2 = panels[2].querySelector('.alc-nav__button--prev alc-icon');
    assert.exists(icon2, 'Ícone de voltar não encontrado');
    expect(icon2.getAttribute('aria-label')).toContain('Painel 2');
  });

  it('Deve verificar se a classe is-selected existe com base no atributo data-alc-selected', async () => {
    const { root, waitForChanges } = await render<HTMLAlcNavElement>(
      <alc-nav>
        <ul>
          <li><a href="#">Item 1</a></li>
          <li data-alc-selected="true"><a href="#">Item 2</a></li>
          <li><a href="#">Item 3</a></li>
        </ul>
      </alc-nav>
    );
    await waitForChanges();

    const list = root.querySelectorAll<HTMLLIElement>('li');
    list.forEach(item => {
      item.addEventListener('click', () => {
        root.setSelectedItem(item);
      });
    });

    expect(list[0]).not.toHaveClass('is-selected');
    expect(list[0]).not.toHaveAttribute('data-alc-selected');
    expect(list[1]).toHaveClass('is-selected');
    expect(list[1]).toHaveAttribute('data-alc-selected');
    expect(list[2]).not.toHaveClass('is-selected');
    expect(list[2]).not.toHaveAttribute('data-alc-selected');

    // Simular clique no Item 1 e verificar se ele se torna o item selecionado
    await userEvent.click(list[0]);
    await waitForChanges();

    expect(list[0]).toHaveClass('is-selected');
    expect(list[0]).toHaveAttribute('data-alc-selected');
    expect(list[1]).not.toHaveClass('is-selected');
    expect(list[1]).not.toHaveAttribute('data-alc-selected');
    expect(list[2]).not.toHaveClass('is-selected');
    expect(list[2]).not.toHaveAttribute('data-alc-selected');

    // Simular clique no Item 3 e verificar se ele se torna o item selecionado
    await userEvent.click(list[2]);
    await waitForChanges();

    expect(list[0]).not.toHaveClass('is-selected');
    expect(list[0]).not.toHaveAttribute('data-alc-selected');
    expect(list[1]).not.toHaveClass('is-selected');
    expect(list[1]).not.toHaveAttribute('data-alc-selected');
    expect(list[2]).toHaveClass('is-selected');
    expect(list[2]).toHaveAttribute('data-alc-selected');
  });
});
