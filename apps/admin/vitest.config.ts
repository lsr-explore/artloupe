import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: [resolve(__dirname, "src/__tests__/setup.ts")],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"dist/",
				".next/",
				"coverage/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/test-setup.ts",
				"**/__mocks__/**",
				"**/__tests__/**",
				"**/*.test.*",
				"**/*.spec.*",
				"**/index.ts",
				"**/index.tsx",
				"**/mocks/**",
				"**/cypress/**",
				"jest.setup.js",
				"TEST_SETUP.md",
			],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"data-providers": resolve(__dirname, "src/data-providers"),
		},
	},
});
