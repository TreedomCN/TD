/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./config.path');

const DefinePlugin = webpack.DefinePlugin;

const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.config.base.js');

const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'js/[name].[hash:8].js',
            publicPath: config.dev
        },
        module: {
            rules: [
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                    exclude: /(node_modules|bower_components)/,
                },
                {
                    test: /\.css$/,
                    use: ['postcss-loader'],
                    exclude: /(node_modules|bower_components)/,
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|dist|lib|fx_methods)/,
                    use: ['babel-loader?cacheDirectory', 'eslint-loader']
                }
            ]
        },
        plugins: [
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('dev'),
                    'PATH': JSON.stringify(config.dev)
                }
            }),
            new HotModuleReplacementPlugin()
        ],
        devServer: {
            host: '0.0.0.0',
            contentBase: path.join(__dirname, './'),
            compress: true,
            port: 3000,
            inline: true,
            hot: true,
            disableHostCheck: true
        }
    });
};
