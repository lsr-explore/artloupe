module.exports = {
  extends: ["next/core-web-vitals"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: [
          "../../tsconfig.apps.eslint.json",
          "../../apps/*/tsconfig.json",
        ],
      },
    },
  },
};
