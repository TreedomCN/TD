/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./config.path');

const webpackMerge = require('webpack-merge');
const WebpackStrip = require('webpack-strip');

const commonConfig = require('./webpack.config.base.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');


const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const DefinePlugin = webpack.DefinePlugin;

const isProduction = function () {
    return process.env.NODE_ENV === 'prod';
};

var jsRules = {};

if (isProduction()) {
    jsRules = {
        test: /\.js$/,
        include: [
            path.resolve(__dirname, 'src/js')
        ],
        exclude: [
            path.resolve(__dirname, 'src/js/lib')
        ],
        use: [
            {
                loader:  WebpackStrip.loader('TD.debug(\\.\\w+)+', 'debug', 'console.log')
            },
            {
                loader: 'babel-loader',
                options: {}
            },
            {
                loader: 'eslint-loader',
                options: {}
            }
        ]
    };
} else {
    jsRules = {
        test: /\.js$/,
        include: [
            path.resolve(__dirname, 'src/js')
        ],
        exclude: [
            path.resolve(__dirname, 'src/js/lib')
        ],
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            },
            {
                loader: 'eslint-loader',
                options: {}
            }
        ]
    };
}

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'js/[name].[hash:8].js',
            publicPath: isProduction() ? config.prod : config.dist
        },
        module: {
            rules: [
                {
                    test: /\.less$/,
                    include: [
                        path.resolve(__dirname, 'src/less')
                    ],
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: !!isProduction()
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {}
                            },
                            {
                                loader: 'less-loader',
                                options: {}
                            }
                        ]
                    }),
                },
                jsRules
            ]
        },
        plugins: [
            new CleanPlugin('dist'),
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(isProduction() ? 'prod' : 'dist'),
                    'PATH': JSON.stringify(isProduction() ? config.prod : config.dist)
                }
            }),
            new ExtractTextPlugin('css/[name].[hash:8].css'),
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: !!isProduction()
                    }
                }
            })
        ]
    });
}
;