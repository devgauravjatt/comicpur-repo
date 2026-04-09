import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/app.ts'],
	platform: 'node',
	format: ['es'],
	outDir: 'build',
	clean: true,
	dts: true,
	unbundle: false,
	deps: {
		skipNodeModulesBundle: false,
	},
});
