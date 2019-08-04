const path = require('path')
const webpack = require('webpack')

const commonConfig = {
	mode : 'production',
	context : __dirname,
	resolve : {
		extensions: ['.ts', '.js'],
	},
	externals : {
		tone : 'Tone',
		webmidi : 'WebMidi'
	},
	module : {
		rules : [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /(node_modules)/,
			}
		]
	}

}

const pianoConfig = Object.assign({}, commonConfig, {
	entry : {
		Piano : ['./src/Piano.ts'],
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
		MidiKeyboard : ['./src/MidiKeyboard.ts'],
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
