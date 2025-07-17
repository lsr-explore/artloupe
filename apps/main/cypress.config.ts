import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		setupNodeEvents() {
			// implement node event listeners here
		},
		specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/end-to-end.ts",
	},
});
