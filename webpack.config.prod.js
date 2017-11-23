/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./config.path');

const webpackMerge = require('webpack-merge');

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
        exclude: /(node_modules|dist|lib|fx_methods)/,
        use: ['webpack-strip?strip[]=TD.debug.*', 'babel-loader', 'eslint-loader']
    };
} else {
    jsRules = {
        test: /\.js$/,
        exclude: /(node_modules|dist|lib|fx_methods)/,
        use: ['babel-loader?cacheDirectory', 'eslint-loader']
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
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader?minimize', 'less-loader']
                    }),
                    exclude: /(node_modules|bower_components)/
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
                comments: false,
                compress: {
                    drop_console: !!isProduction()
                }
            })
        ]
    });
}
;