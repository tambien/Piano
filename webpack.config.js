const webpack = require('webpack');
const path = require('path')

module.exports = [{
	context: __dirname,
	entry: {Demo: ['babel-polyfill', './Demo']},
	output: {
		filename: './build/[name].js',
		chunkFilename: './build/[id].js',
		sourceMapFilename : '[file].map',
	},
	resolve : {
		modules : ['node_modules']
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /(node_modules)|Tone\.js/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}]
	},
	devtool : '#source-map'
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
	resolve : {
		modules : ['node_modules']
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /(node_modules)|Tone\.js/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}]
	},
	externals: ['tone'],
	devtool : '#source-map'
}]
