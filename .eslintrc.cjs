module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { project: ["./tsconfig.json", "./tsconfig.node.json"] },
  plugins: ["@typescript-eslint", "react-refresh"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // "no-multi-spaces": "error",
    // "no-trailing-spaces": "error"
  },
};
