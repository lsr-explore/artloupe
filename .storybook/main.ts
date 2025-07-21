import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "path";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: [
    "../packages/palette-studio/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../packages/media-display/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
  },
  addons: [
    "@storybook/addon-a11y",
    "storybook-addon-performance",
    "storybook-addon-pseudo-states",
    "@storybook/addon-docs",
  ],
  viteFinal: async (config) => {
    return mergeConfig(config, {
      define: {
        process: {
          env: {
            NODE_ENV: JSON.stringify("development"),
          },
        },
      },
      resolve: {
        alias: {
          "@artloupe/palette-studio": resolve(
            __dirname,
            "../packages/palette-studio/src",
          ),
          "@artloupe/media-display": resolve(
            __dirname,
            "../packages/media-display/src",
          ),
          "@artloupe/shared-types": resolve(
            __dirname,
            "../packages/shared-types/src",
          ),
          "@artloupe/api-fetchers": resolve(
            __dirname,
            "../packages/api-fetchers/src",
          ),
          "@artloupe/api-handlers": resolve(
            __dirname,
            "../packages/api-handlers/src",
          ),
          "@artloupe/react-query-hooks": resolve(
            __dirname,
            "../packages/react-query-hooks/src",
          ),
          "@artloupe/logger": resolve(__dirname, "../packages/logger/src"),
        },
      },
    });
  },
};

export default config;
