module.exports = {
    env: {
      es2021: true,
      node: true,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: [
      "react",
      "react-hooks",
      "@typescript-eslint",
      "typescript-sort-keys",
      "sort-destructure-keys",
      "import",
    ],
    rules: {
      "linebreak-style": ["error", "unix"],
      quotes: ["warn", "double"],
      semi: ["warn", "always"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/display-name": "off",
      "react/prop-types": "off",
      "no-unused-vars": "off", // disable the base rule as it can report incorrect errors
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
      "no-unreachable": "warn",
      "typescript-sort-keys/interface": "warn",
      "typescript-sort-keys/string-enum": "warn",
      "sort-destructure-keys/sort-destructure-keys": [
        "warn",
        { caseSensitive: false },
      ],
      "react/jsx-sort-props": [
        "warn",
        {
          ignoreCase: true,
          reservedFirst: ["key", "children", "ref"],
        },
      ],
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          distinctGroup: true,
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
            orderImportKind: "desc",
          },
          groups: [
            "builtin",
            "external",
            "parent",
            "sibling",
            "internal",
            "unknown",
          ],
          pathGroupsExcludedImportTypes: ["react"],
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "([a-z]|@)**",
              group: "external",
            },
            {
              pattern: "**/styles",
              group: "internal",
              position: "before",
            },
            {
              pattern: "**/types",
              group: "internal",
              position: "before",
            },
            {
              pattern: "**/components/**",
              group: "internal",
            },
            {
              pattern: "**/utils/**",
              group: "internal",
              position: "after",
            },
          ],
        },
      ],
    },
  };