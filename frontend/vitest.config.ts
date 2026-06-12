import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // guest-claim signs cookies with STRAPI_API_TOKEN; provide a stable test key.
    env: {
      STRAPI_API_TOKEN: "test-secret-key-for-unit-tests",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
