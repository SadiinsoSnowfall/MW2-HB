const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {
    NODE_ENV = 'production',
} = process.env;

module.exports = {
    entry: {
        server: './src/mw2hb.ts',
    },
    watch: NODE_ENV === 'development',
    target: 'node',
    externals: [
        nodeExternals()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ],
    },
    mode: NODE_ENV,
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    ecma: 8,
                    toplevel: true,
                    mangle: true,
                    compress: {
                        passes: 2,
                        pure_getters: true
                    }
                }
            }),
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/config.json', to: "config.json" },
        ])
    ]
};