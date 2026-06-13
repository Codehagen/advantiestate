import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

const config = [
  {
    ignores: [
      ".content-collections/**",
      ".next/**",
      ".removed/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "prefer-const": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
]

export default config
