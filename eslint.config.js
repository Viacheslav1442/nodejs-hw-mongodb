import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginNode from "eslint-plugin-n";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  pluginJs.configs.recommended,
  pluginImport.configs.recommended,
  pluginNode.configs.recommended,
  tsPlugin.configs.recommended,
  {
    files: ["src/**/*.{js,ts}"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2022,
      parser: tsParser,
    },
    env: {
      node: true,
    },
    rules: {
      semi: "error",
      "no-unused-vars": ["error", { args: "none" }],
      "no-undef": "error",
    },
  },
];