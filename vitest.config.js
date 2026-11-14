import { defineConfig } from "vitest/config";
import fs from "fs";
import path from "path";

// Load .env.test if it exists and DB_HOST is not already set (e.g. from CI workflow)
const envPath = path.join(import.meta.dirname, ".env.test");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const k = key.trim();
      if (!process.env[k]) {
        process.env[k] = valueParts.join("=").trim();
      }
    }
  });
}

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.js", "tests/**/*.test.js"],
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});