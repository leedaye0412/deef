import { dirname } from "path";
import { fileURLToPath } from "url";

import nextConfig from "eslint-config-next";
import unused from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ignores = {
  ignores: ["node_modules/**", ".next/**", "dist/**", "build/**"],
};

const tsOverrides = {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parserOptions: { project: false, tsconfigRootDir: __dirname },
  },
  plugins: {
    "unused-imports": unused,
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
};

const config = [ignores, ...nextConfig, tsOverrides];

export default config;
