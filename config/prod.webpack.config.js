var path = require('path');
var webpack = require('webpack');

var config = {
    devServer: {
        contentBase: 'assets'
    },
    entry: [
        'bootstrap',
        path.resolve(__dirname, '../client/main.js'),
        path.resolve(__dirname, '../client/auth.js')
    ],
    output: {
        filename: path.resolve(__dirname, '../assets/bundle.js')
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tesseract: "tesseract.js"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            include: 'node_modules/tesseract.js'
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
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
            vue: 'vue/dist/vue.min',
            "pinyin-engine/tw": "pinyin-engine/dist/tw"
        }
    },
    node: {
        net: "empty",
        tls: "empty"
    }
};

module.exports = config;
