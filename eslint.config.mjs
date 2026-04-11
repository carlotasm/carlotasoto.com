import nextConfig from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "node_modules/**"],
  },
  ...nextConfig,
  ...nextCoreWebVitals,
  {
    rules: {
      // Stricter rule introduced in eslint-plugin-react-hooks@7 via Next 16.
      // Downgraded to warning — existing Header.tsx effects are intentional.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
