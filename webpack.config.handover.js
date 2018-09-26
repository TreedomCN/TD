/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./config.path');
const fs = require('fs');

const WebpackStrip = require('webpack-strip');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const DefinePlugin = webpack.DefinePlugin;

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var copyItem = [];

if (fs.existsSync('src/img/kf')) {
    copyItem.push({
        from: 'src/img/kf',
        to: './',
        flatten: true
    });
}

module.exports = function () {
    return {
        entry: {
            main: './src/js/index.js'
        },
        output: {
            path: path.resolve(__dirname, './dist/ossweb-img'),
            filename: '[name].js',
            publicPath: config.handover
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
                                    minimize: true  // css压缩，不需要时 false
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
                    })
                },
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
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, 'src/js')
                    ],
                    exclude: [
                        path.resolve(__dirname, 'src/js/lib')
                    ],
                    use: [
                        {
                            // loader:  WebpackStrip.loader('TD.debug(\\.\\w+)+', 'debug', 'console.log')
                            loader:  WebpackStrip.loader('TD.debug(\\.\\w+)+', 'debug')
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
                                name: '[name].[ext]'
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
                                name: '[name].[ext]'
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
            new CleanPlugin('dist'),
            new ExtractTextPlugin('[name].css'),
            new CopyWebpackPlugin(copyItem),
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('handover'),
                    'PATH': JSON.stringify(config.handover)
                }
            }),
            new HtmlWebpackPlugin({
                filename: '../index.html',
                template: 'index.ejs',
                inject: false,
                hash: false,
                minify: {
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: false, // 删除空白符与换行符
                    minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                    minifyJS: true // 压缩 HTML 中出现的 JS 代码
                }
            }),
            // new UglifyJSPlugin({
            //     uglifyOptions: {
            //         compress: {
            //             drop_console: false
            //         }
            //     }
            // })
        ],
        externals: {
            '$': 'window.$',
            'global': 'window.global'
        }
    };
};
