const path = require('path')

const commonConfig = {
	mode : 'development',
	entry : {
		Piano : ['./dist/Piano.js'],
	},
	context : __dirname,
	output : {
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
	devtool : 'inline-source-map'
}

const pianoConfig = Object.assign({}, commonConfig, {
	entry : {
		Piano : ['./dist/Piano.js'],
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
