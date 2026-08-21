import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // guest-claim signs cookies with STRAPI_API_TOKEN; provide a stable test key.
    // The Vertex client is constructed at module load, so give it a dummy
    // project — no network call is made in unit tests.
    env: {
      STRAPI_API_TOKEN: "test-secret-key-for-unit-tests",
      GOOGLE_CLOUD_PROJECT: "test-project",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
