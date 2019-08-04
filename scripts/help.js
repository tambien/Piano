/*eslint no-console:0*/
const util = require('./util')
const verbose = util.isInArgs('verbose')
const { table } = require('table')
let data = [
	['', 'description'],
	['help', verbose?'Prints available commands and their description':'Prints this message'],
	['help:verbose', verbose?'Prints this message':'Same as "help" but displaying an "alias" column'],
	['compile', 'Compiles the .ts files in /src to .js files in /temp'],
	['compile:watch', 'Same as "compile" but recompiles on file change'],
	['build', 'Builds the .js files in /temp to a Piano.js in /build. Minimized.'],
	['build:watch', 'Same as "build" but rebuilds on file change'],
	['build:debug', 'Same as "build", but debuggable and not minimized'],
	['build:watch:debug', 'Same as "build:watch", but debuggable and not minimized'],
	['compileAndBuild', 'Compiles src/*.ts to temp/*.js, runs "build" command, removes /temp dir before exit'],
	['compileAndBuild:debug', 'Same as "compileAndBuild" but runs "build:debug" instead of "build"'],
	['compileAndBuild:watch', 'Runs "compile:watch" and "build:watch" in parallel'],
	['compileAndBuild:watch:debug', 'Same as "compileAndBuild:watch" but runs "build:watch:debug" instead of "build:watch"'],
	['increment', 'Increment package version'],
	['test', 'Runs "compileAndBuild", then runs mocha tests'],
	['test:debug', 'Same as "test" but runs compileAndBuild and mocha both in debug mode'],
	['test:mocha', 'Runs headless mocha test/test.js with 30s timeout'],
	['test:mocha:debug', 'Same as "test:mocha" but opens a web browser and DevTools'],
]
if (verbose){

	const verboseData = ['alias',
		'node scripts/help.js',
		'node scripts/help.js -v',
		'tsc -p tsconfig.json',
		'tsc -p tsconfig.json --watch',
		'webpack -p --env.production', // TODO: I'm not sure "--env.production" has any effect?
		'webpack -p -w',
		'webpack --debug',
		'webpack -w --debug',
		'node scripts/compileAndBuild.js',
		'npm run compileAndBuild -- --d',
		'npm-run-all -p compile:watch build:watch',
		'npm-run-all -p compile:watch build:watch:debug',
		'npm version v$(semver --increment $(npm show @tonejs/piano version)) --git-tag-version=false --allow-same-version',
		'npm run compileAndBuild && npm run test:mocha',
		'npm run compileAndBuild:debug && npm run test:mocha:debug',
		'mocha test/test.js --timeout 30000',
		'npm run test:mocha -- --dbg',
	]
	for (let i=0; i<data.length; i++){
		data[i].push(verboseData[i])
	}

}

console.log('Usage: npm run <command>')
console.log('Where <command> can be:')
/**
 * @typedef {string} table~cell
 */

/**
 * @typedef {table~cell[]} table~row
 */

/**
 * @typedef {Object} table~columns
 * @property {string} alignment Cell content alignment (enum: left, center, right) (default: left).
 * @property {number} width Column width (default: auto).
 * @property {number} truncate Number of characters are which the content will be truncated (default: Infinity).
 * @property {number} paddingLeft Cell content padding width left (default: 1).
 * @property {number} paddingRight Cell content padding width right (default: 1).
 */

/**
 * @typedef {Object} table~border
 * @property {string} topBody
 * @property {string} topJoin
 * @property {string} topLeft
 * @property {string} topRight
 * @property {string} bottomBody
 * @property {string} bottomJoin
 * @property {string} bottomLeft
 * @property {string} bottomRight
 * @property {string} bodyLeft
 * @property {string} bodyRight
 * @property {string} bodyJoin
 * @property {string} joinBody
 * @property {string} joinLeft
 * @property {string} joinRight
 * @property {string} joinJoin
 */

/**
 * Used to dynamically tell table whether to draw a line separating rows or not.
 * The default behavior is to always return true.
 *
 * @typedef {function} drawHorizontalLine
 * @param {number} index
 * @param {number} size
 * @return {boolean}
 */

/**
 * @typedef {Object} table~config
 * @property {table~border} border
 * @property {table~columns[]} columns Column specific configuration.
 * @property {table~columns} columnDefault Default values for all columns. Column specific settings overwrite the default values.
 * @property {table~drawHorizontalLine} drawHorizontalLine
 */

/**
 * Generates a text table.
 *
 * @param {table~row[]} rows
 * @param {table~config} config
 * @return {String}
 */
const output = table(data)

console.log(output)
console.log('tip: place a "debugger" line in a ts file, run "compileAndBuild:watch:debug" in one terminal, then run "test:mocha:debug -- --grep <RegExp | string>" in another')

