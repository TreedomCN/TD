/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
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
                // {
                //     test: /\.ejs/,
                //     exclude: [
                //         path.resolve(__dirname, 'node_modules')
                //     ],
                //     use: [
                //         {
                //             loader: 'ejs-compiled-loader',
                //             options: {}
                //         }
                //     ]
                // },
                // todo: lib下的js未进行压缩
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, 'src/js/lib')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'js/lib/[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    include: [
                        path.resolve(__dirname, 'src/img')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 3000,
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(mp3|mp4)$/,
                    include: [
                        path.resolve(__dirname, 'src/media')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    ]
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
                // template: 'ejs-render-loader!index.ejs',
                inject: false,
                hash: false,
                minify: {
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: false, // 删除空白符与换行符
                    minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                    minifyJS: true // 压缩 HTML 中出现的 JS 代码
                }
            })
        ],
        externals: {
            '$': 'window.$',
            'global': 'window.global'
        }
    };
};
