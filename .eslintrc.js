module.exports = {
    env: {
      browser: true,
      es2021: true,
      amd: true,
      node: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": ["off"],
    },
  };