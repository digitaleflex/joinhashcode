import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: [
      ".next/**",
      "generated/**",
      "node_modules/**",
      ".claude/**",
      "scratch/**",
      "*.config.*",
      "prisma/**",
      "scripts/**",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: false },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ],
    },
  },
];
