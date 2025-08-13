import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createVitestConfig } from '../../vitest.config.shared';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default createVitestConfig({
  rootDir: __dirname,
  environment: 'node',
  name: 'pkg-api-handlers',
  setupFiles: [path.resolve(__dirname, 'src/__tests__/setup.ts')], // if you have one
});
