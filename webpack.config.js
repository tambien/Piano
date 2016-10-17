const webpack = require('webpack');

var PROD = process.argv.indexOf('-p') !== -1

module.exports = {
	context: __dirname,
	entry: {
		Main: ['babel-polyfill', 'Main'],
		// Piano : 'Piano'
	},
	output: {
		filename: './build/[name].js',
		chunkFilename: './build/[id].js',
		sourceMapFilename : '[file].map',
		// library : 'Piano',
		// libraryTarget : 'umd'
	},
	resolve: {
		root: __dirname,
		modulesDirectories : ['node_modules', 'node_modules/tone', 'src'],
	},
	plugins: PROD ? [new webpack.optimize.UglifyJsPlugin({minimize: true})] : [],
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel',
				query: {
				  presets: ['es2015']
				}
			}
		]
	},
	devtool : PROD ? '' : '#eval-source-map'
};