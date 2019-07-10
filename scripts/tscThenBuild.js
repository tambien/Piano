/* eslint-disable no-console */
const ts = require('typescript')
const fs = require('fs')
require('./extendConsole')

function compile(logTsErrors){
	console.log(`Called "compile" function, param "logTsErrors" is ${logTsErrors}`)
	let compilerOptions
	try {
		console.bright('Extracting compilerOptions from tsconfig.json...')
		compilerOptions = JSON.parse(fs.readFileSync('tsconfig.json', { encoding : 'utf8' })).compilerOptions

	} catch (e){
		if (e instanceof SyntaxError){
			const commentsInJson = e.message.includes('Unexpected token / in JSON')
			const strings = [
				'** Error parsing tsconfig.json;',
				commentsInJson ? `comments are not allowed (${e.message.substr(e.message.indexOf('position'))}).` : e.message,
				'Exiting'
			]
			console.yellow(strings.join(' '))
			process.exit()
		} else {
			throw e
		}
	}
	
	console.log('compilerOptions: %O', compilerOptions)
	if (!compilerOptions){
		console.yellow('\t** Error, bad compilerOptions. Exiting')
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
			console.yellow(`** Warning: "${obligatory}" is undefined, compilerOptions in tsconfig.json must specify it`)
		}
	}
	if (missingKeys){
		console.log('Exiting')
		process.exit()
	}
	module = module.toUpperCase()
	target = target.toUpperCase()

	console.log('Translating compilerOptions from tsconfig.json to fit to typescript API...')
	const options = {
		outDir : outDir,
		module : ts.ModuleKind[module],
		target : ts.ScriptTarget[target],
		sourceMap : sourceMap
	}
	
	console.log('Finally compiling with options: %o', options)
	
	const tsfiles = fs.readdirSync('ts').map(f => `ts/${f}`)
	console.log('Compiling the following ts files: %o', tsfiles)
	const program = ts.createProgram(tsfiles, options)
	const emitResult = program.emit()

	if (logTsErrors){
		const allDiagnostics = ts
			.getPreEmitDiagnostics(program)
			.concat(emitResult.diagnostics)

		allDiagnostics.forEach(diagnostic => {
			if (diagnostic.file){
				let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
				let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
				console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
			} else {
				console.log(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
			}
		})
	}
	console.green('Finished compiling ts files')
	const { execSync } = require('child_process')
	execSync('npm run-script build', { encoding : 'utf8', stdio : 'inherit' })
	console.green('Finished webpacking')
	console.log('Process exiting')
	process.exit(0)

}

const arg = process.argv[2]
if (arg && arg === 'help'){
	const usage = [
		'USAGE:',
		'"npm run-script tscThenBuild" compiles ts files to js, then packs with webpack',
		'"npm run-script tscThenBuild help" shows this message',
		'"npm run-script tscThenBuild true" compiles ts then packs, but prints ts compile errors to console (false by default)'
	]
	console.log(usage.join('\n\t'))
	process.exit()
}

compile(Boolean(arg))
