import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

// User-request: disable specific linting errors globally to bypass lint failures.
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow usage of `any` globally
      "@typescript-eslint/no-explicit-any": "off",

      // Disable exhaustive-deps checks (developer accepts the risks)
      "react-hooks/exhaustive-deps": "off",

      // Allow unused vars (underscored vars are preferred but we'll disable globally)
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",

      // Allow creating components in render (temporary bypass)
      "react-hooks/static-components": "off",
      "react-refresh/only-export-components": "off",
    },
  },
]);
