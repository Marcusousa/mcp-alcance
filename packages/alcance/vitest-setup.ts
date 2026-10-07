
import { beforeAll } from 'vitest';

beforeAll(async () => {
   await import('./dist/alcance/alcance.esm.js');
   await import('./dist/alcance/alcance.css');
});

export {};