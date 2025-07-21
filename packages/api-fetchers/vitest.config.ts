import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createVitestConfig } from '../../vitest.config.shared';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = createVitestConfig(__dirname);

// Override the setupFiles to use the local test-setup.ts
if (config.test) {
  config.test.setupFiles = [path.resolve(__dirname, 'test-setup.ts')];
}

export default config;
