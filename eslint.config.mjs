import js from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginCypress from "eslint-plugin-cypress";
import pluginImport from "eslint-plugin-import"; // ✅ Added
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginMarkdown from "eslint-plugin-markdown";
import pluginNoSecrets from "eslint-plugin-no-secrets"; // ✅ Added
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh"; // ✅ Added
import pluginUnicorn from "eslint-plugin-unicorn"; // ✅ Added

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  // Base JS config
  {
    files: ["**/*.{js,jsx,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      import: pluginImport,
      unicorn: pluginUnicorn,
      "no-secrets": pluginNoSecrets,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      ...pluginReactRefresh.configs.recommended.rules,
      ...pluginUnicorn.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
      "no-secrets/no-secrets": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"],
        },
      },
      react: {
        version: "detect",
      },
    },
  },

  // TypeScript config for apps
  {
    files: ["apps/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: path.resolve(__dirname, "tsconfig.apps.eslint.json"),
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      "react-refresh": pluginReactRefresh,
      import: pluginImport,
      unicorn: pluginUnicorn,
      "no-secrets": pluginNoSecrets,
      "@next/next": pluginNext,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      ...pluginReactRefresh.configs.recommended.rules,
      ...pluginUnicorn.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
      "no-secrets/no-secrets": "error",
      ...pluginNext.configs["core-web-vitals"].rules,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: [
            path.resolve(__dirname, "tsconfig.apps.eslint.json"),
            path.resolve(__dirname, "apps/*/tsconfig.json"),
          ],
        },
      },
      react: {
        version: "detect",
      },
    },
  },

  // TypeScript config for packages
  {
    files: ["packages/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      parserOptions: {
        project: [
          path.resolve(__dirname, "tsconfig.packages.eslint.json"),
          path.resolve(__dirname, "packages/*/tsconfig.json"),
        ],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      "react-refresh": pluginReactRefresh,
      import: pluginImport,
      unicorn: pluginUnicorn,
      "no-secrets": pluginNoSecrets,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      ...pluginReactRefresh.configs.recommended.rules,
      ...pluginUnicorn.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
      "no-secrets/no-secrets": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: path.resolve(__dirname, "tsconfig.packages.eslint.json"),
        },
      },
      react: {
        version: "detect",
      },
    },
  },

  // Cypress config
  {
    files: ["**/*.cy.{js,ts,jsx,tsx}", "cypress/**/*.{js,ts}"],
    plugins: {
      cypress: pluginCypress,
    },
    languageOptions: {
      globals: pluginCypress.configs.recommended.languageOptions.globals,
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.md"],
    processor: pluginMarkdown.processors.markdown,
  },

  // Ignored folders
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/*.d.ts",
      "**/storybook-static/**",
      "**/vite.config.*.timestamp*",
      "**/vitest.config.*.timestamp*",
    ],
  },
];
