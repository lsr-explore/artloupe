import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Point to every project config in your monorepo
  projects: [
    // apps
    './apps/main/vitest.config.ts',
    './apps/admin/vitest.config.ts',

    // packages
    './packages/*/vitest.config.ts',
  ],
});
