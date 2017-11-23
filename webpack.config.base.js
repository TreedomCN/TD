/**
 * Created by z on 2017/6/5.
 */
// const path = require('path');
// const webpack = require('webpack');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var copyItem = [];

if (fs.existsSync('src/img/kf')) {
    copyItem.push({
        from: 'src/img/kf',
        to: 'img',
        flatten: true
    });
}

module.exports = function () {
    return {
        entry: {
            main: './src/js/index.js'
        },
        module: {
            rules: [
                {
                    test: /js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$/,
                    use: 'url-loader?limit=1000&name=js/lib/[name].[ext]'
                },
                {
                    test: /\.(png|jpg|gif|svg|mp3|mp4)$/,
                    use: 'url-loader?limit=10000&name=img/[name].[hash:8].[ext]'
                }
            ]
        },
        resolve: {
            alias: {}
        },
        plugins: [
            new CopyWebpackPlugin(copyItem),
            new HtmlWebpackPlugin({
                filename: './index.html',
                template: 'index.ejs',
                inject: false,
                hash: false,
                minify: {
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: false // 删除空白符与换行符
                }
            })
        ],
        externals: {
            '$': 'window.$',
            'global': 'window.global'
        }
    };
};
