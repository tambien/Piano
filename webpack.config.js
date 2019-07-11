const path = require('path')
const webpack = require('webpack')
const { isInArgs } = require('./scripts/util')
// https://webpack.js.org/configuration/
const args = process.argv.slice(2)
const debug = isInArgs('debug')
console.log('args: ', args, 'debug: ', debug)
let commonConfig = {
	// 'production' outputs readable (debuggable) code. 'development' obfuscates.
	mode : debug ? 'production' : 'development',
	entry : {
		Piano : ['./temp/Piano.js'],
	},
	context : __dirname,
	output : {
		pathinfo : debug,
		path : path.resolve(__dirname, 'build'),
		filename : '[name].js',
		library : 'Piano',
		libraryTarget : 'umd',
		libraryExport : 'Piano'
	},
	resolve : {
		modules : [
			'node_modules',
			path.resolve(__dirname, '.'),
		],
		alias : {
			Tone : 'node_modules/tone/Tone'
		},
	},
	module : {
		rules : [
			{
				test : /\.js$/,
				exclude : /node_modules/,
				loader : 'babel-loader'
			}
		]
	}

}
if (debug){
	commonConfig = {
		...commonConfig,
		devtool : 'source-map',
		optimization : {
			minimize : false,
			nodeEnv : 'production',
			namedModules : true,
			namedChunks : true,
			moduleIds : 'named',
			chunkIds : 'named',
		},
		plugins : [
			new webpack.NamedModulesPlugin(),
			new webpack.NamedChunksPlugin(),
			new webpack.DefinePlugin({ 'process.env.NODE_ENV' : JSON.stringify('production') }),
		]
	}
}

const pianoConfig = Object.assign({}, commonConfig, {
	entry : {
		Piano : ['./temp/Piano.js'],
	},
	output : {
		path : path.resolve(__dirname, 'build'),
		filename : '[name].js',
		library : 'Piano',
		libraryTarget : 'umd',
		libraryExport : 'Piano'
	},
})

const midikeyboardConfig = Object.assign({}, commonConfig, {
	entry : {
		MidiKeyboard : ['./temp/MidiKeyboard.js'],
	},
	output : {
		path : path.resolve(__dirname, 'build'),
		filename : '[name].js',
		library : 'MidiKeyboard',
		libraryTarget : 'umd',
		libraryExport : 'MidiKeyboard'
	},
})

module.exports = [pianoConfig, midikeyboardConfig]

// module.exports = [pianoConfig];
