import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  resolve: {
    alias: [
      // Order matters: specific stubs before the catch-all "@" alias.
      { find: "server-only", replacement: path.resolve(__dirname, "tests/stubs/server-only.ts") },
      { find: "@/lib/content", replacement: path.resolve(__dirname, "tests/stubs/lib-content.ts") },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
})
