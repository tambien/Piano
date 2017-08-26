const webpack = require('webpack');

var PROD = process.argv.indexOf('-p') !== -1

module.exports = [{
	context: __dirname + '/src',
	entry: {Main: ['babel-polyfill', './Main']},
	output: {
		filename: './build/[name].js',
		chunkFilename: './build/[id].js',
		sourceMapFilename : '[file].map',
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
}, {
	context: __dirname + '/src',
	entry: {Piano: './Piano'},
	output: {
		filename: './build/[name].js',
		chunkFilename: './build/[id].js',
		sourceMapFilename : '[file].map',
		library: 'Piano',
		libraryTarget: 'umd',
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
  externals: ['tone'],
	devtool : PROD ? '' : '#eval-source-map'
}];