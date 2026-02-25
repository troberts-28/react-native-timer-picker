import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "bin/**",
      "build/**",
      ".expo/**",
      ".yarn/**",
      "schema.graphql",
      "app.config.js",
    ],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.builtin,
        ...globals.es2021,
        ...globals.node,
        ...globals.commonjs,
        __DEV__: "readonly",
        NodeJS: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": fixupPluginRules(reactHooksPlugin),
      "@typescript-eslint": tseslint.plugin,
      perfectionist: perfectionistPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      "linebreak-style": ["error", "unix"],
      quotes: ["warn", "double", { avoidEscape: true }],
      semi: ["warn", "always"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/display-name": "off",
      "react/prop-types": "off",
      "no-unused-vars": "off", // disable the base rule as it can report incorrect errors
      "no-redeclare": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
      "no-unreachable": "warn",
      "prettier/prettier": "off",
      "perfectionist/sort-objects": [
        "warn",
        {
          order: "asc",
          type: "alphabetical",
          groups: ["reserved", "unknown"],
          customGroups: [
            {
              groupName: "reserved",
              type: "unsorted",
              elementNamePattern: "^variables$",
            },
          ],
        },
      ],
      "perfectionist/sort-object-types": [
        "warn",
        {
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-interfaces": [
        "warn",
        {
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-enums": [
        "warn",
        {
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-imports": [
        "warn",
        {
          type: "alphabetical",
          order: "asc",
          fallbackSort: { type: "unsorted" },
          ignoreCase: true,
          specialCharacters: "keep",
          partitionByComment: false,
          partitionByNewLine: false,
          newlinesBetween: "always",
          maxLineLength: undefined,
          groups: ["react", "builtin", "external"],
          customGroups: [
            {
              groupName: "react",
              elementNamePattern: ["^react$"],
            },
          ],
          environment: "node",
        },
      ],
      "perfectionist/sort-jsx-props": [
        "warn",
        {
          type: "alphabetical",
          groups: ["reserved", "unknown"],
          customGroups: [
            {
              groupName: "reserved",
              type: "unsorted",
              elementNamePattern: ["^key$", "^ref$", "^children$"],
            },
          ],
        },
      ],
    },
  },
  {
    // Specific config for .d.ts files
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "perfectionist/sort-interfaces": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-enums": "off",
      "perfectionist/sort-destructuring-properties": "off",
      "perfectionist/sort-objects": "off",
    },
  },
  {
    // Add Jest globals for test files
    files: ["src/tests/**"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    // disable type-aware linting on JS files
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  }
);
