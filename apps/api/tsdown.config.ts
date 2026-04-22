import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/index.ts'],
	platform: 'node',
	format: ['es'],
	outDir: 'build',
	clean: true,
	dts: true,
	unbundle: true,
	deps: {
		skipNodeModulesBundle: true,
	},
});
