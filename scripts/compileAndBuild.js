/* eslint-disable no-console */
const ts = require('typescript')
const fs = require('fs')
const util = require('./util')
util.extendConsole()

function printUsage(){
	const usage = [
		'USAGE:',
		'"npm run-script compileAndBuild" compiles ts files to js, then packs with webpack via "build" script',
		'"npm run-script compileAndBuild help" shows this message',
		'"npm run-script compileAndBuild [-d, --debug, debug]" compiles ts files to js, then packs with webpack via "build:debug" script instead of "build" (false by default)'
	]
	console.log(usage.join('\n\t'))
}

function removeTempDir(){
	fs.readdirSync('temp').forEach(f => fs.unlinkSync(`temp/${f}`)) // rmdirSync => dir not empty
	fs.rmdirSync('temp')
}

function compile({ debug, watch }){
	console.log(`Called "compile" function, param "debug" is ${debug}`)
	let compilerOptions
	try {
		console.underscore('Extracting compilerOptions from tsconfig.json...')
		compilerOptions = JSON.parse(fs.readFileSync('tsconfig.json', { encoding : 'utf8' })).compilerOptions

	} catch (e){
		if (e instanceof SyntaxError){
			const commentsInJson = e.message.includes('Unexpected token / in JSON')
			const strings = [
				'** Error parsing tsconfig.json;',
				commentsInJson ? `comments are not allowed (${e.message.substr(e.message.indexOf('position'))}).` : e.message,
				'Exiting'
			]
			console.bgred(strings.join(' '))
			process.exit()
		} else {
			throw e
		}
	}

	console.log('compilerOptions: %O', compilerOptions)
	if (!compilerOptions){
		console.bgred('\t** Error, bad compilerOptions. Exiting')
		process.exit()
	}

	if (compilerOptions.module && compilerOptions.module.toUpperCase() !== 'ES2015'){
		const warning = [
			`** Warning: "module" key in compilerOptions has value: "${compilerOptions.module},"`,
			'compiling will probably be broken.',
			'The recommended value is "ES2015",',
			'which allows webpack to build successfully.'
		]
		console.yellow(warning.join(' '))
	}
	let { module, outDir, target, sourceMap } = compilerOptions
	let missingKeys = false
	for (let [obligatory, value] of Object.entries({ module, outDir, target })){
		if (value === undefined){
			missingKeys = true
			console.bgred(`** Error: "${obligatory}" is undefined, compilerOptions in tsconfig.json must specify it`)
		}
	}
	if (missingKeys)
		process.exit()
	
	module = module.toUpperCase()
	target = target.toUpperCase()

	console.log('Translating compilerOptions from tsconfig.json to fit to typescript API...')
	const options = {
		outDir : outDir,
		module : ts.ModuleKind[module],
		target : ts.ScriptTarget[target],
		sourceMap : sourceMap
	}

	console.log('Finally compiling to temp directory with options: %o', options)

	const srcFiles = fs.readdirSync('src').map(f => `src/${f}`)
	console.log('Compiling the following ts files: %o', srcFiles)
	const program = ts.createProgram(srcFiles, options)
	program.emit()

	console.green('Finished compiling ts files')
	const wpcmd = `npm run-script build${debug ? ':debug' : ''}`
	try {
		console.underscore(`Executing "${wpcmd}"...`)
		const { execSync } = require('child_process')
		execSync(wpcmd, { encoding : 'utf8', stdio : 'inherit' })
		console.green('Finished webpacking')
	} catch (err){
		console.yellow(err)
	}
	console.underscore('Removing "temp" directory...')
	removeTempDir()
	console.log('Process exiting')
	process.exit()

}

// const args = process.argv.slice(2)

const watch = util.isInArgs('watch')
const debug = util.isInArgs('debug')
const help = util.isInArgs('help')
console.log({ watch, debug, help }, 'args: ', process.argv)
if (help){
	printUsage()
	process.exit()
}
let args = process.argv.slice(2)
const invalidArg = args.filter(a => a).length !== [watch, debug, help].filter(a=>a).length
if (invalidArg){
	console.bgred(`At least one argument is invalid: ${args}`)
	printUsage()
	process.exit()
}
compile({ debug, watch })

