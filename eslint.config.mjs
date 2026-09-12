import nextConfig from "eslint-config-next";

// Next.js 16 no longer ships `next lint`; ESLint runs directly with the
// flat config the Next team publishes (core web vitals and TypeScript rules).

const config = [
  ...nextConfig,
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "reference/**"],
  },
];

export default config;
