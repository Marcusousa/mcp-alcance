import { render, h, describe, it, expect  } from '@stencil/vitest';
import { getUniqueId } from '../getUniqueId';

// yarn stencil-test --project spec getUniqueId.spec.tsx

describe('components/utils/getUniqueId', () => {
  it('Deveria retornar o id corretamente ao solicitar o getUniqueId', () => {
    const uniqueId = getUniqueId();
    expect(uniqueId).toBe('alc-id-0');

    const uniqueId2 = getUniqueId();
    expect(uniqueId2).toBe('alc-id-1');
  });

  it('Deveria retornar o id corretamente ao solicitar o getUniqueId com um id na página', async () => {
    await render(
        <div id='alc-id-2'>Teste</div>
    );

    const uniqueId = getUniqueId();
    expect(uniqueId).toBe('alc-id-3');
  });
});