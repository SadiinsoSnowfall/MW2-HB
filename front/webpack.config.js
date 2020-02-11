const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const {
    NODE_ENV = 'production',
} = process.env;

const devmode = NODE_ENV !== 'production';

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader'
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    plugins: [
    ],
    devtool: false,
    mode: NODE_ENV,
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        historyApiFallback: true,
        inline: true,
        open: true,
        hot: true
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js',
    },
    optimization: {
        minimize: !devmode,
        minimizer: devmode ? [] : [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                terserOptions: {
                    ecma: 2018,
                    mangle: {
                        eval: !devmode,
                        toplevel: true,
                        keep_fnames: false,
                        keep_classnames: false,
                    },
                    compress: {
                        passes: 3,
                        toplevel: true,
                        evaluate: true,
                        pure_getters: true,
                        unused: true,
                        sequences: false,
                        dead_code: true,

                        booleans_as_integers: true,
                        keep_fargs: false,
                        module: true,

                        unsafe: true,
                        unsafe_arrows: true,
                        unsafe_comps: true,
                        unsafe_Function: true,
                        unsafe_math: true,
                        unsafe_methods: true,
                        unsafe_proto: true,
                        unsafe_regexp: true,
                        unsafe_undefined: true,
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    sourcemap: false
                },
            })
        ]
    }
};