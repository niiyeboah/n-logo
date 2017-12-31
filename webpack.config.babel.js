import path from 'path';
import webpack from 'webpack';

export default () => ({
    entry: {
        'n-logo': './index.js',
        'n-logo.web': './index.web.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'Logo'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         include: /\.web\.js$/,
    //         minimize: true
    //     })
    // ]
});
