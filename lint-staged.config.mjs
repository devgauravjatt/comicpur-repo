// lint-staged.config.mjs
export default {
  '.{js,ts,tsx,json}': ['pnpm run format', 'pnpm run lint'],
};
