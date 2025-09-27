import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import unused from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ignores = {
  ignores: ["node_modules/**", ".next/**", "dist/**", "build/**"],
};

const nextRules = compat.extends("next/core-web-vitals", "next/typescript");

export default [
  ignores,
  ...nextRules,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: false, tsconfigRootDir: __dirname },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      "unused-imports": unused,
    },
    settings: {
      "import/resolver": {
        typescript: { project: true },
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "@{lib,features,shared}/**",
              group: "internal",
              position: "before",
            },
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
];
