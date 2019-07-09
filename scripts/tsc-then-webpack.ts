const ts = require('typescript');
const fs = require('fs');
const webpack = require('webpack');

function compile(fileNames) {
    let compilerOptions;
    try {
        compilerOptions = JSON.parse(fs.readFileSync('tsconfig.json', {encoding: 'utf8'})).compilerOptions;
        
    } catch (e) {
        if (e instanceof SyntaxError) {
            const foundComments = e.message.includes('Unexpected token / in JSON');
            console.log(`\t** Error parsing tsconfig.json; ${foundComments ? 'comments are not allowed' : e.message}\n`);
        } else {
            throw e
        }
    }
    console.log('compilerOptions: ', compilerOptions);
    if (!compilerOptions.module || compilerOptions.module.toLowerCase() != 'es2015')
        console.log(`"module" key in compilerOptions has value: "${compilerOptions.module}". The recommended value is "es2015", which allows webpack to build successfully`);
    
    const tsfiles = fs.readdirSync('ts').map(f => `ts/${f}`);
    console.log('tsfiles: ', tsfiles);
    const program = ts.createProgram(tsfiles, {
        "outDir": "./dist/",
        "module": ts.ModuleKind.ES2015,
        "target": ts.ScriptTarget.ES2017,
        "sourceMap": true
    });
    const emitResult = program.emit();
    
    const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
    
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start
            );
            let message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
            );
            // console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            // console.log(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
        }
    });
    
    /*const commonConfig = {
        mode: 'development',
        entry: {
            Piano: ['./dist/Piano.js'],
        },
        context: __dirname,
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js',
            library: 'Piano',
            libraryTarget: 'umd',
            libraryExport: 'Piano'
        },
        resolve: {
            modules: [
                'node_modules',
                path.resolve(__dirname, '.'),
            ],
            alias: {
                Tone: 'node_modules/tone/Tone'
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }
            ]
        },
        devtool: 'inline-source-map'
    };
    
    const pianoConfig = Object.assign({}, commonConfig, {
        entry: {
            Piano: ['./dist/Piano.js'],
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js',
            library: 'Piano',
            libraryTarget: 'umd',
            libraryExport: 'Piano'
        },
    });
    */
    /*const webpackConfig = require('../webpack.config');
    console.log('webpackConfig: ', webpackConfig);
    webpack(webpackConfig, (err, stats) => {
        if (err) throw err;
        console.log('stats: ', stats);
    })
    */
    
    
    // const exitCode = emitResult.emitSkipped ? 1 : 0;
    // console.log(`Process exiting with code '${exitCode}'.`);
    // process.exit(exitCode);
    
}

// compile(process.argv.slice(2), {
compile(['ts/Piano.ts']);
