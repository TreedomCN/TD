
module.exports = {
    webpack: {
        entry: {
            main: "./src/js/index.js",
        },
        output: {
            path: '.',
            filename: "./dist/js/[name].js"
        },
        module: {
            loaders: [
                {
                    test: /js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$/,
                    loader: 'url-loader?importLoaders=1&limit=1000&name=/dist/js/lib/[name].[ext]'
                },
                {
                    test: /\.hbs/,
                    loader: "handlebars-loader"
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
    },
    browsersync: {
        open: "external",
        server: {
            baseDir: "./"
        },
        // port: 80,
        files: ["dist/**/*.*","./*.html"]
    }
};
