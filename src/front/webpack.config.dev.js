"use strict"

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const DelWebpackPlugin = require('del-webpack-plugin');

module.exports = {
    mode: "development",
    entry: [
        './src/Entry.js',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: './app.bundle.js'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'node_modules', 'comlinkjs'),
                    path.join(__dirname, 'node_modules', 'd3-delaunay'),
                    path.join(__dirname, 'node_modules', 'd3-geo-voronoi'),
                ],
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        publicPath: '/assets/scripts/'
                    }
                }
            },
        ]
    },
    node: {
        fs: "empty",
        process: "mock",
    },
    plugins: [
        new DelWebpackPlugin({
            include: ['**'],
            info: true,
            keepGeneratedAssets: true,
        }),
        new webpack.DefinePlugin({
            APP_IN_MODE: '"DEVELOPMENT"',
        }),
    ]
}
