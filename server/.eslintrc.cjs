module.exports = {
  overrides: [
    {
      files: ["**/*.ts"],
      // Exclude build and dependency folders from this override
      excludedFiles: ["node_modules/**", "dist/**"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "no-unused-vars": "warn",
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
      ],
    },
  ],
};
