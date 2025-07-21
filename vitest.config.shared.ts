import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export const createVitestConfig = (packagePath: string) =>
  defineConfig({
    test: {
      environment: 'node',
      globals: true,
      setupFiles: [resolve(__dirname, 'test-setup.ts')],
      include: ['**/__tests__/**/*.{test,spec}.{ts,tsx}'],
      reporters: ['verbose'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        all: true,
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        exclude: [
          '**/*.d.ts',
          '**/index.ts',
          '**/test-setup.ts',
          '**/__tests__/**',
          '**/__mocks__/**',
          '**/vitest.config*.ts',
          '**/.storybook/**',
          '**/storybook-static/**',
          '**/*.stories.*',
          'dist/**',
          'node_modules/**',
          '**/*.config.*',
        ],
      },
    },
    resolve: {
      alias: {
        '@': resolve(packagePath, 'src'),
      },
    },
  });
