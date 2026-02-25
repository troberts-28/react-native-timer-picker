import baseConfig from "../../eslint.config.mjs";
import { defineConfig } from "eslint/config";

export default defineConfig(
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        atob: "readonly",
        btoa: "readonly",
        fetch: "readonly",
      },
    },
  }
);
