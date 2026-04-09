import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import oxlint from 'eslint-plugin-oxlint'; // Add this import

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Add Oxlint disable config last (matches your .oxlintrc.json)
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'hono/app.d.mts',
  ]),
]);

export default eslintConfig;
