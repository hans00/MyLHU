var path = require('path');
var webpack = require('webpack')

var config = {
    devServer: {
        proxy: {
            "/api": "http://localhost:3000"
        },
        publicPath: '/',
        contentBase: 'assets',
        historyApiFallback: true
    },
    entry: [
        'webpack/hot/dev-server',
        'bootstrap',
        path.resolve(__dirname, '../client/main.js'),
        path.resolve(__dirname, '../client/auth.js')
    ],
    output: {
        publicPath: "/assets/",
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tesseract: "tesseract.js"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
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
            vue: 'vue/dist/vue'
        }
    },
    node: {
        net: "empty",
        tls: "empty"
    }
};

module.exports = config;
