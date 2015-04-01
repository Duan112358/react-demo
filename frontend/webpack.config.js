var webpack = require('webpack');

module.exports = {
    entry: {
        app: './js/app',
        vendor: ['react', 'superagent']
    },
    output: {
        path: '../bin/static/js/',
        filename: 'app.js',
        publicPath: '/static/js/'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.js$/,
            loaders: ['react-hot', 'jsx?harmony'],
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            loader: 'style!css!less'
        }, {
            test: /\.(png|jpg|svg)$/,
            loader: 'url?limit=102400'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ],
    resolve: {
        extensions: ['', '.jsx', '.js', '.less', '.css']
    }
};
