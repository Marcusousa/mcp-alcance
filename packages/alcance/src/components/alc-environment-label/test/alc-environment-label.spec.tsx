import { render, h, describe, it, expect } from '@stencil/vitest';
import { Environments } from '../environments';

const CLASS_PREFIX = 'alc-environment-label';

const CSS_CLASSES = {
  [Environments.Prototype]:    `${CLASS_PREFIX}--${Environments.Prototype}`,
  [Environments.Development]:  `${CLASS_PREFIX}--${Environments.Development}`,
  [Environments.Testing]:      `${CLASS_PREFIX}--${Environments.Testing}`,
  [Environments.Homologation]: `${CLASS_PREFIX}--${Environments.Homologation}`,
  [Environments.Production]:   `${CLASS_PREFIX}--${Environments.Production}`,
};

describe('alc-environment-label', () => {
  it('Deve renderizar corretamente quando adiciona env com valor desconhecido', async () => {
    const { root } = await render(
      <alc-environment-label env={"outro-valor" as any}></alc-environment-label>
    );
    expect(root.textContent).toContain('Não reconhecido');
  });
  
  it('Deve renderizar corretamente quando em ambiente de desenvolvimento', async () => {
    const { root } = await render(
      <alc-environment-label env={Environments.Development}></alc-environment-label>
    );
    expect(root).toHaveClass(CSS_CLASSES[Environments.Development]);
    expect(root.textContent).toContain('Desenvolvimento');
  });

  it('Deve renderizar corretamente quando em ambiente de teste', async () => {
    const { root } = await render(
      <alc-environment-label env={Environments.Testing}></alc-environment-label>
    );
    expect(root).toHaveClass(CSS_CLASSES[Environments.Testing]);
    expect(root.textContent).toContain('Teste');
  });

  it('Deve renderizar corretamente quando em ambiente de homologação', async () => {
    const { root } = await render(
      <alc-environment-label env={Environments.Homologation}></alc-environment-label>
    );
    expect(root).toHaveClass(CSS_CLASSES[Environments.Homologation]);
    expect(root.textContent).toContain('Homologação');
  });

  it('Deve renderizar corretamente quando em ambiente de protótipo', async () => {
    const { root } = await render(
      <alc-environment-label env={Environments.Prototype}></alc-environment-label>
    );
    expect(root).toHaveClass(CSS_CLASSES[Environments.Prototype]);
    expect(root.textContent).toContain('Protótipo');
  });
});
