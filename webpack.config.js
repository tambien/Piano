const webpack = require('webpack');

module.exports = {
	context: __dirname,
	entry: {
		Main: 'src/Main',
	},
	output: {
		filename: './build/[name].js',
		chunkFilename: './build/[id].js',
		sourceMapFilename : '[file].map',
	},
	resolve: {
		root: __dirname,
		modulesDirectories : ['node_modules', '../Tonejs/Tone.js/', 'src'],
	},
	// plugins: [new webpack.optimize.UglifyJsPlugin({minimize: true})],
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
	devtool : '#eval-source-map'
};