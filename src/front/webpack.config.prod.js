"use strict"

const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: "production",
    entry: [
        "@babel/polyfill",
        './src/Entry.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: './app.bundle.js'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, './src'),
            "node_modules",
        ]
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
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     options: {
                    //       // you can specify a publicPath here
                    //       // by default it uses publicPath in webpackOptions.output
                    //       publicPath: '/',
                    //       hmr: process.env.NODE_ENV === 'development',
                    //     },
                    // },
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
        ],
    },
    node: {
        fs: "empty",
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            APP_IN_MODE: '"PRODUCTION"',
        }),
        // new MiniCssExtractPlugin({
        //     filename: 'all.css',
        //     ignoreOrder: false, // Enable to remove warnings about conflicting order
        //   }),
    ],
};
