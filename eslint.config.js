//@ts-check
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import ts from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    ignores: ["dist/**", "node_modules/**", "html/"],
    files: ["**/*.vue", "**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: ts.parser, // parse TS inside VUE
      },
    },
  },
  {
    rules: {
      "no-undef": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "_",
          varsIgnorePattern: "_",
          caughtErrorsIgnorePattern: "_",
        },
      ],
      "sort-imports": [
        "error",
        {
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  eslintConfigPrettier,
);
