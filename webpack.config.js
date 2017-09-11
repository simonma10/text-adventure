var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    devtool: 'cheap-source-map',

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/,/\$.test.js$/],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-1']
                }
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    devServer: {
        historyApiFallback: true,
        contentBase: './'
    }

};
