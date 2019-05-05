const path = require('path');
// 抽离html插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 深度js tree shaking插件
const WebpackDeepScopePlugin = require('webpack-deep-scope-plugin').default;

// 单独抽离css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// css tree shaking
const glob = require('glob-all');
// 只匹配html时使用
// const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        // filename: '[name][hash:5]-bundle.js',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // mode: 'development',
    module: {
        rules: [
            // { test: /\.less$/g, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
            { test: /\.less$/g, use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            require('autoprefixer')(),
                            require('cssnano')()
                        ]

                    }
                },
                {
                    loader: 'less-loader'
                }
            ] },            
            { test: /\.css$/g, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            minify:{
                // 清除注释
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new PurifyCSSPlugin({
            paths: glob.sync([path.join(__dirname, './*.html'), path.join(__dirname, './src/*.js')]),
        }),
        new WebpackDeepScopePlugin(),
    ]
}