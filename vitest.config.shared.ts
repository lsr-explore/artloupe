// vitest.config.shared.ts (root)
import path from 'node:path';
import {
  defineConfig,
  type PluginOption,
  type UserConfig,
} from 'vitest/config';

type Env = 'node' | 'jsdom';

type CreateOpts = {
  rootDir: string;
  environment?: Env;
  name?: string;
  setupFiles?: string[];
  alias?: Record<string, string>;
  plugins?: PluginOption[]; // <-- allow plugins (e.g., react)
};

export const createVitestConfig = ({
  rootDir,
  environment = 'node',
  name,
  setupFiles = [],
  alias = {},
  plugins = [],
}: CreateOpts): UserConfig =>
  defineConfig({
    plugins,
    test: {
      name,
      environment,
      globals: true,
      include: [
        '**/__tests__/**/*.{test,spec}.{ts,tsx}',
        '**/*.{test,spec}.{ts,tsx}',
      ],
      setupFiles,
      // JSDOM quality-of-life
      environmentOptions:
        environment === 'jsdom'
          ? { jsdom: { url: 'http://localhost' } }
          : undefined,
      reporters: ['verbose'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        all: true,
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        exclude: [
          'node_modules/**',
          'dist/**',
          'build/**',
          '.next/**',
          'coverage/**',
          '**/*.d.ts',
          '**/*.config.{ts,js,cjs,mjs}',
          '**/vite-env.d.ts',
          '**/stories/**',
          '**/storybook/**',
          '**/mocks/**',
          '**/cypress/**',
          'jest.setup.js',
          'TEST_SETUP.md',
        ],
      },
    },
    // Ensure automatic JSX transform even if tsconfig is off
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
        ...alias,
      },
    },
  });
