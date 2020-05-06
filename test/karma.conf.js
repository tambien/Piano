module.exports = function (config) {
	config.set({
		basePath: "../",
		frameworks: ["mocha", "karma-typescript"],
		files: [
			"src/**/*.ts",
			"test/*.ts",
			{ pattern: "audio/**", included: false },
		],
		preprocessors: {
			"**/*.ts": "karma-typescript" // *.tsx for React Jsx
		},
		karmaTypescriptConfig: {
			compilerOptions: {
				target: "es6",
				// module: "commonjs",
			},
			bundlerOptions: {
				resolve: {
					directories: ["src", "node_modules", "test"],
				},
			},
			// coverageOptions: {
			// 	exclude: /(.*\.test\.ts|test\/.*\.ts)$/i,
			// },
			// reports: {
			// 	html: path.resolve(__dirname, "../coverage"),
			// 	lcovonly: {
			// 		directory: path.resolve(__dirname, "../coverage"),
			// 		filename: "coverage.lcov",
			// 	},
			// },
			tsconfig: "./tsconfig.json",
		},
		reporters: ["progress", "karma-typescript"],
		browsers: ["Chrome"],
		plugins: [
			"karma-typescript",
			"karma-mocha",
		],
		client: {
			mocha: {
				reporter: "html",
				timeout: 10000,
				retries: 2,
				ui: "bdd",
			},
		},
	});
};