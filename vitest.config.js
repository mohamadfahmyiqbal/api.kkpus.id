import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.js", "tests/**/*.test.js"],
    env: {
      NODE_ENV: "test",
      DB_DIALECT: "sqlite",
      DB_STORAGE: ":memory:",
      JWT_SECRET: "test_jwt_secret_key_minimum_32_characters_long",
    },
  },
});
