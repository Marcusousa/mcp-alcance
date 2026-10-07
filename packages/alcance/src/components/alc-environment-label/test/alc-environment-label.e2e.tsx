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
  it('Não deve renderizar quando em ambiente de produção', async () => {
    const { root } = await render(
      <alc-environment-label env={Environments.Production}></alc-environment-label>
    );
    
    expect(root).toHaveClass(CSS_CLASSES[Environments.Production]);
    expect(root.checkVisibility()).toBeFalsy();
  });

});
