const path = require('path')
const webpack = require('webpack')
// https://webpack.js.org/configuration/
const debug = process.argv.slice(2).includes('--debug')

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
	},
	devtool : 'source-map'
}
if (debug){
	commonConfig = { 
		...commonConfig, 
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
		] }
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

/**
	const midikeyboardConfig = Object.assign({}, commonConfig, {
		entry : {
			MidiPiano : ['./src/MidiPiano.js'],
		},
		output : {
			path : path.resolve(__dirname, 'build'),
			filename : '[name].js',
			library : 'MidiPiano',
			libraryTarget : 'umd',
			libraryExport : 'MidiPiano'
		},
	})

	module.exports = [pianoConfig, midikeyboardConfig]
	*/
module.exports = [pianoConfig]
