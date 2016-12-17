var path = require('path');
var webpack = require('webpack')

var config = {
    entry: [
        'webpack/hot/dev-server',
        'whatwg-fetch',
        'bootstrap',
        path.resolve(__dirname, 'main.js'),
        path.resolve(__dirname, 'auth.js')
    ],
    output: {
        filename: 'assets/bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    node: {
        net: "empty",
        tls: "empty"
    }
};

module.exports = config;
