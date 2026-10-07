import { render, h, describe, it, expect, vi, assert } from '@stencil/vitest';

// yarn stencil-test --project spec alc-header-notifications.spec.tsx

describe('alc-header-notifications', () => {

  describe('Renderização com diferentes quantidades', () => {

    it('Renderiza sem badge quando notifications é 0', async () => {
      const { root } = await render(
        <alc-header-notifications notifications={0}></alc-header-notifications>
      );

      const badge = root.querySelector<HTMLAlcBadgeElement>('[data-test-badge]');
      assert.exists(badge, 'O badge não foi encontrado');

      const ariaLiveContainer = root.querySelector('[data-test-aria-live]');
      assert.exists(ariaLiveContainer, 'O container aria-live não foi encontrado');

      expect(badge.label).toBe('');
      expect(ariaLiveContainer).toHaveTextContent('');
    });

    it('Renderiza com número quando notifications é entre 1 e 99', async () => {
      const { root } = await render(
        <alc-header-notifications notifications={15}></alc-header-notifications>
      );

      const badge = root.querySelector<HTMLAlcBadgeElement>('[data-test-badge]');
      assert.exists(badge, 'O badge não foi encontrado');

      const ariaLiveContainer = root.querySelector('[data-test-aria-live]');
      assert.exists(ariaLiveContainer, 'O container aria-live não foi encontrado');

      const button = root.querySelector('[data-test-button]');
      assert.exists(button, 'O botão não foi encontrado');

      expect(badge.label).toBe('15');
      expect(ariaLiveContainer).toHaveTextContent('15 Notificações');
      expect(button.getAttribute('aria-label')).toBeNull();
      
    });

    it('Renderiza com "99+" quando notifications é maior que 99', async () => {
      const { root } = await render(
        <alc-header-notifications notifications={150}></alc-header-notifications>
      );

      const badge = root.querySelector<HTMLAlcBadgeElement>('[data-test-badge]');
      assert.exists(badge, 'O badge não foi encontrado');

      const ariaLiveContainer = root.querySelector('[data-test-aria-live]');
      assert.exists(ariaLiveContainer, 'O container aria-live não foi encontrado');

      const button = root.querySelector('[data-test-button]');
      assert.exists(button, 'O botão não foi encontrado');

      expect(badge.label).toBe('99+');
      expect(ariaLiveContainer).toHaveTextContent('Mais de 99 Notificações');
      expect(button.getAttribute('aria-label')).toBe('Mais de 99 Notificações');
    });

    it('Trata valor não numérico como 0', async () => {
      const { root } = await render(
        <alc-header-notifications notifications={NaN}></alc-header-notifications>
      );

      const badge = root.querySelector<HTMLAlcBadgeElement>('[data-test-badge]');
      assert.exists(badge, 'O badge não foi encontrado');

      const ariaLiveContainer = root.querySelector('[data-test-aria-live]');
      assert.exists(ariaLiveContainer, 'O container aria-live não foi encontrado');

      expect(badge.label).toBe('');
      expect(ariaLiveContainer).toHaveTextContent('');
    });

    it('responde a mudanças na propriedade notifications', async () => {
      const { root, setProps } = await render(
        <alc-header-notifications notifications={5}></alc-header-notifications>
      );

      let badge = root.querySelector<HTMLAlcBadgeElement>('[data-test-badge]');
      assert.exists(badge, 'O badge não foi encontrado');

      expect(badge.label).toBe('5');

      await setProps({ notifications: 100 });

      assert.exists(badge, 'O badge não foi encontrado');
      expect(badge.label).toBe('99+');
    });

    it('atualiza aria-live quando notifications muda', async () => {
      const { root, setProps } = await render(
        <alc-header-notifications notifications={0}></alc-header-notifications>
      );

      const ariaLiveContainer = root.querySelector('[data-test-aria-live]');
      assert.exists(ariaLiveContainer, 'O container aria-live não foi encontrado');

      // Inicialmente sem notificações
      expect(ariaLiveContainer).toHaveTextContent('');

      // Adiciona notificações
      await setProps({ notifications: 25 });
      expect(ariaLiveContainer).toHaveTextContent('25 Notificações');

      // Remove notificações
      await setProps({ notifications: 0 });
      expect(ariaLiveContainer).toHaveTextContent('');
    });

  });

  describe('Renderização com diferentes variações', () => {

    it('Renderiza como button por padrão', async () => {
      const { root } = await render(
        <alc-header-notifications></alc-header-notifications>
      );

      const button = root.querySelector('[data-test-button]');
      assert.exists(button, 'O botão não foi encontrado');

      const link = root.querySelector('[data-test-link]');
      
      expect(link).toBeNull();
      expect(button).toHaveClass('alc-header-button');
    });

    it('Renderiza como button quando variant é button', async () => {
      const { root } = await render(
        <alc-header-notifications variant="button"></alc-header-notifications>
      );

      const button = root.querySelector('[data-test-button]');
      assert.exists(button, 'O botão não foi encontrado');

      const link = root.querySelector('[data-test-link]');

      expect(link).toBeNull();
      expect(button).toHaveClass('alc-header-button');
    });

    it('Renderiza como link quando variant é link', async () => {
      const { root } = await render(
        <alc-header-notifications variant="link" url="/notificacoes"></alc-header-notifications>
      );

      const button = root.querySelector('[data-test-button]');
      const link = root.querySelector('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');

      expect(button).toBeNull();
      expect(link).toHaveClass('alc-header-button');
      expect(link.getAttribute('href')).toBe('/notificacoes');
    });

    it('Renderiza link sem href quando url não é fornecida', async () => {
      const { root } = await render(
        <alc-header-notifications variant="link"></alc-header-notifications>
      );

      const link = root.querySelector('[data-test-link]');
      assert.exists(link, 'O link não foi encontrado');

      expect(link.getAttribute('href')).toBe('');
    });

  });

  describe('Estrutura do componente', () => {

    it('Contém ícone bell', async () => {
      const { root } = await render(
        <alc-header-notifications></alc-header-notifications>
      );

      const icon = root.querySelector<HTMLAlcIconElement>('[data-test-icon]');
      assert.exists(icon, 'O ícone não foi encontrado');

      expect(icon.name).toBe('bell');
      expect(icon.label).toBe('');
      expect(icon).toHaveClass('alc-header-button__icon');
    });

    it('Contém label "Notificações"', async () => {
      const { root } = await render(
        <alc-header-notifications></alc-header-notifications>
      );

      const label = root.querySelector('[data-test-label]');
      assert.exists(label, 'O label não foi encontrado');

      expect(label).toHaveTextContent('Notificações');
    });

    it('Contém badge com configuração correta', async () => {
      const { root } = await render(
        <alc-header-notifications notifications={5}></alc-header-notifications>
      );

      const badge = root.querySelector<HTMLAlcBadgeElement>('[data-test-badge]');
      assert.exists(badge, 'O badge não foi encontrado');


      expect(badge.color).toBe('warning');
      expect(badge.count).toBe(true);
      expect(badge.label).toBe('5');
    });

    it('Contém aria-live region configurada corretamente', async () => {
      const { root } = await render(
        <alc-header-notifications notifications={3}></alc-header-notifications>
      );

      const ariaLiveContainer = root.querySelector('[data-test-aria-live]');
      assert.exists(ariaLiveContainer, 'O container aria-live não foi encontrado');


      expect(ariaLiveContainer.getAttribute('role')).toBe('status');
      expect(ariaLiveContainer.getAttribute('aria-live')).toBe('polite');
      expect(ariaLiveContainer.getAttribute('aria-atomic')).toBe('true');
      expect(ariaLiveContainer).toHaveTextContent('3 Notificações');
      expect(ariaLiveContainer).toHaveClass('alc-header-notifications__aria-live');
    });

  });

});