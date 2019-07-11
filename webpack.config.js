const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');

const paths = {
    index: path.resolve(__dirname, 'src', 'index.ts'),
    template: path.resolve(__dirname, 'src', 'index.html'),
    docs: path.resolve(__dirname, 'docs'),
};

/** @type {webpack.Configuration} */
module.exports = {
    entry: { index: paths.index },
    output: { path: paths.docs },
    resolve: {
        extensions: ['.js', '.css', '.ts'],
    },
    module: {
        rules: [
            { test: /\.css/, use: ['style-loader', 'css-loader'] },
            { test: /\.(js|ts)/, use: ['babel-loader'] },
            {
                test: /\.mp3$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
        ],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlPlugin({
            template: paths.template,
            favicon: 'src/favicon.ico',
        })
    ],
};
