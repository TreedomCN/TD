
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: "./src/js/index.js",
    },
    output: {
        path: path.resolve(__dirname, './'),
        filename: "./js/[name].js"
    },
    module: {
        rules: [
            {
                test: /js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$/,
                loader: 'url-loader?importLoaders=1&limit=1000&name=/dist/js/lib/[name].[ext]'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|dist|js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$|fx_methods)/,
                loaders: ['babel-loader', 'eslint-loader']
            }
        ]
    },
    resolve: {
        alias: {
            'zepto': './lib/zepto.min.js'
        }
    },
    plugins: [
        
    ],
    externals: {
        '$':'window.$',
        'global' : 'window.global'
    }
};
