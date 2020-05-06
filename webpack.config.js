const path = require('path')

module.exports = {
	mode: 'production',
	context: __dirname,
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /(node_modules)/,
			}
		]
	},
	entry: {
		Piano: ['./src/index.ts'],
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js',
		library: 'Tone',
		libraryTarget: 'umd',
	},
	devtool: "source-map",
}
