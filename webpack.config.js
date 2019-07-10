const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');

const paths = {
    index: path.resolve(__dirname, 'src', 'index.ts'),
};

/** @type {webpack.Configuration} */
module.exports = {
    entry: {
        index: paths.index,
    },
    resolve: {
        extensions: ['.js', '.css', '.ts'],
    },
    module: {
        rules: [
            { test: /\.css/, use: ['style-loader', 'css-loader'] },
            { test: /\.(js|ts)/, use: ['babel-loader'] },
        ],
    },
    devtool: 'source-map',
    plugins: [new webpack.ProgressPlugin(), new HtmlPlugin()],
};
