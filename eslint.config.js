import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import ts from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    ignores: ["dist/**", "node_modules/**", "html/"],
    files: ["src/**/*.vue", "src/**/*.js", "src/**/*.ts", "src/**/*.jsx", "src/**/*.tsx"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: ts.parser,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
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
      "import/newline-after-import": ["error", { count: 2 }],
      //TODO need add path resolver
      "import/no-unresolved": 'off',
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^vue", "^\\w", "^@radix-ui", "^@vueuse"],
            // Internal packages.
            [
              "^@/entities(/.*|$)",
              "^@/shared(/.*|$)",
              "^@/features(/.*|$)",
              "^@/widgets(/.*|$)",
              "^@/pages(/.*|$)",
              "^@/app(/.*|$)",
              // Side effect imports.
              "^\\u0000",
              // Parent imports. Put `..` last.
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              // Other relative imports. Put same-folder imports and `.` last.
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
              // Style imports.
              "^.+\\.?(css)$",
            ],
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
