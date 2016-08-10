const webpack = require('webpack');

const PROD = JSON.parse(process.env.PROD_ENV || '0')

module.exports = {
	context: __dirname,
	entry: {
		Main: 'Main',
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
		modulesDirectories : ['node_modules', '../Tonejs/Tone.js/', 'src'],
	},
	plugins: PROD ? [new webpack.optimize.UglifyJsPlugin({minimize: true})] : [],
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|Tone\.js)/,
				loader: 'babel',
				query: {
				  presets: ['es2015']
				}
			}
		]
	},
	devtool : PROD ? '#eval-source-map' : '#none'
};