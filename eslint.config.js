import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Date: "readonly",
        Math: "readonly",
        JSON: "readonly",
        Error: "readonly",
        Promise: "readonly",
        Map: "readonly",
        Set: "readonly",
        URL: "readonly",
        fetch: "readonly",
        global: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-undef": "warn",
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "uploads/",
      "coverage/",
    ],
  },
];
