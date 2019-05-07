# webpack的学习及使用

### 1. webpack的安装

### 2. webpack的核心概念学习
1. webpack前置
    - 虽然最新版的webpack支持无配置工作，但是在真正的开发中，配置文件的重要性不言而喻。
    - webpack是基于nodejs的，遵循CommonJS
    - webpack是一个静态模块打包器，把一切文件看作模块
2. webpack核心概念
    1. 入口 entry
        ```javascript
        module.exports = {
            entry: './src/main.js',
            entry: {
                main: './src/main.js',
                app: './src/app.js',
            }
        }
        ```
    2. 输出 output
        ```javascript
        const path = require('path');
        module.exports = {
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: '[name][hash:8].bundle.js',
            }
        }
        ```
    3. 模式 mode
        ```javascript
        module.exports = {
            mode: 'development' //production
        }
        ```
    4. 插件 plugin
        ```javascript
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        module.exports = {
            plugins: [
                new HtmlWebpackPlugin({
                    /*
                    * 配置参数
                    */
                })
            ]
        }
        ```
    5. loader 
        >loader配置在module:{ rules: [{test: /\.less$/g, use: loaderName}]}
        1. 处理less文件
            
### 3. plugin常用插件
1. html-webpack-plugin 用于单独抽离html文件
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // ...
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
}
```
2. mini-css-extract-plugin 单独抽离css文件
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    // ...
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
     module: {
        rules: [
            {test: /\.less$/g, use: [MiniCssExtractPlugin.loader,'css-loader','less-loader']},
            {test: /\.css$/g, use: [MiniCssExtractPlugin.loader,'css-loader']},
        ]
    },
}
```
3. clean-webpack-plugin 清除以前打包的文件
```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```
### 4. loader常见配置
1. less / sass / css
    >需要预下载style-loader css-loader less-loader less，
    ```javascript
        {test: /\.less$/g, use: ['style-loader','css-loader','less-loader']},
        {test: /\.less$/g, use: [
            {
                loader: 'style-loader',
                options: {

                }
            },
        ]},
    ```
2. 图片
    + html中img
        - 使用html-loader进行处理
        ```javascript
        module.exports = {
            module: {
                rules: [
                    {
                        test: /\.html$/,
                        use: [
                            {
                                loader: 'html-loader',
                                options: {
                                    attr: ['img:src']
                                }
                            }
                        ]
                    }
                ]
            }
        }
        ```
    + css中的img
        - file-loader url-loader (url-loader能实现base64编码)
        - img-loader 图片压缩
        ```javascript
        module.exports = {
            module: {
                rules: [
                    {
                        test: /\.(png|jpg|jpeg|gif|svg)$/,
                        use:[
                            {
                                loader: 'url-loader',
                                options: {
                                    name: '[name][hash:5].[ext]',
                                    /*图片小于10kb 使用base64进行编码*/
                                    limit: 10 * 1000,
                                    /*如果大于，则单独抽离为文件，文件路径 output输出路径下面img*/
                                    outputPath: 'img'
                                }
                            },
                            {
                                loader: 'img-loader',
                                options: {
                                    plugins: [
                                        /*需下载imagemin 和 imagemin-pngquant*/
                                        require('imagemin-pngquant')({
                                            quality: [0.3, 0.5]
                                        })
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        }
        ```
### 5.tree shaking
1. js
    - production 自带tree shaking，但是自带的tree shaking 只是做此法和语法的分析，不能进行作用域分析
    - 深度tree shaking插件: webpack-deep-scope-plugin
    ```javascript
    const WebpackDeepScopePlugin = require('webpack-deep-scope-plugin').default;
    module.exports = {
        plugins: [
            new WebpackDeepScopePlugin()
        ]
    }
    ```
2. css
    - css tree shaking一定要在js抖动之前
    - css tree shaking需将css抽离为单独的文件
    - css tree shaking插件: purifycss-webpack
    ```javascript
    const glob = require('glob');
    const PurifyCSSPlugin = require('purifycss-webpack');    
    module.exports = {
        plugins: [
            new PurifyCSSPlugin({
                /*匹配css与html 无用的抖掉*/
                paths: glob.sync(path.join(__dirname, './*.html')),
            }),
        ]
    }
    ```
    >如果js在后面动态添加了html结构，但是早在js加载前，对应的样式已经被抖动掉了
    ```javascript
    /* npm install glob-all --save-dev*/
    const glob = require('glob-all');
    module.exports = {
        plugins: [
            new PurifyCSSPlugin({
                /*匹配css与html 无用的抖掉*/
                paths: glob.sync([path.join(__dirname, './*.html'), path.join(__dirname, './src/*.js')]),
            }),
        ]
    }
    ```
    >css tree shaking的原理为正则匹配，因此在html如果存在标签被注释，被注释的对应标签的样式会保留。

### 6.postcss使用
1. 预备知识
- postcss-loader在css-loader之前(预处理) 
- 需下载postcss postcss-loader autoprefixer 
2. 使用范例
    ```javascript
    module.exports = {
        module: {
            rules: [
                {test: /\.less$/, use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {loader: 'css-loader'},
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
                    {loader: 'less-loader'},
                ]}
            ]
        }
    }
    ```
### 7.提取公共js
> 针对于多入口js