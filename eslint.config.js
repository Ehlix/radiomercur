import vueParser from "vue-eslint-parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vue from "eslint-plugin-vue";
import globals from "globals";
import ts from "typescript-eslint";

import js from "@eslint/js";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import vueTsEslintConfig from "@vue/eslint-config-typescript";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs["flat/recommended"],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
    files: ["**/*.{js,ts,mts,tsx,vue}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: ts.parser,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
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
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/block-order": [
        "error",
        { order: ["script[setup]", "template", "style[scoped]"] },
      ],
      "vue/define-macros-order": [
        "error",
        {
          order: [
            "defineOptions",
            "defineModel",
            "defineProps",
            "defineEmits",
            "defineSlots",
          ],
          defineExposeLast: true,
        },
      ],
    },
  },
);
