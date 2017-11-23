/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./config.path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const DefinePlugin = webpack.DefinePlugin;

const handoverDir = /a201[\w]*/.exec(config.handover)[0];

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var copyItem = [];

if (fs.existsSync('src/img/kf')) {
    copyItem.push({
        from: 'src/img/kf',
        to: './ossweb-img/',
        flatten: true
    });
}

module.exports = function () {
    return {
        entry: {
            main: './src/js/index.js'
        },
        output: {
            path: path.resolve(__dirname, './dist/' + handoverDir),
            filename: 'ossweb-img/[name].js',
            publicPath: config.handover
        },
        module: {
            rules: [
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'less-loader']
                    }),
                    exclude: /(node_modules|bower_components)/
                },
                {
                    test: /js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$/,
                    use: 'url-loader?limit=1000&name=ossweb-img/js/lib/[name].[ext]'
                },
                {
                    test: /\.(png|jpg|gif|svg|mp3|mp4)$/,
                    use: 'url-loader?limit=10000&name=ossweb-img/[name].[ext]'
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|dist|lib|fx_methods)/,
                    use: ['webpack-strip?strip[]=TD.debug.*', 'babel-loader', 'eslint-loader']
                }
            ]
        },
        resolve: {
            alias: {}
        },
        plugins: [
            new CleanPlugin('dist'),
            new ExtractTextPlugin('ossweb-img/[name].css'),
            new UglifyJSPlugin({
                comments: false,
                compress: {
                    drop_console: true
                }
            }),
            new CopyWebpackPlugin(copyItem),
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('handover'),
                    'PATH': JSON.stringify(config.handover)
                }
            }),
            new HtmlWebpackPlugin({
                // filename: path.resolve(__dirname, handoverDir + '/index.html'),
                filename: 'index.html',
                template: 'index.ejs',
                inject: false,
                hash: false,
                minify: {
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: false // 删除空白符与换行符
                }
            }),
            new ZipPlugin({
                path: '../',
                filename: handoverDir + '.zip'
            })
        ],
        externals: {
            '$': 'window.$',
            'global': 'window.global'
        }
    };
};
