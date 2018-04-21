var path = require('path');
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')


var config = {
    entry: [
        'webpack-hot-middleware/client?reload=true',
        'bootstrap',
        path.resolve(__dirname, '../client/main.js'),
        path.resolve(__dirname, '../client/auth.js')
    ],
    output: {
        path: path.resolve(__dirname, '../assets/'),
        publicPath: "/",
        filename: "bundle.js"
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tesseract: "tesseract.js"
        }),
        // OccurenceOrderPlugin is needed for webpack 1.x only
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../assets/index.html'),
            inject: true,
        })
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
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            vue: 'vue/dist/vue',
            "pinyin-engine/tw": "pinyin-engine/dist/tw"
        }
    },
    node: {
        net: "empty",
        tls: "empty"
    }
};

module.exports = config;
