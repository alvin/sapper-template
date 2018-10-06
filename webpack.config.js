const webpack = require('webpack');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const preprocessOptions = require('./preprocess-pug.config.js')

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: {
			extensions: ['.js', '.json', '.html', '.pug'],
			mainFields: ['svelte', 'module', 'browser', 'main']
		},
		module: {
			rules: [
				{
          test: /\.(html|pug)$/,
					use: {
						loader: 'svelte-loader',
						options: {
              preprocess: require('svelte-preprocess')(preprocessOptions),
							dev,
							hydratable: true,
							hotReload: true
						}
					}
				}
        
			]
		},
		mode,
		plugins: [
			dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: {
			extensions: ['.js', '.json', '.html', '.pug'],
			mainFields: ['svelte', 'module', 'browser', 'main']
		},
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [
				{
          test: /\.html$/,
					use: {
						loader: 'svelte-loader',
						options: {
              preprocess: require('svelte-preprocess')(preprocessOptions),
							css: false,
							generate: 'ssr',
							dev
						}
					}
				}
			]
		},
		mode: process.env.NODE_ENV,
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode: process.env.NODE_ENV
	}
};
