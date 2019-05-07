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

// 清除上次打包的文件
const CleanWebapckPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/main.js',

    // 提取公共js部分代码
    // entry: {
    //     pageA: './src/js/commonJS/src/pageA.js',
    //     pageB: './src/js/commonJS/src/pageB.js'
    // },

    output: {
        // filename: '[name][hash:5]-bundle.js',
        filename: '[name][hash:5].js',
        path: path.resolve(__dirname, 'dist')

        // 提取公共js部分代码
        // path: path.resolve(__dirname, 'src/js/commonJS/dist')
    },
    // mode: 'development',
    module: {
        rules: [
            // { test: /\.less$/g, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
            {
                test: /\.less$/,
                use: [
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
                ]
            },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            {
                test: /\.(jpg|png|jpeg|gif)/g,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name][hash:5].[ext]',
                            // 限制图片的大小 <= 使用base64编码
                            limit: 100,
                            outputPath: 'img',
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-pngquant')({
                                    quality: [0.3, 0.5]
                                }),
                            ]

                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attr: ['img:src'],
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index[hash:5].html',
            template: './src/index.html',
            minify: {
                // 清除注释
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name][hash:5].css',
        }),
        new PurifyCSSPlugin({
            paths: glob.sync([path.join(__dirname, './*.html'), path.join(__dirname, './src/*.js')]),
        }),
        new WebpackDeepScopePlugin(),
        new CleanWebapckPlugin(),
    ]
}